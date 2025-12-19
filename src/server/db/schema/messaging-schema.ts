import { integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const conversations = pgTable('conversations', {
	id: uuid('id').primaryKey().defaultRandom(),
	createdAt: timestamp('created_at').defaultNow(),
	lastMessageAt: timestamp('last_message_at')
});

export const conversationParticipants = pgTable('conversation_participants', {
	conversationId: uuid('conversation_id')
		.notNull()
		.references(() => conversations.id),
	userId: text('user_id').notNull() // references users table
});
export const messages = pgTable('messages', {
	id: uuid('id').primaryKey().defaultRandom(),
	conversationId: uuid('conversation_id')
		.notNull()
		.references(() => conversations.id, { onDelete: 'cascade' }),
	senderId: text('sender_id').notNull(),
	message: text('message').notNull(),
	content: text('content').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	readAt: timestamp('read_at') // NULL = unread
});

export const messageAttachments = pgTable('message_attachments', {
	id: uuid('id').primaryKey().defaultRandom(),

	messageId: uuid('message_id')
		.notNull()
		.references(() => messages.id, { onDelete: 'cascade' }),

	type: varchar('type', { length: 20 }).notNull(),
	// 'image' | 'file' | 'audio'

	url: text('url').notNull(),

	fileName: varchar('file_name', { length: 255 }),
	mimeType: varchar('mime_type', { length: 100 }),
	fileSize: integer('file_size'), // bytes

	duration: integer('duration'), // seconds (audio only)

	createdAt: timestamp('created_at').defaultNow()
});
