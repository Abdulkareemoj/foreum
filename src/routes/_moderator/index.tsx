import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_moderator/")({
  component: ModeratorIndex,
});

function ModeratorIndex() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Moderator Center</h1>
        <p className="text-muted-foreground">
          Review reports, moderate content, and manage user actions for your
          community.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold">Reports</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            View pending reports, resolve issues, and keep discussions safe.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold">Moderation Logs</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Track moderator actions and review recent moderation history.
          </p>
        </div>
      </div>
    </div>
  );
}
