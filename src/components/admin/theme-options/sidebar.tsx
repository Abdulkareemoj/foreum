import * as React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { ScrollArea } from "~/components/ui/scroll-area";
import type { ColorKey } from "~/lib/shadcnTheme";
import { getDefaultShadcnTheme } from "~/lib/shadcnTheme";
import { useThemeData } from "~/providers/theme-data-provider";
import {
  OklchColorPicker,
  parseOKLCH,
  toOKLCHString,
} from "./oklch-color-picker";
import { COLOR_EXAMPLE_MAP } from "~/lib/colorExampleMapping";
import { BorderRadiusEditor } from "./border-radius-editor";
import { FontEditor } from "./font-editor";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import { ChevronDownIcon } from "lucide-react";

const GROUPS: Array<{ id: string; title: string; keys: ColorKey[] }> = [
  { id: "base", title: "Base", keys: ["background", "foreground"] },
  {
    id: "surfaces",
    title: "Surfaces",
    keys: ["card", "card-foreground", "popover", "popover-foreground"],
  },
  { id: "brand", title: "Brand", keys: ["primary", "primary-foreground"] },
  {
    id: "accenting",
    title: "Accent & Secondary",
    keys: [
      "secondary",
      "secondary-foreground",
      "accent",
      "accent-foreground",
      "muted",
      "muted-foreground",
    ],
  },
  { id: "stateful", title: "Stateful & Feedback", keys: ["destructive"] },
  {
    id: "borders",
    title: "Borders & Focus",
    keys: ["border", "input", "ring"],
  },
  {
    id: "charts",
    title: "Charts",
    keys: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
  },
  {
    id: "sidebar",
    title: "Sidebar",
    keys: [
      "sidebar",
      "sidebar-foreground",
      "sidebar-primary",
      "sidebar-primary-foreground",
      "sidebar-accent",
      "sidebar-accent-foreground",
      "sidebar-border",
      "sidebar-ring",
    ],
  },
];

function ColorRow({
  keyName,
  onClick,
  value,
}: {
  keyName: ColorKey;
  value: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 py-2 px-2 cursor-pointer hover:bg-muted rounded-md text-left"
    >
      <div
        className="size-7 shrink-0 rounded-md border shadow"
        style={{ backgroundColor: value }}
      />
      <div className="min-w-0">
        <div
          className="text-sm font-medium text-muted-foreground truncate"
          title={keyName}
        >
          {keyName}
        </div>
        <div
          className="text-xs text-muted-foreground/40 truncate"
          title={value}
        >
          {value}
        </div>
      </div>
    </button>
  );
}

export function ThemeEditorSidebar() {
  const {
    theme,
    updateVar,
    updateVarDirect,
    previewMode,
    setActiveExample,
    setEditingColorKey,
  } = useThemeData();
  const [editingKey, setEditingKey] = React.useState<ColorKey | null>(null);
  const defaults = React.useMemo(() => getDefaultShadcnTheme(), []);
  const [openGroups, setOpenGroups] = React.useState<string[]>([]);

  function toggleGroup(id: string) {
    setOpenGroups((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-3 p-2 px-4">
        {!theme ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : (
          <>
            {GROUPS.map((group) => {
              const isOpen = openGroups.includes(group.id);
              return (
                <Collapsible
                  key={group.id}
                  open={isOpen}
                  onOpenChange={() => toggleGroup(group.id)}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-sm font-semibold">{group.title}</div>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <ChevronDownIcon className="text-muted-foreground transition-transform in-data-open:rotate-180" />
                        <span className="sr-only">Toggle</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className="flex flex-col gap-1">
                    {group.keys.map((k) => {
                      const stored =
                        (theme[previewMode]?.[k] as string | undefined) || "";
                      const fallback =
                        (defaults[previewMode]?.[k] as string) || "";
                      const displayValue = stored || fallback;
                      return (
                        <React.Fragment key={k}>
                          <ColorRow
                            keyName={k}
                            value={displayValue}
                            onClick={() => {
                              const newKey = editingKey === k ? null : k;
                              setEditingKey(newKey);
                              setEditingColorKey(newKey);
                              if (newKey && COLOR_EXAMPLE_MAP[newKey]) {
                                setActiveExample(COLOR_EXAMPLE_MAP[newKey]);
                              }
                            }}
                          />
                          {editingKey === k && (
                            <div className="mt-2 mb-4 pl-2">
                              <OklchColorPicker
                                className="w-[220px] mx-auto"
                                value={parseOKLCH(displayValue)}
                                initialColor={displayValue}
                                onChange={(v) => {
                                  updateVarDirect(
                                    k,
                                    toOKLCHString(v.l, v.c, v.h),
                                    { mode: previewMode },
                                  );
                                }}
                                onChangeCommitted={(v) => {
                                  updateVar(k, toOKLCHString(v.l, v.c, v.h), {
                                    mode: previewMode,
                                  });
                                }}
                              />
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </>
        )}
        <Separator />
        <div className="flex flex-col gap-2 pb-2">
          <BorderRadiusEditor />
          <FontEditor />
        </div>
      </div>
    </ScrollArea>
  );
}
