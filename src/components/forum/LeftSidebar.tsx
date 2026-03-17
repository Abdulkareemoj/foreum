import { Link } from '@tanstack/react-router'
import { Folder, MessageCircle, Tag, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { trpc } from '~/lib/trpc'
import { Skeleton } from '~/components/ui/skeleton'

export default function LeftSidebar() {
  const { data: categories, isLoading: catLoading } = trpc.category.list.useQuery()
  const { data: trendingTags, isLoading: tagLoading } = trpc.tag.popular.useQuery({ limit: 10 })
  const { data: topContributors, isLoading: userLoading } = trpc.user.topContributors.useQuery({ limit: 5 })
  const { data: activeDiscussions, isLoading: discLoading } = trpc.thread.recent.useQuery({ limit: 5 })
  const { data: topCategories } = trpc.category.list.useQuery()

  // Match Svelte's isLoading skeleton
  if (catLoading || tagLoading || userLoading || discLoading) {
    return (
      <div className="w-full space-y-4 p-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  return (
    <div className="h-full w-full overflow-y-auto border-border bg-background">
      <div className="space-y-6 p-4">
        {/* Categories */}
        <div>
          <h2 className="mb-3 text-lg font-semibold">Categories</h2>
          {categories && categories.length > 0 ? (
            categories.map((cat: any) => (
              <div key={cat.id} className="flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-accent">
                <Link to={`/categories/${cat.slug}`} className="text-sm">{cat.name}</Link>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground px-2 italic">No categories found</p>
          )}
        </div>

        {/* Trending Tags */}
        <div>
          <h2 className="mb-3 text-lg font-semibold">Trending Tags</h2>
          {trendingTags && trendingTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {trendingTags.map((tag: any) => (
                <Link key={tag.id} to={`/tags/${tag.slug}`}>
                  <Badge variant="secondary" className="cursor-pointer">
                    <Tag className="mr-1 h-3 w-3" />
                    {tag.name}
                  </Badge>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground px-2 italic">No tags yet</p>
          )}
        </div>

        {/* Top Contributors */}
        <div>
          <h2 className="mb-3 text-lg font-semibold">Top Contributors</h2>
          {topContributors && topContributors.length > 0 ? (
            <div className="space-y-3">
              {topContributors.map((user: any) => (
                <div key={user.id} className="flex items-center gap-3">
                  <Link
                    to="/profile/$username"
                    params={{ username: user.username || user.id }}
                    className="flex items-center gap-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback>{user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{user.displayUsername || user.username}</span>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground px-2 italic">No contributors yet</p>
          )}
        </div>

        {/* Active Discussions */}
        <div>
          <h2 className="mb-3 text-lg font-semibold">Active Discussions</h2>
          {activeDiscussions && activeDiscussions.length > 0 ? (
            <div className="space-y-2">
              {activeDiscussions.map((disc: any) => (
                <Link key={disc.id} to="/threads/thread/$id" params={{ id: disc.id }} className="block">
                  <div className="flex items-center justify-between gap-5 rounded-lg p-2 hover:bg-accent">
                    <span className="line-clamp-1 text-sm">{disc.title}</span>
                    <span className="text-xs text-muted-foreground">{disc.replies || disc.replyCount || 0} replies</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground px-2 italic">No active discussions</p>
          )}
        </div>

        {/* Top Categories */}
        {topCategories && topCategories.length > 0 && (
          <div>
            <h2 className="mb-3 text-lg font-semibold">Top Categories</h2>
            {topCategories.slice(0, 5).map((cat: any) => (
              <Link key={cat.id} to={`/categories/${cat.slug}`} className="flex justify-between rounded-lg p-2 hover:bg-accent">
                <span className="text-sm">{cat.name}</span>
                <span className="text-xs text-muted-foreground">{cat.count || 0}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}