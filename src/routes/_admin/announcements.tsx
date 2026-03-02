import { createFileRoute } from "@tanstack/react-router";
import { CardContent, CardHeader, CardTitle, Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import { Plus, Speaker } from "lucide-react";
export const Route = createFileRoute("/_admin/announcements")({
  component: AdminAnnouncements,
});

function AdminAnnouncements() {
  let announcements = [
    {
      id: 1,
      title: "Welcome to Foreum Admin!",
      content: "Check out the new dashboard.",
      active: true,
    },
    {
      id: 2,
      title: "Maintenance Scheduled",
      content: "Server downtime next Tuesday.",
      active: false,
    },
  ];
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Announcements</h1>
        <Button>
          <Plus className="mr-2 size-4" /> New Announcement
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Manage global messages displayed to all users.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Speaker className="size-5" /> Active Announcements
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          {announcements.map((ann) => (
            <div className="flex items-center justify-between py-4">
              <div className="space-y-1">
                <p className="font-medium">{ann.title}</p>
                <p className="text-sm text-muted-foreground">{ann.content}</p>
              </div>
              <Switch checked={ann.active} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create New</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Title" />
          <Textarea placeholder="Content" rows={3} />
          <div className="flex justify-end">
            <Button>Publish</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
