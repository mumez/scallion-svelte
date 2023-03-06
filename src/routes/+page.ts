import WikiBookService from '$lib/services/WikiBookService';

export async function load({ fetch }) {
	const wikiBookService = new WikiBookService(fetch);
	const wikiBooks = await wikiBookService.listBooks();
	return { books: wikiBooks };
}
