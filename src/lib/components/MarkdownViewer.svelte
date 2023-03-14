<script lang="ts">
	import { marked } from 'marked';
	import { onMount } from 'svelte';
	
	export let markdown = '';
	let convertedText = '...';

	onMount(()=>{
		console.log('mounted marked :>> ', markdown);
		convertedText = marked.parse(markdown);
	});

	const isNewLink = (href: string): boolean => {
		return /[^/]+/.test(href);
	};
	const isNewLinkClass = (href: string): string => {
		return isNewLink(href) ? 'new' : 'existing';
	};

	const walkTokens = async (token) => {
		if (token.type === 'link') {
			console.log('token :>> ', token);
		}
	};

	const renderer = {
		link(href, title, text) {
			console.log('href :>> ', href);
			return `
					<a class="${isNewLinkClass(href)}" title="${isNewLinkClass(href)}" href="${href}">
						${text}
					</a>`;
		}
	};
	const options = { renderer, walkTokens };
	marked.use(options);

	convertedText = marked.parse(markdown);

	$: htmlText = convertedText;

</script>

<div class="space-x-0">
	<article data-sveltekit-reload>{@html htmlText}</article>
	<article>{htmlText}</article>
</div>
