import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Skeleton } from '~/components/ui/skeleton'
import { ListChecks, AlertCircle, Loader2 } from 'lucide-react'
import { trpc } from '~/lib/trpc'
import { toast } from 'sonner'

export const Route = createFileRoute('/_admin/reports')({
  component: AdminReports,
})

interface Report {
  id: string
  type: string
  reason: string
  reportedBy: string | null
  createdAt: Date | null
}

function AdminReports() {
  const [activeTab, setActiveTab] = useState('pending')
  const [resolvingId, setResolvingId] = useState<string | null>(null)

  const utils = trpc.useUtils()

  const {
    data: pendingReports = [],
    isLoading: pendingLoading,
    error: pendingError,
  } = trpc.moderation.recentReports.useQuery({ limit: 50, resolved: false })

  const {
    data: resolvedReports = [],
    isLoading: resolvedLoading,
  } = trpc.moderation.recentReports.useQuery({ limit: 50, resolved: true })

  const resolveReportMutation = trpc.moderation.resolveReport.useMutation({
    onSuccess: () => {
      toast.success('Report resolved successfully')
      // Invalidate both queries to refresh data
      utils.moderation.recentReports.invalidate()
      setResolvingId(null)
    },
    onError: (error) => {
      toast.error('Failed to resolve report')
      console.error('[Reports] Failed to resolve:', error)
      setResolvingId(null)
    },
  })

  const handleResolveReport = async (reportId: string) => {
    setResolvingId(reportId)
    resolveReportMutation.mutate({ reportId })
  }

  const isLoading = pendingLoading || resolvedLoading

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Content Reports</h1>
        <p className="text-sm text-muted-foreground">
          Manage user-submitted reports on threads and replies.
        </p>
      </div>

      {/* Error Display */}
      {pendingError && !isLoading && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="flex items-center gap-3 py-6">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <div>
              <p className="font-medium text-destructive">Failed to load reports</p>
              <p className="text-sm text-muted-foreground">{pendingError.message}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => utils.moderation.recentReports.invalidate()}
              className="ml-auto"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending ({pendingReports.length})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({resolvedReports.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5" /> Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              {isLoading ? (
                <div className="space-y-3 py-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  ))}
                </div>
              ) : pendingReports.length === 0 ? (
                <div className="py-4 text-sm text-muted-foreground">No pending reports.</div>
              ) : (
                pendingReports.map((report: Report) => (
                  <div key={report.id} className="flex items-center justify-between py-3">
                    <div className="space-y-1">
                      <p className="font-medium">
                        {report.type} Report: {report.reason}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Reported by: {report.reportedBy}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {report.createdAt
                          ? new Date(report.createdAt).toLocaleDateString()
                          : 'No date'}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      disabled={resolvingId !== null}
                      onClick={() => handleResolveReport(report.id)}
                    >
                      {resolvingId === report.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        'Resolve'
                      )}
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5" /> Resolved
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              {isLoading ? (
                <div className="space-y-3 py-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  ))}
                </div>
              ) : resolvedReports.length === 0 ? (
                <div className="py-4 text-sm text-muted-foreground">No resolved reports.</div>
              ) : (
                resolvedReports.map((report: Report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between py-3 text-muted-foreground"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">
                        {report.type} Report: {report.reason}
                      </p>
                      <p className="text-xs">Reported by: {report.reportedBy}</p>
                      <p className="text-xs">
                        {report.createdAt
                          ? new Date(report.createdAt).toLocaleDateString()
                          : 'No date'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}