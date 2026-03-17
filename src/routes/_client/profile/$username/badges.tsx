import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
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

  const { data: profileUser, isLoading: userLoading } = trpc.user.byUsername.useQuery({ username })

  const { data: reputation, isLoading: repLoading } = trpc.reputation.getReputation.useQuery(
    { userId: profileUser?.id || '' },
    { enabled: !!profileUser?.id }
  )

  const { data: allBadges, isLoading: allBadgesLoading } = trpc.reputation.listBadges.useQuery()

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
      <div className="container max-w-4xl py-6 text-center">
        <h2 className="text-2xl font-bold mb-2">User not found</h2>
        <Button onClick={() => navigate({ to: '/threads' } as any)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Threads
        </Button>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="-ml-4 hover:bg-transparent hover:text-primary transition-colors"
        onClick={() => navigate({ to: '/profile/$username', params: { username } })}
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Profile
      </Button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/10">
            <AvatarImage src={profileUser.image || ''} />
            <AvatarFallback>{profileUser.name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Award className="h-8 w-8 text-primary" />
              {isOwnProfile ? 'Your Badges' : `${profileUser.name}'s Badges`}
            </h1>
            <p className="text-muted-foreground mt-1">
              {earned.length} of {allBadges?.length || 0} badges earned
            </p>
          </div>
        </div>

        {/* Progress Display */}
        <div className="text-right flex flex-col items-center sm:items-end gap-2">
           <div className="flex items-baseline gap-1">
             <span className="text-4xl font-black text-primary">{earned.length}</span>
             <span className="text-muted-foreground font-medium">earned</span>
           </div>
           <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
             <div
               className="h-full bg-primary transition-all duration-500"
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
        <div className="space-y-12">
          {/* Earned Badges */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              Earned Badges <Badge>{earned.length}</Badge>
            </h2>

            {earned.length === 0 ? (
              <Card className="bg-muted/30">
                <CardContent className="py-16 text-center">
                  <Award className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground text-lg">
                    {isOwnProfile
                      ? 'You haven\'t earned any badges yet. Start contributing to the community!'
                      : 'This user has not earned any badges yet.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {earned.map((badge: any) => (
                  <Card key={badge.id} className="border-primary/20 hover:border-primary/40 transition-colors shadow-sm overflow-hidden group">
                    <CardContent className="flex flex-col items-center p-8 text-center relative">
                      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">{badge.icon}</div>
                      <h3 className="text-lg font-bold">{badge.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {badge.description}
                      </p>
                      <Badge variant="secondary" className="mt-4">{badge.rarity || 'Common'}</Badge>
                      {badge.awardedAt && (
                         <p className="mt-4 text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium">
                           Earned {format(new Date(badge.awardedAt), 'MMM d, yyyy')}
                         </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Unearned Badges */}
          {unearned.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-xl font-bold text-muted-foreground flex items-center gap-2">
                Available Badges <Badge variant="outline">{unearned.length}</Badge>
              </h2>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {unearned.map((badge: any) => (
                  <Card key={badge.id} className="opacity-60 bg-muted/20 grayscale-0 border-dashed">
                    <CardContent className="flex flex-col items-center p-8 text-center">
                      <div className="text-5xl mb-4 grayscale pointer-events-none">{badge.icon}</div>
                      <h3 className="text-lg font-bold text-muted-foreground">{badge.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground/80 line-clamp-2">
                        {badge.description}
                      </p>
                      <Badge variant="outline" className="mt-4">{badge.rarity || 'Common'}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}