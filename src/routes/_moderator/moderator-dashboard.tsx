import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { ListChecks, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react'
import { trpc } from '~/lib/trpc'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/_moderator/moderator-dashboard')({
  head: () => ({
    meta: [...seo({ title: 'Moderator Dashboard - Foreum' })],
  }),
  component: ModeratorDashboard,
})

function ModeratorDashboard() {
  const { data: stats } = trpc.moderation.getStats.useQuery()
  const { data: recentReports } = trpc.moderation.recentReports.useQuery({ limit: 5 })

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Moderator Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Quick access to community moderation tools and recent activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <AlertCircle className="size-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingReports ?? 0}</div>
            <p className="text-xs text-muted-foreground">Requiring review</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <ListChecks className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalReports ?? 0}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moderation Status</CardTitle>
            <ShieldCheck className="size-4 text-green-500" />
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="text-sm font-medium text-green-500">Active</div>
            <p className="text-xs text-muted-foreground">You have access to moderation tools.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for moderators.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button asChild variant="outline" className="justify-between w-full">
              <Link to="/reports">
                Review Reports
                <ArrowRight className="size-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between w-full">
              <Link to="/moderation">
                View Moderation Logs
                <ArrowRight className="size-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Latest items requiring attention.</CardDescription>
          </CardHeader>
          <CardContent className="divide-y">
            {!recentReports || recentReports.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">No recent reports.</p>
            ) : (
              recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">{report.reason}</p>
                    <p className="text-xs text-muted-foreground">Type: {report.type}</p>
                  </div>
                  <Button size="sm" variant="ghost" asChild>
                    <Link to="/reports">View</Link>
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
