/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })],
  test: {
    include: ['src/tests/**/*.{test,spec}.{js,ts,svelte}'],
    environment: 'jsdom',
    setupFiles: ['src/tests/setup.ts'],
    alias: {
      $lib: '/src/lib',
      $components: '/src/lib/components'
    }
  },
});