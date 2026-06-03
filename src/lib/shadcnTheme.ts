import { z } from 'zod'

export const zShadcnThemeVars = z
	.object({
		background: z.string(),
		foreground: z.string(),
		card: z.string(),
		'card-foreground': z.string(),
		popover: z.string(),
		'popover-foreground': z.string(),
		primary: z.string(),
		'primary-foreground': z.string(),
		secondary: z.string(),
		'secondary-foreground': z.string(),
		muted: z.string(),
		'muted-foreground': z.string(),
		accent: z.string(),
		'accent-foreground': z.string(),
		destructive: z.string(),
		border: z.string(),
		input: z.string(),
		ring: z.string(),
		'chart-1': z.string(),
		'chart-2': z.string(),
		'chart-3': z.string(),
		'chart-4': z.string(),
		'chart-5': z.string(),
		sidebar: z.string(),
		'sidebar-foreground': z.string(),
		'sidebar-primary': z.string(),
		'sidebar-primary-foreground': z.string(),
		'sidebar-accent': z.string(),
		'sidebar-accent-foreground': z.string(),
		'sidebar-border': z.string(),
		'sidebar-ring': z.string()
	})
	.strict()

export const zShadcnThemeShared = z
	.object({
		'font-sans': z.string(),
		'font-serif': z.string(),
		'font-mono': z.string(),
		radius: z.string()
	})
	.strict()

export const zShadcnTheme = z
	.object({
		theme: zShadcnThemeShared,
		light: zShadcnThemeVars.partial(),
		dark: zShadcnThemeVars.partial()
	})
	.strict()

export type ShadcnTheme = z.infer<typeof zShadcnTheme>
export type ShadcnThemeVars = z.infer<typeof zShadcnThemeVars>
export type ShadcnThemeShared = z.infer<typeof zShadcnThemeShared>
export type ColorKey = keyof ShadcnThemeVars

export const getDefaultShadcnTheme = (): ShadcnTheme => ({
	theme: {
		'font-sans':
			"ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
		'font-serif': 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
		'font-mono':
			'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
		radius: '0.625rem'
	},
	light: {
		background: 'oklch(1 0 0)',
		foreground: 'oklch(0.145 0 0)',
		card: 'oklch(1 0 0)',
		'card-foreground': 'oklch(0.145 0 0)',
		popover: 'oklch(1 0 0)',
		'popover-foreground': 'oklch(0.145 0 0)',
		primary: 'oklch(0.498 0.155 162.48)',
		'primary-foreground': 'oklch(0.985 0 0)',
		secondary: 'oklch(0.97 0 0)',
		'secondary-foreground': 'oklch(0.205 0 0)',
		muted: 'oklch(0.97 0 0)',
		'muted-foreground': 'oklch(0.556 0 0)',
		accent: 'oklch(0.97 0 0)',
		'accent-foreground': 'oklch(0.205 0 0)',
		destructive: 'oklch(0.577 0.245 27.325)',
		border: 'oklch(0.922 0 0)',
		input: 'oklch(0.922 0 0)',
		ring: 'oklch(0.498 0.155 162.48)',
		'chart-1': 'oklch(0.646 0.222 41.116)',
		'chart-2': 'oklch(0.6 0.118 184.704)',
		'chart-3': 'oklch(0.398 0.07 227.392)',
		'chart-4': 'oklch(0.828 0.189 84.429)',
		'chart-5': 'oklch(0.769 0.188 70.08)',
		sidebar: 'oklch(0.985 0 0)',
		'sidebar-foreground': 'oklch(0.145 0 0)',
		'sidebar-primary': 'oklch(0.498 0.155 162.48)',
		'sidebar-primary-foreground': 'oklch(0.985 0 0)',
		'sidebar-accent': 'oklch(0.97 0 0)',
		'sidebar-accent-foreground': 'oklch(0.205 0 0)',
		'sidebar-border': 'oklch(0.922 0 0)',
		'sidebar-ring': 'oklch(0.498 0.155 162.48)'
	},
	dark: {
		background: 'oklch(0.145 0 0)',
		foreground: 'oklch(0.985 0 0)',
		card: 'oklch(0.205 0 0)',
		'card-foreground': 'oklch(0.985 0 0)',
		popover: 'oklch(0.269 0 0)',
		'popover-foreground': 'oklch(0.985 0 0)',
		primary: 'oklch(0.696 0.17 162.48)',
		'primary-foreground': 'oklch(0.145 0 0)',
		secondary: 'oklch(0.269 0 0)',
		'secondary-foreground': 'oklch(0.985 0 0)',
		muted: 'oklch(0.269 0 0)',
		'muted-foreground': 'oklch(0.708 0 0)',
		accent: 'oklch(0.371 0 0)',
		'accent-foreground': 'oklch(0.985 0 0)',
		destructive: 'oklch(0.704 0.191 22.216)',
		border: 'oklch(1 0 0 / 10%)',
		input: 'oklch(1 0 0 / 15%)',
		ring: 'oklch(0.696 0.17 162.48)',
		'chart-1': 'oklch(0.488 0.243 264.376)',
		'chart-2': 'oklch(0.696 0.17 162.48)',
		'chart-3': 'oklch(0.769 0.188 70.08)',
		'chart-4': 'oklch(0.627 0.265 303.9)',
		'chart-5': 'oklch(0.645 0.246 16.439)',
		sidebar: 'oklch(0.205 0 0)',
		'sidebar-foreground': 'oklch(0.985 0 0)',
		'sidebar-primary': 'oklch(0.696 0.17 162.48)',
		'sidebar-primary-foreground': 'oklch(0.985 0 0)',
		'sidebar-accent': 'oklch(0.269 0 0)',
		'sidebar-accent-foreground': 'oklch(0.985 0 0)',
		'sidebar-border': 'oklch(1 0 0 / 10%)',
		'sidebar-ring': 'oklch(0.696 0.17 162.48)'
	}
})

/**
 * Applies a ShadcnTheme to CSS variables on a given DOM element.
 * Call with document.documentElement to apply globally.
 */
export function applyShadcnThemeToDom(theme: ShadcnTheme, el: HTMLElement, mode: 'light' | 'dark') {
	const vars = theme[mode]
	if (!vars) return
	for (const [key, value] of Object.entries(vars)) {
		if (typeof value === 'string' && value.trim()) {
			el.style.setProperty(`--${key}`, value)
		}
	}
	if (theme.theme.radius) {
		el.style.setProperty('--radius', theme.theme.radius)
	}
}

const overrideExistingObjectVars = (
	into: Record<string, unknown>,
	from: Record<string, unknown>
): Record<string, unknown> => {
	if (!from) return into
	const out = { ...into }
	for (const key in into) {
		if (key in from && typeof from[key] === typeof into[key]) {
			out[key] = from[key]
		}
	}
	return out
}

export const parseShadcnThemeFromJson = (json: unknown): ShadcnTheme => {
	const input: Record<string, unknown> =
		typeof json === 'string' ? JSON.parse(json) : (json as Record<string, unknown>)
	const out = getDefaultShadcnTheme()
	try {
		if (typeof input !== 'object' || input === null) return out
		if (typeof input.theme === 'object' && input.theme !== null) {
			out.theme = overrideExistingObjectVars(
				out.theme,
				input.theme as Record<string, unknown>
			) as ShadcnThemeShared
		}
		if (typeof input.light === 'object' && input.light !== null) {
			out.light = overrideExistingObjectVars(
				out.light,
				input.light as Record<string, unknown>
			)
		}
		if (typeof input.dark === 'object' && input.dark !== null) {
			out.dark = overrideExistingObjectVars(
				out.dark,
				input.dark as Record<string, unknown>
			)
		}
		return out
	} catch (e) {
		console.error(e)
		return out
	}
}
