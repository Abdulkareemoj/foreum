import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';
import * as authSchema from './schema/auth-schema';
import * as forumSchema from './schema/thread-schema';
import * as moderationSchema from './schema/moderation-schema';
import * as reactionSchema from './schema/reaction-schema';
import * as settingSchema from './schema/settings-schema';
import * as tagSchema from './schema/tag-schema';
import * as profileSchema from './schema/profile-schema';
import * as bookmarkSchema from './schema/bookmark-schema';
import * as notificationSchema from './schema/notification-schema';
import * as reputationSchema from './schema/reputations-schema';
import * as eventsSchema from './schema/events-schema';
import * as groupsSchema from './schema/groups-schema';
import * as messagingSchema from './schema/messaging-schema';
import * as resourcesSchema from './schema/resources-schema';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
export const schema = {
	...authSchema,
	...forumSchema,
	...moderationSchema,
	...reactionSchema,
	...settingSchema,
	...tagSchema,
	...notificationSchema,
	...profileSchema,
	...bookmarkSchema,
	...reputationSchema,
	...eventsSchema,
	...groupsSchema,
	...messagingSchema,
	...resourcesSchema
};
const client = postgres(env.DATABASE_URL);

export const db = drizzle(client, { schema });
