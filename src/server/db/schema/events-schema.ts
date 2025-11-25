import { boolean, integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const events = pgTable('events', {
	id: uuid('id').primaryKey().defaultRandom(),

	title: varchar('title', { length: 200 }).notNull(),
	description: text('description'),

	eventType: varchar('event_type', { length: 20 })
		.notNull() // physical | virtual | hybrid | other
		.default('other'),

	physicalLocation: varchar('physical_location', { length: 255 }),

	virtualUrl: varchar('virtual_url', { length: 255 }),

	isOnline: boolean('is_online').notNull().default(false),

	startsAt: timestamp('starts_at').notNull(),
	endsAt: timestamp('ends_at').notNull(),
	visibility: varchar('visibility', { length: 20 }).notNull().default('public'), // public | private | unlisted
	coverImage: varchar('cover_image', { length: 255 }),
	category: varchar('category', { length: 100 }),
	maxAttendees: integer('max_attendees'),

	createdBy: uuid('created_by').notNull(),

	groupId: uuid('group_id'),

	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const eventAttendees = pgTable('event_attendees', {
	eventId: uuid('event_id')
		.notNull()
		.references(() => events.id, { onDelete: 'cascade' }),
	userId: uuid('user_id').notNull(), // references users table
	status: varchar('status', { length: 20 }).notNull() // 'going', 'maybe', 'not_going'
});
