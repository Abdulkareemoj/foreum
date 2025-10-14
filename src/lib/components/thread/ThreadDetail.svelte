<script lang="ts">
	import { renderTipTap } from '$utils';

	type Thread = {
		id: string;
		title: string;
		content: string;
		createdAt: string;
	};

	let { thread } = $props<{ thread: Thread }>();
</script>

<div>
	<h1 class="text-2xl font-bold">{thread.title}</h1>
	<div class="prose dark:prose-invert max-w-none">{@html renderTipTap(thread.content)}</div>
	<small class="text-gray-500">
		Posted on {new Date(thread.createdAt).toLocaleString()}
	</small>
</div>
