import { pgTable, primaryKey,text, timestamp } from 'drizzle-orm/pg-core';

import { user } from './auth-schema';

export const bookmark = pgTable(
	'bookmark',
	{
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		threadId: text('thread_id').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [primaryKey({ columns: [table.userId, table.threadId] })]
);
