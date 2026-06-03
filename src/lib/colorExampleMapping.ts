import type { ColorKey } from '~/lib/shadcnTheme'

export const EXAMPLE_IDS = {
	COLORS: 'colors',
	TYPOGRAPHY: 'typography'
} as const

export type ExampleId = (typeof EXAMPLE_IDS)[keyof typeof EXAMPLE_IDS]
export type FontType = 'font-sans' | 'font-serif' | 'font-mono'

export const COLOR_EXAMPLE_MAP: Record<ColorKey, ExampleId> = {
	background: EXAMPLE_IDS.COLORS,
	foreground: EXAMPLE_IDS.COLORS,
	card: EXAMPLE_IDS.COLORS,
	'card-foreground': EXAMPLE_IDS.COLORS,
	popover: EXAMPLE_IDS.COLORS,
	'popover-foreground': EXAMPLE_IDS.COLORS,
	primary: EXAMPLE_IDS.COLORS,
	'primary-foreground': EXAMPLE_IDS.COLORS,
	secondary: EXAMPLE_IDS.COLORS,
	'secondary-foreground': EXAMPLE_IDS.COLORS,
	accent: EXAMPLE_IDS.COLORS,
	'accent-foreground': EXAMPLE_IDS.COLORS,
	muted: EXAMPLE_IDS.COLORS,
	'muted-foreground': EXAMPLE_IDS.COLORS,
	destructive: EXAMPLE_IDS.COLORS,
	border: EXAMPLE_IDS.COLORS,
	input: EXAMPLE_IDS.COLORS,
	ring: EXAMPLE_IDS.COLORS,
	'chart-1': EXAMPLE_IDS.COLORS,
	'chart-2': EXAMPLE_IDS.COLORS,
	'chart-3': EXAMPLE_IDS.COLORS,
	'chart-4': EXAMPLE_IDS.COLORS,
	'chart-5': EXAMPLE_IDS.COLORS,
	sidebar: EXAMPLE_IDS.COLORS,
	'sidebar-foreground': EXAMPLE_IDS.COLORS,
	'sidebar-primary': EXAMPLE_IDS.COLORS,
	'sidebar-primary-foreground': EXAMPLE_IDS.COLORS,
	'sidebar-accent': EXAMPLE_IDS.COLORS,
	'sidebar-accent-foreground': EXAMPLE_IDS.COLORS,
	'sidebar-border': EXAMPLE_IDS.COLORS,
	'sidebar-ring': EXAMPLE_IDS.COLORS
}

export const FONT_EXAMPLE_MAP: Record<FontType, ExampleId> = {
	'font-sans': EXAMPLE_IDS.TYPOGRAPHY,
	'font-serif': EXAMPLE_IDS.TYPOGRAPHY,
	'font-mono': EXAMPLE_IDS.TYPOGRAPHY
}
