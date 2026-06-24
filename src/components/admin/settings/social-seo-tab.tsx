import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Label } from "~/components/ui/label"
import { Separator } from "~/components/ui/separator"
import { trpc } from "~/lib/trpc"
import { Save, Plus, Trash2, Globe } from "lucide-react"
import { toast } from "sonner"

const SOCIAL_PLATFORMS = [
  { value: "github", label: "GitHub" },
  { value: "twitter", label: "X / Twitter" },
  { value: "discord", label: "Discord" },
  { value: "youtube", label: "YouTube" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "reddit", label: "Reddit" },
  { value: "mastodon", label: "Mastodon" },
  { value: "website", label: "Website" },
]

export function SocialSeoTab() {
  const { data: settings, refetch } = trpc.settings.getAllGlobal.useQuery()
  const saveMultiple = trpc.settings.updateMultiple.useMutation()

  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string }[]>([])
  const [metaTitleSuffix, setMetaTitleSuffix] = useState("")
  const [ogImage, setOgImage] = useState("")
  const [customHeadHtml, setCustomHeadHtml] = useState("")

  useEffect(() => {
    if (!settings) return
    try {
      setSocialLinks(JSON.parse(settings.social_links ?? "[]"))
    } catch {
      setSocialLinks([])
    }
    setMetaTitleSuffix(settings.meta_title_suffix ?? "")
    setOgImage(settings.og_image ?? "")
    setCustomHeadHtml(settings.custom_head_html ?? "")
  }, [settings])

  function handleBatchSave() {
    saveMultiple.mutate(
      {
        settings: {
          social_links: JSON.stringify(socialLinks),
          meta_title_suffix: metaTitleSuffix,
          og_image: ogImage,
          custom_head_html: customHeadHtml,
        },
      },
      { onSuccess: () => { toast.success("All settings saved"); refetch() }, onError: () => toast.error("Failed to save") }
    )
  }

  function addSocialLink() {
    setSocialLinks([...socialLinks, { platform: "github", url: "" }])
  }

  function updateSocialLink(index: number, field: "platform" | "url", value: string) {
    const updated = [...socialLinks]
    updated[index] = { ...updated[index], [field]: value }
    setSocialLinks(updated)
  }

  function removeSocialLink(index: number) {
    setSocialLinks(socialLinks.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
          <CardDescription>Links to your community on other platforms. Shown in the footer.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {socialLinks.length === 0 && (
            <p className="text-sm text-muted-foreground">No social links added yet.</p>
          )}
          {socialLinks.map((link, i) => (
            <div key={i} className="flex items-center gap-2">
              <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
              <select
                value={link.platform}
                onChange={(e) => updateSocialLink(i, "platform", e.target.value)}
                className="flex h-9 w-36 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              >
                {SOCIAL_PLATFORMS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              <Input
                placeholder="https://..."
                value={link.url}
                onChange={(e) => updateSocialLink(i, "url", e.target.value)}
              />
              <Button variant="ghost" size="icon-sm" onClick={() => removeSocialLink(i)}>
                <Trash2 />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-fit gap-2" onClick={addSocialLink}>
            <Plus /> Add Social Link
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO &amp; Meta</CardTitle>
          <CardDescription>Search engine and social preview settings.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="meta-suffix">Meta Title Suffix</Label>
            <p className="text-xs text-muted-foreground">Appended to every page title. e.g. &quot;- Foreum&quot;</p>
            <Input
              id="meta-suffix"
              value={metaTitleSuffix}
              onChange={(e) => setMetaTitleSuffix(e.target.value)}
              placeholder="- My Forum"
            />
          </div>
          <Separator />
          <div className="flex flex-col gap-2">
            <Label htmlFor="og-image">OG Image URL</Label>
            <p className="text-xs text-muted-foreground">Preview image shown when links are shared on social media.</p>
            <Input
              id="og-image"
              placeholder="https://..."
              value={ogImage}
              onChange={(e) => setOgImage(e.target.value)}
            />
            {ogImage && (
              <img src={ogImage} alt="OG preview" className="mt-2 h-32 w-auto rounded border object-cover" />
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom Head HTML</CardTitle>
          <CardDescription>Inject meta tags, verification codes, or scripts into the page head.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Textarea
            value={customHeadHtml}
            onChange={(e) => setCustomHeadHtml(e.target.value)}
            rows={5}
            placeholder="<!-- Google site verification -->&#10;<meta name=&quot;google-site-verification&quot; content=&quot;...&quot; />"
            className="font-mono text-xs"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleBatchSave} disabled={saveMultiple.isPending}>
          {saveMultiple.isPending ? "Saving..." : "Save All Social & SEO Settings"}
        </Button>
      </div>
    </div>
  )
}
