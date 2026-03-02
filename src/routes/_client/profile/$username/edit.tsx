import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { RichTextEditor } from "~/components/ui/rich-text-editor";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { ArrowLeft, User } from "lucide-react";
import { trpc } from "~/lib/trpc";
import { toast } from "sonner";
import { useSession } from "~/lib/auth-client";
import { redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_client/profile/$username/edit")({
  component: EditProfilePage,
});

function EditProfilePage() {
  const { username } = Route.useParams();
  const navigate = useNavigate();
  const { data: session } = useSession();
  const utils = trpc.useUtils();

  const { data: profileUser, isLoading } = trpc.user.byUsername.useQuery({
    username,
  });

  const [name, setName] = useState("");
  const [usernameVal, setUsernameVal] = useState("");
  const [image, setImage] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(() => {
    if (profileUser) {
      setName(profileUser.name || "");
      setUsernameVal(profileUser.username || "");
      setImage(profileUser.image || "");
      setBio(profileUser.bio || "");
      setLocation(profileUser.location || "");
      setWebsite(profileUser.website || "");
    }
  }, [profileUser]);

  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully");
      utils.user.byUsername.invalidate({ username });
      navigate({
        to: "/profile/$username",
        params: { username: usernameVal },
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

  // Guard: only own profile
  if (!isLoading && session?.user?.id !== profileUser?.id) {
    navigate({ to: "/profile/$username", params: { username } });
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!usernameVal.trim()) {
      toast.error("Username is required");
      return;
    }

    if (!/^[a-z0-9_-]+$/.test(usernameVal)) {
      toast.error(
        "Username can only contain lowercase letters, numbers, _ and -",
      );
      return;
    }

    updateProfile.mutate({
      name: name.trim(),
      username: usernameVal.trim().toLowerCase(),
      image: image.trim() || undefined,
      bio: bio || undefined,
      location: location.trim() || undefined,
      website: website.trim() || undefined,
    });
  };

  if (isLoading) {
    return <div className="container max-w-2xl py-6">Loading...</div>;
  }

  return (
    <div className="container max-w-2xl py-6 space-y-6">
      <Button
        variant="ghost"
        onClick={() =>
          navigate({ to: "/profile/$username", params: { username } })
        }
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Profile
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Preview */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={image} />
                <AvatarFallback className="text-2xl">
                  {name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Label htmlFor="image">Avatar URL</Label>
                <Input
                  id="image"
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  disabled={updateProfile.isPending}
                />
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Display Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your display name"
                disabled={updateProfile.isPending}
                maxLength={100}
              />
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">@</span>
                <Input
                  id="username"
                  value={usernameVal}
                  onChange={(e) => setUsernameVal(e.target.value.toLowerCase())}
                  placeholder="username"
                  disabled={updateProfile.isPending}
                  maxLength={30}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Only lowercase letters, numbers, underscores, and hyphens
              </p>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <RichTextEditor
                value={bio}
                onChange={setBio}
                placeholder="Tell community about yourself..."
                disabled={updateProfile.isPending}
                showCharacterCount={true}
                maxLength={500}
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
                disabled={updateProfile.isPending}
                maxLength={100}
              />
            </div>

            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourwebsite.com"
                disabled={updateProfile.isPending}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  navigate({ to: "/profile/$username", params: { username } })
                }
                disabled={updateProfile.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
