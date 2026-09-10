import { integer, pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core';

import { user } from './auth-schema';
import { reply, thread } from './thread-schema';

export const vote = pgTable('vote', {
	id: text('id').primaryKey(),
	value: integer('value').notNull(), // 1 = upvote, -1 = downvote
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	threadId: text('thread_id').references(() => thread.id, { onDelete: 'cascade' }),
	replyId: text('reply_id').references(() => reply.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').defaultNow(),
}, (t) => [
	unique('unique_thread_vote').on(t.userId, t.threadId),
	unique('unique_reply_vote').on(t.userId, t.replyId),
]);

export const voteCount = pgTable('vote_count', {
	id: text('id').primaryKey(),
	threadId: text('thread_id').references(() => thread.id, { onDelete: 'cascade' }),
	replyId: text('reply_id').references(() => reply.id, { onDelete: 'cascade' }),
	score: integer('score').default(0), // upvotes - downvotes
	upvotes: integer('upvotes').default(0),
	downvotes: integer('downvotes').default(0),
	createdAt: timestamp('created_at').defaultNow(),
});
