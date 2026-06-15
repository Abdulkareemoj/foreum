import { Button } from "~/components/ui/button";
import { Save } from "lucide-react";
import { Spinner } from "~/components/ui/spinner";
import { useNavigate } from "@tanstack/react-router";
import { useSession } from "~/lib/auth-client";
import { trpc } from "~/lib/trpc";
import { useThemeData } from "~/providers/theme-data-provider";
import { toast } from "sonner";

export function SaveToAccountButton() {
  const navigate = useNavigate();
  const { data: session } = useSession();
  const { theme, themeName } = useThemeData();
  const createPreset = trpc.theme.createPreset.useMutation({
    onSuccess: (data) => {
      toast.success("Theme saved to your account");
      navigate({ to: `/themes/${data.id}/edit` });
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSave = () => {
    if (!theme) return;
    createPreset.mutate({
      name: themeName || "Untitled Theme",
      data: { ...theme, name: themeName || "Untitled Theme" },
    });
  };

  if (!session?.user) {
    return (
      <Button
        onClick={() => navigate({ to: "/sign-in" })}
        variant="outline"
        size="sm"
        title="Sign in to save theme"
      >
        <Save />
        Sign In to Save
      </Button>
    );
  }

  return (
    <Button
      onClick={handleSave}
      disabled={createPreset.isPending}
      variant="outline"
      size="sm"
      title="Save theme to your account"
    >
      {createPreset.isPending ? <Spinner /> : <Save />}
      {createPreset.isPending ? "Saving..." : "Save to Account"}
    </Button>
  );
}
