<script lang="ts">
	let attachments: any[] = $state([]);
</script>

<div class="mt-2 space-y-2">
	{#each attachments as a}
		{#if a.type === 'image'}
			<img src={a.url} alt={a.fileName} class="max-w-xs rounded-lg border" />
		{:else if a.type === 'audio'}
			<audio controls class="w-full">
				<source src={a.url} type={a.mimeType} />
			</audio>
		{:else}
			<a
				href={a.url}
				target="_blank"
				class="flex items-center gap-2 rounded-md border p-2 hover:bg-muted"
			>
				📎 {a.fileName}
				<span class="text-xs text-muted-foreground">
					({Math.round(a.fileSize / 1024)} KB)
				</span>
			</a>
		{/if}
	{/each}
</div>
