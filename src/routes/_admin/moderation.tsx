import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { History } from 'lucide-react';
import { trpc } from '~/lib/trpc';
import { DataTable } from '~/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';

export const Route = createFileRoute('/_admin/moderation')({
  component: AdminModeration,
})

type AuditLog = {
  id: string;
  action: string;
  reason: string | null;
  createdAt: Date | null;
  performedBy: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
}

const columns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const action = row.getValue("action") as string;
      return <span className="font-medium">{action}</span>;
    },
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => {
      const reason = row.getValue("reason") as string;
      return <span className="text-muted-foreground">{reason || "No reason provided"}</span>;
    },
  },
  {
    accessorKey: "performedBy",
    header: "Moderator",
    cell: ({ row }) => {
      const performedBy = row.getValue("performedBy") as AuditLog["performedBy"];
      return <span>{performedBy?.name || "Unknown"}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return <span className="text-muted-foreground">{date ? new Date(date).toLocaleString() : "N/A"}</span>;
    },
  },
];

function AdminModeration() {
  const { data: logs, isLoading } = trpc.moderation.listAuditLogs.useQuery({ limit: 50 });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Moderation Logs</h1>
        <p className="text-sm text-muted-foreground">
          Review all actions taken by administrators and moderators.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="size-5" /> Recent Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading logs...</p>
          ) : (
            <DataTable columns={columns} data={logs || []} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
