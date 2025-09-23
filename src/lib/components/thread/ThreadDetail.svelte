<script lang="ts">
	export let thread: {
		id: string;
		title: string;
		content: string;
		createdAt: string;
	};
</script>

<div>
	<h1 class="text-2xl font-bold">{thread.title}</h1>
	<p class="mt-2">{thread.content}</p>
	<small class="text-gray-500">
		Posted on {new Date(thread.createdAt).toLocaleString()}
	</small>
</div>
