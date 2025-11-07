<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/';
	import AppSidebar from '$lib/components/admin/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import NavUser from '$components/shared/NavUser.svelte';
	import { page } from '$app/state';
	import { LayoutDashboard } from '@lucide/svelte';
	import { Separator } from '$components/ui/separator';

	let { data, children } = $props();
	const user = data.user;

	const segments = $derived.by(() => {
		const result = page.url.pathname.split('/').filter(Boolean);
		console.log('segments', result);
		return result;
	});

	function capitalize(str: string) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
</script>

<Sidebar.Provider>
	<AppSidebar {user} />
	<Sidebar.Inset>
		<header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
			<Sidebar.Trigger class="-ml-1" />
			<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
			<LayoutDashboard class="size-5" />
			<Breadcrumb.Root>
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/dashboard">Dashboard</Breadcrumb.Link>
					</Breadcrumb.Item>
					{#each segments as segment, i}
						{#if i > 0}
							<Breadcrumb.Separator />
							<Breadcrumb.Item>
								{#if i === segments.length - 1}
									<Breadcrumb.Page>{capitalize(segment)}</Breadcrumb.Page>
								{:else}
									<Breadcrumb.Link href={`/${segments.slice(0, i + 1).join('/')}`}>
										{capitalize(segment)}
									</Breadcrumb.Link>
								{/if}
							</Breadcrumb.Item>
						{/if}
					{/each}
				</Breadcrumb.List>
			</Breadcrumb.Root>

			<div class="ml-auto flex gap-3">
				<NavUser {user} />
			</div>
		</header>
		<main class="p-4">
			{@render children?.()}
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
