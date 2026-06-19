// server/trpc/routers/index.ts
import { router } from '../init';
import { analyticsRouter } from './analytics';
import { announcementRouter } from './announcement';
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
import { pagesRouter } from './pages';
import { searchRouter } from './search';
import { settingsRouter } from './settings';
import { tagRouter } from './tag';
import { themeRouter } from './theme';
import { threadRouter } from './thread';
import { userRouter } from './user';

export const appRouter = router({
	analytics: analyticsRouter,
	announcement: announcementRouter,
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
	theme: themeRouter,
	pages: pagesRouter
});

export type AppRouter = typeof appRouter;
