import { Link } from "@tanstack/react-router"
import { trpc } from "~/lib/trpc"
import Logo from "./Logo"

const SOCIAL_ICONS: Record<string, string> = {
  github: "gh",
  twitter: "X",
  discord: "DC",
  youtube: "YT",
  linkedin: "in",
  facebook: "fb",
  instagram: "ig",
  reddit: "rd",
  mastodon: "Md",
  website: "WWW",
}

export default function ForumFooter() {
  const { data: settings } = trpc.settings.getPublicSettings.useQuery()
  const { data: pages } = trpc.pages.list.useQuery()

  if (!settings) return null

  const forumName = settings.forumName ?? "Foreum"
  const navItems = safeParse<{ label: string; href: string }[]>(settings.navItems, [])
  const socialLinks = safeParse<{ platform: string; url: string }[]>(settings.socialLinks, [])
  const publishedPages = pages?.filter((p) => p.published) ?? []
  const footerText = settings.footerText
  const copyright = settings.footerCopyright || `© ${new Date().getFullYear()} ${forumName}. All rights reserved.`

  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <Logo />
            {footerText && (
              <p className="max-w-xs text-sm text-muted-foreground">{footerText}</p>
            )}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-2 pt-2">
                {socialLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-md border text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    title={link.platform}
                  >
                    {SOCIAL_ICONS[link.platform] ?? link.platform.slice(0, 2).toUpperCase()}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-8">
            {navItems.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Links</p>
                <div className="flex flex-col gap-1.5">
                  {navItems.map((item: any, i: number) => (
                    <Link key={i} to={item.href} className="text-sm text-muted-foreground hover:text-foreground">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {publishedPages.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pages</p>
                <div className="flex flex-col gap-1.5">
                  {publishedPages.map((page) => (
                    <Link
                      key={page.id}
                      to="/pages/$slug"
                      params={{ slug: page.slug }}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {page.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <p className="text-center text-xs text-muted-foreground">{copyright}</p>
        </div>
      </div>
    </footer>
  )
}

function safeParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T
  } catch {
    return fallback
  }
}
