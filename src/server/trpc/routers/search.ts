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

export const searchRouter = router({
  all: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ input }) => {
      try {
        const searchPattern = `%${input.query}%`

        const [threads, users, categories, tags, groupResults, eventResults] = await Promise.all([
          // Threads
          db
            .select({
              id: thread.id,
              title: thread.title,
              content: thread.content,
              createdAt: thread.createdAt,
              author: {
                id: user.id,
                name: user.name,
                image: user.image,
              },
            })
            .from(thread)
            .leftJoin(user, sql`${thread.authorId} = ${user.id}`)
            .where(
              or(
                ilike(thread.title, searchPattern),
                sql`${thread.content}::text ILIKE ${searchPattern}`
              )
            )
            .limit(input.limit),

          // Users
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

        return {
          threads,
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

  // Quick global search (for command palette)
  global: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        limit: z.number().optional().default(5),
      })
    )
    .query(async ({ input }) => {
      try {
        const q = `%${input.query}%`

        const [threadResults, userResults, groupResults, categoryResults, tagResults] =
          await Promise.all([
            db
              .select({
                id: thread.id,
                title: thread.title,
                type: sql<string>`'thread'`,
              })
              .from(thread)
              .where(ilike(thread.title, q))
              .limit(input.limit),

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

        return [...threadResults, ...userResults, ...groupResults, ...categoryResults, ...tagResults]
      } catch (error) {
        console.error('[search.global]', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to search',
        })
      }
    }),
})