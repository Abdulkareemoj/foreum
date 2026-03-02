import { useState } from "react";
import { Button } from "~/components/ui/button";
import { RichTextEditor } from "~/components/ui/rich-text-editor";
import { Card, CardContent } from "~/components/ui/card";
import { trpc } from "~/lib/trpc";
import { toast } from "sonner";

interface ReplyFormProps {
  threadId: string;
  parentReplyId?: string;
  onSuccess?: () => void;
  placeholder?: string;
}

export default function ReplyForm({
  threadId,
  parentReplyId,
  onSuccess,
  placeholder = "Write your reply...",
}: ReplyFormProps) {
  const [content, setContent] = useState("");
  const utils = trpc.useUtils();

  const createReply = trpc.reply.create.useMutation({
    onSuccess: () => {
      toast.success("Reply posted");
      setContent("");
      utils.reply.list.invalidate({ threadId });
      utils.thread.getById.invalidate({ id: threadId });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to post reply");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content) {
      toast.error("Reply cannot be empty");
      return;
    }

    createReply.mutate({
      threadId,
      content,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder={placeholder}
            disabled={createReply.isPending}
            showCharacterCount={true}
            maxLength={2000}
          />

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {onSuccess && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onSuccess}
                  disabled={createReply.isPending}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={createReply.isPending || !content}
              >
                {createReply.isPending ? "Posting..." : "Post Reply"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
