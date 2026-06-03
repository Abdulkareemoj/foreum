import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'

import { db } from '~/server/db'
import { globalSetting } from '~/server/db/schema/settings-schema'
import { adminProcedure, publicProcedure, router } from '~/server/trpc/init'
import { getDefaultShadcnTheme, parseShadcnThemeFromJson, zShadcnTheme } from '~/lib/shadcnTheme'

const THEME_KEY = 'theme_config_v2'

export const themeRouter = router({
	// Get global theme (public – needed to apply theme to all visitors)
	getGlobal: publicProcedure.query(async () => {
		try {
			const [setting] = await db
				.select()
				.from(globalSetting)
				.where(eq(globalSetting.key, THEME_KEY))

			if (!setting) return getDefaultShadcnTheme()

			return parseShadcnThemeFromJson(JSON.parse(setting.value))
		} catch (error) {
			console.error('[theme.getGlobal] Failed:', error)
			return getDefaultShadcnTheme()
		}
	}),

	// Save global theme (admin only)
	saveGlobal: adminProcedure.input(zShadcnTheme).mutation(async ({ input }) => {
		try {
			const value = JSON.stringify(input)
			await db
				.insert(globalSetting)
				.values({ key: THEME_KEY, value })
				.onConflictDoUpdate({ target: globalSetting.key, set: { value } })

			return { success: true }
		} catch (error) {
			console.error('[theme.saveGlobal] Failed:', error)
			throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to save theme' })
		}
	}),

	// Reset to default (admin only)
	resetGlobal: adminProcedure.mutation(async () => {
		try {
			const value = JSON.stringify(getDefaultShadcnTheme())
			await db
				.insert(globalSetting)
				.values({ key: THEME_KEY, value })
				.onConflictDoUpdate({ target: globalSetting.key, set: { value } })

			return { success: true }
		} catch (error) {
			console.error('[theme.resetGlobal] Failed:', error)
			throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to reset theme' })
		}
	})
})
