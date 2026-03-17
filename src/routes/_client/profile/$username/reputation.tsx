import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Skeleton } from '~/components/ui/skeleton'
import { TrendingUp } from 'lucide-react'
import { trpc } from '~/lib/trpc'

export const Route = createFileRoute('/_client/profile/$username/reputation')({
  component: ReputationPage,
})

function ReputationPage() {
  const { username } = Route.useParams()
  const { data: user } = trpc.user.byUsername.useQuery({ username })
  const { data: reputationData, isLoading, error } = trpc.reputation.getReputation.useQuery(
    { userId: user?.id || '' },
    { enabled: !!user?.id }
  )
  const { data: badges } = trpc.reputation.listBadges.useQuery()

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl space-y-8 px-4 py-12">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (error || !reputationData) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">Failed to load reputation data</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-8 px-4 py-12">
      <div>
        <h1 className="text-3xl font-bold">Reputation & Badges</h1>
        <p className="mt-2 text-muted-foreground">
          Earn reputation points and badges by contributing to the community.
        </p>
      </div>

      {/* Reputation Score Card */}
      <Card className="border-2 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-primary">{reputationData.points ?? 0}</div>
            <p className="mt-2 text-sm text-muted-foreground">Total Reputation Points</p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-semibold">{reputationData.upvotes ?? 0}</div>
                <p className="text-xs text-muted-foreground">Upvotes Received</p>
              </div>
              <div>
                <div className="text-2xl font-semibold">{reputationData.acceptedAnswers ?? 0}</div>
                <p className="text-xs text-muted-foreground">Accepted Answers</p>
              </div>
              <div>
                <div className="text-2xl font-semibold">{reputationData.helpfulMarks ?? 0}</div>
                <p className="text-xs text-muted-foreground">Helpful Marks</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Badges Earned</h2>
        {reputationData.badges && reputationData.badges.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reputationData.badges.map((badge: any) => (
              <Card key={badge.id} className="text-center">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="text-5xl">{badge.icon}</div>
                  <h3 className="mt-3 font-semibold">{badge.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{badge.description}</p>
                  <Badge variant="secondary" className="mt-3">{badge.rarity || 'Common'}</Badge>
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

      {/* Available Badges */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Available Badges</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {badges?.map((badge: any) => (
            <Card key={badge.id} className="opacity-75">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="text-4xl grayscale">{badge.icon}</div>
                <h3 className="mt-3 text-center font-semibold">{badge.name}</h3>
                <p className="mt-1 text-center text-sm text-muted-foreground line-clamp-2">{badge.description}</p>
                <Badge variant="outline" className="mt-3">{badge.rarity || 'Common'}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* How to Earn */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> How to Earn Reputation
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 font-bold text-green-600">+10</span>
              <span className="text-muted-foreground">Receive an upvote on your thread or reply</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 font-bold text-green-600">+25</span>
              <span className="text-muted-foreground">Your answer is marked as helpful</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 font-bold text-green-600">+50</span>
              <span className="text-muted-foreground">Your answer is accepted as the solution</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 font-bold text-destructive">-5</span>
              <span className="text-muted-foreground">You receive a downvote</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}