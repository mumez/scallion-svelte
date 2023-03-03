<script lang="ts">
	import { marked } from 'marked';
	export let markdown = '';
	$: htmlText = marked(markdown);
</script>

<div class="space-x-0">
	<article>{@html htmlText}</article>
</div>
