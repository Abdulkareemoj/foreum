import { pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core';

import { user } from './auth-schema';
import { thread } from './thread-schema';

/**
 * Thread subscriptions, users follow threads to receive notifications on new replies.
 */
export const threadSubscription = pgTable(
	'thread_subscription',
	{
		id: text('id').primaryKey(),
		threadId: text('thread_id')
			.notNull()
			.references(() => thread.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at').defaultNow(),
	},
	(t) => [unique('unique_subscription').on(t.threadId, t.userId)]
);
