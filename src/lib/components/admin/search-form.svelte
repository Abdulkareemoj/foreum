<script lang="ts">
	import { SidebarInput, SidebarGroup, SidebarGroupContent } from '$lib/components/ui/sidebar';
	import { Search } from '@lucide/svelte';
	let id = crypto.randomUUID();
</script>

<SidebarGroup class="py-0">
	<SidebarGroupContent class="relative">
		<div class="relative">
			<SidebarInput {id} class="ps-9 pe-9" aria-label="Search" />
			<!-- Left icon -->
			<div
				class="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-muted-foreground/60 peer-disabled:opacity-50"
			>
				<Search size={20} aria-hidden="true" />
			</div>

			<!-- Right keyboard hint -->
			<div
				class="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-2 text-muted-foreground"
			>
				<kbd
					class="inline-flex size-5 max-h-full items-center justify-center rounded bg-input px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70"
				>
					/
				</kbd>
			</div>
		</div>
	</SidebarGroupContent>
</SidebarGroup>
