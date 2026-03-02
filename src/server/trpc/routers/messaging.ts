import { TRPCError } from '@trpc/server'
import crypto from 'crypto'
import { and, asc, desc, eq, ne, sql } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~/server/db'
import { user } from '~/server/db/schema/auth-schema'
import {
  conversationParticipants,
  conversations,
  messageAttachments,
  messages,
} from '~/server/db/schema/messaging-schema'
import { protectedProcedure, router } from '~/server/trpc/init'

export const messagesRouter = router({
  conversations: protectedProcedure.query(async ({ ctx }) => {
    try {
      // Get all conversations for the user with last message and unread count
      const userConversations = await db
        .select({
          conversationId: conversationParticipants.conversationId,
        })
        .from(conversationParticipants)
        .where(eq(conversationParticipants.userId, ctx.user.id))

      const conversationIds = userConversations.map((c) => c.conversationId)

      if (conversationIds.length === 0) {
        return []
      }

      const result = await db
        .select({
          id: conversations.id,
          lastMessageAt: conversations.lastMessageAt,
          lastMessage: {
            content: messages.content,
            createdAt: messages.createdAt,
            senderId: messages.senderId,
          },
          otherUser: {
            id: user.id,
            name: user.name,
            image: user.image,
          },
        })
        .from(conversations)
        .leftJoin(
          messages,
          and(
            eq(messages.conversationId, conversations.id),
            eq(
              messages.id,
              db
                .select({ id: messages.id })
                .from(messages)
                .where(eq(messages.conversationId, conversations.id))
                .orderBy(desc(messages.createdAt))
                .limit(1)
            )
          )
        )
        .leftJoin(
          conversationParticipants,
          and(
            eq(conversationParticipants.conversationId, conversations.id),
            ne(conversationParticipants.userId, ctx.user.id)
          )
        )
        .leftJoin(user, eq(user.id, conversationParticipants.userId))
        .where(sql`${conversations.id} IN ${conversationIds}`)
        .orderBy(desc(conversations.lastMessageAt))

      // Get unread counts
      const unreadCounts = await Promise.all(
        result.map(async (convo) => {
          const [count] = await db
            .select({ count: sql<number>`count(*)` })
            .from(messages)
            .where(
              and(
                eq(messages.conversationId, convo.id),
                eq(messages.readAt, null),
                ne(messages.senderId, ctx.user.id)
              )
            )

          return {
            conversationId: convo.id,
            unreadCount: Number(count?.count || 0),
          }
        })
      )

      return result.map((convo) => ({
        ...convo,
        unreadCount:
          unreadCounts.find((u) => u.conversationId === convo.id)?.unreadCount || 0,
      }))
    } catch (error) {
      console.error('[messages.conversations]', error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch conversations',
      })
    }
  }),

  getConversation: protectedProcedure
    .input(z.object({ conversationId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        // Verify user is a participant
        const [userParticipant] = await db
          .select()
          .from(conversationParticipants)
          .where(
            and(
              eq(conversationParticipants.conversationId, input.conversationId),
              eq(conversationParticipants.userId, ctx.user.id)
            )
          )

        if (!userParticipant) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not authorized to view this conversation',
          })
        }

        const [convo] = await db
          .select()
          .from(conversations)
          .where(eq(conversations.id, input.conversationId))

        if (!convo) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Conversation not found' })
        }

        // Get participants
        const participants = await db
          .select()
          .from(conversationParticipants)
          .where(eq(conversationParticipants.conversationId, input.conversationId))

        // Get the other user
        const otherUserId = participants.find((p) => p.userId !== ctx.user.id)?.userId

        if (!otherUserId) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Other participant not found' })
        }

        const [otherUser] = await db.select().from(user).where(eq(user.id, otherUserId))

        if (!otherUser) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Other user not found' })
        }

        // Get messages with attachments
        const msgs = await db
          .select({
            id: messages.id,
            conversationId: messages.conversationId,
            senderId: messages.senderId,
            content: messages.content,
            createdAt: messages.createdAt,
            readAt: messages.readAt,
          })
          .from(messages)
          .where(eq(messages.conversationId, input.conversationId))
          .orderBy(asc(messages.createdAt))

        // Get attachments for all messages
        const messageIds = msgs.map((m) => m.id)
        const attachments = messageIds.length
          ? await db
              .select()
              .from(messageAttachments)
              .where(sql`${messageAttachments.messageId} IN ${messageIds}`)
          : []

        const messagesWithAttachments = msgs.map((msg) => ({
          ...msg,
          attachments: attachments.filter((a) => a.messageId === msg.id),
        }))

        return {
          conversation: convo,
          messages: messagesWithAttachments,
          currentUser: {
            id: ctx.user.id,
            name: ctx.user.name,
            image: ctx.user.image,
          },
          otherUser: {
            id: otherUser.id,
            name: otherUser.name,
            image: otherUser.image,
          },
        }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        console.error('[messages.getConversation]', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch conversation',
        })
      }
    }),

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
              duration: z.number().optional(),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Verify participant
        const [participant] = await db
          .select()
          .from(conversationParticipants)
          .where(
            and(
              eq(conversationParticipants.conversationId, input.conversationId),
              eq(conversationParticipants.userId, ctx.user.id)
            )
          )

        if (!participant) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not authorized to send messages',
          })
        }

        if (!input.content && !input.attachments?.length) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Message must contain text or attachments',
          })
        }

        // Insert message and attachments in transaction
        const [message] = await db
          .insert(messages)
          .values({
            id: crypto.randomUUID(),
            conversationId: input.conversationId,
            senderId: ctx.user.id,
            content: input.content ?? '',
          })
          .returning()

        if (input.attachments?.length) {
          await db.insert(messageAttachments).values(
            input.attachments.map((a) => ({
              id: crypto.randomUUID(),
              messageId: message.id,
              type: a.type,
              url: a.url,
              fileName: a.fileName,
              mimeType: a.mimeType,
              fileSize: a.fileSize,
              duration: a.duration,
            }))
          )
        }

        // Update conversation last message timestamp
        await db
          .update(conversations)
          .set({ lastMessageAt: new Date() })
          .where(eq(conversations.id, input.conversationId))

        return message
      } catch (error) {
        if (error instanceof TRPCError) throw error
        console.error('[messages.sendMessage]', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to send message',
        })
      }
    }),

  createConversation: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if conversation already exists
        const existingParticipants = await db
          .select({ conversationId: conversationParticipants.conversationId })
          .from(conversationParticipants)
          .where(eq(conversationParticipants.userId, ctx.user.id))

        const conversationIds = existingParticipants.map((p) => p.conversationId)

        if (conversationIds.length > 0) {
          const otherUserParticipants = await db
            .select({ conversationId: conversationParticipants.conversationId })
            .from(conversationParticipants)
            .where(eq(conversationParticipants.userId, input.userId))

          const sharedConvo = otherUserParticipants.find((p) =>
            conversationIds.includes(p.conversationId)
          )

          if (sharedConvo) {
            return { id: sharedConvo.conversationId, existing: true }
          }
        }

        // Create new conversation
        const convoId = crypto.randomUUID()

        await db.insert(conversations).values({ id: convoId })

        await db.insert(conversationParticipants).values([
          { conversationId: convoId, userId: ctx.user.id },
          { conversationId: convoId, userId: input.userId },
        ])

        return { id: convoId, existing: false }
      } catch (error) {
        console.error('[messages.createConversation]', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create conversation',
        })
      }
    }),

  markAsRead: protectedProcedure
    .input(z.object({ conversationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await db
          .update(messages)
          .set({ readAt: new Date() })
          .where(
            and(
              eq(messages.conversationId, input.conversationId),
              eq(messages.readAt, null),
              ne(messages.senderId, ctx.user.id)
            )
          )

        return { success: true }
      } catch (error) {
        console.error('[messages.markAsRead]', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to mark as read',
        })
      }
    }),
})