import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Label } from "~/components/ui/label"
import { Switch } from "~/components/ui/switch"
import { Separator } from "~/components/ui/separator"
import { trpc } from "~/lib/trpc"
import { Save, ImageIcon } from "lucide-react"
import { toast } from "sonner"

export function AdvancedTab() {
  const { data: settings, refetch } = trpc.settings.getAllGlobal.useQuery()
  const saveMultiple = trpc.settings.updateMultiple.useMutation()

  const [customCss, setCustomCss] = useState("")
  const [customJsHead, setCustomJsHead] = useState("")
  const [customJsBody, setCustomJsBody] = useState("")
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [maintenanceMessage, setMaintenanceMessage] = useState("")
  const [defaultAvatar, setDefaultAvatar] = useState("")

  useEffect(() => {
    if (!settings) return
    setCustomCss(settings.custom_css ?? "")
    setCustomJsHead(settings.custom_js_head ?? "")
    setCustomJsBody(settings.custom_js_body ?? "")
    setMaintenanceMode(settings.maintenance_mode === "true")
    setMaintenanceMessage(settings.maintenance_message ?? "")
    setDefaultAvatar(settings.default_avatar ?? "")
  }, [settings])

  function handleBatchSave() {
    saveMultiple.mutate(
      {
        settings: {
          custom_css: customCss,
          custom_js_head: customJsHead,
          custom_js_body: customJsBody,
          maintenance_mode: String(maintenanceMode),
          maintenance_message: maintenanceMessage,
          default_avatar: defaultAvatar,
        },
      },
      { onSuccess: () => { toast.success("All settings saved"); refetch() }, onError: () => toast.error("Failed to save") }
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Mode</CardTitle>
          <CardDescription>Enable to show a maintenance page to visitors.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
            <span className="text-sm">{maintenanceMode ? "Maintenance mode is ON" : "Maintenance mode is OFF"}</span>
          </div>
          {maintenanceMode && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="maintenance-msg">Maintenance Message</Label>
              <Input
                id="maintenance-msg"
                value={maintenanceMessage}
                onChange={(e) => setMaintenanceMessage(e.target.value)}
                placeholder="We'll be back soon!"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Default Avatar</CardTitle>
          <CardDescription>Fallback avatar image for users who haven't set one.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            {defaultAvatar ? (
              <img src={defaultAvatar} alt="" className="h-10 w-10 rounded-full object-cover ring-1 ring-border" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <ImageIcon className="h-4 w-4" />
              </div>
            )}
            <div className="flex-1">
              <Input
                value={defaultAvatar}
                onChange={(e) => setDefaultAvatar(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom CSS</CardTitle>
          <CardDescription>Additional CSS injected on every page. Overrides theme settings.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Textarea
            value={customCss}
            onChange={(e) => setCustomCss(e.target.value)}
            rows={8}
            placeholder="/* Custom styles */&#10;.my-class { color: red; }"
            className="font-mono text-xs"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom JavaScript</CardTitle>
          <CardDescription>Inject analytics, widgets, or custom scripts.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Head Scripts (before closing &lt;/head&gt;)</Label>
            <Textarea
              value={customJsHead}
              onChange={(e) => setCustomJsHead(e.target.value)}
              rows={4}
              placeholder="&lt;script&gt;console.log('head')&lt;/script&gt;"
              className="font-mono text-xs"
            />
          </div>
          <Separator />
          <div className="flex flex-col gap-2">
            <Label>Body Scripts (before closing &lt;/body&gt;)</Label>
            <Textarea
              value={customJsBody}
              onChange={(e) => setCustomJsBody(e.target.value)}
              rows={4}
              placeholder="&lt;script&gt;console.log('body')&lt;/script&gt;"
              className="font-mono text-xs"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleBatchSave} disabled={saveMultiple.isPending}>
          {saveMultiple.isPending ? "Saving..." : "Save All Advanced Settings"}
        </Button>
      </div>
    </div>
  )
}
