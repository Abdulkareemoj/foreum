import { pgTable, text, timestamp, varchar, uuid, primaryKey } from 'drizzle-orm/pg-core';

export const reputation = pgTable('reputation', {
	userId: uuid('user_id').primaryKey(),
	points: varchar('points').default('0'),
	lastUpdated: timestamp('last_updated').defaultNow()
});

export const badges = pgTable('badges', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 100 }).notNull(),
	description: text('description'),
	icon: varchar('icon', { length: 200 })
});

export const userBadges = pgTable(
	'user_badges',
	{
		userId: uuid('user_id').notNull(),
		badgeId: uuid('badge_id').notNull(),
		awardedAt: timestamp('awarded_at').defaultNow()
	},
	(t) => ({
		pk: primaryKey({ columns: [t.userId, t.badgeId] })
	})
);
