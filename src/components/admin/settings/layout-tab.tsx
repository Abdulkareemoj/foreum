import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Label } from "~/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Separator } from "~/components/ui/separator"
import { trpc } from "~/lib/trpc"
import { Save, Plus, Trash2, GripVertical } from "lucide-react"
import { toast } from "sonner"

export function LayoutTab() {
  const { data: settings, refetch } = trpc.settings.getAllGlobal.useQuery()
  const saveMultiple = trpc.settings.updateMultiple.useMutation()

  const [footerText, setFooterText] = useState("")
  const [footerCopyright, setFooterCopyright] = useState("")
  const [homepageLayout, setHomepageLayout] = useState("latest")
  const [navItems, setNavItems] = useState<{ label: string; href: string }[]>([])

  useEffect(() => {
    if (!settings) return
    setFooterText(settings.footer_text ?? "")
    setFooterCopyright(settings.footer_copyright ?? "")
    setHomepageLayout(settings.homepage_layout ?? "latest")
    try {
      setNavItems(JSON.parse(settings.nav_items ?? "[]"))
    } catch {
      setNavItems([])
    }
  }, [settings])

  function handleSave(key: string, value: string) {
    saveMultiple.mutate(
      { settings: { [key]: value } },
      { onSuccess: () => { toast.success("Saved"); refetch() }, onError: () => toast.error("Failed to save") }
    )
  }

  function handleBatchSave() {
    saveMultiple.mutate(
      {
        settings: {
          footer_text: footerText,
          footer_copyright: footerCopyright,
          homepage_layout: homepageLayout,
          nav_items: JSON.stringify(navItems),
        },
      },
      { onSuccess: () => { toast.success("All settings saved"); refetch() }, onError: () => toast.error("Failed to save") }
    )
  }

  function addNavItem() {
    setNavItems([...navItems, { label: "", href: "" }])
  }

  function updateNavItem(index: number, field: "label" | "href", value: string) {
    const updated = [...navItems]
    updated[index] = { ...updated[index], [field]: value }
    setNavItems(updated)
  }

  function removeNavItem(index: number) {
    setNavItems(navItems.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Homepage</CardTitle>
          <CardDescription>Choose what visitors see on the landing page.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Default Homepage Layout</Label>
            <Select value={homepageLayout} onValueChange={setHomepageLayout}>
              <SelectTrigger className="w-60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest Threads</SelectItem>
                <SelectItem value="popular">Popular Threads</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Navigation Menu</CardTitle>
          <CardDescription>Custom links shown in the navbar.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {navItems.length === 0 && (
            <p className="text-sm text-muted-foreground">No custom nav items. Add one below.</p>
          )}
          {navItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
              <Input
                placeholder="Label"
                value={item.label}
                onChange={(e) => updateNavItem(i, "label", e.target.value)}
                className="w-40"
              />
              <Input
                placeholder="/path"
                value={item.href}
                onChange={(e) => updateNavItem(i, "href", e.target.value)}
              />
              <Button variant="ghost" size="icon-sm" onClick={() => removeNavItem(i)}>
                <Trash2 />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-fit gap-2" onClick={addNavItem}>
            <Plus /> Add Nav Item
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Footer</CardTitle>
          <CardDescription>Text shown at the bottom of every page.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="footer-text">Footer Text</Label>
            <Textarea
              id="footer-text"
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
              rows={3}
            />
          </div>
          <Separator />
          <div className="flex flex-col gap-2">
            <Label htmlFor="footer-copyright">Copyright Line</Label>
            <Input
              id="footer-copyright"
              value={footerCopyright}
              onChange={(e) => setFooterCopyright(e.target.value)}
              placeholder={`© ${new Date().getFullYear()} My Forum. All rights reserved.`}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleBatchSave} disabled={saveMultiple.isPending}>
          {saveMultiple.isPending ? "Saving..." : "Save All Layout Settings"}
        </Button>
      </div>
    </div>
  )
}
