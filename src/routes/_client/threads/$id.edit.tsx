import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { RichTextEditor } from "~/components/ui/rich-text-editor";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { trpc } from "~/lib/trpc";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_client/threads/$id/edit")({
  component: EditThreadPage,
});

function EditThreadPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const { data: thread, isLoading } = trpc.thread.getById.useQuery({ id });
  const { data: categories } = trpc.category.list.useQuery();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    if (thread) {
      setTitle(thread.title);
      setContent(
        typeof thread.content === "string"
          ? thread.content
          : JSON.stringify(thread.content),
      );
      setCategoryId(thread.category?.id || "");
    }
  }, [thread]);

  const updateThread = trpc.thread.update.useMutation({
    onSuccess: () => {
      toast.success("Thread updated successfully");
      utils.thread.getById.invalidate({ id });
      navigate({ to: "/thread/$id", params: { id } });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update thread");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!content) {
      toast.error("Content is required");
      return;
    }

    updateThread.mutate({
      id,
      title: title.trim(),
      content,
      categoryId: categoryId || undefined,
    });
  };

  if (isLoading) {
    return <div className="container max-w-2xl py-6">Loading...</div>;
  }

  if (!thread) {
    return (
      <div className="container max-w-2xl py-6">
        <p>Thread not found</p>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-6 space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: "/thread/$id", params: { id } })}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Thread
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Thread</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter thread title"
                disabled={updateThread.isPending}
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Write your content..."
                disabled={updateThread.isPending}
                showCharacterCount={true}
                maxLength={5000}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate({ to: "/thread/$id", params: { id } })}
                disabled={updateThread.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateThread.isPending}>
                {updateThread.isPending ? "Updating..." : "Update Thread"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
