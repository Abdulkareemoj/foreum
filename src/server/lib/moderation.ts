import { eq } from 'drizzle-orm'
import { db } from '~/server/db'
import { moderationRule } from '~/server/db/schema/moderation-rule-schema'

export interface ModerationResult {
  /** Whether any rule blocked the content */
  blocked: boolean
  /** Whether any rule flagged the content (allowed but needs review) */
  flagged: boolean
  /** The cleaned/replaced content (if any 'replace' rules matched) */
  cleanedContent: string
  /** The first blocking rule's message */
  message: string | null
  /** All matched rule names */
  matchedRules: string[]
}

let cachedRules: any[] | null = null
let cacheTime = 0
const CACHE_TTL = 30_000 // 30 seconds

async function getActiveRules() {
  const now = Date.now()
  if (cachedRules && now - cacheTime < CACHE_TTL) {
    return cachedRules
  }

  try {
    cachedRules = await db
      .select()
      .from(moderationRule)
      .where(eq(moderationRule.enabled, true))
    cacheTime = now
    return cachedRules
  } catch {
    return cachedRules ?? []
  }
}

export function invalidateModerationCache(): void {
  cachedRules = null
  cacheTime = 0
}

function matchesPattern(text: string, pattern: string, type: string): boolean {
  switch (type) {
    case 'regex':
      try {
        return new RegExp(pattern, 'i').test(text)
      } catch {
        return false
      }
    case 'contains':
      return text.toLowerCase().includes(pattern.toLowerCase())
    case 'startsWith':
      return text.toLowerCase().startsWith(pattern.toLowerCase())
    case 'endsWith':
      return text.toLowerCase().endsWith(pattern.toLowerCase())
    default:
      return text.toLowerCase().includes(pattern.toLowerCase())
  }
}

function replaceMatches(text: string, pattern: string, type: string, replacement: string): string {
  switch (type) {
    case 'regex':
      try {
        return text.replace(new RegExp(pattern, 'gi'), replacement)
      } catch {
        return text
      }
    case 'contains': {
      const lower = text.toLowerCase()
      const patLower = pattern.toLowerCase()
      const idx = lower.indexOf(patLower)
      if (idx === -1) return text
      return text.substring(0, idx) + replacement + text.substring(idx + pattern.length)
    }
    default:
      return text
  }
}

/**
 * Check content against all active moderation rules.
 * Returns whether the content is allowed, flagged, or blocked.
 */
export async function checkModeration(
  content: string,
  title?: string,
  target: 'title' | 'content' | 'both' = 'both'
): Promise<ModerationResult> {
  const rules = await getActiveRules()
  const matchedRules: string[] = []
  let blocked = false
  let flagged = false
  let message: string | null = null
  let cleanedTitle = title ?? ''
  let cleanedContent = content

  for (const rule of rules) {
    // Check if this rule applies to the target
    if (rule.target !== 'both' && rule.target !== target) continue

    const patternType = rule.patternType ?? 'contains'
    const action = rule.action ?? 'block'
    const replacement = rule.replacement ?? '***'

    // Check title if applicable
    if (title && (rule.target === 'title' || rule.target === 'both')) {
      if (matchesPattern(title, rule.pattern, patternType)) {
        matchedRules.push(rule.name)

        if (action === 'block') {
          blocked = true
          message = rule.message ?? `Content blocked by rule: ${rule.name}`
          break // No need to check further
        } else if (action === 'flag') {
          flagged = true
        } else if (action === 'replace') {
          cleanedTitle = replaceMatches(cleanedTitle, rule.pattern, patternType, replacement)
        }
      }
    }

    // Check content if applicable
    if (rule.target === 'content' || rule.target === 'both') {
      if (matchesPattern(content, rule.pattern, patternType)) {
        matchedRules.push(rule.name)

        if (action === 'block') {
          blocked = true
          message = rule.message ?? `Content blocked by rule: ${rule.name}`
          break
        } else if (action === 'flag') {
          flagged = true
        } else if (action === 'replace') {
          cleanedContent = replaceMatches(cleanedContent, rule.pattern, patternType, replacement)
        }
      }
    }
  }

  return {
    blocked,
    flagged,
    cleanedContent,
    cleanedTitle,
    message,
    matchedRules,
  } as ModerationResult & { cleanedTitle: string }
}
