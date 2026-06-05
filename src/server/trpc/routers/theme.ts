import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { db } from '~/server/db'
import { globalSetting } from '~/server/db/schema/settings-schema'
import { themePreset } from '~/server/db/schema/theme-preset-schema'
import { adminProcedure, publicProcedure, router } from '~/server/trpc/init'
import { getDefaultShadcnTheme, parseShadcnThemeFromJson, zShadcnTheme } from '~/lib/shadcnTheme'

const THEME_KEY = 'theme_config_v2'

export const themeRouter = router({
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
	}),

	// --- Theme Presets ---

	listPresets: adminProcedure.query(async () => {
		try {
			const presets = await db
				.select({ id: themePreset.id, name: themePreset.name, updatedAt: themePreset.updatedAt })
				.from(themePreset)
				.orderBy(themePreset.updatedAt)

			return presets
		} catch (error) {
			console.error('[theme.listPresets] Failed:', error)
			throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to list presets' })
		}
	}),

	getPreset: adminProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
		try {
			const [preset] = await db
				.select()
				.from(themePreset)
				.where(eq(themePreset.id, input.id))

			if (!preset) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Preset not found' })
			}

			return {
				...preset,
				data: parseShadcnThemeFromJson(JSON.parse(preset.data))
			}
		} catch (error) {
			if (error instanceof TRPCError) throw error
			console.error('[theme.getPreset] Failed:', error)
			throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to get preset' })
		}
	}),

	createPreset: adminProcedure
		.input(z.object({ name: z.string().min(1), data: zShadcnTheme }))
		.mutation(async ({ input }) => {
			try {
				const [preset] = await db
					.insert(themePreset)
					.values({ name: input.name, data: JSON.stringify(input.data) })
					.returning({ id: themePreset.id, name: themePreset.name })

				return preset
			} catch (error) {
				console.error('[theme.createPreset] Failed:', error)
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create preset' })
			}
		}),

	updatePreset: adminProcedure
		.input(z.object({ id: z.string(), name: z.string().min(1).optional(), data: zShadcnTheme.optional() }))
		.mutation(async ({ input }) => {
			try {
				const updates: Record<string, unknown> = { updatedAt: new Date() }
				if (input.name) updates.name = input.name
				if (input.data) updates.data = JSON.stringify(input.data)

				const [preset] = await db
					.update(themePreset)
					.set(updates)
					.where(eq(themePreset.id, input.id))
					.returning({ id: themePreset.id, name: themePreset.name })

				if (!preset) {
					throw new TRPCError({ code: 'NOT_FOUND', message: 'Preset not found' })
				}

				return preset
			} catch (error) {
				if (error instanceof TRPCError) throw error
				console.error('[theme.updatePreset] Failed:', error)
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update preset' })
			}
		}),

	deletePreset: adminProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input }) => {
			try {
				const [preset] = await db
					.delete(themePreset)
					.where(eq(themePreset.id, input.id))
					.returning({ id: themePreset.id })

				if (!preset) {
					throw new TRPCError({ code: 'NOT_FOUND', message: 'Preset not found' })
				}

				return { success: true }
			} catch (error) {
				if (error instanceof TRPCError) throw error
				console.error('[theme.deletePreset] Failed:', error)
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete preset' })
			}
		}),

	applyPreset: adminProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input }) => {
			try {
				const [preset] = await db
					.select()
					.from(themePreset)
					.where(eq(themePreset.id, input.id))

				if (!preset) {
					throw new TRPCError({ code: 'NOT_FOUND', message: 'Preset not found' })
				}

				await db
					.insert(globalSetting)
					.values({ key: THEME_KEY, value: preset.data })
					.onConflictDoUpdate({ target: globalSetting.key, set: { value: preset.data } })

				return { success: true }
			} catch (error) {
				if (error instanceof TRPCError) throw error
				console.error('[theme.applyPreset] Failed:', error)
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to apply preset' })
			}
		})
})
