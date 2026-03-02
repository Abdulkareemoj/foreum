import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Skeleton } from '~/components/ui/skeleton'
import { Star, TrendingUp, Award } from 'lucide-react'
import { trpc } from '~/lib/trpc'

export const Route = createFileRoute('/_client/reputation')({
  component: ReputationPage,
})

const REPUTATION_RULES = [
  { points: '+10', action: 'Receive an upvote on your thread or reply' },
  { points: '+25', action: 'Your answer is marked as helpful' },
  { points: '+50', action: 'Your answer is accepted as the solution' },
  { points: '-5', action: 'You receive a downvote' },
]

function ReputationPage() {
  const { data, isLoading, error } = trpc.reputation.getReputation.useQuery()
  const { data: allBadges, isLoading: badgesLoading } = trpc.reputation.listBadges.useQuery()

  const earnedBadgeIds = new Set(data?.badges?.map((b: any) => b.id) || [])

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Reputation & Badges</h1>
        <p className="mt-2 text-muted-foreground">
          Earn reputation points and badges by contributing to the community.
        </p>
      </div>

      {/* Error */}
      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">Failed to load reputation data</p>
          </CardContent>
        </Card>
      )}

      {/* Reputation Score Card */}
      {isLoading ? (
        <Skeleton className="h-40" />
      ) : data && (
        <Card className="border-2 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary">{data.points}</div>
              <p className="mt-2 text-sm text-muted-foreground">Total Reputation Points</p>

              <div className="mt-6 grid grid-cols-2 gap-4 max-w-xs mx-auto">
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-2xl font-semibold">
                    {data.badges?.length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Badges Earned</p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-2xl font-semibold">
                    {Math.floor(data.points / 100)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Level</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Earned Badges */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Award className="h-5 w-5" />
          Badges Earned
        </h2>
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        ) : data?.badges && data.badges.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.badges.map((badge: any) => (
              <Card key={badge.id} className="text-center border-primary/20">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="text-5xl">{badge.icon}</div>
                  <h3 className="mt-3 font-semibold">{badge.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{badge.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No badges earned yet. Keep contributing!
            </CardContent>
          </Card>
        )}
      </div>

      {/* All Available Badges */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Star className="h-5 w-5" />
          All Available Badges
        </h2>
        {badgesLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allBadges?.map((badge: any) => {
              const isEarned = earnedBadgeIds.has(badge.id)
              return (
                <Card
                  key={badge.id}
                  className={isEarned ? 'border-primary/20' : 'opacity-60'}
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <div className={isEarned ? 'text-5xl' : 'text-5xl grayscale'}>
                      {badge.icon}
                    </div>
                    <h3 className="mt-3 font-semibold text-center">{badge.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground text-center">
                      {badge.description}
                    </p>
                    {isEarned && (
                      <Badge className="mt-3">Earned</Badge>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* How to Earn */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-5 w-5" />
            How to Earn Reputation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {REPUTATION_RULES.map((rule) => (
              <li key={rule.points} className="flex items-center gap-3 text-sm">
                <span
                  className={`font-bold w-10 text-right flex-shrink-0 ${
                    rule.points.startsWith('+') ? 'text-green-600' : 'text-destructive'
                  }`}
                >
                  {rule.points}
                </span>
                <span className="text-muted-foreground">{rule.action}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}