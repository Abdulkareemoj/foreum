import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), svelte({ hot: !process.env.VITEST })],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts,svelte}'],
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./setupTests.ts']
	}
});
