import { json, pgTable, primaryKey,text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const conversations = pgTable('conversations', {
	id: uuid('id').primaryKey().defaultRandom(),
	type: varchar('type', { length: 20 }).notNull(), // direct, group
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export const conversationParticipants = pgTable(
	'conversation_participants',
	{
		conversationId: uuid('conversation_id').notNull(),
		userId: uuid('user_id').notNull(),
		role: varchar('role', { length: 20 }).default('member')
	},
	(t) => ({
		pk: primaryKey({ columns: [t.conversationId, t.userId] })
	})
);

export const messages = pgTable('messages', {
	id: uuid('id').primaryKey().defaultRandom(),
	conversationId: uuid('conversation_id').notNull(),
	senderId: uuid('sender_id').notNull(),
	content: text('content').notNull(),
	attachments: json('attachments'),
	createdAt: timestamp('created_at').defaultNow().notNull()
});
