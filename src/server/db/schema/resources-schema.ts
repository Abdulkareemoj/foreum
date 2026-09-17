import { pgTable, primaryKey, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

import { user } from './auth-schema';

// Resources
export const resources = pgTable('resources', {
	id: uuid('id').primaryKey().defaultRandom(),
	title: varchar('title', { length: 200 }).notNull(),
	url: varchar('url', { length: 300 }).notNull(),
	description: text('description'),
	createdBy: text('created_by')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const resourceTags = pgTable(
	'resource_tags',
	{
		resourceId: uuid('resource_id')
			.notNull()
			.references(() => resources.id, { onDelete: 'cascade' }),
		tagId: uuid('tag_id').notNull()
	},
	(t) => ({
		pk: primaryKey({ columns: [t.resourceId, t.tagId] })
	})
);
