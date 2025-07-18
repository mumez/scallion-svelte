import { http, HttpResponse } from 'msw';
import type { WikiBook } from '$lib/models/WikiBook';
import type { PageContent } from '$lib/models/PageContent';

// Mock data
const mockWikiBooks: WikiBook[] = [
	{
		ownedBy: '4saYpbYbngfMl6N4YPLWn8kJHAC2',
		id: '4mmw6ztlrzrrr1nv9hszjk3vy',
		title: 'ume wiki',
		name: 'ume',
		count: 6
	},
	{
		ownedBy: '4saYpbYbngfMl6N4YPLWn8kJHAC2',
		id: 'a3g5xislem5pgvmqxga6qus18',
		title: 'squeak wiki',
		name: 'squeak',
		count: 1
	}
];

const mockWikiPages: PageContent[] = [
	{
		name: 'index',
		updatedAt: 1677728598145,
		id: '5scwgcisl11lxnqkgfgfycse5',
		number: 3,
		isLocked: false,
		content: 'index content hello',
		bookId: '4mmw6ztlrzrrr1nv9hszjk3vy',
		updatedBy: 'ume@softumeya.com',
		wiki: 'ume'
	},
	{
		name: 'test1',
		updatedAt: 1678770722431,
		id: 'adhl8btzl9bdaxvhypg0eo2qj',
		number: 4,
		isLocked: false,
		content: 'test content update',
		bookId: '4mmw6ztlrzrrr1nv9hszjk3vy',
		updatedBy: 'updater1',
		wiki: 'ume'
	}
];

const existingPages = ['index', 'test1'];

export const handlers = [
	// GET /wikis - List wiki books
	http.get('*/wikis', () => {
		return HttpResponse.json(mockWikiBooks);
	}),

	// GET /wiki - Get wiki book description
	http.get('*/wiki', ({ request }) => {
		const url = new URL(request.url);
		const name = url.searchParams.get('name');
		
		const wikiBook = mockWikiBooks.find(wb => wb.name === name);
		if (wikiBook) {
			return HttpResponse.json(wikiBook);
		}
		return HttpResponse.json({}, { status: 404 });
	}),

	// GET /pages - Get pages existence
	http.get('*/pages', ({ request }) => {
		const url = new URL(request.url);
		const wiki = url.searchParams.get('wiki');
		const exist = url.searchParams.get('exist');
		
		if (!wiki || !exist) {
			return HttpResponse.json([], { status: 400 });
		}
		
		const pageNames = exist.split(',');
		const existence = pageNames.map(name => existingPages.includes(name.trim()));
		
		return HttpResponse.json(existence);
	}),

	// GET /page - Get page content
	http.get('*/page', ({ request }) => {
		const url = new URL(request.url);
		const name = url.searchParams.get('name');
		const wiki = url.searchParams.get('wiki');
		
		const page = mockWikiPages.find(p => p.name === name && p.wiki === wiki);
		if (page) {
			return HttpResponse.json(page);
		}
		return HttpResponse.json({}, { status: 404 });
	}),

	// POST /page - Create new page
	http.post('*/page', async ({ request }) => {
		const body = await request.json() as PageContent;
		const newPage: PageContent = {
			...body,
			id: `new-${Date.now()}`,
			updatedAt: Date.now(),
			number: mockWikiPages.length + 1,
			isLocked: false,
			bookId: '4mmw6ztlrzrrr1nv9hszjk3vy'
		};
		
		mockWikiPages.push(newPage);
		existingPages.push(newPage.name);
		
		return HttpResponse.json(newPage);
	}),

	// PUT /page - Update page
	http.put('*/page', async ({ request }) => {
		const body = await request.json() as PageContent;
		const pageIndex = mockWikiPages.findIndex(p => p.id === body.id);
		
		if (pageIndex >= 0) {
			mockWikiPages[pageIndex] = {
				...mockWikiPages[pageIndex],
				...body,
				updatedAt: Date.now(),
				number: mockWikiPages[pageIndex].number + 1
			};
			return HttpResponse.json(mockWikiPages[pageIndex]);
		}
		return HttpResponse.json({}, { status: 404 });
	}),

	// GET /versions - Get page versions
	http.get('*/versions', ({ request }) => {
		const url = new URL(request.url);
		const page = url.searchParams.get('page');
		const wiki = url.searchParams.get('wiki');
		const from = parseInt(url.searchParams.get('from') || '0');
		const size = parseInt(url.searchParams.get('size') || '10');
		
		const versions = mockWikiPages.filter(p => p.name === page && p.wiki === wiki);
		const paginatedVersions = versions.slice(from, from + size);
		
		return HttpResponse.json(paginatedVersions);
	}),

	// GET /version - Get last version number
	http.get('*/version', ({ request }) => {
		const url = new URL(request.url);
		const page = url.searchParams.get('page');
		const wiki = url.searchParams.get('wiki');
		const field = url.searchParams.get('field');
		
		if (field === 'lastVersionNumber') {
			const pageVersions = mockWikiPages.filter(p => p.name === page && p.wiki === wiki);
			const maxVersion = Math.max(...pageVersions.map(p => p.number));
			return HttpResponse.json(maxVersion || 0);
		}
		
		return HttpResponse.json(0);
	}),

	// GET /updates - Get latest updates
	http.get('*/updates', ({ request }) => {
		const url = new URL(request.url);
		const wiki = url.searchParams.get('wiki');
		const from = parseInt(url.searchParams.get('from') || '0');
		const size = parseInt(url.searchParams.get('size') || '10');
		
		const wikiPages = mockWikiPages.filter(p => !wiki || p.wiki === wiki);
		const sortedPages = wikiPages.sort((a, b) => b.updatedAt - a.updatedAt);
		const paginatedPages = sortedPages.slice(from, from + size);
		
		return HttpResponse.json(paginatedPages);
	}),

	// GET /search - Search pages
	http.get('*/search', ({ request }) => {
		const url = new URL(request.url);
		const wiki = url.searchParams.get('wiki');
		const q = url.searchParams.get('q');
		
		if (!q) {
			return HttpResponse.json([]);
		}
		
		const searchResults = mockWikiPages.filter(p => 
			(!wiki || p.wiki === wiki) && 
			(p.content.toLowerCase().includes(q.toLowerCase()) || 
			 p.name.toLowerCase().includes(q.toLowerCase()))
		);
		
		return HttpResponse.json(searchResults);
	})
];