<script lang="ts">
	import { enrichedHtmlFrom } from '$lib/utils/MarkdownParser';

	export let markdown = '';
	export let existingPageNames: string[] = [];

	$: htmlText = enrichedHtmlFrom(markdown, existingPageNames);
</script>

<div class="space-x-0">
	<article data-sveltekit-reload>{@html htmlText}</article>
	<article>{htmlText}</article>
	<article>{existingPageNames}</article>
</div>
