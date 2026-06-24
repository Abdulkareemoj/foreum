import { TRPCError } from '@trpc/server'
import { and, count, desc, eq, ilike, or, sql } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~/server/db'
import { user } from '~/server/db/schema/auth-schema'
import { profile } from '~/server/db/schema/profile-schema'
import { thread, reply } from '~/server/db/schema/thread-schema'
import { adminProcedure, protectedProcedure, publicProcedure, router } from '~/server/trpc/init'
import { createLogger } from '~/server/lib/logger'
import { apiError, paginationInputSchema } from '~/server/lib/trpc-utils'

const logger = createLogger('user')

export const userRouter = router({
	list: adminProcedure
		.input(
			z.object({
				...paginationInputSchema.shape,
				search: z.string().optional(),
				role: z.string().optional(),
				banned: z.boolean().optional(),
			})
		)
		.query(async ({ input }) => {
			try {
				const conditions = [];

				if (input.search) {
					conditions.push(
						or(
							ilike(user.name, `%${input.search}%`),
							ilike(user.email, `%${input.search}%`),
							ilike(sql`COALESCE(${user.username}, '')`, `%${input.search}%`)
						)
					);
				}

				if (input.role) {
					conditions.push(eq(user.role, input.role));
				}

				if (input.banned !== undefined) {
					conditions.push(eq(user.banned, input.banned));
				}

				const where = conditions.length > 0 ? and(...conditions) : undefined;

				const [{ count: total } = { count: 0 }] = await db
					.select({ count: count() })
					.from(user)
					.where(where);

				const users = await db
					.select({
						id: user.id,
						name: user.name,
						email: user.email,
						username: user.username,
						displayUsername: user.displayUsername,
						image: user.image,
						role: user.role,
						banned: user.banned,
						banReason: user.banReason,
						emailVerified: user.emailVerified,
						createdAt: user.createdAt,
					})
					.from(user)
					.where(where)
					.orderBy(desc(user.createdAt))
					.limit(input.limit)
					.offset(input.offset);

				return { users, total: Number(total) };
			} catch (error) {
				logger.error({ err: error }, 'Failed to list users')
				throw apiError('INTERNAL_SERVER_ERROR', 'Failed to list users')
			}
		}),

	updateRole: adminProcedure
		.input(z.object({ userId: z.string(), role: z.string() }))
		.mutation(async ({ input }) => {
			try {
				await db.update(user).set({ role: input.role }).where(eq(user.id, input.userId));
				return { success: true };
			} catch (error) {
				logger.error({ err: error }, 'Failed to update user role')
				throw apiError('INTERNAL_SERVER_ERROR', 'Failed to update user role')
			}
		}),

	banUser: adminProcedure
		.input(z.object({ userId: z.string(), reason: z.string().optional() }))
		.mutation(async ({ input }) => {
			try {
				await db
					.update(user)
					.set({ banned: true, banReason: input.reason ?? null, banExpires: null })
					.where(eq(user.id, input.userId));
				return { success: true };
			} catch (error) {
				logger.error({ err: error }, 'Failed to ban user')
				throw apiError('INTERNAL_SERVER_ERROR', 'Failed to ban user')
			}
		}),

	unbanUser: adminProcedure
		.input(z.object({ userId: z.string() }))
		.mutation(async ({ input }) => {
			try {
				await db
					.update(user)
					.set({ banned: false, banReason: null, banExpires: null })
					.where(eq(user.id, input.userId));
				return { success: true };
			} catch (error) {
				logger.error({ err: error }, 'Failed to unban user')
				throw apiError('INTERNAL_SERVER_ERROR', 'Failed to unban user')
			}
		}),

	byUsername: publicProcedure
		.input(z.object({ username: z.string() }))
		.query(async ({ input }) => {
			try {
				const [result] = await db
					.select({
						id: user.id,
						name: user.name,
						username: user.username,
						image: user.image,
						createdAt: user.createdAt,
						bio: profile.bio,
						location: profile.location,
						website: profile.website,
					})
					.from(user)
					.leftJoin(profile, eq(profile.id, user.id))
					.where(
						or(eq(user.username, input.username.toLowerCase()), eq(user.id, input.username))
					)

				return result ?? null
			} catch (error) {
				logger.error({ err: error }, 'Failed to fetch user by username')
				throw apiError('INTERNAL_SERVER_ERROR', 'Failed to fetch user')
			}
		}),

	getMyProfile: protectedProcedure.query(async ({ ctx }) => {
			try {
				const [result] = await db
					.select({
						id: user.id,
						name: user.name,
						username: user.username,
						email: user.email,
						image: user.image,
						bio: profile.bio,
						location: profile.location,
						website: profile.website,
					})
					.from(user)
					.leftJoin(profile, eq(profile.id, user.id))
					.where(eq(user.id, ctx.user.id))

				return result ?? null
			} catch (error) {
				logger.error({ err: error }, 'Failed to fetch my profile')
				throw apiError('INTERNAL_SERVER_ERROR', 'Failed to fetch profile')
			}
		}),

	updateProfile: protectedProcedure
		.input(
			z.object({
				name: z.string().min(1).max(100),
				username: z.string().min(3).max(30).regex(/^[a-z0-9_-]+$/),
				image: z.string().url().optional(),
				bio: z.string().max(500).optional(),
				location: z.string().max(100).optional(),
				website: z.string().url().optional(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				const [existing] = await db
					.select({ id: user.id })
					.from(user)
					.where(eq(user.username, input.username))

				if (existing && existing.id !== ctx.user.id) {
					throw apiError('CONFLICT', 'Username already taken')
				}

				await db
					.update(user)
					.set({ name: input.name, username: input.username, image: input.image })
					.where(eq(user.id, ctx.user.id))

				await db
					.insert(profile)
					.values({
						id: ctx.user.id,
						bio: input.bio,
						location: input.location,
						website: input.website,
					})
					.onConflictDoUpdate({
						target: profile.id,
						set: {
							bio: input.bio,
							location: input.location,
							website: input.website,
							updatedAt: new Date(),
						},
					})

				return { success: true }
			} catch (error) {
				if (error instanceof TRPCError) throw error
				logger.error({ err: error }, 'Failed to update profile')
				throw apiError('INTERNAL_SERVER_ERROR', 'Failed to update profile')
			}
		}),

	search: publicProcedure
		.input(z.object({ query: z.string().min(1) }))
		.query(async ({ input }) => {
			try {
				return db
					.select({ id: user.id, name: user.name, username: user.username, image: user.image })
					.from(user)
					.where(ilike(user.name, `%${input.query}%`))
					.limit(10)
			} catch (error) {
				logger.error({ err: error }, 'Failed to search users')
				throw apiError('INTERNAL_SERVER_ERROR', 'Failed to search users')
			}
		}),

	getThreads: publicProcedure
		.input(z.object({ userId: z.string(), limit: z.number().default(10) }))
		.query(async ({ input }) => {
			try {
				return db
					.select({ id: thread.id, title: thread.title, createdAt: thread.createdAt, replyCount: thread.replyCount })
					.from(thread)
					.where(eq(thread.authorId, input.userId))
					.limit(input.limit)
			} catch (error) {
				logger.error({ err: error }, 'Failed to fetch user threads')
				throw apiError('INTERNAL_SERVER_ERROR', 'Failed to fetch user threads')
			}
		}),

	topContributors: publicProcedure
		.input(z.object({ limit: z.number().default(5) }))
		.query(async ({ input }) => {
			try {
				const threadCount = count(thread.id)

				return db
					.select({
						id: user.id,
						name: user.name,
						username: user.username,
						image: user.image,
						displayUsername: user.username,
						threadCount,
					})
					.from(user)
					.leftJoin(thread, eq(user.id, thread.authorId))
					.groupBy(user.id)
					.orderBy(desc(threadCount))
					.limit(input.limit)
			} catch (error) {
				logger.error({ err: error }, 'Failed to fetch top contributors')
				throw apiError('INTERNAL_SERVER_ERROR', 'Failed to fetch top contributors')
			}
		}),
})
