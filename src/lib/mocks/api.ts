import { rest } from 'msw';
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
	rest.get('*/wikis', (req, res, ctx) => {
		return res(ctx.json(mockWikiBooks));
	}),

	// GET /wiki - Get wiki book description
	rest.get('*/wiki', (req, res, ctx) => {
		const name = req.url.searchParams.get('name');
		
		const wikiBook = mockWikiBooks.find(wb => wb.name === name);
		if (wikiBook) {
			return res(ctx.json(wikiBook));
		}
		return res(ctx.status(404), ctx.json({}));
	}),

	// GET /pages - Get pages existence
	rest.get('*/pages', (req, res, ctx) => {
		const wiki = req.url.searchParams.get('wiki');
		const exist = req.url.searchParams.get('exist');
		
		if (!wiki || !exist) {
			return res(ctx.status(400), ctx.json([]));
		}
		
		const pageNames = exist.split(',');
		const existence = pageNames.map(name => existingPages.includes(name.trim()));
		
		return res(ctx.json(existence));
	}),

	// GET /page - Get page content
	rest.get('*/page', (req, res, ctx) => {
		const name = req.url.searchParams.get('name');
		const wiki = req.url.searchParams.get('wiki');
		
		const page = mockWikiPages.find(p => p.name === name && p.wiki === wiki);
		if (page) {
			return res(ctx.json(page));
		}
		return res(ctx.status(404), ctx.json({}));
	}),

	// POST /page - Create new page
	rest.post('*/page', async (req, res, ctx) => {
		const body = await req.json() as PageContent;
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
		
		return res(ctx.json(newPage));
	}),

	// PUT /page - Update page
	rest.put('*/page', async (req, res, ctx) => {
		const body = await req.json() as PageContent;
		const pageIndex = mockWikiPages.findIndex(p => p.id === body.id);
		
		if (pageIndex >= 0 && mockWikiPages[pageIndex]) {
			const currentPage = mockWikiPages[pageIndex];
			const updatedPage = {
				...currentPage,
				...body,
				updatedAt: Date.now(),
				number: currentPage.number + 1
			};
			mockWikiPages[pageIndex] = updatedPage;
			return res(ctx.json(updatedPage));
		}
		return res(ctx.status(404), ctx.json({}));
	}),

	// GET /versions - Get page versions
	rest.get('*/versions', (req, res, ctx) => {
		const page = req.url.searchParams.get('page');
		const wiki = req.url.searchParams.get('wiki');
		const from = parseInt(req.url.searchParams.get('from') || '0');
		const size = parseInt(req.url.searchParams.get('size') || '10');
		
		const versions = mockWikiPages.filter(p => p.name === page && p.wiki === wiki);
		const paginatedVersions = versions.slice(from, from + size);
		
		return res(ctx.json(paginatedVersions));
	}),

	// GET /version - Get last version number
	rest.get('*/version', (req, res, ctx) => {
		const page = req.url.searchParams.get('page');
		const wiki = req.url.searchParams.get('wiki');
		const field = req.url.searchParams.get('field');
		
		if (field === 'lastVersionNumber') {
			const pageVersions = mockWikiPages.filter(p => p.name === page && p.wiki === wiki);
			const maxVersion = Math.max(...pageVersions.map(p => p.number));
			return res(ctx.json(maxVersion || 0));
		}
		
		return res(ctx.json(0));
	}),

	// GET /updates - Get latest updates
	rest.get('*/updates', (req, res, ctx) => {
		const wiki = req.url.searchParams.get('wiki');
		const from = parseInt(req.url.searchParams.get('from') || '0');
		const size = parseInt(req.url.searchParams.get('size') || '10');
		
		const wikiPages = mockWikiPages.filter(p => !wiki || p.wiki === wiki);
		const sortedPages = wikiPages.sort((a, b) => b.updatedAt - a.updatedAt);
		const paginatedPages = sortedPages.slice(from, from + size);
		
		return res(ctx.json(paginatedPages));
	}),

	// GET /search - Search pages
	rest.get('*/search', (req, res, ctx) => {
		const wiki = req.url.searchParams.get('wiki');
		const q = req.url.searchParams.get('q');
		
		if (!q) {
			return res(ctx.json([]));
		}
		
		const searchResults = mockWikiPages.filter(p => 
			(!wiki || p.wiki === wiki) && 
			(p.content.toLowerCase().includes(q.toLowerCase()) || 
			 p.name.toLowerCase().includes(q.toLowerCase()))
		);
		
		return res(ctx.json(searchResults));
	})
];