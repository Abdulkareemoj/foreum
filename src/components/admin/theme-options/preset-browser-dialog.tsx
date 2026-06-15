import { trpc } from '~/lib/trpc'
import { usePresetBrowserStore } from '~/stores/preset-browser-store'
import { useThemeData } from '~/providers/theme-data-provider'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Spinner } from '~/components/ui/spinner'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '~/components/ui/empty'
import { Skeleton } from '~/components/ui/skeleton'
import { toast } from 'sonner'
import { Play, Trash2, Palette } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export function PresetBrowserDialog() {
  const open = usePresetBrowserStore((s) => s.open)
  const setOpen = usePresetBrowserStore((s) => s.setOpen)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Theme Presets</DialogTitle>
          <DialogDescription>
            Browse saved presets. Click one to load it into the editor.
          </DialogDescription>
        </DialogHeader>
        <PresetGrid onApplied={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

function PresetGrid({ onApplied }: { onApplied: () => void }) {
  const { data: presets, isLoading, error } = trpc.theme.listPresets.useQuery()
  const utils = trpc.useUtils()
  const { loadThemeFromPreset } = useThemeData()

  const applyPreset = trpc.theme.applyPreset.useMutation({
    onSuccess: async (_data, variables) => {
      utils.theme.getGlobal.invalidate()
      try {
        const preset = await utils.client.theme.getPreset.query({ id: variables.id })
        loadThemeFromPreset(preset.data)
      } catch {}
      toast.success('Theme preset applied')
      onApplied()
    },
    onError: (err) => toast.error(err.message),
  })

  const deletePreset = trpc.theme.deletePreset.useMutation({
    onSuccess: () => {
      utils.theme.listPresets.invalidate()
      toast.success('Preset deleted')
    },
    onError: (err) => toast.error(err.message),
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="p-3 pb-0">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="p-3 pt-1">
              <Skeleton className="h-3 w-16" />
            </CardContent>
            <CardFooter className="p-3 pt-0 flex gap-1 justify-end">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-8" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Failed to load presets</EmptyTitle>
          <EmptyDescription>{error.message}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (!presets || presets.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Palette />
          </EmptyMedia>
          <EmptyTitle>No saved presets yet</EmptyTitle>
          <EmptyDescription>
            Save your current theme from the sidebar to create one.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto p-1">
      {presets.map((preset) => (
        <Card key={preset.id}>
          <CardHeader className="p-3 pb-0">
            <CardTitle className="text-sm truncate">{preset.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-1">
            {preset.updatedAt && (
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(preset.updatedAt), { addSuffix: true })}
              </p>
            )}
          </CardContent>
          <CardFooter className="p-3 pt-0 flex gap-1 justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => applyPreset.mutate({ id: preset.id })}
              disabled={applyPreset.isPending && applyPreset.variables?.id === preset.id}
            >
              {applyPreset.isPending && applyPreset.variables?.id === preset.id ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <Play data-icon="inline-start" />
              )}
              Apply
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => deletePreset.mutate({ id: preset.id })}
              disabled={deletePreset.isPending}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
