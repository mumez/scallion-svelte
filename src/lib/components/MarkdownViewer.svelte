<script lang="ts">
	import { enrichedHtmlFrom } from '$lib/utils/MarkdownParser';

	export let markdown = '';
	export let existingPageNames: string[] = [];
	export let baseImageUrl = '';

	$: htmlText = enrichedHtmlFrom(markdown, existingPageNames, baseImageUrl);
</script>

<div class="html-from-markdown space-x-0">
	<article data-sveltekit-reload>{@html htmlText}</article>
</div>
