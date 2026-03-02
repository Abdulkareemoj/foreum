import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { Skeleton } from '~/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import {
  MapPin,
  Globe,
  ArrowLeft,
  MessageSquare,
  Star,
  Edit,
  Calendar,
  Award,
} from 'lucide-react'
import { trpc } from '~/lib/trpc'
import { format } from 'date-fns'
import { useSession } from '~/lib/auth-client'

export const Route = createFileRoute('/_client/profile/profile/$username')({
  component: ProfilePage,
})

function ProfilePage() {
  const { username } = Route.useParams()
  const navigate = useNavigate()
  const { data: session } = useSession()

  const { data: profileUser, isLoading } = trpc.user.byUsername.useQuery({ username })

  const { data: reputation } = trpc.reputation.getByUserId.useQuery(
    { userId: profileUser?.id || '' },
    { enabled: !!profileUser?.id }
  )

  const { data: threads } = trpc.user.getThreads.useQuery(
    { userId: profileUser?.id || '', limit: 10 },
    { enabled: !!profileUser?.id }
  )

  const isOwnProfile = session?.user?.id === profileUser?.id

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-6 space-y-6">
        <Skeleton className="h-48" />
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (!profileUser) {
    return (
      <div className="container max-w-4xl py-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">User not found</h2>
          <p className="text-muted-foreground mb-4">
            This profile doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate({ to: '/thread' })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Threads
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profileUser.image || ''} />
              <AvatarFallback className="text-3xl">
                {profileUser.name?.[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{profileUser.name}</h1>
                  <p className="text-muted-foreground">@{profileUser.username}</p>
                </div>

                {isOwnProfile && (
                  <Link
                    to="/profile/$username/edit"
                    params={{ username: profileUser.username || '' }}
                  >
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                )}
              </div>

              {profileUser.bio && (
                <p className="text-sm">{profileUser.bio}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {profileUser.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{profileUser.location}</span>
                  </div>
                )}
                {profileUser.website && (
                  <Link
                    to={profileUser.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-primary"
                  >
                    <Globe className="h-4 w-4" />
                    <span className="truncate max-w-[200px]">{profileUser.website}</span>
                  </Link>
                )}
                {profileUser.createdAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Joined {format(new Date(profileUser.createdAt), 'MMMM yyyy')}
                    </span>
                  </div>
                )}
              </div>

              {/* Stats Row */}
              <div className="flex gap-6 pt-2">
                <div className="text-center">
                  <p className="text-xl font-bold text-primary">
                    {reputation?.points || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Reputation</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">{threads?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">Threads</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">
                    {reputation?.badges?.length || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Badges</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Tabs */}
      <Tabs defaultValue="threads">
        <TabsList>
          <TabsTrigger value="threads">
            <MessageSquare className="h-4 w-4 mr-2" />
            Threads
          </TabsTrigger>
          <TabsTrigger value="badges">
            <Star className="h-4 w-4 mr-2" />
            Badges
          </TabsTrigger>
        </TabsList>

        <TabsContent value="threads" className="mt-6 space-y-4">
          {!threads || threads.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No threads yet</p>
              </CardContent>
            </Card>
          ) : (
            threads.map((t) => (
              <Link key={t.id} to="/thread/$id" params={{ id: t.id }}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="py-4 px-6">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-medium line-clamp-1">{t.title}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground flex-shrink-0">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {t.replyCount}
                        </span>
                        <span>{format(new Date(t.createdAt), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </TabsContent>

       <TabsContent value="badges" className="mt-6">
  <div className="flex items-center justify-between mb-4">
    <p className="text-sm text-muted-foreground">
      {reputation?.badges?.length || 0} badges earned
    </p>
    <Link
      to="/profile/$username/badges"
      params={{ username: profileUser.username || '' }}
    >
      <Button variant="outline" size="sm">
        <Award className="h-4 w-4 mr-2" />
        View All Badges
      </Button>
    </Link>
  </div>

  {!reputation?.badges || reputation.badges.length === 0 ? (
    <Card>
      <CardContent className="py-12 text-center">
        <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">No badges earned yet</p>
      </CardContent>
    </Card>
  ) : (
    // Show first 6 as a preview
    (<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {reputation.badges.slice(0, 6).map((badge: any) => (
        <Card key={badge.id} className="text-center border-primary/20">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-5xl">{badge.icon}</div>
            <h3 className="mt-3 font-semibold">{badge.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
              {badge.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>)
  )}

  {(reputation?.badges?.length || 0) > 6 && (
    <Link
      to="/profile/$username/badges"
      params={{ username: profileUser.username || '' }}
      className="block mt-4"
    >
      <Button variant="outline" className="w-full">
        View all {reputation?.badges?.length} badges
      </Button>
    </Link>
  )}
</TabsContent>
      </Tabs>
    </div>
  )
}