import { boolean, pgTable, text, timestamp, index } from 'drizzle-orm/pg-core';

import { user } from './auth-schema';

export const notification = pgTable('notification', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	type: text('type').notNull(), // e.g. 'reply', 'mention'
	title: text('title').notNull(),
	message: text('message').notNull(),
	link: text('link').notNull(), // where to go when clicked
	read: boolean('read').default(false).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
}, (t) => [
	index('idx_notification_user_id').on(t.userId),
	index('idx_notification_user_read').on(t.userId, t.read),
	index('idx_notification_created_at').on(t.createdAt),
]);
