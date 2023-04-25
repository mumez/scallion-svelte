<script lang="ts">
	import { debounce } from '$lib/utils/CoreUtils';
	import { enrichedHtmlFrom } from '$lib/utils/MarkdownHandler';

	export let markdown = '';
	export let wikiName = '';
	export let existingPageNames: string[] = [];
	export let baseAttachmentUrl = '';
	export let isEditable = false;

	let html = markdown;

	const debouncedHtmlFrom = debounce((markdown, wikiName, existingPageNames, baseAttachmentUrl) => {
		html = enrichedHtmlFrom(markdown, wikiName, existingPageNames, baseAttachmentUrl);
	}, 500);

	function renderHtml(
		markdown: string,
		wikiName: string,
		existingPageNames: string[],
		baseAttachmentUrl: string
	) {
		if (isEditable) {
			debouncedHtmlFrom(markdown, wikiName, existingPageNames, baseAttachmentUrl);
			return;
		}
		html = enrichedHtmlFrom(markdown, wikiName, existingPageNames, baseAttachmentUrl);
	}

	$: renderHtml(markdown, wikiName, existingPageNames, baseAttachmentUrl);
</script>

<div class="html-from-markdown space-x-0">
	<article data-sveltekit-reload>{@html html}</article>
</div>
