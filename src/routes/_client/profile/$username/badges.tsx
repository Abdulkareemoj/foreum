import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { ArrowLeft, Award } from 'lucide-react'
import { trpc } from '~/lib/trpc'
import { useSession } from '~/lib/auth-client'
import { format } from 'date-fns'

export const Route = createFileRoute('/_client/profile/$username/badges')({
  component: ProfileBadgesPage,
})

function ProfileBadgesPage() {
  const { username } = Route.useParams()
  const navigate = useNavigate()
  const { data: session } = useSession()

  const { data: profileUser, isLoading: userLoading } =
    trpc.user.byUsername.useQuery({ username })

  const { data: reputation, isLoading: repLoading } =
    trpc.reputation.getByUserId.useQuery(
      { userId: profileUser?.id || '' },
      { enabled: !!profileUser?.id }
    )

  const { data: allBadges, isLoading: allBadgesLoading } =
    trpc.reputation.listBadges.useQuery()

  const isLoading = userLoading || repLoading || allBadgesLoading
  const isOwnProfile = session?.user?.id === profileUser?.id

  const earnedIds = new Set(reputation?.badges?.map((b: any) => b.id) || [])
  const earned = reputation?.badges || []
  const unearned = allBadges?.filter((b: any) => !earnedIds.has(b.id)) || []

  if (userLoading) {
    return (
      <div className="container max-w-4xl py-6 space-y-6">
        <Skeleton className="h-12 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44" />
          ))}
        </div>
      </div>
    )
  }

  if (!profileUser) {
    return (
      <div className="container max-w-4xl py-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">User not found</h2>
          <Button onClick={() => navigate({ to: '/thread' })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Threads
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-6 space-y-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() =>
          navigate({ to: '/profile/$username', params: { username } })
        }
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Profile
      </Button>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={profileUser.image || ''} />
            <AvatarFallback>{profileUser.name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Award className="h-6 w-6" />
              {isOwnProfile ? 'Your Badges' : `${profileUser.name}'s Badges`}
            </h1>
            <p className="text-sm text-muted-foreground">
              {earned.length} of {allBadges?.length || 0} badges earned
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="hidden sm:block text-right">
          <div className="text-3xl font-bold text-primary">{earned.length}</div>
          <div className="w-32 h-2 bg-muted rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{
                width: `${allBadges?.length ? (earned.length / allBadges.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44" />
          ))}
        </div>
      ) : (
        <>
          {/* Earned Badges */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              Earned
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({earned.length})
              </span>
            </h2>

            {earned.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center">
                  <Award className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {isOwnProfile
                      ? 'No badges yet — start contributing to earn your first!'
                      : 'No badges earned yet.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {earned.map((badge: any) => (
                  <Card key={badge.id} className="border-primary/30">
                    <CardContent className="flex flex-col items-center p-6 text-center">
                      <div className="text-5xl">{badge.icon}</div>
                      <h3 className="mt-3 font-semibold">{badge.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {badge.description}
                      </p>
                      <span className="mt-3 text-xs text-muted-foreground">
                        Earned {format(new Date(badge.awardedAt), 'MMM d, yyyy')}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Unearned Badges - only show on own profile */}
          {isOwnProfile && unearned.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-muted-foreground">
                Not Yet Earned
                <span className="ml-2 text-sm font-normal">({unearned.length})</span>
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {unearned.map((badge: any) => (
                  <Card key={badge.id} className="opacity-50">
                    <CardContent className="flex flex-col items-center p-6 text-center">
                      <div className="text-5xl grayscale">{badge.icon}</div>
                      <h3 className="mt-3 font-semibold">{badge.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {badge.description}
                      </p>
                      <span className="mt-3 text-xs text-muted-foreground italic">
                        Not yet earned
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}