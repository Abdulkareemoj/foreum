import { createAccessControl } from 'better-auth/plugins/access';
import { adminAc, defaultStatements, userAc } from 'better-auth/plugins/admin/access';

const statement = {
	...defaultStatements,
	thread: ['create', 'update', 'delete', 'moderate'],
	report: ['view', 'resolve'],
	category: ['create', 'update', 'delete']
} as const;

const accessControl = createAccessControl(statement);

export const moderatorRole = accessControl.newRole({
	thread: ['moderate', 'delete'],
	report: ['view', 'resolve'],
	user: ['ban'], // Can ban but not delete users
	session: ['list', 'revoke']
});

export const adminRole = accessControl.newRole({
	...adminAc.statements,
	thread: ['create', 'update', 'delete', 'moderate'],
	report: ['view', 'resolve'],
	category: ['create', 'update', 'delete'],
	user: ['create', 'list', 'set-role', 'ban', 'delete'], // Full control
	session: ['list', 'revoke', 'delete']
});

export { accessControl, userAc };
