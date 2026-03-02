import { createFileRoute } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Skeleton } from '~/components/ui/skeleton'
import { MessageSquare, Users, TrendingUp, AlertCircle } from 'lucide-react'
import { trpc } from '~/lib/trpc'
import type { LucideIcon } from 'lucide-react'

import { adminMiddleware } from '~/utils/middleware'

export const Route = createFileRoute('/_admin/dashboard')({
  component: AdminDashboard,
   server: {
    middleware: [adminMiddleware],
  },
})

interface Stats {
  title: string
  value: string
  change: { value: string; trend: 'up' | 'down' }
  icon: LucideIcon
}

function AdminDashboard() {
  const { data: userStats, isLoading: userStatsLoading } = trpc.user.stats.useQuery()
  const { data: reportStats, isLoading: reportsLoading } = trpc.moderation.recentReports.useQuery(
    { limit: 5 }
  )

  const isLoading = userStatsLoading || reportsLoading

  const stats: Stats[] = [
    {
      title: 'Total Users',
      value: userStats?.totalUsers?.toString() || '0',
      change: {
        value: `${userStats?.monthlyGrowth || 0}%`,
        trend: (userStats?.monthlyGrowth || 0) > 0 ? 'up' : 'down',
      },
      icon: Users,
    },
    {
      title: 'Active Threads',
      value: userStats?.activeThreads?.toString() || '0',
      change: { value: '+1.1%', trend: 'up' },
      icon: MessageSquare,
    },
    {
      title: 'Pending Reports',
      value: reportStats?.length?.toString() || '0',
      change: {
        value: reportStats && reportStats.length > 0 ? '-0%' : '↓',
        trend: 'down',
      },
      icon: AlertCircle,
    },
    {
      title: 'Engagement Score',
      value: userStats?.engagementScore?.toFixed(0) + '%' || '0%',
      change: { value: '+0.5%', trend: 'up' },
      icon: TrendingUp,
    },
  ]

  const recentReports = reportStats || []

  return (
   
    <div className="flex flex-1 flex-col gap-4 py-4 lg:gap-6 lg:py-6">
      {/* Page intro */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Welcome back, Admin!</h1>
          <p className="text-sm text-muted-foreground">
            Manage your community, users, and reports all in one place.
          </p>
        </div>
        <Button className="px-3">Quick Action</Button>
      </div>

      {/* Stats */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span
                      className={
                        stat.change.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }
                    >
                      {stat.change.value}
                    </span>{' '}
                    from last month
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="reports">Pending Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest user activity and community engagement</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12" />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Activity feed coming soon</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Pending Reports ({recentReports?.length || 0})</CardTitle>
              <CardDescription>User-reported content awaiting review</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12" />
                  ))}
                </div>
              ) : recentReports.length === 0 ? (
                <p className="text-sm text-muted-foreground">No pending reports</p>
              ) : (
                <div className="space-y-3">
                  {recentReports.map((report: any) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{report.reason}</p>
                        <p className="text-xs text-muted-foreground">
                          Reported by {report.reportedBy} •{' '}
                          {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
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