import WikiBooksService from '$lib/services/WikiBooksService';

export async function load({ fetch }) {
	const wikiBooksService = new WikiBooksService(fetch);
	const wikiBooks = await wikiBooksService.listBooks();
	return { books: wikiBooks };
}
