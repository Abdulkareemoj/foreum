import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';
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
	read: boolean('read').default('false').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});
