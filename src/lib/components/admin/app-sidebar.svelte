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
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { Separator } from '$components/ui/separator';
	import * as Avatar from '$components/ui/avatar';
	import SearchForm from '$lib/components/admin/search-form.svelte';
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	let { user } = $props<{ user: { name: string; email: string; image?: string } }>();
	const data = {
		navMain: [
			{
				title: 'Sections',
				items: [
					{ title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
					{ title: 'Users', url: '/admin/users', icon: User },
					{ title: 'Appearance', url: '/admin/appearance', icon: Sparkles, isActive: true },
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

<Sidebar.Root>
	<Sidebar.Header>
		<div class="flex h-10 items-center justify-center px-4">
			<Logo />
		</div>
		<hr class="mx-2 -mt-px border-t border-border" />
		<SearchForm />
	</Sidebar.Header>

	<Sidebar.Content>
		{#each data.navMain as section}
			<Sidebar.Group>
				<Sidebar.GroupLabel class="text-muted-foreground/60 uppercase">
					{section.title}
				</Sidebar.GroupLabel>
				<Sidebar.GroupContent class="px-2">
					<Sidebar.Menu>
						<div class="flex items-center gap-3 rounded-lg bg-muted/50 p-2">
							{#if user}
								<a
									href={`/profile/${user.username ?? user.id}`}
									class="flex w-full items-center gap-3"
								>
									<Avatar.Root class="size-8 rounded-lg grayscale">
										<Avatar.Image src={user.image} alt={user.name} />
										<Avatar.Fallback>{user.name?.slice(0, 2).toUpperCase()}</Avatar.Fallback>
									</Avatar.Root>
									<div class="grid flex-1 text-left text-sm leading-tight">
										<span class="truncate font-medium">{user.name}</span>
										<span class="truncate text-xs text-muted-foreground">
											{user.email}
										</span>
									</div>
								</a>
							{:else}
								<a href="/login" class="text-sm font-medium text-primary">Sign in</a>
							{/if}
						</div>

						<Separator class="my-4" />
						{#each section.items as item}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton
									class="group/menu-button hover:from-sidebar.-accent hover:to-sidebar.-accent/40 h-9 gap-3 rounded-md bg-gradient-to-r font-medium hover:bg-transparent data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto"
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
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/each}
	</Sidebar.Content>

	<!-- <Sidebar.Footer>
		<hr class="mx-2 -mt-px border-t border-border" />
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton
					onclick={async () => {
						try {
							console.log('Button clicked!');
							await authClient.signOut({
								fetchOptions: {
									onSuccess: () => {
										goto('/login');
									},
									onError: (error) => {
										console.error('Logout failed:', error);
									}
								}
							});
						} catch (error) {
							console.error('Logout error:', error);
						}
					}}
					class="hover:from-sideba.r-accent hover:to-sideba.r-accent/40 hover:bg-transparen .data-[active=true]:from-primary/20 h-9 gap-3 rounded-md bg-linear-to-r font-medium data-[active=true]:to-primary/5 [&>svg]:size-auto"
				>
					<LogOutIcon
						size={22}
						class="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
					/>
					<span>Sign Out</span>
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer> -->

	<Sidebar.Rail />
</Sidebar.Root>
