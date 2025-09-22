<script lang="ts">
	import { Check,ChevronDown, X } from '@lucide/svelte';
	import { createEventDispatcher, onMount } from 'svelte';

	import { Badge } from '$components/ui/badge';
	import { Button } from '$components/ui/button';
	import * as Command from '$components/ui/command';
	import * as Popover from '$components/ui/popover';
	import { Separator } from '$components/ui/separator';
	import { cn } from '$lib/utils';

	import { multiSelectVariants } from './multi-select-variants';
	import type { MultiSelectGroup,MultiSelectOption } from './types';

	export let options: MultiSelectOption[] | MultiSelectGroup[] = [];
	export let placeholder = 'Select options';
	export let selected: string[] = [];
	export let maxCount = 3;
	export let hideSelectAll = false;
	export let searchable = true;
	export let emptyIndicator = 'No results found.';
	export let disabled = false;

	const dispatch = createEventDispatcher<{ change: string[] }>();
	let open = false;
	let search = '';

	function isGrouped(opts: MultiSelectOption[] | MultiSelectGroup[]): opts is MultiSelectGroup[] {
		return opts.length > 0 && 'heading' in opts[0];
	}

	function toggle(value: string) {
		if (disabled) return;
		if (selected.includes(value)) {
			selected = selected.filter((v) => v !== value);
		} else {
			selected = [...selected, value];
		}
		dispatch('change', selected);
	}

	function clear() {
		selected = [];
		dispatch('change', selected);
	}
	function getOption(value: string) {
		if (Array.isArray(options) && !isGrouped(options)) {
			return options.find((o) => o.value === value) ?? null;
		}
		return null;
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger asChild>
		<Button
			variant="outline"
			{disabled}
			class={cn('flex w-full justify-between', disabled && 'opacity-50')}
		>
			{#if selected.length > 0}
				<div class="flex flex-wrap gap-1">
					{#each selected.slice(0, maxCount) as value}
						{#if getOption(value) as opt}
							<Badge class={cn(multiSelectVariants({ variant: 'default' }))}>
								<button
									type="button"
									class="flex items-center"
									on:click|stopPropagation={() => toggle(opt.value)}
								>
									{opt.label}
									<X class="ml-1 size-3 cursor-pointer" />
								</button>
							</Badge>
						{/if}
					{/each}

					{#if selected.length > maxCount}
						<Badge variant="secondary">+ {selected.length - maxCount} more</Badge>
					{/if}
				</div>
			{:else}
				<span class="text-muted-foreground">{placeholder}</span>
			{/if}
			<ChevronDown class="ml-2 size-4 text-muted-foreground" />
		</Button>
	</Popover.Trigger>

	<Popover.Content class="w-64 p-0">
		<Command.Root>
			{#if searchable}
				<Command.Input placeholder="Search..." bind:value={search} />
			{/if}
			<Command.List>
				<Command.Empty>{emptyIndicator}</Command.Empty>

				{#if isGrouped(options)}
					{#each options as group}
						<Command.Group heading={group.heading}>
							{#each group.options as opt}
								<Command.Item value={opt.value} onSelect={() => toggle(opt.value)}>
									<div class="flex items-center">
										<div
											class={cn(
												'mr-2 flex size-4 items-center justify-center rounded-sm border border-primary',
												selected.includes(opt.value)
													? 'bg-primary text-primary-foreground'
													: 'opacity-50 [&_svg]:invisible'
											)}
										>
											<Check class="size-3" />
										</div>
										{opt.label}
									</div>
								</Command.Item>
							{/each}
						</Command.Group>
					{/each}
				{:else}
					<Command.Group>
						{#each options as opt}
							<Command.Item value={opt.value} onSelect={() => toggle(opt.value)}>
								<div class="flex items-center">
									<div
										class={cn(
											'mr-2 flex size-4 items-center justify-center rounded-sm border border-primary',
											selected.includes(opt.value)
												? 'bg-primary text-primary-foreground'
												: 'opacity-50 [&_svg]:invisible'
										)}
									>
										<Check class="size-3" />
									</div>
									{opt.label}
								</div>
							</Command.Item>
						{/each}
					</Command.Group>
				{/if}
			</Command.List>

			<Separator />
			<div class="flex justify-between p-2">
				<Button variant="ghost" size="sm" on:click={clear} disabled={selected.length === 0}>
					Clear
				</Button>
				<Button variant="ghost" size="sm" on:click={() => (open = false)}>Close</Button>
			</div>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
