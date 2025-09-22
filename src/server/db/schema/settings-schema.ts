import { boolean, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';

import { user } from './auth-schema';

// --------------------
// Global Settings
// --------------------
export const setting = pgTable('setting', {
	key: text('key').primaryKey(),
	value: text('value').notNull(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const globalSetting = pgTable('global_setting', {
	key: text('key').primaryKey(),
	value: text('value').notNull(),
	updatedAt: timestamp('updated_at').defaultNow()
});

// --------------------
// User Key-Value Settings (generic)
// --------------------
export const userSetting = pgTable(
	'user_setting',
	{
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		settingKey: text('setting_key').notNull(),
		value: text('value').notNull(),
		updatedAt: timestamp('updated_at').defaultNow()
	},
	(table) => [primaryKey({ columns: [table.userId, table.settingKey] })]
);

// --------------------
// Specific Modules (Typed for performance & validation)
// --------------------

// Notification Preferences
export const notificationSetting = pgTable(
	'notification_setting',
	{
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		type: text('type').notNull(), // 'email', 'push', 'mention', etc.
		enabled: boolean('enabled').default(true),
		updatedAt: timestamp('updated_at').defaultNow()
	},
	(table) => [primaryKey({ columns: [table.userId, table.type] })]
);

// Privacy Settings
export const privacySetting = pgTable(
	'privacy_setting',
	{
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		visibility: text('visibility').notNull().default('public'), // 'public' | 'private'
		dataSharing: boolean('data_sharing').default(true),
		updatedAt: timestamp('updated_at').defaultNow()
	},
	(table) => [primaryKey({ columns: [table.userId] })]
);

// Theme Settings
export const themeSetting = pgTable(
	'theme_setting',
	{
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		theme: text('theme').notNull().default('system'), // 'light' | 'dark' | 'system'
		customCss: text('custom_css'),
		updatedAt: timestamp('updated_at').defaultNow()
	},
	(table) => [primaryKey({ columns: [table.userId] })]
);
