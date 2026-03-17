import { Info, Flame } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { trpc } from '~/lib/trpc'
import { Skeleton } from '~/components/ui/skeleton'
import { Link } from '@tanstack/react-router'

export default function RightSidebar() {
  const { data: recentPosts, isLoading: recentLoading } = trpc.thread.recent.useQuery({ limit: 5 })
  const { data: popularPosts, isLoading: popularLoading } = trpc.thread.trending.useQuery({ limit: 5 })
  
  const quickLinks = [
    { name: 'About', href: '/about' },
    { name: 'Help', href: '/help' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy', href: '/privacy' }
  ]

  if (recentLoading || popularLoading) {
    return (
      <div className="w-full space-y-4 p-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  return (
    <div className="h-full w-full overflow-y-auto bg-background p-4 space-y-6">
      {/* Announcements */}
      <Card>
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground italic">No new announcements</p>
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {recentPosts && recentPosts.length > 0 ? (
            recentPosts.map((post: any) => (
              <div key={post.id} className="flex gap-3 rounded-lg p-1 hover:bg-accent ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <Link to={`/thread/${post.id}` as any} className="flex gap-2 py-1 flex-1">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.author?.image} alt={post.author?.name} />
                    <AvatarFallback>
                      {post.author?.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="line-clamp-2 text-sm font-medium">{post.title}</p>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground italic">No recent posts</p>
          )}
        </CardContent>
      </Card>

      {/* Popular This Week */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" /> Popular This Week
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {popularPosts && popularPosts.length > 0 ? (
            popularPosts.map((post: any) => (
              <div key={post.id} className="flex justify-between rounded-lg p-2 hover:bg-accent transition-colors">
                <span className="line-clamp-1 text-sm">{post.title}</span>
                <span className="text-xs text-muted-foreground">{post.score || 0} pts</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground italic">No trending posts</p>
          )}
        </CardContent>
      </Card>

      {/* Quick Links */}
       <Card>
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <Info className="h-4 w-4" /> Quick Links
           </CardTitle>
         </CardHeader>
         <CardContent>
           <ul className="space-y-2">
             {quickLinks.map((link) => (
               <li key={link.name}>
                 <Link to={link.href as any} className="text-sm text-muted-foreground hover:underline">
                   {link.name}
                 </Link>
               </li>
             ))}
           </ul>
         </CardContent>
       </Card>
    </div>
  )
}