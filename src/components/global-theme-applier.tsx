import * as React from 'react'
import { trpc } from '~/lib/trpc'
import { applyShadcnThemeToDom } from '~/lib/shadcnTheme'

/**
 * Fetches the globally saved forum theme and applies it as CSS custom properties
 * to document.documentElement, so every page picks up the custom colours.
 * Runs once on mount; re-runs whenever the cached TRPC data refreshes.
 */
export function GlobalThemeApplier() {
  const { data: theme } = trpc.theme.getGlobal.useQuery(undefined, {
    // Only fetch once per session – theme changes are admin-only
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false
  })

  React.useEffect(() => {
    if (!theme) return
    const el = document.documentElement
    // Detect user's colour scheme preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const mode = el.classList.contains('dark') || prefersDark ? 'dark' : 'light'
    applyShadcnThemeToDom(theme, el, mode)
  }, [theme])

  return null
}
