<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from '$components/ui/button';
  import * as Card from '$components/ui/card';
  import * as Select from '$components/ui/select';
  import { Input } from '$components/ui/input';
  import { createTRPC } from '$lib/trpc';

  export let params: { id: string };

  const trpc = createTRPC();

  let threads = $state<any[]>([]);
  let isLoading = $state(true);
  let search = $state('');
  let sortBy = $state<'newest'|'oldest'|'popular'>('newest');

  async function load() {
    isLoading = true;
    try {
      threads = await trpc.groups.threads.query({ groupId: params.id, search: search || undefined, sortBy: sortBy === 'popular' ? 'popular' : 'recent', limit: 30 });
    } catch (err) {
      console.error('Failed to fetch group threads', err);
    } finally {
      isLoading = false;
    }
  }

  onMount(load);

  $effect(() => {
    const t = setTimeout(() => load(), 220);
    return () => clearTimeout(t);
  });

  function openNew() {
    window.location.href = `/threads/new?group=${params.id}`;
  }
</script>

<div class="p-6 space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-semibold">Group Forum</h1>

    <div class="flex items-center gap-3">
      <Input placeholder="Search threads..." bind:value={search} />
      <Select.Root type="single" bind:value={sortBy}>
        <Select.Trigger class="w-44" />
        <Select.Content>
          <Select.Item value="newest">Newest</Select.Item>
          <Select.Item value="oldest">Oldest</Select.Item>
          <Select.Item value="popular">Most Replies</Select.Item>
        </Select.Content>
      </Select.Root>
      <Button on:click={openNew}>New Thread</Button>
    </div>
  </div>

  {#if isLoading}
    <div class="space-y-4">
      {#each Array(3) as _}
        <Card.Root class="animate-pulse"><Card.Content class="h-24" /></Card.Root>
      {/each}
    </div>
  {:else if threads.length === 0}
    <Card.Root><Card.Content class="py-8 text-center text-muted-foreground">No threads yet.</Card.Content></Card.Root>
  {:else}
    <div class="space-y-4">
      {#each threads as t}
        <!-- reuse your thread card component -->
        <ThreadCardView {thread}={t} />
      {/each}
    </div>
  {/if}
</div>
