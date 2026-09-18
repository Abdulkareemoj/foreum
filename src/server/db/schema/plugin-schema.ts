import { boolean, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * Registered plugins.
 * Each plugin has a manifest (name, version, hooks, permissions) and an enabled flag.
 */
export const plugin = pgTable('plugin', {
	id: text('id').primaryKey(),
	name: text('name').notNull().unique(),
	version: text('version').notNull().default('1.0.0'),
	description: text('description'),
	author: text('author'),
	enabled: boolean('enabled').default(true).notNull(),
	hooks: jsonb('hooks').notNull().default('[]'),
	permissions: jsonb('permissions').notNull().default('[]'),
	config: jsonb('config').default('{}'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});
