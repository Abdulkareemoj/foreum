import * as React from 'react'
import type { ShadcnTheme, ColorKey } from '~/lib/shadcnTheme'
import { getDefaultShadcnTheme, parseShadcnThemeFromJson } from '~/lib/shadcnTheme'
import { trpc } from '~/lib/trpc'
import type { ExampleId } from '~/lib/colorExampleMapping'
import { EXAMPLE_IDS } from '~/lib/colorExampleMapping'

export type FontType = 'font-sans' | 'font-serif' | 'font-mono'

type ThemeContextValue = {
	theme: ShadcnTheme | null
	isLoading: boolean
	isSaving: boolean
	updateVar: (key: ColorKey, value: string, options?: { mode?: 'light' | 'dark' }) => void
	updateVarDirect: (key: ColorKey, value: string, options?: { mode?: 'light' | 'dark' }) => void
	updateRadius: (value: string) => void
	updateFont: (fontType: FontType, value: string) => void
	saveTheme: () => void
	resetTheme: () => void
	previewMode: 'light' | 'dark'
	setPreviewMode: (mode: 'light' | 'dark') => void
	activeExample: ExampleId
	setActiveExample: (example: ExampleId) => void
	editingColorKey: ColorKey | null
	setEditingColorKey: (key: ColorKey | null) => void
	themedScopeRef: React.MutableRefObject<HTMLDivElement | null>
}

const ThemeDataContext = React.createContext<ThemeContextValue>({
	theme: getDefaultShadcnTheme(),
	isLoading: false,
	isSaving: false,
	updateVar: () => {},
	updateVarDirect: () => {},
	updateRadius: () => {},
	updateFont: () => {},
	saveTheme: () => {},
	resetTheme: () => {},
	previewMode: 'light',
	setPreviewMode: () => {},
	activeExample: EXAMPLE_IDS.COLORS,
	setActiveExample: () => {},
	editingColorKey: null,
	setEditingColorKey: () => {},
	themedScopeRef: { current: null }
})

const PREVIEW_MODE_KEY = 'foreum-theme-preview-mode'

export function ThemeDataProvider({ children }: { children: React.ReactNode }) {
	const { data: remoteTheme, isLoading } = trpc.theme.getGlobal.useQuery()
	const saveGlobal = trpc.theme.saveGlobal.useMutation()
	const resetGlobal = trpc.theme.resetGlobal.useMutation()
	const utils = trpc.useUtils()

	const [theme, setTheme] = React.useState<ShadcnTheme | null>(null)
	const [needsUpdate, setNeedsUpdate] = React.useState(false)
	const [previewMode, setPreviewMode] = React.useState<'light' | 'dark'>(() => {
		if (typeof window !== 'undefined') {
			try {
				const saved = window.localStorage.getItem(PREVIEW_MODE_KEY)
				if (saved === 'light' || saved === 'dark') return saved
			} catch {}
		}
		return 'dark'
	})
	const [activeExample, setActiveExample] = React.useState<ExampleId>(EXAMPLE_IDS.COLORS)
	const [editingColorKey, setEditingColorKey] = React.useState<ColorKey | null>(null)
	const themedScopeRef = React.useRef<HTMLDivElement | null>(null)

	// Persist preview mode
	React.useEffect(() => {
		if (typeof window === 'undefined') return
		try { window.localStorage.setItem(PREVIEW_MODE_KEY, previewMode) } catch {}
	}, [previewMode])

	// Load remote theme once available
	React.useEffect(() => {
		if (remoteTheme && !theme) {
			// The stored data might be the old simple format — parse safely
			try {
				const parsed = parseShadcnThemeFromJson(remoteTheme)
				setTheme(parsed)
			} catch {
				setTheme(getDefaultShadcnTheme())
			}
		}
		if (!remoteTheme && !isLoading && !theme) {
			setTheme(getDefaultShadcnTheme())
		}
	}, [remoteTheme, isLoading, theme])

	const updateVarDirect = React.useCallback((key: ColorKey, value: string) => {
		if (themedScopeRef.current) {
			themedScopeRef.current.style.setProperty(`--${key}`, value)
		}
	}, [])

	const updateVar = React.useCallback((
		key: ColorKey,
		value: string,
		options?: { mode?: 'light' | 'dark' }
	) => {
		setTheme(prev => {
			if (!prev) return null
			const mode = options?.mode || previewMode
			return { ...prev, [mode]: { ...prev[mode], [key]: value } }
		})
		setNeedsUpdate(true)
	}, [previewMode])

	const updateRadius = React.useCallback((value: string) => {
		setTheme(prev => {
			if (!prev) return null
			return { ...prev, theme: { ...prev.theme, radius: value } }
		})
		setNeedsUpdate(true)
	}, [])

	const updateFont = React.useCallback((fontType: FontType, value: string) => {
		setTheme(prev => {
			if (!prev) return null
			return { ...prev, theme: { ...prev.theme, [fontType]: value } }
		})
		setNeedsUpdate(true)
	}, [])

	const saveTheme = React.useCallback(() => {
		if (!theme) return
		saveGlobal.mutate(theme, {
			onSuccess: () => utils.theme.getGlobal.invalidate()
		})
	}, [theme, saveGlobal, utils])

	const resetTheme = React.useCallback(() => {
		resetGlobal.mutate(undefined, {
			onSuccess: () => {
				setTheme(getDefaultShadcnTheme())
				setNeedsUpdate(false)
				utils.theme.getGlobal.invalidate()
			}
		})
	}, [resetGlobal, utils])

	// Debounced auto-save (500ms after last change)
	React.useEffect(() => {
		if (!needsUpdate || !theme) return
		const handle = setTimeout(() => {
			saveGlobal.mutate(theme, {
				onSuccess: () => utils.theme.getGlobal.invalidate()
			})
			setNeedsUpdate(false)
		}, 500)
		return () => clearTimeout(handle)
	}, [needsUpdate, theme, saveGlobal, utils])

	const ctx = React.useMemo<ThemeContextValue>(() => ({
		theme,
		isLoading,
		isSaving: saveGlobal.isPending,
		updateVar,
		updateVarDirect,
		updateRadius,
		updateFont,
		saveTheme,
		resetTheme,
		previewMode,
		setPreviewMode,
		activeExample,
		setActiveExample,
		editingColorKey,
		setEditingColorKey,
		themedScopeRef
	}), [
		theme, isLoading, saveGlobal.isPending,
		updateVar, updateVarDirect, updateRadius, updateFont,
		saveTheme, resetTheme,
		previewMode, activeExample, editingColorKey
	])

	return (
		<ThemeDataContext.Provider value={ctx}>
			{children}
		</ThemeDataContext.Provider>
	)
}

export function useThemeData(): ThemeContextValue {
	return React.useContext(ThemeDataContext)
}
