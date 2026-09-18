import { boolean, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * Auto-moderation rules, filter content based on patterns.
 * Actions: 'block' (reject), 'flag' (allow but flag for review), 'replace' (censor matched text)
 */
export const moderationRule = pgTable('moderation_rule', {
	id: text('id').primaryKey(),
	/** Human-readable rule name */
	name: text('name').notNull(),
	/** Whether this rule is active */
	enabled: boolean('enabled').default(true).notNull(),
	/** Pattern type: 'regex', 'contains', 'startsWith', 'endsWith' */
	patternType: text('pattern_type').notNull().default('contains'),
	/** The pattern string (regex pattern, substring, etc.) */
	pattern: text('pattern').notNull(),
	/** What to do: 'block', 'flag', 'replace' */
	action: text('action').notNull().default('block'),
	/** For 'replace' action: what to replace matches with (e.g. '***') */
	replacement: text('replacement'),
	/** Target: 'title', 'content', 'both' */
	target: text('target').notNull().default('both'),
	/** Message to show user when rule triggers */
	message: text('message'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});
