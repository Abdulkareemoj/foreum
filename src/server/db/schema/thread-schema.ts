import {
	pgTable,
	text,
	timestamp,
	boolean,
	json,
	integer,
	unique,
	jsonb
} from 'drizzle-orm/pg-core';
import { user } from './auth-schema';

export const category = pgTable('category', {
	id: text('id').primaryKey(),
	name: text('name').notNull().unique(),
	slug: text('slug').notNull().unique(),
	description: text('description'),
	createdAt: timestamp('created_at').defaultNow()
});

export const thread = pgTable('thread', {
	id: text('id').primaryKey(),
	title: text('title').notNull(),
	content: jsonb('content').notNull(),
	categoryId: text('category_id')
		.notNull()
		.references(() => category.id),
	replyCount: integer('reply_count').default(0),
	authorId: text('author_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	pinned: boolean('pinned').default(false),
	locked: boolean('locked').default(false),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const reply = pgTable('reply', {
	id: text('id').primaryKey(),
	content: jsonb('content').notNull(),
	threadId: text('thread_id')
		.notNull()
		.references(() => thread.id, { onDelete: 'cascade' }),
	authorId: text('author_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const threadView = pgTable(
	'thread_view',
	{
		id: text('id').primaryKey(),
		threadId: text('thread_id')
			.notNull()
			.references(() => thread.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		viewedAt: timestamp('viewed_at').defaultNow()
	},
	(t) => [unique('unique_view').on(t.threadId, t.userId)]
);

export const threadBookmark = pgTable(
	'thread_bookmark',
	{
		id: text('id').primaryKey(),
		threadId: text('thread_id')
			.notNull()
			.references(() => thread.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at').defaultNow()
	},
	(t) => [unique('unique_bookmark').on(t.threadId, t.userId)]
);

export const threadPoll = pgTable('thread_poll', {
	id: text('id').primaryKey(),
	threadId: text('thread_id')
		.notNull()
		.references(() => thread.id, { onDelete: 'cascade' }),
	question: text('question').notNull(),
	options: json('options').notNull(), // instead of text()
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
	isAnonymous: boolean('is_anonymous').default(false)
});

export const threadPollVote = pgTable(
	'thread_poll_vote',
	{
		id: text('id').primaryKey(),
		pollId: text('poll_id')
			.notNull()
			.references(() => threadPoll.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		optionIndex: integer('option_index').notNull(),

		createdAt: timestamp('created_at').defaultNow()
	},
	(t) => [unique('unique_vote').on(t.pollId, t.userId)]
);
