import { createFileRoute } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { MessageSquare, Reply, TrendingUp, Users, AlertCircle } from 'lucide-react'
import { trpc } from '~/lib/trpc'

import { adminMiddleware } from '~/server/auth-actions'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/_admin/admin-dashboard')({
  head: () => ({
    meta: [...seo({ title: 'Admin Dashboard - Foreum' })],
  }),
  component: AdminDashboard,
   server: {
    middleware: [adminMiddleware],
  },
})

function StatCard({ title, value, subtitle, icon: Icon, loading }: {
  title: string
  value: string
  subtitle?: string
  icon: any
  loading?: boolean
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="flex size-8 items-center justify-center rounded-md bg-muted">
          <Icon className="size-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  )
}

function AdminDashboard() {
  const { data: overview, isLoading: overviewLoading } = trpc.analytics.getOverview.useQuery();
  const { data: engagement } = trpc.analytics.getEngagement.useQuery();
  const { data: reportStats, isLoading: reportsLoading } = trpc.moderation.recentReports.useQuery(
    { limit: 5 }
  )
  const { data: topContributors } = trpc.analytics.getTopContributors.useQuery({ limit: 5 })

  const loading = overviewLoading || reportsLoading
  const recentReports = reportStats || []

  return (
    <div className="flex flex-1 flex-col gap-4 py-4 lg:gap-6 lg:py-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Welcome back, Admin!</h1>
          <p className="text-sm text-muted-foreground">
            Manage your community, users, and reports all in one place.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={overview ? overview.totalUsers.toLocaleString() : '—'}
          subtitle={overview ? `${overview.activeUsers} active` : undefined}
          icon={Users}
          loading={overviewLoading}
        />
        <StatCard
          title="Total Threads"
          value={overview ? overview.totalThreads.toLocaleString() : '—'}
          subtitle={overview ? `${overview.totalReplies} replies` : undefined}
          icon={MessageSquare}
          loading={overviewLoading}
        />
        <StatCard
          title="Pending Reports"
          value={recentReports.length.toString()}
          subtitle={reportStats ? 'awaiting review' : undefined}
          icon={AlertCircle}
          loading={reportsLoading}
        />
        <StatCard
          title="Engagement"
          value={engagement ? `${engagement.reactionRate}%` : '—'}
          subtitle={engagement ? `${engagement.avgRepliesPerThread} avg replies/thread` : undefined}
          icon={TrendingUp}
          loading={overviewLoading}
        />
      </div>

      <Tabs defaultValue="activity" className="flex flex-col gap-4">
        <TabsList>
          <TabsTrigger value="activity">Top Contributors</TabsTrigger>
          <TabsTrigger value="reports">Pending Reports ({recentReports.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Top Contributors</CardTitle>
              <CardDescription>Most active community members by content created</CardDescription>
            </CardHeader>
            <CardContent>
              {topContributors && topContributors.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {topContributors.map((c: any, i: number) => (
                    <div key={c.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground w-5">#{i + 1}</span>
                        <Avatar className="size-8">
                          <AvatarImage src={c.image} />
                          <AvatarFallback>{c.name?.charAt(0) ?? '?'}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{c.name}</span>
                          {c.username && (
                            <span className="text-xs text-muted-foreground">@{c.username}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MessageSquare className="size-3" />{c.threadCount}</span>
                        <span className="flex items-center gap-1"><Reply className="size-3" />{c.replyCount}</span>
                        <Badge variant="secondary">{c.total}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No contributors yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Pending Reports ({recentReports.length})</CardTitle>
              <CardDescription>User-reported content awaiting review</CardDescription>
            </CardHeader>
            <CardContent>
              {reportsLoading ? (
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12" />
                  ))}
                </div>
              ) : recentReports.length === 0 ? (
                <p className="text-sm text-muted-foreground">No pending reports</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {recentReports.map((report: any) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium">{report.reason}</p>
                        <p className="text-xs text-muted-foreground">
                          Reported by {report.reportedBy} •{' '}
                          {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={report.resolved ? 'secondary' : 'outline'}>
                        {report.resolved ? 'Resolved' : 'Pending'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}