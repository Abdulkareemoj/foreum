import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  UserIcon,
  Moon,
  Sun,
  Bell as BellIcon,
  MessageSquare,
  LogOut as LogOutIcon,
  Settings,
  Shield,
} from "lucide-react";
import { signOut } from "~/lib/auth-client";
import { Switch } from "~/components/ui/switch";
import { useTheme } from "next-themes";

interface UserDropdownProps {
  user?: {
    id?: string;
    name: string;
    email: string;
    image?: string;
    username?: string;
    displayUsername?: string;
    role?: string | null;
  };
}

export default function UserDropdown({ user }: UserDropdownProps) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate({ to: "/sign-in" });
        },
      },
    });
  };

  if (!user) {
    return (
      <Link to="/sign-in">
        <Button variant="outline" size="sm" className="text-sm font-medium">
          Sign In
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="hidden h-auto gap-3 px-2 py-2 md:inline-flex hover:bg-transparent"
        >
          <Avatar className="size-8 rounded-lg">
            <AvatarImage src={user.image || ""} alt={user.name} />
            <AvatarFallback className="rounded-lg">
              {user.name?.[0]?.toUpperCase() ?? "?"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="size-8 rounded-lg">
              <AvatarImage
                src={user.image || ""}
                alt={user.displayUsername || user.username}
              />
              <AvatarFallback className="rounded-lg">
                {user.displayUsername?.[0]?.toUpperCase() ??
                  user.username?.[0]?.toUpperCase() ??
                  "?"}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {user.displayUsername || user.username}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              to="/profile/$username"
              params={{ username: user.username || user.id || "" }}
              className="flex items-center gap-2 cursor-pointer w-full"
            >
              <UserIcon className="size-4" /> View Profile
            </Link>
          </DropdownMenuItem>

          {user.role === "admin" && (
            <DropdownMenuItem asChild>
              <Link
                to="/admin-dashboard"
                className="flex items-center gap-2 cursor-pointer w-full"
              >
                <Shield className="size-4" /> Admin
              </Link>
            </DropdownMenuItem>
          )}

          {user.role === "moderator" && (
            <DropdownMenuItem asChild>
              <Link
                to="/moderator-dashboard"
                className="flex items-center gap-2 cursor-pointer w-full"
              >
                <Shield className="size-4" /> Moderation
              </Link>
            </DropdownMenuItem>
          )}

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between px-2 py-1.5">
            <div className="flex items-center gap-2 text-sm">
              {isDarkMode ? (
                <Moon className="size-4" />
              ) : (
                <Sun className="size-4" />
              )}
              <span>Dark Mode</span>
            </div>
            <Switch
              checked={isDarkMode}
              onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
            />
          </div>

          <DropdownMenuItem asChild>
            <Link
              to="/settings"
              className="flex items-center gap-2 cursor-pointer w-full"
            >
              <Settings className="size-4" /> Settings
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              to="/messages"
              className="flex items-center gap-2 cursor-pointer w-full"
            >
              <MessageSquare className="size-4" /> Messages
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-100 dark:focus:bg-red-950/50"
        >
          <LogOutIcon className="size-4 mr-2" /> Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
