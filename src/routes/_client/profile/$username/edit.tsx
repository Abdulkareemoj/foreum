import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { RichTextEditor } from "~/components/ui/rich-text-editor";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Spinner } from "~/components/ui/spinner";
import { ArrowLeft, User, Save } from "lucide-react";
import { trpc } from "~/lib/trpc";
import { toast } from "sonner";
import { useSession } from "~/lib/auth-client";
import { useProfileStore } from "~/stores/profile-store";
import { FieldGroup, Field, FieldLabel, FieldDescription } from "~/components/ui/field";

export const Route = createFileRoute("/_client/profile/$username/edit")({
  component: EditProfilePage,
});

function EditProfilePage() {
  const { username } = Route.useParams();
  const navigate = useNavigate();
  const { data: session, isPending: sessionLoading } = useSession();
  const utils = trpc.useUtils();
  const { profileUser, formData, setFormField, setProfileUser, initializeForm } = useProfileStore();

  const { data: fetchedUser, isLoading: fetching } = trpc.user.byUsername.useQuery({ username });

  useEffect(() => {
    if (!fetchedUser) return;
    setProfileUser(fetchedUser);
    initializeForm();
  }, [fetchedUser, setProfileUser, initializeForm]);

  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully");
      utils.user.byUsername.invalidate({ username });
      navigate({
        to: "/profile/$username",
        params: { username: formData.username },
      });
    },
    onError: (error) => {
      if (error.message?.includes("Username already taken")) {
        toast.error("This username is already in use");
      } else {
        toast.error(error.message || "Failed to update profile");
      }
    },
  });

  // Guard: only own profile (wait for session to load first)
  if (!fetching && !sessionLoading && profileUser && session?.user?.id !== profileUser.id) {
    navigate({ to: "/profile/$username", params: { username } });
    return null;
  }

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.username.trim()) {
      toast.error("Username is required");
      return;
    }
    if (!/^[a-z0-9_-]+$/.test(formData.username)) {
      toast.error("Username can only contain lowercase letters, numbers, _ and -");
      return;
    }
    updateProfile.mutate({
      name: formData.name.trim(),
      username: formData.username.trim().toLowerCase(),
      image: formData.image.trim() || undefined,
      bio: formData.bio || undefined,
      location: formData.location.trim() || undefined,
      website: formData.website.trim() || undefined,
    });
  };

  if (fetching || sessionLoading) {
    return (
      <div className="container flex max-w-2xl items-center justify-center py-20">
        <Spinner className="size-5" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6">
      <Button
        variant="ghost"
        className="w-fit self-start"
        onClick={() =>
          navigate({ to: "/profile/$username", params: { username } })
        }
      >
        <ArrowLeft data-icon="inline-start" />
        Back to Profile
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="size-5" />
            Edit Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            {/* Avatar */}
            <Field>
              <FieldLabel htmlFor="image">Avatar</FieldLabel>
              <div className="flex items-center gap-4">
                <Avatar className="size-16">
                  <AvatarImage src={formData.image} />
                  <AvatarFallback className="text-xl">
                    {formData.name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <Input
                  id="image"
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormField("image", e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  disabled={updateProfile.isPending}
                />
              </div>
            </Field>

            {/* Name */}
            <Field>
              <FieldLabel htmlFor="name">Display Name *</FieldLabel>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormField("name", e.target.value)}
                placeholder="Your display name"
                disabled={updateProfile.isPending}
                maxLength={100}
              />
            </Field>

            {/* Username */}
            <Field>
              <FieldLabel htmlFor="username">Username *</FieldLabel>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">@</span>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormField("username", e.target.value.toLowerCase())
                  }
                  placeholder="username"
                  disabled={updateProfile.isPending}
                  maxLength={30}
                />
              </div>
              <FieldDescription>
                Only lowercase letters, numbers, underscores, and hyphens
              </FieldDescription>
            </Field>

            {/* Bio */}
            <Field>
              <FieldLabel>Bio</FieldLabel>
              <RichTextEditor
                value={formData.bio}
                onChange={(v) => setFormField("bio", v)}
                placeholder="Tell the community about yourself..."
                disabled={updateProfile.isPending}
                showCharacterCount
                maxLength={500}
              />
            </Field>

            {/* Location */}
            <Field>
              <FieldLabel htmlFor="location">Location</FieldLabel>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormField("location", e.target.value)}
                placeholder="City, Country"
                disabled={updateProfile.isPending}
                maxLength={100}
              />
            </Field>

            {/* Website */}
            <Field>
              <FieldLabel htmlFor="website">Website</FieldLabel>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormField("website", e.target.value)}
                placeholder="https://yourwebsite.com"
                disabled={updateProfile.isPending}
              />
            </Field>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                onClick={() =>
                  navigate({ to: "/profile/$username", params: { username } })
                }
                disabled={updateProfile.isPending}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={updateProfile.isPending}>
                {updateProfile.isPending ? (
                  <Spinner data-icon="inline-start" />
                ) : (
                  <Save data-icon="inline-start" />
                )}
                Save Changes
              </Button>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
}
