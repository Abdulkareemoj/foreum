<script lang="ts">
	import { BellIcon, CreditCardIcon, LogOutIcon, Moon, Sun, UserIcon } from '@lucide/svelte';

	import { goto } from '$app/navigation';
	import { Button } from '$components/ui/button';
	import { authClient } from '$lib/auth-client';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Switch } from '$lib/components/ui/switch';

	let isDarkMode = $state(false);

	$effect(() => {
		document.documentElement.classList.toggle('dark', isDarkMode);
	});

	let { user } = $props<{ user: { name: string; email: string; image?: string } }>();
</script>

{#if user}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button
					variant="ghost"
					size="sm"
					class="hidden h-auto gap-3 px-2 py-2 md:inline-flex"
					{...props}
				>
					<Avatar.Root class="size-8 rounded-lg">
						<Avatar.Image src={user.image} alt={user.name} />
						<Avatar.Fallback class="rounded-lg">
							{user.name?.[0] ?? '?'}
						</Avatar.Fallback>
					</Avatar.Root>
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>

		<DropdownMenu.Content class="w-56 rounded-lg" side="bottom" align="end" sideOffset={4}>
			<DropdownMenu.Label class="p-0 font-normal">
				<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
					<Avatar.Root class="size-8 rounded-lg">
						<Avatar.Image src={user.image} alt={user.name} />
						<Avatar.Fallback class="rounded-lg">{user.name?.[0]}</Avatar.Fallback>
					</Avatar.Root>
					<div class="grid flex-1 text-left text-sm leading-tight">
						<span class="truncate font-medium">{user.displayUsername}</span>
						<span class="truncate text-xs text-muted-foreground">{user.email}</span>
					</div>
				</div>
			</DropdownMenu.Label>
			<DropdownMenu.Separator />

			<DropdownMenu.Group>
				<DropdownMenu.Item>
					<a class="flex items-center gap-2" href={`/profile/${user.username}`}>
						<UserIcon class="size-4" /> View Profile
					</a>
				</DropdownMenu.Item>
				<!-- Dark Mode Toggle -->
				<div class="flex items-center justify-between px-2 py-1.5">
					<div class="flex items-center gap-2 text-sm">
						{#if isDarkMode}
							<Moon class="size-4" />
						{:else}
							<Sun class="size-4" />
						{/if}
						<span>Dark Mode</span>
					</div>
					<Switch bind:checked={isDarkMode} />
				</div>
				<DropdownMenu.Item>
					<a class="items flex gap-2" href="/notifications">
						<BellIcon class="size-4" /> Notifications
					</a>
				</DropdownMenu.Item>
				<DropdownMenu.Item>
					<a class="items flex gap-2" href="/billing">
						<CreditCardIcon class="size-4" /> Billing
					</a>
				</DropdownMenu.Item>
			</DropdownMenu.Group>

			<DropdownMenu.Separator />

			<DropdownMenu.Item
				onclick={() =>
					authClient.signOut({
						fetchOptions: {
							onSuccess: () => {
								goto('/login');
							}
						}
					})}
			>
				<LogOutIcon class="size-4" /> Log Out
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{:else}
	<Button variant="outline" size="sm" href="/login" class="text-sm font-medium">Sign In</Button>
{/if}
