/**
 * Trust Level System
 *
 * Progressive participation privileges based on account age and post count.
 * Trust levels grant content creation abilities, NOT moderation powers.
 * Moderation remains with admin/moderator roles via RBAC.
 *
 * Config is stored in the `trust_level_config` table and managed via admin panel.
 * Hardcoded defaults are used as fallback when DB config is not yet seeded.
 */

export const TRUST_LEVEL_DEFAULTS: TrustLevelDefinition[] = [
  { level: 0, name: 'New User', minDays: 0, minPosts: 0, permissions: ['thread.create', 'reply.create'] },
  { level: 1, name: 'Basic', minDays: 14, minPosts: 5, permissions: ['thread.create', 'reply.create', 'link.post', 'file.upload'] },
  { level: 2, name: 'Member', minDays: 30, minPosts: 20, permissions: ['thread.create', 'reply.create', 'link.post', 'file.upload', 'poll.create', 'own_post.edit'] },
  { level: 3, name: 'Regular', minDays: 100, minPosts: 100, permissions: ['thread.create', 'reply.create', 'link.post', 'file.upload', 'poll.create', 'own_post.edit', 'own_post.delete', 'own_thread.pin'] },
  { level: 4, name: 'Leader', minDays: 200, minPosts: 500, permissions: ['thread.create', 'reply.create', 'link.post', 'file.upload', 'poll.create', 'own_post.edit', 'own_post.delete', 'own_thread.pin', 'extended_upload'] },
]

export type TrustLevel = 0 | 1 | 2 | 3 | 4

export interface TrustLevelDefinition {
  level: number
  name: string
  minDays: number
  minPosts: number
  permissions: string[]
}

/**
 * In-memory cache of trust level config from DB.
 * Refreshed on first access and can be invalidated by admin actions.
 */
let cachedConfig: TrustLevelDefinition[] | null = null

/**
 * Load trust level config from DB. Falls back to hardcoded defaults.
 * Call this from server-side only (needs db import).
 */
export async function loadTrustLevelConfig(): Promise<TrustLevelDefinition[]> {
  if (cachedConfig) return cachedConfig

  try {
    const { db } = await import('~/server/db')
    const { trustLevelConfig } = await import('~/server/db/schema/trust-level-schema')

    const rows = await db
      .select()
      .from(trustLevelConfig)
      .orderBy(trustLevelConfig.level)

    if (rows.length === 5) {
      cachedConfig = rows.map((r) => ({
        level: r.level,
        name: r.name,
        minDays: r.minDays,
        minPosts: r.minPosts,
        permissions: (r.permissions as string[]) ?? [],
      }))
      return cachedConfig
    }
  } catch {
    // DB not available, use defaults
  }

  return TRUST_LEVEL_DEFAULTS.map((d) => ({ ...d, permissions: [...d.permissions] }))
}

/**
 * Invalidate the cached config (call after admin updates).
 */
export function invalidateTrustLevelCache(): void {
  cachedConfig = null
}

/**
 * Get trust level definitions (sync, from cache or defaults).
 * Use loadTrustLevelConfig() for first load.
 */
export function getTrustLevelDefinitions(): TrustLevelDefinition[] {
  if (cachedConfig) return cachedConfig
  return TRUST_LEVEL_DEFAULTS.map((d) => ({ ...d, permissions: [...d.permissions] }))
}

/**
 * Calculate the trust level a user should have based on account age, post count, and config.
 */
export function calculateTrustLevel(
  createdAt: Date,
  postCount: number,
  config?: TrustLevelDefinition[]
): TrustLevel {
  const levels = config ?? getTrustLevelDefinitions()
  const now = new Date()
  const daysSinceCreation = Math.floor(
    (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
  )

  // Check from highest to lowest
  for (let i = levels.length - 1; i >= 0; i--) {
    const lvl = levels[i]
    if (daysSinceCreation >= lvl.minDays && postCount >= lvl.minPosts) {
      return lvl.level as TrustLevel
    }
  }

  return 0
}

/**
 * Check if a user's trust level grants a specific permission.
 */
export function hasTrustPermission(
  trustLevel: TrustLevel,
  permission: string,
  config?: TrustLevelDefinition[]
): boolean {
  const levels = config ?? getTrustLevelDefinitions()
  const lvl = levels.find((l) => l.level === trustLevel)
  const perms = lvl?.permissions ?? levels[0]?.permissions ?? []
  return perms.includes(permission)
}

/**
 * Get the name of a trust level.
 */
export function getTrustLevelName(level: TrustLevel, config?: TrustLevelDefinition[]): string {
  const levels = config ?? getTrustLevelDefinitions()
  return levels.find((l) => l.level === level)?.name ?? 'Unknown'
}

/**
 * Calculate the progress towards the next trust level.
 * Returns null if already at max level.
 */
export function getTrustLevelProgress(
  currentLevel: TrustLevel,
  createdAt: Date,
  postCount: number,
  config?: TrustLevelDefinition[]
): { nextLevel: TrustLevel; daysProgress: number; daysRequired: number; postsProgress: number; postsRequired: number } | null {
  const levels = config ?? getTrustLevelDefinitions()
  if (currentLevel >= 4) return null

  const nextLevel = (currentLevel + 1) as TrustLevel
  const nextConfig = levels.find((l) => l.level === nextLevel)
  if (!nextConfig) return null

  const now = new Date()
  const daysSinceCreation = Math.floor(
    (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
  )

  return {
    nextLevel,
    daysProgress: Math.min(daysSinceCreation, nextConfig.minDays),
    daysRequired: nextConfig.minDays,
    postsProgress: Math.min(postCount, nextConfig.minPosts),
    postsRequired: nextConfig.minPosts,
  }
}
