// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/svelte';
import { load } from '../+page.ts';
import HomePage from '../+page.svelte';

// This test uses the MSW server to test the full data loading flow
import { server } from '$lib/mocks/node';
import { rest } from 'msw';
import type { WikiBook } from '$lib/models/WikiBook';

describe('HomePage Integration Tests', () => {
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
		},
		{
			ownedBy: '4saYpbYbngfMl6N4YPLWn8kJHAC2',
			id: 'test-wiki-id',
			title: 'Test Wiki',
			name: 'test',
			count: 10
		}
	];

	beforeEach(() => {
		vi.clearAllMocks();
		
		// Ensure the default MSW handler is active
		server.use(
			rest.get('*/wikis', (req, res, ctx) => {
				return res(ctx.json(mockWikiBooks));
			})
		);
	});

	it('loads wiki data from API and displays it', async () => {
		// Test the load function
		const mockFetch = global.fetch;
		const loadResult = await load({ fetch: mockFetch });
		
		expect(loadResult.books).toHaveLength(3);
		expect(loadResult.books).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ name: 'ume', title: 'ume wiki' }),
				expect.objectContaining({ name: 'squeak', title: 'squeak wiki' }),
				expect.objectContaining({ name: 'test', title: 'Test Wiki' })
			])
		);

		// Test that the component renders the loaded data
		render(HomePage, {
			props: {
				data: loadResult
			}
		});

		// Verify all wikis are displayed
		expect(screen.getByText('ume wiki')).toBeTruthy();
		expect(screen.getByText('squeak wiki')).toBeTruthy();
		expect(screen.getByText('Test Wiki')).toBeTruthy();
		
		// Verify page counts
		expect(screen.getByText('(6)')).toBeTruthy();
		expect(screen.getByText('(1)')).toBeTruthy();
		expect(screen.getByText('(10)')).toBeTruthy();
	});

	it('sorts wikis alphabetically by name', async () => {
		const unsortedWikis: WikiBook[] = [
			{
				ownedBy: 'user1',
				id: 'id1',
				title: 'Zebra Wiki',
				name: 'zebra',
				count: 1
			},
			{
				ownedBy: 'user1',
				id: 'id2',
				title: 'Apple Wiki',
				name: 'apple',
				count: 2
			},
			{
				ownedBy: 'user1',
				id: 'id3',
				title: 'Beta Wiki',
				name: 'beta',
				count: 3
			}
		];

		server.use(
			rest.get('*/wikis', (req, res, ctx) => {
				return res(ctx.json(unsortedWikis));
			})
		);

		const loadResult = await load({ fetch: global.fetch });
		
		// Should be sorted by name
		expect(loadResult.books[0]?.name).toBe('apple');
		expect(loadResult.books[1]?.name).toBe('beta');
		expect(loadResult.books[2]?.name).toBe('zebra');

		render(HomePage, {
			props: {
				data: loadResult
			}
		});

		// Verify they appear in the correct order in the DOM
		const listItems = screen.getAllByRole('listitem');
		expect(listItems[0]).toHaveTextContent('Apple Wiki');
		expect(listItems[1]).toHaveTextContent('Beta Wiki');
		expect(listItems[2]).toHaveTextContent('Zebra Wiki');
	});

	it('handles API errors gracefully', async () => {
		// Mock API failure
		server.use(
			rest.get('*/wikis', (req, res, ctx) => {
				return res(ctx.status(500), ctx.json({ error: 'Server error' }));
			})
		);

		const loadResult = await load({ fetch: global.fetch });
		
		// Should return empty array on error
		expect(loadResult.books).toEqual([]);

		render(HomePage, {
			props: {
				data: loadResult
			}
		});

		// Should render empty list without crashing
		expect(screen.getByRole('list')).toBeTruthy();
		expect(screen.queryAllByRole('listitem')).toHaveLength(0);
	});

	it('handles network errors gracefully', async () => {
		// Mock network failure
		server.use(
			rest.get('*/wikis', (req, res, ctx) => {
				return res.networkError('Failed to connect');
			})
		);

		const loadResult = await load({ fetch: global.fetch });
		
		// Should return empty array on network error
		expect(loadResult.books).toEqual([]);

		render(HomePage, {
			props: {
				data: loadResult
			}
		});

		// Should render empty list without crashing
		expect(screen.getByRole('list')).toBeTruthy();
		expect(screen.queryAllByRole('listitem')).toHaveLength(0);
	});

	it('displays correct number of wikis based on API response', async () => {
		const singleWiki: WikiBook[] = [
			{
				ownedBy: 'user1',
				id: 'single-id',
				title: 'Only Wiki',
				name: 'only',
				count: 42
			}
		];

		server.use(
			rest.get('*/wikis', (req, res, ctx) => {
				return res(ctx.json(singleWiki));
			})
		);

		const loadResult = await load({ fetch: global.fetch });
		
		expect(loadResult.books).toHaveLength(1);

		render(HomePage, {
			props: {
				data: loadResult
			}
		});

		const listItems = screen.getAllByRole('listitem');
		expect(listItems).toHaveLength(1);
		expect(screen.getByText('Only Wiki')).toBeTruthy();
		expect(screen.getByText('(42)')).toBeTruthy();
	});

	it('handles empty API response', async () => {
		server.use(
			rest.get('*/wikis', (req, res, ctx) => {
				return res(ctx.json([]));
			})
		);

		const loadResult = await load({ fetch: global.fetch });
		
		expect(loadResult.books).toEqual([]);

		render(HomePage, {
			props: {
				data: loadResult
			}
		});

		expect(screen.getByRole('list')).toBeTruthy();
		expect(screen.queryAllByRole('listitem')).toHaveLength(0);
	});

	it('creates functional links that match the expected routing', async () => {
		const loadResult = await load({ fetch: global.fetch });

		render(HomePage, {
			props: {
				data: loadResult
			}
		});

		// Test that all links are properly formed for SvelteKit routing
		const wikiLinks = screen.getAllByRole('link');
		const wikiPageLinks = wikiLinks.filter(link => 
			link.getAttribute('href')?.startsWith('wikis/')
		);
		const blikiLinks = wikiLinks.filter(link => 
			link.getAttribute('href')?.startsWith('blikis/')
		);

		// Should have one wiki page link and one bliki link per wiki
		expect(wikiPageLinks).toHaveLength(3);
		expect(blikiLinks).toHaveLength(3);

		// Verify specific link formats
		expect(wikiPageLinks.some(link => 
			link.getAttribute('href') === 'wikis/ume/index'
		)).toBe(true);
		expect(blikiLinks.some(link => 
			link.getAttribute('href') === 'blikis/ume'
		)).toBe(true);
	});
});