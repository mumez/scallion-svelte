import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-auto';
//import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		vitePreprocess()
		// preprocess({
		// 	typescript: {
		// 		tsconfigFile: './tsconfig.json'
		// 	}
		// })
	],

	kit: {
		adapter: adapter()
	}
};

export default config;
