<script lang="ts">
	import { onMount } from 'svelte';
	import * as Card from '$components/ui/card';
	import * as Avatar from '$components/ui/avatar';
	import { Button } from '$components/ui/button';
	import { createTRPC } from '$lib/trpc';
	import { page } from '$app/state';
	import * as Select from '$components/ui/select';

	let { params } = $props<{ params: { id: string } }>();
	const trpc = createTRPC();
	let members = $state<any[]>([]);
	let isLoading = $state(true);
	let currentUser = $derived(page.data.user);

	async function load() {
		isLoading = true;
		try {
			members = await trpc.groups.members.query({ groupId: params.id });
		} catch (err) {
			console.error('Failed loading members', err);
		} finally {
			isLoading = false;
		}
	}

	onMount(load);

	async function changeRole(memberId: string, role: 'member' | 'owner') {
		await trpc.groups.updateMemberRole.mutate({ groupId: params.id, userId: memberId, role });
		await load();
	}

	async function removeMember(memberId: string) {
		if (!confirm('Remove member from group?')) return;
		await trpc.groups.removeMember.mutate({ groupId: params.id, memberId });
		await load();
	}
</script>

<div class="p-6">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-semibold">Members</h1>
	</div>

	{#if isLoading}
		<div class="space-y-3">
			{#each Array(6) as _}
				<Card.Root class="animate-pulse"><Card.Content class="h-12" /></Card.Root>
			{/each}
		</div>
	{:else if members.length === 0}
		<Card.Root
			><Card.Content class="py-8 text-center text-muted-foreground">No members</Card.Content
			></Card.Root
		>
	{:else}
		<div class="space-y-3">
			{#each members as member}
				<Card.Root>
					<Card.Content class="flex items-center justify-between">
						<div class="flex items-center gap-3">
							<Avatar.Root class="h-8 w-8">
								<Avatar.Image src={member.user?.image} />
								<Avatar.Fallback>{member.user?.name?.[0] || 'U'}</Avatar.Fallback>
							</Avatar.Root>
							<div>
								<div class="font-medium">{member.user?.name}</div>
								<div class="text-sm text-muted-foreground">{member.role}</div>
							</div>
						</div>

						<div class="flex items-center gap-2">
							{#if page.data.user?.role === 'admin' || member.canManage}
								<Select.Root
									type="single"
									value={member.role}
									onValueChange={(value) => changeRole(member.user.id, value.value)}
								>
									<Select.Trigger class="w-32">
										{member.role.charAt(0).toUpperCase() + member.role.slice(1)}
									</Select.Trigger>
									<Select.Content>
										<Select.Group>
											<Select.Item value="member" label="Member">Member</Select.Item>
											<Select.Item value="moderator" label="Moderator">Moderator</Select.Item>
											<Select.Item value="owner" label="Owner">Owner</Select.Item>
										</Select.Group>
									</Select.Content>
								</Select.Root>
								<Button variant="destructive" on:click={() => removeMember(member.user.id)}
									>Remove</Button
								>
							{/if}
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	{/if}
</div>
