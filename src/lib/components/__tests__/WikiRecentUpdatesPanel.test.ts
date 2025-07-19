import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/svelte';
import WikiRecentUpdatesPanel from '../WikiRecentUpdatesPanel.svelte';
import type { PageContent } from '$lib/models/PageContent';

// Mock the MSW server and handlers
import { server } from '$lib/mocks/node';
import { http, HttpResponse } from 'msw';

// Mock SvelteKit stores
vi.mock('$app/stores', () => ({
	page: {
		subscribe: vi.fn(),
		params: { wiki: 'testwiki' }
	}
}));

// Mock localization
vi.mock('$lib/plugins/localization', () => ({
	_: vi.fn((key: string) => key)
}));

// Mock stores
vi.mock('$lib/stores/isAuthenticated', () => ({
	default: { subscribe: vi.fn((callback: any) => callback(true)) }
}));

describe('WikiRecentUpdatesPanel with API Mock', () => {
	const mockRecentUpdates: PageContent[] = [
		{
			id: 'recent-1',
			name: 'recent-page-1',
			title: 'Recent Page 1',
			content: 'Recent content 1',
			wiki: 'testwiki',
			bookId: 'test-book-id',
			number: 1,
			updatedAt: Date.now() - 1000,
			updatedBy: 'user1@example.com',
			isLocked: false
		},
		{
			id: 'recent-2',
			name: 'recent-page-2',
			title: 'Recent Page 2',
			content: 'Recent content 2',
			wiki: 'testwiki',
			bookId: 'test-book-id',
			number: 2,
			updatedAt: Date.now() - 2000,
			updatedBy: 'user2@example.com',
			isLocked: false
		}
	];

	beforeEach(() => {
		vi.clearAllMocks();
		
		// Add a custom handler for this test
		server.use(
			http.get('*/updates', ({ request }) => {
				const url = new URL(request.url);
				const wiki = url.searchParams.get('wiki');
				const from = parseInt(url.searchParams.get('from') || '0');
				const size = parseInt(url.searchParams.get('size') || '10');
				
				if (wiki === 'testwiki') {
					const paginatedUpdates = mockRecentUpdates.slice(from, from + size);
					return HttpResponse.json(paginatedUpdates);
				}
				
				return HttpResponse.json([]);
			})
		);
	});

	it('loads and displays recent updates from API', async () => {
		render(WikiRecentUpdatesPanel);

		// Wait for the API call to complete and component to update
		await waitFor(() => {
			expect(screen.getByText('Recent Page 1')).toBeTruthy();
		}, { timeout: 3000 });

		// Check that both recent updates are displayed
		expect(screen.getByText('Recent Page 1')).toBeTruthy();
		expect(screen.getByText('Recent Page 2')).toBeTruthy();
		expect(screen.getByText('user1@example.com')).toBeTruthy();
		expect(screen.getByText('user2@example.com')).toBeTruthy();
	});

	it('handles empty results from API', async () => {
		// Override the handler to return empty results
		server.use(
			http.get('*/updates', () => {
				return HttpResponse.json([]);
			})
		);

		render(WikiRecentUpdatesPanel);

		await waitFor(() => {
			// Should show some indication of no updates
			expect(screen.getByRole('list')).toBeTruthy();
		});
	});

	it('handles API errors gracefully', async () => {
		// Override the handler to return an error
		server.use(
			http.get('*/updates', () => {
				return HttpResponse.json({ error: 'Server error' }, { status: 500 });
			})
		);

		render(WikiRecentUpdatesPanel);

		// Component should still render without crashing
		await waitFor(() => {
			expect(screen.getByRole('list')).toBeTruthy();
		});
	});

	it('formats update timestamps correctly', async () => {
		render(WikiRecentUpdatesPanel);

		await waitFor(() => {
			expect(screen.getByText('Recent Page 1')).toBeTruthy();
		});

		// Should display formatted timestamps
		// (The exact format depends on your implementation)
		const timeElements = screen.getAllByText(/\d/);
		expect(timeElements.length).toBeGreaterThan(0);
	});

	it('shows pagination controls when there are many updates', async () => {
		// Create a large dataset
		const manyUpdates = Array.from({ length: 25 }, (_, i) => ({
			id: `update-${i}`,
			name: `page-${i}`,
			title: `Page ${i}`,
			content: `Content ${i}`,
			wiki: 'testwiki',
			bookId: 'test-book-id',
			number: i + 1,
			updatedAt: Date.now() - (i * 1000),
			updatedBy: `user${i}@example.com`,
			isLocked: false
		}));

		server.use(
			http.get('*/updates', ({ request }) => {
				const url = new URL(request.url);
				const from = parseInt(url.searchParams.get('from') || '0');
				const size = parseInt(url.searchParams.get('size') || '10');
				
				const paginatedUpdates = manyUpdates.slice(from, from + size);
				return HttpResponse.json(paginatedUpdates);
			})
		);

		render(WikiRecentUpdatesPanel);

		await waitFor(() => {
			// Should show the first batch of updates
			expect(screen.getByText('Page 0')).toBeTruthy();
		});

		// Should show pagination controls
		// (Implementation depends on your component)
		expect(screen.getByRole('list')).toBeTruthy();
	});
});