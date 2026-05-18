import { createFileRoute } from "@tanstack/react-router";
import { CardContent, CardHeader, CardTitle, Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import { Speaker } from "lucide-react";
import { useState } from "react";
import { trpc } from "~/lib/trpc";
import { toast } from "sonner";
import { RichTextEditor } from "~/components/ui/rich-text-editor";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";

export const Route = createFileRoute("/_admin/announcements")({
  component: AdminAnnouncements,
});

function AdminAnnouncements() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  const utils = trpc.useUtils();

  const { data: announcements, isLoading } = trpc.announcement.list.useQuery();

  const createAnnouncement = trpc.announcement.create.useMutation({
    onSuccess: () => {
      toast.success("Announcement published");
      setTitle("");
      setContent("");
      utils.announcement.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to publish announcement");
    },
  });

  const toggleActive = trpc.announcement.toggleActive.useMutation({
    onSuccess: () => {
      toast.success("Status updated");
      utils.announcement.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update status");
    },
  });

  const handlePublish = () => {
    if (!title || !content) {
      toast.error("Please fill in all fields");
      return;
    }
    createAnnouncement.mutate({
      title,
      content,
    });
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Announcements</h1>
          <p className="text-sm text-muted-foreground">
            Manage global messages displayed to all users.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Speaker className="size-5" /> Active Announcements
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          {isLoading ? (
            <p className="text-sm text-muted-foreground py-4">Loading announcements...</p>
          ) : !announcements || announcements.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No announcements found.</p>
          ) : (
            announcements.map((ann) => (
              <div key={ann.id} className="flex items-center justify-between py-4">
                <div className="flex flex-col gap-1">
                  <p className="font-medium">{ann.title}</p>
                  <div 
                    className="text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: ann.content }}
                  />
                </div>
                <Switch 
                  checked={ann.active} 
                  onCheckedChange={(checked) => {
                    toggleActive.mutate({ id: ann.id, active: checked });
                  }}
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create New Announcement</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input 
                id="title" 
                placeholder="Announcement Title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Field>
            
            <Field>
              <FieldLabel htmlFor="content">Content</FieldLabel>
              <RichTextEditor 
                id="content" 
                placeholder="Write your announcement here..." 
                value={content}
                onChange={setContent}
                disabled={createAnnouncement.isPending}
              />
            </Field>

            <div className="flex justify-end mt-4">
              <Button onClick={handlePublish} disabled={createAnnouncement.isPending}>
                {createAnnouncement.isPending ? "Publishing..." : "Publish"}
              </Button>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
}
