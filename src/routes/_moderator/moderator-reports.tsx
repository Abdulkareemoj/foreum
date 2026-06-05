import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { trpc } from "~/lib/trpc";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { DataTable } from "~/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { seo } from '~/utils/seo'

export const Route = createFileRoute("/_moderator/moderator-reports")({
  head: () => ({
    meta: [...seo({ title: 'Moderation Reports - Foreum' })],
  }),
  component: ModeratorReports,
});

interface Report {
  id: string
  type: string
  reason: string
  reportedBy: {
    id: string;
    name: string | null;
    image: string | null;
  } | null
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
        const reportedBy = row.getValue("reportedBy") as Report["reportedBy"];
        return <span>{reportedBy?.name || "Anonymous"}</span>;
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

function ModeratorReports() {
  const [activeTab, setActiveTab] = useState<"pending" | "resolved">("pending");
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const utils = trpc.useUtils();

  const {
    data: reports = [],
    isLoading,
  } = trpc.moderation.listReports.useQuery({
    resolved: activeTab === "resolved",
    limit: 50,
  });

  const resolveReportMutation = trpc.moderation.resolveReport.useMutation({
    onSuccess: () => {
      utils.moderation.listReports.invalidate();
      utils.moderation.getStats.invalidate();
      setResolvingId(null);
    },
    onError: () => {
      setResolvingId(null);
    },
  });

  const { data: stats } = trpc.moderation.getStats.useQuery();

  const handleResolveReport = (reportId: string) => {
    setResolvingId(reportId);
    resolveReportMutation.mutate({ reportId });
  };

  const pendingCount = stats?.pendingReports || 0;
  const resolvedCount = (stats?.totalReports || 0) - pendingCount;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Reports</h1>
        <p className="text-sm text-muted-foreground">
          Review and resolve user reports from across the community.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Reports</CardTitle>
            <CheckCircle className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedCount}</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <AlertCircle className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalReports || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "pending" | "resolved")}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({resolvedCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-12 w-full bg-muted animate-pulse rounded" />
                  ))}
                </div>
              ) : (
                <DataTable 
                  columns={getColumns(handleResolveReport, resolvingId, true)} 
                  data={reports} 
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved">
          <Card>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-12 w-full bg-muted animate-pulse rounded" />
                  ))}
                </div>
              ) : (
                <DataTable 
                  columns={getColumns(handleResolveReport, resolvingId, false)} 
                  data={reports} 
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
