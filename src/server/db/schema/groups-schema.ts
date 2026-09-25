import { pgTable, primaryKey, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

import { user } from './auth-schema';

export const groups = pgTable('groups', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 100 }).notNull(),
	slug: varchar('slug', { length: 100 }).notNull().unique(),
	description: text('description'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	createdBy: text('created_by').notNull().references(() => user.id, { onDelete: 'cascade' }),
	bannerImage: text('banner_image'),
	avatarImage: text('avatar_image')
});

export const groupMembers = pgTable(
	'group_members',
	{
		groupId: uuid('group_id').notNull().references(() => groups.id, { onDelete: 'cascade' }),
		userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
		role: varchar('role', { length: 20 }).default('member').notNull(), // owner, moderator, member
		joinedAt: timestamp('joined_at').defaultNow()
	},
	(t) => ({
		pk: primaryKey({ columns: [t.groupId, t.userId] })
	})
);

export const groupForums = pgTable('group_forums', {
	id: uuid('id').primaryKey().defaultRandom(),
	groupId: uuid('group_id').notNull().references(() => groups.id, { onDelete: 'cascade' }),
	name: varchar('name', { length: 100 }).notNull(),
	slug: varchar('slug', { length: 100 }).notNull()
});
