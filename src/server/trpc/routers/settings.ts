import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '~/server/db';
import {
	globalSetting,
	notificationSetting,
	privacySetting,
	themeSetting
} from '~/server/db/schema/settings-schema';
import { adminProcedure, protectedProcedure, publicProcedure, router } from '~/server/trpc/init';

export const settingsRouter = router({
	getAll: protectedProcedure.query(async ({ ctx }) => {
		const userId = ctx.user.id;

		const [privacy] = await db
			.select()
			.from(privacySetting)
			.where(eq(privacySetting.userId, userId));
		const [theme] = await db.select().from(themeSetting).where(eq(themeSetting.userId, userId));
		const notifications = await db
			.select()
			.from(notificationSetting)
			.where(eq(notificationSetting.userId, userId));

		return {
			privacy: privacy || { visibility: 'public', dataSharing: true },
			theme: theme || { theme: 'system', customCss: null },
			notifications
		};
	}),

	updatePrivacy: protectedProcedure
		.input(z.object({ visibility: z.enum(['public', 'private']), dataSharing: z.boolean() }))
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.user.id;
			await db
				.insert(privacySetting)
				.values({ userId, ...input })
				.onConflictDoUpdate({
					target: privacySetting.userId,
					set: { visibility: input.visibility, dataSharing: input.dataSharing }
				});
			return { success: true };
		}),

	updateTheme: protectedProcedure
		.input(
			z.object({ theme: z.enum(['light', 'dark', 'system']), customCss: z.string().nullable() })
		)
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.user.id;
			await db
				.insert(themeSetting)
				.values({ userId, ...input })
				.onConflictDoUpdate({
					target: themeSetting.userId,
					set: { theme: input.theme, customCss: input.customCss }
				});
			return { success: true };
		}),

	updateNotification: protectedProcedure
		.input(z.object({ type: z.string(), enabled: z.boolean() }))
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.user.id;
			await db
				.insert(notificationSetting)
				.values({ userId, ...input })
				.onConflictDoUpdate({
					target: [notificationSetting.userId, notificationSetting.type],
					set: { enabled: input.enabled }
				});
			return { success: true };
		}),

	getAllGlobal: adminProcedure.query(async () => {
		const rows = await db.select().from(globalSetting);
		const settings: Record<string, string> = {};
		for (const row of rows) {
			settings[row.key] = row.value;
		}
		return settings;
	}),

	updateGlobal: adminProcedure
		.input(z.object({ key: z.string(), value: z.string() }))
		.mutation(async ({ input }) => {
			await db
				.insert(globalSetting)
				.values({ key: input.key, value: input.value })
				.onConflictDoUpdate({
					target: globalSetting.key,
					set: { value: input.value, updatedAt: new Date() }
				});
			return { success: true };
		}),

	getPublicSettings: publicProcedure.query(async () => {
		const rows = await db.select().from(globalSetting);
		const settings: Record<string, string> = {};
		for (const row of rows) {
			settings[row.key] = row.value;
		}
		return {
			forumName: settings.forum_name ?? 'Foreum',
			forumDescription: settings.forum_description ?? '',
			forumLogo: settings.forum_logo ?? '',
			forumBanner: settings.forum_banner ?? '',
			faviconUrl: settings.favicon_url ?? '',
			footerText: settings.footer_text ?? '',
			footerCopyright: settings.footer_copyright ?? '',
			homepageLayout: settings.homepage_layout ?? 'latest',
			customCss: settings.custom_css ?? '',
			defaultAvatar: settings.default_avatar ?? '',
			socialLinks: settings.social_links ?? '[]',
			metaTitleSuffix: settings.meta_title_suffix ?? '',
			ogImage: settings.og_image ?? '',
			navItems: settings.nav_items ?? '[]',
		};
	}),

	updateMultiple: adminProcedure
		.input(z.object({ settings: z.record(z.string(), z.string()) }))
		.mutation(async ({ input }) => {
			const now = new Date();
			for (const [key, value] of Object.entries(input.settings)) {
				await db
					.insert(globalSetting)
					.values({ key, value })
					.onConflictDoUpdate({
						target: globalSetting.key,
						set: { value, updatedAt: now },
					});
			}
			return { success: true };
		}),
});
