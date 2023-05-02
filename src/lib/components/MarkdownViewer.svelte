<script lang="ts">
	import { debounce } from 'lodash-es';
	import { enrichedHtmlFrom } from '$lib/utils/MarkdownHandler';

	export let markdown = '';
	export let wikiName = '';
	export let existingPageNames: string[] = [];
	export let wikiBasePart = '';
	export let attachmentsBaseUrl = '';
	export let isEditable = false;

	let html = markdown;

	const debouncedHtmlFrom = debounce(
		(markdown, wikiName, existingPageNames, wikiBasePart, attachmentsBaseUrl) => {
			html = enrichedHtmlFrom(
				markdown,
				wikiName,
				existingPageNames,
				wikiBasePart,
				attachmentsBaseUrl
			);
		},
		500
	);

	function renderHtml(
		markdown: string,
		wikiName: string,
		existingPageNames: string[],
		wikiBasePart: string,
		attachmentsBaseUrl: string
	) {
		if (isEditable) {
			debouncedHtmlFrom(markdown, wikiName, existingPageNames, wikiBasePart, attachmentsBaseUrl);
			return;
		}
		html = enrichedHtmlFrom(
			markdown,
			wikiName,
			existingPageNames,
			wikiBasePart,
			attachmentsBaseUrl
		);
	}

	$: renderHtml(markdown, wikiName, existingPageNames, wikiBasePart, attachmentsBaseUrl);
</script>

<div class="html-from-markdown space-x-0">
	<article data-sveltekit-reload>{@html html}</article>
</div>
