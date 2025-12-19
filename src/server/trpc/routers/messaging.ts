// messaging.ts
import { and, asc, desc, eq, ne } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '$server/db';
import { user } from '$server/db/schema/auth-schema'; // ADD THIS IMPORT
import {
	conversationParticipants,
	conversations,
	messageAttachments,
	messages
} from '$server/db/schema/messaging-schema';
import { protectedProcedure, router } from '$server/trpc/init';

export const messagesRouter = router({
	// List conversations for the logged-in user
	conversations: protectedProcedure.query(async ({ ctx }) => {
		const result = await db
			.select({
				conversationId: conversations.id,
				lastMessageAt: conversations.lastMessageAt,
				messageContent: messages.content,
				messageCreatedAt: messages.createdAt,
				senderId: messages.senderId,
				unreadCount: db.$count(messages.id).mapWith(Number)
			})
			.from(conversationParticipants)
			.innerJoin(conversations, eq(conversations.id, conversationParticipants.conversationId))
			.leftJoin(
				messages,
				and(
					eq(messages.conversationId, conversations.id),
					eq(messages.readAt, null),
					ne(messages.senderId, ctx.user.id)
				)
			)
			.where(eq(conversationParticipants.userId, ctx.user.id))
			.groupBy(conversations.id, messages.content, messages.createdAt, messages.senderId)
			.orderBy(desc(conversations.lastMessageAt));

		return result;
	}),

	// Get conversation + messages + participants
	getConversation: protectedProcedure
		.input(z.object({ conversationId: z.string() }))
		.query(async ({ ctx, input }) => {
			// Verify user is a participant
			const userParticipant = await db.query.conversationParticipants.findFirst({
				where: and(
					eq(conversationParticipants.conversationId, input.conversationId),
					eq(conversationParticipants.userId, ctx.user.id)
				)
			});

			if (!userParticipant) {
				throw new Error('Not authorized to view this conversation');
			}

			const convo = await db.query.conversations.findFirst({
				where: eq(conversations.id, input.conversationId)
			});

			if (!convo) {
				throw new Error('Conversation not found');
			}

			// Get participants
			const participants = await db.query.conversationParticipants.findMany({
				where: eq(conversationParticipants.conversationId, input.conversationId)
			});

			// Get the other user (not the current user)
			const otherUserId = participants.find((p) => p.userId !== ctx.user.id)?.userId;

			if (!otherUserId) {
				throw new Error('Other participant not found');
			}

			// Fetch user details from your user table
			const otherUser = await db.query.user.findFirst({
				where: eq(user.id, otherUserId)
			});

			if (!otherUser) {
				throw new Error('Other user not found');
			}

			const currentUser = ctx.user;

			const msgs = await db.query.messages.findMany({
				where: eq(messages.conversationId, input.conversationId),
				orderBy: [asc(messages.createdAt)]
			});

			return {
				conversation: convo,
				messages: msgs,
				currentUser: {
					id: currentUser.id,
					name: currentUser.name,
					img: currentUser.image
				},
				otherUser: {
					id: otherUser.id,
					name: otherUser.name,
					img: otherUser.image,
					lastActive: 5
				},
				currentUserId: currentUser.id
			};
		}),

	// Send a message
	sendMessage: protectedProcedure
		.input(
			z.object({
				conversationId: z.string(),
				content: z.string().optional(),

				attachments: z
					.array(
						z.object({
							type: z.enum(['image', 'file', 'audio']),
							url: z.string().url(),
							fileName: z.string().optional(),
							mimeType: z.string().optional(),
							fileSize: z.number().optional(),
							duration: z.number().optional() // audio only
						})
					)
					.optional()
			})
		)
		.mutation(async ({ ctx, input }) => {
			// Verify user is a participant
			const participant = await db.query.conversationParticipants.findFirst({
				where: and(
					eq(conversationParticipants.conversationId, input.conversationId),
					eq(conversationParticipants.userId, ctx.user.id)
				)
			});

			if (!participant) {
				throw new Error('Not authorized to send messages in this conversation');
			}

			// Validate message has content OR attachments

			if (!input.content && !input.attachments?.length) {
				throw new Error('Message must contain text or at least one attachment');
			}

			// Transaction: insert message + attachments
			return await db.transaction(async (tx) => {
				const [message] = await tx
					.insert(messages)
					.values({
						id: crypto.randomUUID(),
						conversationId: input.conversationId,
						senderId: ctx.user.id,
						content: input.content ?? ''
					})
					.returning();

				if (input.attachments?.length) {
					await tx.insert(messageAttachments).values(
						input.attachments.map((a) => ({
							messageId: message.id,
							type: a.type,
							url: a.url,
							fileName: a.fileName,
							mimeType: a.mimeType,
							fileSize: a.fileSize,
							duration: a.duration
						}))
					);
				}

				return message;
			});
		}),
	// Start a new conversation (2-way DM)
	createConversation: protectedProcedure
		.input(z.object({ userId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			// Check if conversation already exists between these users
			const existingParticipants = await db
				.select({
					conversationId: conversationParticipants.conversationId
				})
				.from(conversationParticipants)
				.where(eq(conversationParticipants.userId, ctx.user.id));

			const conversationIds = existingParticipants.map((p) => p.conversationId);

			if (conversationIds.length > 0) {
				const otherUserParticipants = await db
					.select({
						conversationId: conversationParticipants.conversationId
					})
					.from(conversationParticipants)
					.where(eq(conversationParticipants.userId, input.userId));

				const sharedConvo = otherUserParticipants.find((p) =>
					conversationIds.includes(p.conversationId)
				);

				if (sharedConvo) {
					return { id: sharedConvo.conversationId, existing: true };
				}
			}

			// Create new conversation
			const convoId = crypto.randomUUID();

			await db.insert(conversations).values({
				id: convoId
			});

			await db.insert(conversationParticipants).values([
				{ conversationId: convoId, userId: ctx.user.id },
				{ conversationId: convoId, userId: input.userId }
			]);

			return { id: convoId, existing: false };
		}),
	markAsRead: protectedProcedure
		.input(z.object({ conversationId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await db
				.update(messages)
				.set({ readAt: new Date() })
				.where(
					and(
						eq(messages.conversationId, input.conversationId),
						eq(messages.readAt, null),
						ne(messages.senderId, ctx.user.id)
					)
				);
		})
});
