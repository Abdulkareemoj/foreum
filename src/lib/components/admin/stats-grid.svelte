<script lang="ts">
	import { cn } from '$lib/utils';
	import { ArrowRight } from '@lucide/svelte';

	interface StatsCardProps {
		title: string;
		value: string;
		change: {
			value: string;
			trend: 'up' | 'down';
		};
		icon: any;
	}

	let { stats = [] }: { stats: StatsCardProps[] } = $props();

	const getTrendColor = (trend: 'up' | 'down') =>
		trend === 'up' ? 'text-emerald-500' : 'text-red-500';
</script>

<div
	class="grid grid-cols-2 rounded-xl border border-border bg-gradient-to-br from-sidebar/60 to-sidebar min-[1200px]:grid-cols-4"
>
	{#each stats as stat}
		<div
			class="group relative p-4 before:absolute before:inset-y-8 before:right-0 before:w-px before:bg-gradient-to-b before:from-input/30 before:via-input before:to-input/30 last:before:hidden lg:p-5"
		>
			<div class="relative flex items-center gap-4">
				<ArrowRight
					class="absolute top-0 right-0 text-emerald-500 opacity-0 transition-opacity group-hover:opacity-100"
					size={20}
				/>

				<!-- Icon -->
				<div
					class="flex size-10 shrink-0 items-center justify-center rounded-full border border-emerald-600/50 bg-emerald-600/25 text-emerald-500 max-[480px]:hidden"
				>
					<svelte:component this={stat.icon} />
				</div>

				<!-- Content -->
				<div>
					<a
						href="#"
						class="text-xs font-medium tracking-widest text-muted-foreground/60 uppercase before:absolute before:inset-0"
					>
						{stat.title}
					</a>
					<div class="mb-2 text-2xl font-semibold">{stat.value}</div>
					<div class="text-xs text-muted-foreground/60">
						<span class={cn('font-medium', getTrendColor(stat.change.trend))}>
							{stat.change.trend === 'up' ? '↗' : '↘'}
							{stat.change.value}
						</span>
						vs last week
					</div>
				</div>
			</div>
		</div>
	{/each}
</div>
