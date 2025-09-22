import { pgTable, primaryKey,text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

// Resources
export const resources = pgTable('resources', {
	id: uuid('id').primaryKey().defaultRandom(),
	title: varchar('title', { length: 200 }).notNull(),
	url: varchar('url', { length: 300 }).notNull(),
	description: text('description'),
	createdBy: uuid('created_by').notNull(),
	createdAt: timestamp('created_at').defaultNow()
});

export const resourceTags = pgTable(
	'resource_tags',
	{
		resourceId: uuid('resource_id').notNull(),
		tagId: uuid('tag_id').notNull()
	},
	(t) => ({
		pk: primaryKey({ columns: [t.resourceId, t.tagId] })
	})
);
