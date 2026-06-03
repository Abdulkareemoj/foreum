import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Skeleton } from '~/components/ui/skeleton'
import { Badge } from '~/components/ui/badge'
import { ListChecks, AlertCircle, Loader2 } from 'lucide-react'
import { trpc } from '~/lib/trpc'
import { toast } from 'sonner'
import { DataTable } from '~/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'

export const Route = createFileRoute('/_admin/reports-summary')({
  component: AdminReports,
})

interface Report {
  id: string
  type: string
  reason: string
  reportedBy: string | null
  createdAt: Date | null
}

const getColumns = (
  onResolve: (id: string) => void, 
  resolvingId: string | null, 
  isPending: boolean
): ColumnDef<Report>[] => {
  const cols: ColumnDef<Report>[] = [
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        return <Badge variant="secondary" className="capitalize">{type}</Badge>;
      },
    },
    {
      accessorKey: "reason",
      header: "Reason",
    },
    {
      accessorKey: "reportedBy",
      header: "Reported By",
      cell: ({ row }) => {
        const reportedBy = row.getValue("reportedBy") as string;
        return <span>{reportedBy || "Anonymous"}</span>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as Date;
        return <span className="text-muted-foreground">{date ? new Date(date).toLocaleDateString() : "No date"}</span>;
      },
    },
  ];

  if (isPending) {
    cols.push({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const report = row.original;
        return (
          <Button
            size="sm"
            disabled={resolvingId !== null}
            onClick={() => onResolve(report.id)}
          >
            {resolvingId === report.id ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              'Resolve'
            )}
          </Button>
        );
      },
    });
  }

  return cols;
};

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
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Content Reports</h1>
        <p className="text-sm text-muted-foreground">
          Manage user-submitted reports on threads and replies.
        </p>
      </div>

      {pendingError && !isLoading && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="flex items-center gap-3 py-6">
            <AlertCircle className="size-5 text-destructive" />
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
                <ListChecks className="size-5" /> Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <DataTable 
                  columns={getColumns(handleResolveReport, resolvingId, true)} 
                  data={pendingReports} 
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="size-5" /> Resolved
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <DataTable 
                  columns={getColumns(handleResolveReport, resolvingId, false)} 
                  data={resolvedReports} 
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}