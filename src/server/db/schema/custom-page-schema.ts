import { pgTable, text, timestamp, boolean, uuid } from 'drizzle-orm/pg-core';

export const customPage = pgTable('custom_page', {
	id: uuid('id').primaryKey().defaultRandom(),
	title: text('title').notNull(),
	slug: text('slug').notNull().unique(),
	content: text('content').notNull().default(''),
	published: boolean('published').notNull().default(false),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});
