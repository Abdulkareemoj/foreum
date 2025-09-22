import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { thread } from './thread-schema';

export const tag = pgTable('tag', {
	id: text('id').primaryKey(),
	name: text('name').notNull().unique(),
	slug: text('slug').notNull().unique(),
	createdAt: timestamp('created_at').defaultNow()
});

export const threadTag = pgTable('thread_tag', {
	threadId: text('thread_id')
		.notNull()
		.references(() => thread.id),
	tagId: text('tag_id')
		.notNull()
		.references(() => tag.id)
});
export const tagCount = pgTable('tag_count', {
	tagId: text('tag_id')
		.notNull()
		.references(() => tag.id, { onDelete: 'cascade' }),
	threadCount: integer('thread_count').default(0),
	createdAt: timestamp('created_at').defaultNow()
});
