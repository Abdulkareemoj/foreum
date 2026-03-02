// server/trpc/routers/index.ts
import { router } from '../init';
import { bookmarksRouter } from './bookmark';
import { categoryRouter } from './category';
import { eventsRouter } from './events';
import { groupsRouter } from './groups';
import { messagesRouter } from './messaging';
import { moderationRouter } from './moderation';
import { notificationsRouter } from './notification';
import { replyRouter } from './reply';
import { reputationRouter } from './reputation';
import { resourcesRouter } from './resources';
import { searchRouter } from './search';
import { settingsRouter } from './settings';
import { tagRouter } from './tag';
import { themeRouter } from './theme';
import { threadRouter } from './thread';
import { userRouter } from './user';

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
	reputation: reputationRouter,
	search: searchRouter,
	theme: themeRouter
});

export type AppRouter = typeof appRouter;
