import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import Mainbar from '~/components/forum/Mainbar'
import { trpc } from '~/lib/trpc'
import { Button } from '~/components/ui/button'
import { PlusIcon, Users } from 'lucide-react'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/_client/threads/')({
  head: () => ({
    meta: [...seo({ title: 'Threads - Foreum', description: 'Browse discussions on Foreum.' })],
  }),
  component: ThreadPage,
})

function ThreadPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'oldest'>('popular')
  const { data: settings } = trpc.settings.getPublicSettings.useQuery()

  const bannerUrl = settings?.forumBanner
  const forumName = settings?.forumName ?? 'Foreum'
  const forumDescription = settings?.forumDescription ?? ''

  return (
    <>
      {bannerUrl ? (
        <div className="relative mb-6 flex min-h-[220px] items-center justify-center overflow-hidden rounded-xl border">
          <img
            src={bannerUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/50 to-black/60" />
          <div className="relative z-10 flex flex-col items-center gap-4 px-6 py-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-md">
              {forumName}
            </h1>
            {forumDescription && (
              <p className="max-w-lg text-base text-white/80 drop-shadow-sm">
                {forumDescription}
              </p>
            )}
            <div className="mt-2 flex items-center gap-3">
              <Link to="/threads/new">
                <Button className="gap-2">
                  <PlusIcon /> New Thread
                </Button>
              </Link>
              <Link to="/groups">
                <Button variant="secondary" className="gap-2">
                  <Users /> Browse Communities
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 flex flex-col items-center gap-3 px-6 py-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight">{forumName}</h1>
          {forumDescription && (
            <p className="max-w-lg text-muted-foreground">{forumDescription}</p>
          )}
          <div className="mt-2 flex items-center gap-3">
            <Link to="/threads/new">
              <Button className="gap-2">
                <PlusIcon /> New Thread
              </Button>
            </Link>
            <Link to="/groups">
              <Button variant="secondary" className="gap-2">
                <Users /> Browse Communities
              </Button>
            </Link>
          </div>
        </div>
      )}
      <div className="h-full flex-1">
        <Mainbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </div>
    </>
  )
}
