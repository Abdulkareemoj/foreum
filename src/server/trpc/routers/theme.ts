import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '~/server/db';
import { globalSetting } from '~/server/db/schema/settings-schema';
import { adminProcedure, publicProcedure, router } from '~/server/trpc/init';

export const themeConfigSchema = z.object({
	// Light mode colors
	light: z.object({
		primary: z.string(),
		primaryForeground: z.string(),
		secondary: z.string(),
		secondaryForeground: z.string(),
		accent: z.string(),
		accentForeground: z.string(),
		destructive: z.string(),
		background: z.string(),
		foreground: z.string(),
		card: z.string(),
		cardForeground: z.string(),
		border: z.string(),
		muted: z.string(),
		mutedForeground: z.string(),
		ring: z.string()
	}),
	// Dark mode colors
	dark: z.object({
		primary: z.string(),
		primaryForeground: z.string(),
		secondary: z.string(),
		secondaryForeground: z.string(),
		accent: z.string(),
		accentForeground: z.string(),
		destructive: z.string(),
		background: z.string(),
		foreground: z.string(),
		card: z.string(),
		cardForeground: z.string(),
		border: z.string(),
		muted: z.string(),
		mutedForeground: z.string(),
		ring: z.string()
	}),
	// Radius
	radius: z.string()
});

export type ThemeConfig = z.infer<typeof themeConfigSchema>;

const defaultTheme: ThemeConfig = {
	light: {
		primary: 'oklch(0.498 0.155 162.48)',
		primaryForeground: 'oklch(0.985 0 0)',
		secondary: 'oklch(0.97 0 0)',
		secondaryForeground: 'oklch(0.205 0 0)',
		accent: 'oklch(0.95 0.05 162.48)',
		accentForeground: 'oklch(0.205 0 0)',
		destructive: 'oklch(0.577 0.245 27.325)',
		background: 'oklch(1 0 0)',
		foreground: 'oklch(0.145 0 0)',
		card: 'oklch(1 0 0)',
		cardForeground: 'oklch(0.145 0 0)',
		border: 'oklch(0.922 0 0)',
		muted: 'oklch(0.97 0 0)',
		mutedForeground: 'oklch(0.556 0 0)',
		ring: 'oklch(0.498 0.155 162.48)'
	},
	dark: {
		primary: 'oklch(0.696 0.17 162.48)',
		primaryForeground: 'oklch(0.145 0 0)',
		secondary: 'oklch(0.269 0 0)',
		secondaryForeground: 'oklch(0.985 0 0)',
		accent: 'oklch(0.35 0.1 162.48)',
		accentForeground: 'oklch(0.985 0 0)',
		destructive: 'oklch(0.704 0.191 22.216)',
		background: 'oklch(0.145 0 0)',
		foreground: 'oklch(0.985 0 0)',
		card: 'oklch(0.205 0 0)',
		cardForeground: 'oklch(0.985 0 0)',
		border: 'oklch(1 0 0 / 10%)',
		muted: 'oklch(0.269 0 0)',
		mutedForeground: 'oklch(0.708 0 0)',
		ring: 'oklch(0.696 0.17 162.48)'
	},
	radius: '0.625rem'
};

export const themeRouter = router({
	// Get global theme (public)
	getGlobal: publicProcedure.query(async () => {
		try {
			const [setting] = await db
				.select()
				.from(globalSetting)
				.where(eq(globalSetting.key, 'theme_config'));

			if (!setting) {
				return defaultTheme;
			}

			return JSON.parse(setting.value) as ThemeConfig;
		} catch (error) {
			console.error('[v0] Failed to get theme:', error);
			return defaultTheme;
		}
	}),

	// Save global theme (admin only)
	saveGlobal: adminProcedure.input(themeConfigSchema).mutation(async ({ input }) => {
		if (!input) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'Theme configuration is required'
			});
		}

		try {
			const themeJson = JSON.stringify(input);

			await db
				.insert(globalSetting)
				.values({ key: 'theme_config', value: themeJson })
				.onConflictDoUpdate({
					target: globalSetting.key,
					set: { value: themeJson }
				});

			return { success: true, theme: input };
		} catch (error) {
			console.error('[v0] Failed to save theme:', error);
			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'Failed to save theme configuration'
			});
		}
	}),

	// Reset to default theme (admin only)
	resetGlobal: adminProcedure.mutation(async () => {
		try {
			await db
				.insert(globalSetting)
				.values({ key: 'theme_config', value: JSON.stringify(defaultTheme) })
				.onConflictDoUpdate({
					target: globalSetting.key,
					set: { value: JSON.stringify(defaultTheme) }
				});

			return { success: true, theme: defaultTheme };
		} catch (error) {
			console.error('[v0] Failed to reset theme:', error);
			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'Failed to reset theme configuration'
			});
		}
	})
});
