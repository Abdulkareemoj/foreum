import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { RichTextEditor } from "~/components/ui/rich-text-editor";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { trpc } from "~/lib/trpc";
import { toast } from "sonner";
import { ArrowLeft, Users } from "lucide-react";

export const Route = createFileRoute("/_client/groups/new")({
  component: CreateGroupPage,
});

function CreateGroupPage() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);

  const createGroup = trpc.groups.create.useMutation({
    onSuccess: (data) => {
      toast.success("Group created successfully");
      utils.groups.list.invalidate();
      navigate({ to: "/groups/$slug", params: { slug: data.slug } });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create group");
    },
  });

  const handleNameChange = (value: string) => {
    setName(value);
    if (autoSlug) {
      // Auto-generate slug from name
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(generatedSlug);
    }
  };

  const handleSlugChange = (value: string) => {
    setAutoSlug(false);
    setSlug(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Group name is required");
      return;
    }

    if (!slug.trim()) {
      toast.error("Group slug is required");
      return;
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      toast.error(
        "Slug can only contain lowercase letters, numbers, and hyphens",
      );
      return;
    }

    createGroup.mutate({
      name: name.trim(),
      slug: slug.trim(),
      description: description || undefined,
    });
  };

  return (
    <div className="container max-w-2xl py-6 space-y-6">
      <Button variant="ghost" onClick={() => navigate({ to: "/groups" })}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Groups
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Create New Group
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Group Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter group name"
                disabled={createGroup.isPending}
                maxLength={100}
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">
                Group Slug *{" "}
                <span className="text-xs text-muted-foreground">(URL)</span>
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">/groups/</span>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="group-slug"
                  disabled={createGroup.isPending}
                  maxLength={100}
                  pattern="[a-z0-9-]+"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Only lowercase letters, numbers, and hyphens allowed
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <RichTextEditor
                value={description}
                onChange={setDescription}
                placeholder="Describe what your group is about..."
                disabled={createGroup.isPending}
                showCharacterCount={true}
                maxLength={1000}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate({ to: "/groups" })}
                disabled={createGroup.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createGroup.isPending}>
                {createGroup.isPending ? "Creating..." : "Create Group"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
