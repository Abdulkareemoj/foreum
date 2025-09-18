// server/trpc/routers/index.ts
import { router } from '../init';
import { threadRouter } from './thread';
import { replyRouter } from './reply';
import { userRouter } from './user';
import { tagRouter } from './tag';
import { categoryRouter } from './category';
import { moderationRouter } from './moderation';
import { settingsRouter } from './settings';
import { bookmarksRouter } from './bookmark';
import { notificationsRouter } from './notification';
import { eventsRouter } from './events';
import { groupsRouter } from './groups';
import { messagesRouter } from './messaging';
import { resourcesRouter } from './resources';
import { reputationRouter } from './reputation';

export const appRouter = router({
	thread: threadRouter,
	reply: replyRouter,
	user: userRouter,
	tag: tagRouter,
	category: categoryRouter,
	moderation: moderationRouter,
	settings: settingsRouter,
	bookmarks: bookmarksRouter,
	notifications: notificationsRouter,
	events: eventsRouter,
	resources: resourcesRouter,
	messaging: messagesRouter,
	groups: groupsRouter,
	reputation: reputationRouter
});

export type AppRouter = typeof appRouter;
