import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const themePreset = pgTable('theme_preset', {
	id: uuid('id').defaultRandom().primaryKey(),
	name: text('name').notNull().default('Untitled Theme'),
	data: text('data').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});
