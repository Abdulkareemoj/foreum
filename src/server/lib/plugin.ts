/**
 * Plugin System for Foreum
 *
 * Provides:
 * - Plugin manifest schema (Zod validation)
 * - Event hook registry
 * - Plugin API for DB, auth, notifications
 * - Plugin loader (reads from DB, registers hooks)
 *  We epect great things here, similar to Discourse's plugin system, and flarum
 */

import { z } from 'zod'
import { db } from '~/server/db'
import { plugin as pluginTable } from '~/server/db/schema/plugin-schema'
import { notification } from '~/server/db/schema/notification-schema'
import { moderationLog } from '~/server/db/schema/moderation-schema'

// Plugin Manifest Schema

export const zPluginHook = z.enum([
	'thread:beforeCreate',
	'thread:afterCreate',
	'reply:beforeCreate',
	'reply:afterCreate',
	'user:beforeCreate',
	'user:afterCreate',
	'reaction:afterToggle',
	'notification:afterCreate',
	'report:afterCreate',
	'page:beforeRender',
])

export const zPluginManifest = z.object({
	name: z.string().min(1).max(50),
	version: z.string().default('1.0.0'),
	description: z.string().max(500).optional(),
	author: z.string().max(100).optional(),
	hooks: z.array(zPluginHook).default([]),
	permissions: z.array(z.string()).default([]),
	config: z.record(z.string(), z.unknown()).default({}),
})

export type PluginManifest = z.infer<typeof zPluginManifest>
export type PluginHookName = z.infer<typeof zPluginHook>

// Hook Callback Type

export type HookPayload = Record<string, unknown>

export interface HookContext {
	/** The plugin that registered this hook */
	pluginId: string
	/** Authenticated user (if available) */
	user?: { id: string; role: string; name?: string }
	/** Database access */
	db: typeof db
}

export type HookCallback = (
	payload: HookPayload,
	ctx: HookContext
) => Promise<HookPayload | void> | HookPayload | void

// Plugin Registry (In-Memory)

interface RegisteredPlugin {
	id: string
	manifest: PluginManifest
	hooks: Map<PluginHookName, HookCallback[]>
	enabled: boolean
}

const registry = new Map<string, RegisteredPlugin>()
const globalHooks = new Map<PluginHookName, Set<string>>() // hook → pluginIds

/**
 * Register a plugin's hooks into the registry.
 */
export function registerPlugin(
	id: string,
	manifest: PluginManifest,
	hookHandlers: Partial<Record<PluginHookName, HookCallback>>
): void {
	const hooks = new Map<PluginHookName, HookCallback[]>()

	for (const hookName of manifest.hooks) {
		const handler = hookHandlers[hookName]
		if (handler) {
			hooks.set(hookName, [handler])
			if (!globalHooks.has(hookName)) {
				globalHooks.set(hookName, new Set())
			}
			globalHooks.get(hookName)!.add(id)
		}
	}

	registry.set(id, {
		id,
		manifest,
		hooks,
		enabled: true,
	})
}

/**
 * Unregister a plugin from the registry.
 */
export function unregisterPlugin(id: string): void {
	const plugin = registry.get(id)
	if (!plugin) return

	for (const [hookName] of plugin.hooks) {
		globalHooks.get(hookName)?.delete(id)
	}

	registry.delete(id)
}

/**
 * Enable or disable a plugin.
 */
export function setPluginEnabled(id: string, enabled: boolean): void {
	const plugin = registry.get(id)
	if (plugin) {
		plugin.enabled = enabled
	}
}

/**
 * Execute all registered hooks for a given hook name.
 * Runs hooks sequentially; each hook can modify the payload.
 */
export async function runHooks(
	hookName: PluginHookName,
	payload: HookPayload,
	ctx: Omit<HookContext, 'pluginId'>
): Promise<HookPayload> {
	const pluginIds = globalHooks.get(hookName)
	if (!pluginIds || pluginIds.size === 0) return payload

	let currentPayload = { ...payload }

	for (const pluginId of pluginIds) {
		const registered = registry.get(pluginId)
		if (!registered || !registered.enabled) continue

		const hookCallbacks = registered.hooks.get(hookName)
		if (!hookCallbacks) continue

		for (const callback of hookCallbacks) {
			try {
				const result = await callback(currentPayload, {
					...ctx,
					pluginId,
				})
				if (result && typeof result === 'object') {
					currentPayload = { ...currentPayload, ...result }
				}
			} catch (error) {
				console.error(`[plugin:${pluginId}] Hook ${hookName} failed:`, error)
				// Don't let plugin errors break the app
			}
		}
	}

	return currentPayload
}

/**
 * Get all registered plugins (for admin listing).
 */
export function getRegisteredPlugins(): Array<{
	id: string
	manifest: PluginManifest
	enabled: boolean
}> {
	return Array.from(registry.values()).map((p) => ({
		id: p.id,
		manifest: p.manifest,
		enabled: p.enabled,
	}))
}

/**
 * Get a single registered plugin.
 */
export function getRegisteredPlugin(id: string): RegisteredPlugin | undefined {
	return registry.get(id)
}

/**
 * Load all enabled plugins from the DB and register them.
 * Call this on server startup.
 */
export async function loadPluginsFromDB(): Promise<void> {
	try {
		const plugins = await db.select().from(pluginTable)
		for (const p of plugins) {
			if (!p.enabled) continue
			const manifest: PluginManifest = {
				name: p.name,
				version: p.version,
				description: p.description ?? undefined,
				author: p.author ?? undefined,
				hooks: ((p.hooks as string[]) || []) as PluginHookName[],
				permissions: (p.permissions as string[]) || [],
				config: (p.config as Record<string, unknown>) || {},
			}
			// Plugins are registered with their hooks from the manifest.
			// Actual handler code would be loaded from a plugin directory or CDN.
			// For now, we just register the metadata.
			registerPlugin(p.id, manifest, {})
		}
		console.log(`[plugin] Loaded ${plugins.length} plugins from DB`)
	} catch (error) {
		console.error('[plugin] Failed to load plugins from DB:', error)
	}
}

/**
 * Plugin API, available to plugin hooks for safe access to app features.
 */
export const pluginAPI = {
	/**
	 * Access the database directly (use with caution).
	 */
	get db() {
		return db
	},

	/**
	 * Create a notification for a user.
	 */
	async notify(userId: string, data: { type: string; title: string; message: string; link: string }) {
		await db.insert(notification).values({
			id: crypto.randomUUID(),
			userId,
			...data,
		})
	},

	/**
	 * Log a moderation action.
	 */
	async logModeration(data: { action: string; targetUserId: string; performedById: string; details?: string }) {
		await db.insert(moderationLog).values({
			id: crypto.randomUUID(),
			...data,
		})
	},

	/**
	 * Get plugin-specific config values.
	 */
	getConfig(pluginId: string): Record<string, unknown> {
		const p = registry.get(pluginId)
		return (p?.manifest.config as Record<string, unknown>) ?? {}
	},
}
