import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { user } from './auth-schema';
import { reply,thread } from './thread-schema';

export const reaction = pgTable('reaction', {
	id: text('id').primaryKey(),
	type: text('type').notNull(), // e.g. 'like', 'heart'
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	threadId: text('thread_id').references(() => thread.id),
	replyId: text('reply_id').references(() => reply.id),
	createdAt: timestamp('created_at').defaultNow()
});

export const reactionCount = pgTable('reaction_count', {
	id: text('id').primaryKey(),
	threadId: text('thread_id').references(() => thread.id),
	replyId: text('reply_id').references(() => reply.id),
	likeCount: integer('like_count').default(0),
	heartCount: integer('heart_count').default(0),
	laughCount: integer('laugh_count').default(0),
	total: integer('total').default(0),
	createdAt: timestamp('created_at').defaultNow()
});

export const reactionSummary = pgTable('reaction_summary', {
	id: text('id').primaryKey(),
	threadId: text('thread_id')
		.notNull()
		.references(() => thread.id, { onDelete: 'cascade' }),
	replyId: text('reply_id').references(() => reply.id),
	totalReactions: integer('total_reactions').default(0),
	createdAt: timestamp('created_at').defaultNow()
});

export const reactionType = pgTable('reaction_type', {
	id: text('id').primaryKey(), // e.g. 'like', 'heart', 'laugh'
	label: text('label').notNull(),
	emoji: text('emoji').notNull() // e.g. "❤️", "😂"
});
