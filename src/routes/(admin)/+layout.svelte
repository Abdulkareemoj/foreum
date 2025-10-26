<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/';
	import AppSidebar from '$lib/components/admin/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import NavUser from '$components/shared/NavUser.svelte';
	import { LayoutDashboard } from '@lucide/svelte';
	import { Separator } from '$components/ui/separator';

	let { data, children } = $props();
	const user = data.user;
	$effect(() => {
		console.log('NavUser received user:', user);
	});
</script>

<Sidebar.Provider>
	<AppSidebar {user} />
	<Sidebar.Inset>
		<header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
			<Sidebar.Trigger class="-ml-1" />
			<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />

			<Breadcrumb.Root>
				<Breadcrumb.List>
					<Breadcrumb.Item class="hidden md:block">
						<Breadcrumb.Link href="#">
							<LayoutDashboard size={22} aria-hidden="true" />
							<span class="sr-only">Dashboard</span>
						</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator class="hidden md:block" />
					<Breadcrumb.Item>
						<Breadcrumb.Page>Contacts</Breadcrumb.Page>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>

			<div class="ml-auto flex gap-3">
				<NavUser {user} />
			</div>
		</header>
		<main class="p-2">
			{@render children?.()}
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
