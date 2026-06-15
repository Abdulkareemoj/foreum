import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Trash2 } from "lucide-react";
import { trpc } from "~/lib/trpc";
import { toast } from "sonner";

export function DeleteThemeDialog({ id }: { id: string }) {
  const [open, setOpen] = React.useState(false);
  const [typed, setTyped] = React.useState("");

  const { data: preset } = trpc.theme.getPreset.useQuery({ id });
  const utils = trpc.useUtils();
  const deletePreset = trpc.theme.deletePreset.useMutation({
    onSuccess: () => {
      utils.theme.listPresets.invalidate();
      toast.success("Theme deleted");
      setOpen(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const themeName = preset?.name ?? "";
  const canDelete = themeName.length > 0 && typed.trim() === themeName;

  React.useEffect(() => {
    if (!open) setTyped("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label="Delete theme"
          className="px-2"
        >
          <Trash2 className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this theme?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the theme
            and remove any stars. To confirm, type the theme name exactly.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <div className="text-sm">
            Type "<span className="font-semibold">{themeName}</span>" to confirm
          </div>
          <Input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder={themeName ? `Type "${themeName}"` : "Loading name..."}
            disabled={deletePreset.isPending || themeName.length === 0}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (canDelete && !deletePreset.isPending) {
                  deletePreset.mutate({ id });
                }
              }
            }}
          />
          {deletePreset.isError ? (
            <div className="text-xs text-destructive" role="status">
              {deletePreset.error?.message || "Failed to delete"}
            </div>
          ) : null}
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOpen(false)}
            disabled={deletePreset.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => deletePreset.mutate({ id })}
            disabled={!canDelete || deletePreset.isPending}
          >
            {deletePreset.isPending ? "Deleting..." : "Delete theme"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
