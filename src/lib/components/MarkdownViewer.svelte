<script lang="ts">
	import { run } from 'svelte/legacy';

	import { _ } from '$lib/plugins/localization';
	import { debounce } from 'lodash-es';
	import { enrichedHtmlFrom } from '$lib/utils/MarkdownHandler';

	interface Props {
		markdown?: string;
		wikiName?: string;
		existingPageNames?: string[];
		wikisBaseDirectory?: string;
		attachmentsBaseUrl?: string;
		isEditable?: boolean;
	}

	let {
		markdown = '',
		wikiName = '',
		existingPageNames = [],
		wikisBaseDirectory = '',
		attachmentsBaseUrl = '',
		isEditable = false
	}: Props = $props();

	const newPageLinkTitle = $_('create-new-page');

	let html = $state(markdown);

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

	run(() => {
		renderHtml(markdown, wikiName, existingPageNames, wikisBaseDirectory, attachmentsBaseUrl);
	});
</script>

<div class="html-from-markdown space-x-0">
	<article data-sveltekit-reload>{@html html}</article>
</div>
