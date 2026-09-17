import { jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { user } from './auth-schema';

/**
 * Thread drafts — auto-saved unpublished content.
 * One active draft per user (upserted on each save).
 */
export const threadDraft = pgTable('thread_draft', {
	id: text('id').primaryKey(),
	authorId: text('author_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	title: text('title'),
	content: jsonb('content'),
	categoryId: text('category_id'),
	tags: jsonb('tags'), // string[]
	groupId: text('group_id'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});
