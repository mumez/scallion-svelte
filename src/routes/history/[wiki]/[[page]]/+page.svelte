<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	export let data: PageData;

	let versions = data.page ?? {};
	let wikiName = $page.params['wiki'] ?? '';
	let pageName = $page.params['page'] ?? 'index';

</script>

<div class="container mx-auto p-4 space-y-4">
	{wikiName}{pageName}
	<div>{versions}</div>
</div>
