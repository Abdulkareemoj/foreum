import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

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

export const eventAttendees = pgTable('event_attendees', {
	eventId: uuid('event_id')
		.notNull()
		.references(() => events.id, { onDelete: 'cascade' }),
	userId: uuid('user_id').notNull(), // references users table
	status: varchar('status', { length: 20 }).notNull() // 'going', 'maybe', 'not_going'
	// Composite primary key
});
