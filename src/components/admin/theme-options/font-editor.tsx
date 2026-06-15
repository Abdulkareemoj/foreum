import * as React from 'react'
import { useThemeData, type FontType } from '~/providers/theme-data-provider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

const FONT_OPTIONS: Record<FontType, Array<{ label: string; value: string }>> = {
	'font-sans': [
		{ label: 'System Default', value: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
		{ label: 'Inter', value: "'Inter', ui-sans-serif, system-ui, sans-serif" },
		{ label: 'Geist', value: "'Geist', ui-sans-serif, system-ui, sans-serif" },
		{ label: 'DM Sans', value: "'DM Sans', ui-sans-serif, system-ui, sans-serif" },
		{ label: 'Nunito', value: "'Nunito', ui-sans-serif, system-ui, sans-serif" },
		{ label: 'Outfit', value: "'Outfit', ui-sans-serif, system-ui, sans-serif" }
	],
	'font-serif': [
		{ label: 'System Default', value: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' },
		{ label: 'Georgia', value: 'Georgia, ui-serif, serif' },
		{ label: 'Merriweather', value: "'Merriweather', ui-serif, serif" },
		{ label: 'Lora', value: "'Lora', ui-serif, serif" },
		{ label: 'Playfair Display', value: "'Playfair Display', ui-serif, serif" }
	],
	'font-mono': [
		{ label: 'System Default', value: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' },
		{ label: 'Fira Code', value: "'Fira Code', ui-monospace, monospace" },
		{ label: 'JetBrains Mono', value: "'JetBrains Mono', ui-monospace, monospace" },
		{ label: 'Geist Mono', value: "'Geist Mono', ui-monospace, monospace" }
	]
}

function FontSection({ label, fontType }: { label: string; fontType: FontType }) {
	const { theme, updateFont } = useThemeData()
	if (!theme) return null
	const currentValue = theme.theme[fontType]
	const options = FONT_OPTIONS[fontType]
	const matchedOption = options.find(o => o.value === currentValue)

	return (
		<div className="flex flex-col gap-1.5">
			<div className="text-sm font-medium">{label}</div>
			<Select
				value={currentValue}
				onValueChange={v => updateFont(fontType, v)}
			>
				<SelectTrigger className="h-8 text-xs">
					<SelectValue placeholder={matchedOption?.label ?? 'Custom'} />
				</SelectTrigger>
				<SelectContent>
					{options.map(opt => (
						<SelectItem key={opt.value} value={opt.value}>
							{opt.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}

export function FontEditor() {
	const { theme } = useThemeData()
	if (!theme) return null
	return (
		<div className="flex flex-col gap-4 pt-4">
			<div className="text-sm font-semibold">Fonts</div>
			<FontSection label="Sans-serif" fontType="font-sans" />
			<FontSection label="Serif" fontType="font-serif" />
			<FontSection label="Monospace" fontType="font-mono" />
		</div>
	)
}
