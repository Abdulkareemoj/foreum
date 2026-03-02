
import * as React from "react";
import {
 Building,
		ChartArea,
		LayoutDashboard,
		LifeBuoy,
		List,
		LogOut,
		Settings,
		Shield,
		Sparkles,
		Speaker,
		User
} from "lucide-react";

import { SearchForm } from "~/components/shared/SearchForm";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "~/components/ui/sidebar";
import { Link } from "@tanstack/react-router";

const data = {
  user: {
    name: "Admin",
    email: "admin@emailforge.com",
    avatar: "/avatars/admin.jpg",
  },
 navMain: [
			{
				title: 'Sections',
				items: [
					{ title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
					{ title: 'Users', url: '/users', icon: User },
					{ title: 'Appearance', url: '/appearance', icon: Sparkles },
					{ title: 'Moderation Logs', url: '/moderation-logs', icon: Building },
					{ title: 'Reports', url: '/reports', icon: List },					{ title: 'Settings', url: '/settings-admin', icon: Settings },
					{ title: 'Announcements', url: '/announcements', icon: Speaker }
				]
			},
			{
				title: 'Other',
				items: [
					{ title: 'Analytics', url: '/analytics', icon: ChartArea },
					{ title: 'Help Center', url: '/help', icon: LifeBuoy }
				]
			}
		]
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
            <Shield className="h-4 w-4" />
          </div>
          <span className="font-bold text-lg">EmailForge Admin</span>
        </div>
        <hr className="border-t border-border mx-2 -mt-px" />
        <SearchForm className="mt-3" />
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="uppercase text-muted-foreground/60">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-2">
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="group/menu-button font-medium gap-3 h-9 rounded-md bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto"
                    >
                      <Link to={item.url}>
                        {item.icon && (
                          <item.icon
                            className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
                            size={22}
                            aria-hidden="true"
                          />
                        )}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <hr className="border-t border-border mx-2 -mt-px" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="font-medium gap-3 h-9 rounded-md bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto">
              <LogOut
                className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
                size={22}
                aria-hidden="true"
              />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
