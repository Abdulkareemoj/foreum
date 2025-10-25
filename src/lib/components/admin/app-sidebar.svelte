<script lang="ts">
	import {
		Building,
		ChartArea,
		LayoutDashboard,
		LifeBuoy,
		List,
		LogOutIcon,
		Settings,
		Sparkles,
		Speaker,
		User
	} from '@lucide/svelte';
	import Logo from '$lib/components/shared/Logo.svelte';
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
		SidebarRail
	} from '$lib/components/ui/sidebar';

	import SearchForm from '$lib/components/admin/search-form.svelte';

	const data = {
		navMain: [
			{
				title: 'Sections',
				items: [
					{ title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
					{ title: 'Users', url: '/admin/users', icon: User },
					{ title: 'Apperance', url: '/admin/appearance', icon: Sparkles, isActive: true },
					{ title: 'Moderation Logs', url: '/admin/moderation-logs', icon: Building },
					{ title: 'Reports', url: '/admin/reports', icon: List },
					{ title: 'Settings', url: '/admin/settings-admin', icon: Settings },
					{ title: 'Announcement', url: '/admin/announcements', icon: Speaker }
				]
			},
			{
				title: 'Other',
				items: [
					{ title: 'Analytics', url: '/admin/analytics', icon: ChartArea },
					{ title: 'Help Center', url: '/admin/help', icon: LifeBuoy }
				]
			}
		]
	};
</script>

<Sidebar>
	<SidebarHeader>
		<Logo />
		<hr class="mx-2 -mt-px border-t border-border" />
		<SearchForm />
	</SidebarHeader>

	<SidebarContent>
		{#each data.navMain as section}
			<SidebarGroup>
				<SidebarGroupLabel class="text-muted-foreground/60 uppercase">
					{section.title}
				</SidebarGroupLabel>
				<SidebarGroupContent class="px-2">
					<SidebarMenu>
						{#each section.items as item}
							<SidebarMenuItem>
								<SidebarMenuButton
									class="group/menu-button h-9 gap-3 rounded-md bg-gradient-to-r font-medium hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto"
									data-active={item.isActive}
								>
									<a href={item.url} class="flex items-center gap-3">
										{#if item.icon}
											<svelte:component
												this={item.icon}
												size={22}
												class="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
											/>
										{/if}
										<span>{item.title}</span>
									</a>
								</SidebarMenuButton>
							</SidebarMenuItem>
						{/each}
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		{/each}
	</SidebarContent>

	<SidebarFooter>
		<hr class="mx-2 -mt-px border-t border-border" />
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					class="h-9 gap-3 rounded-md bg-gradient-to-r font-medium hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto"
				>
					<LogOutIcon
						size={22}
						class="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
					/>
					<span>Sign Out</span>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	</SidebarFooter>

	<SidebarRail />
</Sidebar>
