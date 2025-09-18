import { router, publicProcedure, protectedProcedure } from '$server/trpc/init';
import { z } from 'zod';
import { eq, desc } from 'drizzle-orm';
import { user } from '$server/db/schema/auth-schema';
import { profile } from '$server/db/schema/profile-schema';
import { TRPCError } from '@trpc/server';
import { profileSchema } from '$lib/schemas';
import { normalizeUsername } from '$utils';
import { reply, thread } from '$server/db/schema/thread-schema';

export const userRouter = router({
	byUsername: publicProcedure
		.input(z.object({ username: z.string().min(1) }))
		.query(async ({ ctx, input }) => {
			const normalizedUsername = normalizeUsername(input.username);
			const [found] = await ctx.db
				.select({
					id: user.id,
					name: user.name,
					username: user.username,
					displayUsername: user.displayUsername,
					image: user.image,
					role: user.role,
					createdAt: user.createdAt,
					profile: {
						bio: profile.bio,
						location: profile.location,
						website: profile.website
					}
				})
				.from(user)
				.leftJoin(profile, eq(user.id, profile.id))
				.where(eq(user.username, normalizedUsername));

			if (!found) return null;

			const threads = await ctx.db
				.select({
					id: thread.id,
					title: thread.title,
					createdAt: thread.createdAt
				})
				.from(thread)
				.where(eq(thread.authorId, found.id))
				.orderBy(desc(thread.createdAt))
				.limit(20);

			const replies = await ctx.db
				.select({
					id: reply.id,
					content: reply.content,
					createdAt: reply.createdAt,
					threadId: reply.threadId
				})
				.from(reply)
				.where(eq(reply.authorId, found.id))
				.orderBy(desc(reply.createdAt))
				.limit(20);

			return { ...found, threads, replies };
		}),

	updateProfile: protectedProcedure.input(profileSchema).mutation(async ({ ctx, input }) => {
		const currentUserId = ctx.user.id;

		const normalizedUsername = normalizeUsername(input.username);

		const [existing] = await ctx.db
			.select({ id: user.id })
			.from(user)
			.where(eq(user.username, normalizedUsername));

		if (existing && existing.id !== currentUserId) {
			throw new TRPCError({ code: 'CONFLICT', message: 'Username already taken' });
		}

		await ctx.db
			.update(user)
			.set({
				name: input.name,
				username: normalizedUsername,
				displayUsername: input.displayUsername || input.name,
				updatedAt: new Date()
			})
			.where(eq(user.id, currentUserId));

		await ctx.db
			.update(profile)
			.set({
				bio: input.bio || '',
				location: input.location || '',
				website: input.website || '',
				image: input.image
			})
			.where(eq(profile.id, currentUserId));

		return { success: true };
	}),

	list: publicProcedure.query(async ({ ctx }) => {
		return ctx.db
			.select({
				id: user.id,
				username: user.username,
				displayUsername: user.displayUsername,
				image: user.image
			})
			.from(user);
	}),
	updateSettings: protectedProcedure
		.input(
			z.object({
				emailNotifications: z.boolean(),
				privateProfile: z.boolean()
			})
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.db
				.update(user)
				.set({
					emailNotifications: input.emailNotifications,
					privateProfile: input.privateProfile
				})
				.where(eq(user.id, ctx.user.id));
			return { success: true };
		}),

	getSettings: protectedProcedure.query(async ({ ctx }) => {
		const result = await ctx.db.select().from(user).where(eq(user.id, ctx.user.id)).limit(1);
		return result[0];
	}),
	topContributors: publicProcedure
		.input(z.object({ limit: z.number().optional() }))
		.query(async ({ ctx, input }) => {
			const limit = input.limit ?? 5;

			return await ctx.db
				.select({
					id: user.id,
					name: user.name,
					displayUsername: user.displayUsername,
					image: user.image // or profiles.avatar if you join it
				})
				.from(user)
				.groupBy(user.id)
				.limit(limit);
		})
});
