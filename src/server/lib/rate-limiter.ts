interface RateLimitTier {
  windowMs: number
  maxRequests: number
}

interface RateLimiterOptions {
  tiers: Record<string, RateLimitTier>
  cleanupIntervalMs?: number
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetMs: number
}

class RateLimiter {
  private windows = new Map<string, number[]>()
  private tiers: Record<string, RateLimitTier>
  private cleanupTimer: ReturnType<typeof setInterval>

  constructor(options: RateLimiterOptions) {
    this.tiers = options.tiers
    this.cleanupTimer = setInterval(
      () => this.cleanup(),
      options.cleanupIntervalMs ?? 60_000,
    )
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, timestamps] of this.windows.entries()) {
      const tier = this.getTier(key)
      const cutoff = now - tier.windowMs
      const active = timestamps.filter((t) => t > cutoff)
      if (active.length === 0) {
        this.windows.delete(key)
      } else {
        this.windows.set(key, active)
      }
    }
  }

  private getTier(key: string): RateLimitTier {
    const prefix = key.split(":")[0]
    return this.tiers[prefix] ?? { windowMs: 60_000, maxRequests: 30 }
  }

  private keyFor(tier: string, identifier: string): string {
    return `${tier}:${identifier}`
  }

  check(tier: string, identifier: string): RateLimitResult {
    const key = this.keyFor(tier, identifier)
    const now = Date.now()
    const tierConfig = this.tiers[tier] ?? { windowMs: 60_000, maxRequests: 30 }
    const cutoff = now - tierConfig.windowMs

    let timestamps = this.windows.get(key) ?? []
    timestamps = timestamps.filter((t) => t > cutoff)
    timestamps.push(now)
    this.windows.set(key, timestamps)

    return {
      allowed: timestamps.length <= tierConfig.maxRequests,
      remaining: Math.max(0, tierConfig.maxRequests - timestamps.length),
      resetMs: cutoff + tierConfig.windowMs - now,
    }
  }

  destroy() {
    clearInterval(this.cleanupTimer)
    this.windows.clear()
  }
}

export const rateLimiter = new RateLimiter({
  tiers: {
    public: { windowMs: 60_000, maxRequests: 30 },
    protected: { windowMs: 60_000, maxRequests: 60 },
    admin: { windowMs: 60_000, maxRequests: 120 },
    auth: { windowMs: 60_000, maxRequests: 10 },
  },
})

function getHeader(headers: unknown, name: string): string | null {
  if (!headers) return null
  if (headers instanceof Headers) {
    return headers.get(name)
  }
  const h = headers as Record<string, string | string[] | undefined>
  const val = h[name]
  if (!val) return null
  return Array.isArray(val) ? val[0] : val
}

export function getIdentifier(ctx: {
  req?: { headers: unknown }
  user?: { id: string } | null
}): string {
  if (ctx.user?.id) {
    return ctx.user.id
  }
  const forwarded = getHeader(ctx.req?.headers, "x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  const ip = getHeader(ctx.req?.headers, "x-real-ip")
  if (ip) return ip
  return "anonymous"
}
