import { TRPCError } from '@trpc/server';
import crypto from 'crypto';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '$server/db';
import { groupMembers, groups } from '$server/db/schema/groups-schema';
import { protectedProcedure, publicProcedure, router } from '$server/trpc/init';

export const groupsRouter = router({
	list: publicProcedure.query(async () => {
		try {
			const allGroups = await db.select().from(groups);

			// Attach member counts (optional but useful)
			const withCounts = await Promise.all(
				allGroups.map(async (g) => {
					const members = await db
						.select()
						.from(groupMembers)
						.where(eq(groupMembers.groupId, g.id));

					return {
						...g,
						membersCount: members.length
					};
				})
			);

			return withCounts;
		} catch (error) {
			console.error('[groups.list]', error);
			throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch groups' });
		}
	}),

	create: protectedProcedure
		.input(
			z.object({
				name: z.string().min(1).max(100),
				slug: z
					.string()
					.min(1)
					.regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
				description: z.string().optional()
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				// Check if slug already exists
				const existing = await db.select().from(groups).where(eq(groups.slug, input.slug));

				if (existing.length > 0) {
					throw new TRPCError({
						code: 'CONFLICT',
						message: 'Slug already exists. Choose a different one.'
					});
				}

				const [g] = await db
					.insert(groups)
					.values({
						id: crypto.randomUUID(),
						name: input.name,
						slug: input.slug,
						description: input.description,
						createdBy: ctx.user.id
					})
					.returning();

				// Creator becomes group owner
				await db.insert(groupMembers).values({
					groupId: g.id,
					userId: ctx.user.id,
					role: 'owner'
				});

				return g;
			} catch (error) {
				if (error instanceof TRPCError) throw error;
				console.error('[groups.create]', error);
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create group' });
			}
		}),

	join: protectedProcedure
		.input(z.object({ groupId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			try {
				// Check if already a member
				const existing = await db
					.select()
					.from(groupMembers)
					.where(
						and(eq(groupMembers.groupId, input.groupId), eq(groupMembers.userId, ctx.user.id))
					);

				if (existing.length > 0) {
					throw new TRPCError({
						code: 'CONFLICT',
						message: 'You are already a member of this group'
					});
				}

				// Check if group exists
				const groupExists = await db.select().from(groups).where(eq(groups.id, input.groupId));

				if (groupExists.length === 0) {
					throw new TRPCError({ code: 'NOT_FOUND', message: 'Group not found' });
				}

				await db.insert(groupMembers).values({
					groupId: input.groupId,
					userId: ctx.user.id,
					role: 'member'
				});

				return { success: true };
			} catch (error) {
				if (error instanceof TRPCError) throw error;
				console.error('[groups.join]', error);
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to join group' });
			}
		}),

	leave: protectedProcedure
		.input(z.object({ groupId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			try {
				// use .returning() so we get an array of deleted rows
				const deleted = await db
					.delete(groupMembers)
					.where(and(eq(groupMembers.groupId, input.groupId), eq(groupMembers.userId, ctx.user.id)))
					.returning();

				if (deleted.length === 0) {
					throw new TRPCError({
						code: 'NOT_FOUND',
						message: 'You are not a member of this group.'
					});
				}

				return { success: true };
			} catch (error) {
				// Added error handling for leave group
				if (error instanceof TRPCError) throw error;
				console.error('[groups.leave]', error);
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to leave group' });
			}
		}),
	byId: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
		try {
			const [group] = await db.select().from(groups).where(eq(groups.id, input.id));

			if (!group) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Group not found'
				});
			}

			return group;
		} catch (error) {
			// Added error handling for get group by id
			console.error('[groups.byId]', error);
			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'Failed to fetch group by id'
			});
		}
	}),
	threads: publicProcedure.input(z.object({ groupId: z.string() })).query(async ({ input }) => {
		try {
			// Placeholder for fetching threads related to the group
			// Replace with actual implementation
			return [];
		} catch (error) {
			// Added error handling for get threads
			console.error('[groups.threads]', error);
			throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch threads' });
		}
	}),
	members: publicProcedure.input(z.object({ groupId: z.string() })).query(async ({ input }) => {
		try {
			const members = await db
				.select()
				.from(groupMembers)
				.where(eq(groupMembers.groupId, input.groupId));

			return members;
		} catch (error) {
			// Added error handling for get members
			console.error('[groups.members]', error);
			throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch members' });
		}
	}),
	updateMemberRole: protectedProcedure
		.input(
			z.object({
				groupId: z.string(),
				userId: z.string(),
				role: z.enum(['owner', 'member'])
			})
		)
		.mutation(async ({ input }) => {
			try {
				const updated = await db
					.update(groupMembers)
					.set({ role: input.role })
					.where(
						and(eq(groupMembers.groupId, input.groupId), eq(groupMembers.userId, input.userId))
					)
					.returning();

				if (updated.length === 0) {
					throw new TRPCError({
						code: 'NOT_FOUND',
						message: 'Member not found in the group.'
					});
				}

				return { success: true };
			} catch (error) {
				// Added error handling for update member role
				if (error instanceof TRPCError) throw error;
				console.error('[groups.updateMemberRole]', error);
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Failed to update member role'
				});
			}
		}),
	removeMember: protectedProcedure
		.input(
			z.object({
				groupId: z.string(),
				memberId: z.string()
			})
		)
		.mutation(async ({ input }) => {
			try {
				const deleted = await db
					.delete(groupMembers)
					.where(
						and(eq(groupMembers.groupId, input.groupId), eq(groupMembers.userId, input.memberId))
					)
					.returning();

				if (deleted.length === 0) {
					throw new TRPCError({
						code: 'NOT_FOUND',
						message: 'Member not found in the group.'
					});
				}

				return { success: true };
			} catch (error) {
				// Added error handling for remove member
				if (error instanceof TRPCError) throw error;
				console.error('[groups.removeMember]', error);
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to remove member' });
			}
		}),
	view: publicProcedure
		.input(z.object({ slug: z.string().min(1) }))
		.query(async ({ ctx, input }) => {
			try {
				// 1. Find the group
				const [group] = await db.select().from(groups).where(eq(groups.slug, input.slug));

				if (!group) {
					throw new TRPCError({
						code: 'NOT_FOUND',
						message: 'Group not found.'
					});
				}

				// 2. Get all members
				const members = await db
					.select()
					.from(groupMembers)
					.where(eq(groupMembers.groupId, group.id));

				// 3. Determine if current user is a member (optional for public)
				let membership: null | {
					role: 'owner' | 'admin' | 'member';
				} = null;

				if (ctx.user) {
					const existing = await db
						.select()
						.from(groupMembers)
						.where(and(eq(groupMembers.groupId, group.id), eq(groupMembers.userId, ctx.user.id)));

					if (existing.length > 0) {
						membership = { role: existing[0].role };
					}
				}

				// 4. Count members
				const membersCount = members.length;

				return {
					...group,
					membersCount,
					membership,
					members
				};
			} catch (error) {
				// Added error handling for view group
				console.error('[groups.view]', error);
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to view group' });
			}
		})
});
