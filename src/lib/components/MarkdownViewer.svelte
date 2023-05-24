<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { debounce } from 'lodash-es';
	import { enrichedHtmlFrom } from '$lib/utils/MarkdownHandler';

	export let markdown = '';
	export let wikiName = '';
	export let existingPageNames: string[] = [];
	export let wikisBaseDirectory = '';
	export let attachmentsBaseUrl = '';
	export let isEditable = false;

	const newPageLinkTitle = $_('create-new-page');

	let html = markdown;

	const debouncedHtmlFrom = debounce(
		(markdown, wikiName, existingPageNames, wikisBaseDirectory, attachmentsBaseUrl) => {
			html = enrichedHtmlFrom(
				markdown,
				wikiName,
				existingPageNames,
				wikisBaseDirectory,
				attachmentsBaseUrl,
				newPageLinkTitle
			);
		},
		500
	);

	function renderHtml(
		markdown: string,
		wikiName: string,
		existingPageNames: string[],
		wikisBaseDirectory: string,
		attachmentsBaseUrl: string
	) {
		if (isEditable) {
			debouncedHtmlFrom(
				markdown,
				wikiName,
				existingPageNames,
				wikisBaseDirectory,
				attachmentsBaseUrl
			);
			return;
		}
		html = enrichedHtmlFrom(
			markdown,
			wikiName,
			existingPageNames,
			wikisBaseDirectory,
			attachmentsBaseUrl,
			newPageLinkTitle
		);
	}

	$: renderHtml(markdown, wikiName, existingPageNames, wikisBaseDirectory, attachmentsBaseUrl);
</script>

<div class="html-from-markdown space-x-0">
	<article data-sveltekit-reload>{@html html}</article>
</div>
