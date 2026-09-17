import { integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * Admin-configurable trust level settings.
 * Stores the full trust level definition as JSON for flexibility.
 */
export const trustLevelConfig = pgTable('trust_level_config', {
	id: text('id').primaryKey(),
	/** Trust level number (0-4) */
	level: integer('level').notNull().unique(),
	/** Display name e.g. "New User" */
	name: text('name').notNull(),
	/** Minimum account age in days */
	minDays: integer('min_days').notNull().default(0),
	/** Minimum post count (threads + replies) */
	minPosts: integer('min_posts').notNull().default(0),
	/** Array of permission strings granted at this level */
	permissions: jsonb('permissions').notNull().default([]),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});
