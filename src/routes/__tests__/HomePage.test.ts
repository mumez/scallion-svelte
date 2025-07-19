import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/svelte';
import HomePage from '../+page.svelte';
import type { WikiBook } from '$lib/models/WikiBook';

// Mock data matching the API mock
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

describe('HomePage - Wiki List Display', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('displays all wikis from the data prop', () => {
		const mockData = {
			books: mockWikiBooks
		};

		render(HomePage, {
			props: {
				data: mockData
			}
		});

		// Check that both wiki titles are displayed
		expect(screen.getByText('ume wiki')).toBeTruthy();
		expect(screen.getByText('squeak wiki')).toBeTruthy();
	});

	it('shows wiki page counts', () => {
		const mockData = {
			books: mockWikiBooks
		};

		render(HomePage, {
			props: {
				data: mockData
			}
		});

		// Check that page counts are displayed
		expect(screen.getByText('(6)')).toBeTruthy();
		expect(screen.getByText('(1)')).toBeTruthy();
	});

	it('creates correct links to wiki pages', () => {
		const mockData = {
			books: mockWikiBooks
		};

		render(HomePage, {
			props: {
				data: mockData
			}
		});

		// Check that links are correctly formatted
		const umeWikiLink = screen.getByRole('link', { name: 'ume wiki' });
		expect(umeWikiLink.getAttribute('href')).toBe('wikis/ume/index');
		expect(umeWikiLink.getAttribute('title')).toBe('ume wiki');

		const squeakWikiLink = screen.getByRole('link', { name: 'squeak wiki' });
		expect(squeakWikiLink.getAttribute('href')).toBe('wikis/squeak/index');
		expect(squeakWikiLink.getAttribute('title')).toBe('squeak wiki');
	});

	it('creates correct bliki links', () => {
		const mockData = {
			books: mockWikiBooks
		};

		render(HomePage, {
			props: {
				data: mockData
			}
		});

		// Check bliki links
		const blikiLinks = screen.getAllByText('bliki');
		expect(blikiLinks).toHaveLength(2);
		
		// Get parent li elements to check the correct bliki links
		const listItems = screen.getAllByRole('listitem');
		
		// First wiki (ume) bliki link
		const umeBlikiLink = listItems[0]?.querySelector('a[href*="blikis"]');
		expect(umeBlikiLink?.getAttribute('href')).toBe('blikis/ume');
		
		// Second wiki (squeak) bliki link  
		const squeakBlikiLink = listItems[1]?.querySelector('a[href*="blikis"]');
		expect(squeakBlikiLink?.getAttribute('href')).toBe('blikis/squeak');
	});

	it('handles wikis with custom initial page names', () => {
		const wikiWithCustomInitialPage: WikiBook = {
			ownedBy: '4saYpbYbngfMl6N4YPLWn8kJHAC2',
			id: 'custom-wiki-id',
			title: 'Custom Wiki',
			name: 'custom',
			count: 3,
			initialPageName: 'welcome'
		};

		const mockData = {
			books: [wikiWithCustomInitialPage]
		};

		render(HomePage, {
			props: {
				data: mockData
			}
		});

		// Should link to the custom initial page
		const customWikiLink = screen.getByRole('link', { name: 'Custom Wiki' });
		expect(customWikiLink.getAttribute('href')).toBe('wikis/custom/welcome');
	});

	it('handles empty wiki list', () => {
		const mockData = {
			books: []
		};

		render(HomePage, {
			props: {
				data: mockData
			}
		});

		// Should render the container but no list items
		expect(screen.getByRole('list')).toBeTruthy();
		expect(screen.queryAllByRole('listitem')).toHaveLength(0);
	});

	it('handles missing data prop', () => {
		const mockData = {
			// books property missing
		};

		render(HomePage, {
			props: {
				data: mockData
			}
		});

		// Should handle undefined books gracefully
		expect(screen.getByRole('list')).toBeTruthy();
		expect(screen.queryAllByRole('listitem')).toHaveLength(0);
	});

	it('displays wikis in correct list structure', () => {
		const mockData = {
			books: mockWikiBooks
		};

		render(HomePage, {
			props: {
				data: mockData
			}
		});

		// Check overall structure
		const list = screen.getByRole('list');
		expect(list).toBeTruthy();
		expect(list.classList.contains('list-disc')).toBe(true);

		// Check list items
		const listItems = screen.getAllByRole('listitem');
		expect(listItems).toHaveLength(2);
		
		// Check that each list item has the correct class
		listItems.forEach(item => {
			expect(item.classList.contains('text-xl')).toBe(true);
		});
	});

	it('has correct accessibility attributes', () => {
		const mockData = {
			books: mockWikiBooks
		};

		render(HomePage, {
			props: {
				data: mockData
			}
		});

		// Check that links have proper title attributes
		const umeLink = screen.getByRole('link', { name: 'ume wiki' });
		expect(umeLink.getAttribute('title')).toBe('ume wiki');

		const squeakLink = screen.getByRole('link', { name: 'squeak wiki' });
		expect(squeakLink.getAttribute('title')).toBe('squeak wiki');

		// Check that bliki links also have title attributes
		const listItems = screen.getAllByRole('listitem');
		const umeBlikiLink = listItems[0]?.querySelector('a[href*="blikis"]');
		const squeakBlikiLink = listItems[1]?.querySelector('a[href*="blikis"]');
		
		expect(umeBlikiLink?.getAttribute('title')).toBe('ume wiki');
		expect(squeakBlikiLink?.getAttribute('title')).toBe('squeak wiki');
	});
});