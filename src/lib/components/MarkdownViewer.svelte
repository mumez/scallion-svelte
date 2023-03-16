<script lang="ts">
	//import { onMount } from 'svelte';
	import { extractInternalLinks, htmlFrom, enrichedHtmlFrom } from '$lib/utils/MarkdownParser';

	export let markdown = '';
	export let internalLinks: string[] = [];


	let convertedText = '...';

	// onMount(() => {
	// 	console.log('internal links :>> ', extractInternalLinks(markdown));
	// 	convertedText = enrichedHtmlFrom(markdown, ['hoge']);
	// });

	convertedText = enrichedHtmlFrom(markdown, internalLinks);

	$: htmlText = convertedText;
</script>

<div class="space-x-0">
	<article data-sveltekit-reload>{@html htmlText}</article>
	<article>{htmlText}</article>
</div>
