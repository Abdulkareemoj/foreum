import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~/server/db'
import { plugin as pluginTable } from '~/server/db/schema/plugin-schema'
import { adminProcedure, router } from '~/server/trpc/init'
import {
	registerPlugin,
	unregisterPlugin,
	setPluginEnabled,
	getRegisteredPlugins,
	zPluginManifest,
} from '~/server/lib/plugin'

export const pluginRouter = router({
	/**
	 * List all registered plugins (admin only).
	 */
	list: adminProcedure.query(async () => {
		try {
			// Return from registry (in-memory, fast)
			const registered = getRegisteredPlugins()

			// Also get DB records for metadata
			const dbPlugins = await db.select().from(pluginTable)
			const dbMap = new Map(dbPlugins.map((p) => [p.id, p]))

			return registered.map((r) => ({
				id: r.id,
				name: r.manifest.name,
				version: r.manifest.version,
				description: r.manifest.description,
				author: r.manifest.author,
				enabled: r.enabled,
				hooks: r.manifest.hooks,
				permissions: r.manifest.permissions,
				config: r.manifest.config,
				createdAt: dbMap.get(r.id)?.createdAt,
				updatedAt: dbMap.get(r.id)?.updatedAt,
			}))
		} catch (error) {
			console.error('[plugin.list]', error)
			throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to list plugins' })
		}
	}),

	/**
	 * Register a new plugin (admin only).
	 * Adds to DB and registers hooks in memory.
	 */
	register: adminProcedure
		.input(zPluginManifest)
		.mutation(async ({ input }) => {
			try {
				const id = input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

				// Check if already registered
				const existing = await db
					.select({ id: pluginTable.id })
					.from(pluginTable)
					.where(eq(pluginTable.id, id))
					.then((r) => r[0])

				if (existing) {
					throw new TRPCError({ code: 'CONFLICT', message: 'Plugin already registered' })
				}

				// Insert into DB
				await db.insert(pluginTable).values({
					id,
					name: input.name,
					version: input.version,
					description: input.description,
					author: input.author,
					hooks: input.hooks,
					permissions: input.permissions,
					config: input.config,
				})

				// Register in memory
				registerPlugin(id, input, {})

				return { id, name: input.name }
			} catch (error) {
				if (error instanceof TRPCError) throw error
				console.error('[plugin.register]', error)
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to register plugin' })
			}
		}),

	/**
	 * Enable or disable a plugin (admin only).
	 */
	toggle: adminProcedure
		.input(z.object({ id: z.string(), enabled: z.boolean() }))
		.mutation(async ({ input }) => {
			try {
				await db
					.update(pluginTable)
					.set({ enabled: input.enabled, updatedAt: new Date() })
					.where(eq(pluginTable.id, input.id))

				setPluginEnabled(input.id, input.enabled)

				return { success: true }
			} catch (error) {
				console.error('[plugin.toggle]', error)
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to toggle plugin' })
			}
		}),

	/**
	 * Unregister/remove a plugin (admin only).
	 */
	unregister: adminProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input }) => {
			try {
				await db.delete(pluginTable).where(eq(pluginTable.id, input.id))
				unregisterPlugin(input.id)

				return { success: true }
			} catch (error) {
				console.error('[plugin.unregister]', error)
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to unregister plugin' })
			}
		}),

	/**
	 * Update plugin config (admin only).
	 */
	updateConfig: adminProcedure
		.input(z.object({ id: z.string(), config: z.record(z.string(), z.unknown()) }))
		.mutation(async ({ input }) => {
			try {
				await db
					.update(pluginTable)
					.set({ config: input.config, updatedAt: new Date() })
					.where(eq(pluginTable.id, input.id))

				return { success: true }
			} catch (error) {
				console.error('[plugin.updateConfig]', error)
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update plugin config' })
			}
		}),
})
