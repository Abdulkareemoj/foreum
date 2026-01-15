import { boolean, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';

import { user } from './auth-schema';
import { reply, thread } from './thread-schema';

export const report = pgTable('report', {
	id: text('id').primaryKey(),
	type: text('type').notNull(), // 'thread' or 'reply'
	reason: text('reason').notNull(),
	threadId: text('thread_id').references(() => thread.id),
	replyId: text('reply_id').references(() => reply.id),
	reportedById: text('reported_by_id')
		.notNull()
		.references(() => user.id),
	resolved: boolean('resolved').default(false),
	createdAt: timestamp('created_at').defaultNow()
});

export const auditLog = pgTable('audit_log', {
	id: text('id').primaryKey(),
	action: text('action').notNull(), // e.g. 'delete_thread'
	performedById: text('performed_by_id')
		.notNull()
		.references(() => user.id),
	targetUserId: text('target_user_id').references(() => user.id),
	targetThreadId: text('target_thread_id').references(() => thread.id),
	targetReplyId: text('target_reply_id').references(() => reply.id),
	reason: text('reason'),
	createdAt: timestamp('created_at').defaultNow()
});

export const moderationLog = pgTable('moderation_log', {
	id: text('id').primaryKey(),
	action: text('action').notNull(), // e.g. 'ban_user', 'unban_user'
	targetUserId: text('target_user_id')
		.notNull()
		.references(() => user.id),
	performedById: text('performed_by_id')
		.notNull()
		.references(() => user.id),
	details: text('details'), // Additional information about the action
	createdAt: timestamp('created_at').defaultNow()
});

export const userReport = pgTable(
	'user_report',
	{
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		reportId: text('report_id')
			.notNull()
			.references(() => report.id, { onDelete: 'cascade' })
	},
	(table) => [primaryKey({ columns: [table.userId, table.reportId] })]
);

export const userAuditLog = pgTable(
	'user_audit_log',
	{
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		auditLogId: text('audit_log_id')
			.notNull()
			.references(() => auditLog.id, { onDelete: 'cascade' })
	},
	(table) => [primaryKey({ columns: [table.userId, table.auditLogId] })]
);

export const userModerationLog = pgTable(
	'user_moderation_log',
	{
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		moderationLogId: text('moderation_log_id')
			.notNull()
			.references(() => moderationLog.id, { onDelete: 'cascade' })
	},
	(table) => [primaryKey({ columns: [table.userId, table.moderationLogId] })]
);
