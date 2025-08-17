import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), svelteTesting()],
	build: {
		// inline all imported assets
		assetsInlineLimit: Infinity
	},
	server: {
		host: true,
		port: 8081
	},
	test: {
		globals: true,
		environment: 'jsdom',
		include: ['src/**/*.{test,spec}.{js,ts}'],
		setupFiles: ['src/setupTests.ts'],
		server: {
			deps: {
				inline: ['msw']
			}
		}
	}
});