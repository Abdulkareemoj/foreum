import { pgTable, text, timestamp, varchar, uuid } from 'drizzle-orm/pg-core';

export const events = pgTable('events', {
	id: uuid('id').primaryKey().defaultRandom(),
	title: varchar('title', { length: 200 }).notNull(),
	description: text('description'),
	location: varchar('location', { length: 200 }),
	startsAt: timestamp('starts_at').notNull(),
	endsAt: timestamp('ends_at').notNull(),
	createdBy: uuid('created_by').notNull(),
	groupId: uuid('group_id') // optional
});
