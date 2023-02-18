import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: true,
		port: 8081
	},
	test: {
		globals: true,
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
