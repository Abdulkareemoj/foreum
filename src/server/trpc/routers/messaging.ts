// server/trpc/routers/messages.ts
import { and,eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '$server/db';
import {
	conversationParticipants,
	conversations,
	messages
} from '$server/db/schema/messaging-schema';
import { protectedProcedure,router } from '$server/trpc/init';

export const messagesRouter = router({
	startConversation: protectedProcedure
		.input(z.object({ userId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const [conv] = await db
				.insert(conversations)
				.values({
					id: crypto.randomUUID(),
					type: 'direct'
				})
				.returning();

			await db.insert(conversationParticipants).values([
				{ conversationId: conv.id, userId: ctx.user.id, role: 'member' },
				{ conversationId: conv.id, userId: input.userId, role: 'member' }
			]);

			return conv;
		}),

	sendMessage: protectedProcedure
		.input(
			z.object({
				conversationId: z.string(),
				content: z.string().min(1),
				attachments: z.any().optional()
			})
		)
		.mutation(({ ctx, input }) =>
			db.insert(messages).values({
				id: crypto.randomUUID(),
				conversationId: input.conversationId,
				senderId: ctx.user.id,
				content: input.content,
				attachments: input.attachments
			})
		)
});
