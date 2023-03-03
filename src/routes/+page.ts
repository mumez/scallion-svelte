import wikiBookService from '$lib/services/WikiBookService';
import type { WikiBook } from '$lib/models/WikiBook';

export async function load() {
	let wikiBooks: WikiBook[] = [];
	wikiBooks = await wikiBookService.listBooks();
	return { books: wikiBooks };
}
