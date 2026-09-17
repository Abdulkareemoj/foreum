import { TRPCError } from '@trpc/server'
import { ilike, or, sql } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~/server/db'
import { user } from '~/server/db/schema/auth-schema'
import { category, thread } from '~/server/db/schema/thread-schema'
import { tag } from '~/server/db/schema/tag-schema'
import { groups } from '~/server/db/schema/groups-schema'
import { events } from '~/server/db/schema/events-schema'
import { publicProcedure, router } from '~/server/trpc/init'

/**
 * Convert user query to tsquery format.
 * Supports: "phrase match", individual words with AND, and prefix matching.
 */
function toTsQuery(query: string): string {
  const trimmed = query.trim()
  if (!trimmed) return "''"

  const phraseMatch = trimmed.match(/^"(.+)"$/)
  if (phraseMatch) {
    const words = phraseMatch[1].split(/\s+/).filter(Boolean)
    if (words.length === 0) return "''"
    if (words.length === 1) return `'${words[0]}':*`
    return words.map((w) => `'${w}'`).join(' <-> ')
  }

  const words = trimmed.split(/\s+/).filter(Boolean)
  if (words.length === 0) return "''"
  return words.map((w) => `'${w}':*`).join(' & ')
}

export const searchRouter = router({
  /**
   * Full-text search across threads, replies, users, categories, tags, groups, events.
   * Uses PostgreSQL tsvector/tsquery for threads and replies (fast, ranked).
   * Falls back to ILIKE for smaller entity tables.
   */
  all: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ input }) => {
      try {
        const tsQuery = toTsQuery(input.query)
        const searchPattern = `%${input.query}%`

        const [ftsThreads, ftsReplies, users, categories, tags, groupResults, eventResults] =
          await Promise.all([
            // Full-text search on threads (title + content text)
            db.execute(sql`
              SELECT
                t.id,
                t.title,
                t.content,
                t.created_at as "createdAt",
                t.author_id as "authorId",
                ts_rank(
                  to_tsvector('english', t.title || ' ' || coalesce(t.content #>> '{}', '')),
                  to_tsquery('english', ${tsQuery})
                ) AS rank,
                ts_headline(
                  'english',
                  t.title || ' ' || coalesce(t.content #>> '{}', ''),
                  to_tsquery('english', ${tsQuery}),
                  'StartSel=<mark>, StopSel=</mark>, MaxWords=35, MinWords=15'
                ) AS snippet
              FROM thread t
              WHERE to_tsvector('english', t.title || ' ' || coalesce(t.content #>> '{}', ''))
                    @@ to_tsquery('english', ${tsQuery})
              ORDER BY rank DESC, t.created_at DESC
              LIMIT ${input.limit}
            `),

            // Full-text search on replies (content only)
            db.execute(sql`
              SELECT
                r.id,
                r.content,
                r.thread_id as "threadId",
                r.created_at as "createdAt",
                r.author_id as "authorId",
                ts_rank(
                  to_tsvector('english', coalesce(r.content #>> '{}', '')),
                  to_tsquery('english', ${tsQuery})
                ) AS rank,
                ts_headline(
                  'english',
                  coalesce(r.content #>> '{}', ''),
                  to_tsquery('english', ${tsQuery}),
                  'StartSel=<mark>, StopSel=</mark>, MaxWords=35, MinWords=15'
                ) AS snippet
              FROM reply r
              WHERE to_tsvector('english', coalesce(r.content #>> '{}', ''))
                    @@ to_tsquery('english', ${tsQuery})
              ORDER BY rank DESC, r.created_at DESC
              LIMIT ${input.limit}
            `),

            // Users (ILIKE is fine for small entity tables)
            db
              .select({
                id: user.id,
                name: user.name,
                username: user.username,
                image: user.image,
              })
              .from(user)
              .where(or(ilike(user.name, searchPattern), ilike(user.username, searchPattern)))
              .limit(input.limit),

            // Categories
            db
              .select({
                id: category.id,
                name: category.name,
                slug: category.slug,
                description: category.description,
              })
              .from(category)
              .where(
                or(
                  ilike(category.name, searchPattern),
                  ilike(category.description, searchPattern)
                )
              )
              .limit(input.limit),

            // Tags
            db
              .select({
                id: tag.id,
                name: tag.name,
                slug: tag.slug,
              })
              .from(tag)
              .where(ilike(tag.name, searchPattern))
              .limit(input.limit),

            // Groups
            db
              .select({
                id: groups.id,
                name: groups.name,
                slug: groups.slug,
                description: groups.description,
                avatarImage: groups.avatarImage,
              })
              .from(groups)
              .where(or(ilike(groups.name, searchPattern), ilike(groups.description, searchPattern)))
              .limit(input.limit),

            // Events
            db
              .select({
                id: events.id,
                title: events.title,
                description: events.description,
                startsAt: events.startsAt,
                eventType: events.eventType,
              })
              .from(events)
              .where(
                or(ilike(events.title, searchPattern), ilike(events.description, searchPattern))
              )
              .limit(input.limit),
          ])

        // Cast execute results to any[] (Drizzle execute returns array-like)
        const threadRows = ftsThreads as any[]
        const replyRows = ftsReplies as any[]

        // Resolve author info for threads
        const threadAuthorIds = [...new Set(threadRows.map((t) => t.authorId))]
        const threadAuthors =
          threadAuthorIds.length > 0
            ? await db
                .select({ id: user.id, name: user.name, image: user.image })
                .from(user)
                .where(sql`${user.id} IN ${threadAuthorIds}`)
            : []
        const threadAuthorMap = new Map(threadAuthors.map((a) => [a.id, a]))

        // Resolve author info for replies
        const replyAuthorIds = [...new Set(replyRows.map((r) => r.authorId))]
        const replyAuthors =
          replyAuthorIds.length > 0
            ? await db
                .select({ id: user.id, name: user.name, image: user.image })
                .from(user)
                .where(sql`${user.id} IN ${replyAuthorIds}`)
            : []
        const replyAuthorMap = new Map(replyAuthors.map((a) => [a.id, a]))

        // Resolve thread titles for reply results
        const replyThreadIds = [...new Set(replyRows.map((r) => r.threadId))]
        const replyThreads =
          replyThreadIds.length > 0
            ? await db
                .select({ id: thread.id, title: thread.title })
                .from(thread)
                .where(sql`${thread.id} IN ${replyThreadIds}`)
            : []
        const replyThreadMap = new Map(replyThreads.map((t) => [t.id, t]))

        // Format thread results with author info
        const threads = threadRows.map((t) => ({
          id: t.id,
          title: t.title,
          content: t.content,
          createdAt: t.createdAt,
          rank: t.rank,
          snippet: t.snippet,
          author: threadAuthorMap.get(t.authorId) ?? null,
        }))

        // Format reply results with author and thread info
        const replyResults = replyRows.map((r) => ({
          id: r.id,
          content: r.content,
          threadId: r.threadId,
          createdAt: r.createdAt,
          rank: r.rank,
          snippet: r.snippet,
          thread: replyThreadMap.get(r.threadId) ?? null,
          author: replyAuthorMap.get(r.authorId) ?? null,
        }))

        return {
          threads,
          replies: replyResults,
          users,
          categories,
          tags,
          groups: groupResults,
          events: eventResults,
        }
      } catch (error) {
        console.error('[search.all]', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to search',
        })
      }
    }),

  /**
   * Quick global search (for command palette / ⌘K).
   * Returns minimal data for fast rendering.
   */
  global: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        limit: z.number().optional().default(5),
      })
    )
    .query(async ({ input }) => {
      try {
        const tsQuery = toTsQuery(input.query)
        const q = `%${input.query}%`

        const [threadResults, replyResults, userResults, groupResults, categoryResults, tagResults] =
          await Promise.all([
            // Threads via full-text search
            db.execute(sql`
              SELECT
                t.id,
                t.title,
                'thread' AS type
              FROM thread t
              WHERE to_tsvector('english', t.title || ' ' || coalesce(t.content #>> '{}', ''))
                    @@ to_tsquery('english', ${tsQuery})
              ORDER BY ts_rank(
                to_tsvector('english', t.title || ' ' || coalesce(t.content #>> '{}', '')),
                to_tsquery('english', ${tsQuery})
              ) DESC
              LIMIT ${input.limit}
            `),

            // Replies via full-text search
            db.execute(sql`
              SELECT
                r.id,
                r.thread_id AS "threadId",
                'reply' AS type
              FROM reply r
              WHERE to_tsvector('english', coalesce(r.content #>> '{}', ''))
                    @@ to_tsquery('english', ${tsQuery})
              ORDER BY ts_rank(
                to_tsvector('english', coalesce(r.content #>> '{}', '')),
                to_tsquery('english', ${tsQuery})
              ) DESC
              LIMIT ${input.limit}
            `),

            db
              .select({
                id: user.id,
                title: user.name,
                subtitle: user.username,
                image: user.image,
                type: sql<string>`'user'`,
              })
              .from(user)
              .where(or(ilike(user.username, q), ilike(user.name, q)))
              .limit(input.limit),

            db
              .select({
                id: groups.id,
                title: groups.name,
                slug: groups.slug,
                image: groups.avatarImage,
                type: sql<string>`'group'`,
              })
              .from(groups)
              .where(ilike(groups.name, q))
              .limit(input.limit),

            db
              .select({
                id: category.id,
                title: category.name,
                slug: category.slug,
                type: sql<string>`'category'`,
              })
              .from(category)
              .where(ilike(category.name, q))
              .limit(input.limit),

            db
              .select({
                id: tag.id,
                title: tag.name,
                slug: tag.slug,
                type: sql<string>`'tag'`,
              })
              .from(tag)
              .where(ilike(tag.name, q))
              .limit(input.limit),
          ])

        // Cast execute results
        const threadRows = threadResults as any[]
        const replyRows = replyResults as any[]

        // Map thread titles for reply results
        const replyThreadIds = replyRows.map((r) => r.threadId).filter(Boolean)
        const replyThreads =
          replyThreadIds.length > 0
            ? await db
                .select({ id: thread.id, title: thread.title })
                .from(thread)
                .where(sql`${thread.id} IN ${replyThreadIds}`)
            : []
        const replyThreadMap = new Map(replyThreads.map((t) => [t.id, t]))

        const formattedReplies = replyRows.map((r) => ({
          id: r.id,
          title: replyThreadMap.get(r.threadId)?.title ?? 'Reply',
          type: 'reply' as const,
        }))

        return [
          ...threadRows,
          ...formattedReplies,
          ...userResults,
          ...groupResults,
          ...categoryResults,
          ...tagResults,
        ]
      } catch (error) {
        console.error('[search.global]', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to search',
        })
      }
    }),
})
