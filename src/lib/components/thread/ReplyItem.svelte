<script lang="ts">
	export let reply: {
		id: string;
		content: string;
		authorId: string;
		createdAt: string;
	};
</script>

<div class="border-t py-3">
	<p>{reply.content}</p>
	<small class="mt-1 block text-sm text-gray-500">
		By user {reply.authorId} on {new Date(reply.createdAt).toLocaleString()}
	</small>
</div>
