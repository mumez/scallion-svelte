import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
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
		include: ['src/**/*.{test,spec}.{js,ts}'],
		setupFiles: ['src/setupTests.ts']
	}
});