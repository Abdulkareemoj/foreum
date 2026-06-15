import { useThemeData } from '~/providers/theme-data-provider'
import { useEffect, useState } from 'react'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Check, Pencil } from 'lucide-react'

export function ThemeNameEditor() {
	const { themeName, setThemeName, isLoading } = useThemeData()
	const [isEditing, setIsEditing] = useState(false)
	const [localName, setLocalName] = useState('')

	useEffect(() => {
		setLocalName(themeName)
	}, [themeName])

	function saveName() {
		const next = localName.trim() || 'Untitled Theme'
		setThemeName(next)
		setIsEditing(false)
	}

	return (
		<div className="flex items-center gap-1.5">
			{isEditing ? (
				<>
					<Input
						value={localName}
						onChange={e => setLocalName(e.target.value)}
						placeholder="Theme name"
						className="px-2"
						autoFocus
						onKeyDown={e => {
							if (e.key === 'Enter') saveName()
						}}
						onBlur={() => saveName()}
					/>
					<Button variant="secondary" onClick={() => saveName()} size="icon" aria-label="Save name">
						<Check />
					</Button>
				</>
			) : (
				<>
					<div
						className="text-sm font-medium truncate flex-1 p-2 py-1.5 rounded-md border cursor-text"
						onClick={() => setIsEditing(true)}
					>
						{isLoading ? themeName : themeName}
					</div>
					<Button
						variant="ghost"
						size="icon"
						aria-label="Edit name"
						onClick={() => setIsEditing(true)}
						className="opacity-50 hover:opacity-100 transition-opacity"
					>
						<Pencil />
					</Button>
				</>
			)}
		</div>
	)
}