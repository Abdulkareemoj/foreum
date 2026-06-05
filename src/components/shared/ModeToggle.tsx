
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        className="w-9 px-0"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <span className="t-icon-swap" data-state={theme === "dark" ? "b" : "a"}>
          <Sun className="t-icon h-[1.2rem] w-[1.2rem]" data-icon="a" />
          <Moon className="t-icon h-[1.2rem] w-[1.2rem]" data-icon="b" />
        </span>
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
}
