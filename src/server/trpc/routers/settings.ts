import { z } from 'zod';
import { router, protectedProcedure } from '$server/trpc/init';
import { db } from '$server/db';
import {
	notificationSetting,
	privacySetting,
	themeSetting
} from '$server/db/schema/settings-schema';
import { eq } from 'drizzle-orm';

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
		})
});
