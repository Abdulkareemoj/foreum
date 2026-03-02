import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { RichTextEditor } from "~/components/ui/rich-text-editor";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { trpc } from "~/lib/trpc";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute(
  "/_client/threads/$threadId/reply/$replyId/edit",
)({
  component: EditReplyPage,
});

function EditReplyPage() {
  const { threadId, replyId } = Route.useParams();
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const { data: reply, isLoading } = trpc.reply.getById.useQuery({
    id: replyId,
  });
  const [content, setContent] = useState("");

  useEffect(() => {
    if (reply) {
      setContent(
        typeof reply.content === "string"
          ? reply.content
          : JSON.stringify(reply.content),
      );
    }
  }, [reply]);

  const updateReply = trpc.reply.update.useMutation({
    onSuccess: () => {
      toast.success("Reply updated successfully");
      utils.reply.getByThreadId.invalidate({ threadId });
      navigate({ to: "/thread/$id", params: { id: threadId } });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update reply");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content) {
      toast.error("Content is required");
      return;
    }

    updateReply.mutate({
      id: replyId,
      content,
    });
  };

  if (isLoading) {
    return <div className="container max-w-2xl py-6">Loading...</div>;
  }

  if (!reply) {
    return (
      <div className="container max-w-2xl py-6">
        <p>Reply not found</p>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-6 space-y-6">
      <Button
        variant="ghost"
        onClick={() =>
          navigate({ to: "/thread/$id", params: { id: threadId } })
        }
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Thread
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Reply</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Write your reply..."
                disabled={updateReply.isPending}
                showCharacterCount={true}
                maxLength={2000}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  navigate({ to: "/thread/$id", params: { id: threadId } })
                }
                disabled={updateReply.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateReply.isPending}>
                {updateReply.isPending ? "Updating..." : "Update Reply"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
