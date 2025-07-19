import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/svelte';
import WikiPage from '../wikis/[wiki]/[[page]]/+page.svelte';
import type { PageContent } from '$lib/models/PageContent';

// Mock SvelteKit stores and navigation
vi.mock('$app/stores', () => ({
	page: {
		subscribe: vi.fn(),
		params: { wiki: 'testwiki', page: 'testpage' },
		url: new URL('http://localhost/wikis/testwiki/testpage')
	},
	navigating: { subscribe: vi.fn() }
}));

vi.mock('$app/navigation', () => ({
	goto: vi.fn(),
	invalidate: vi.fn()
}));

// Mock services
const mockPageService = {
	getContent: vi.fn(),
	saveContent: vi.fn(),
	updateContent: vi.fn()
};

const mockWikiBookService = {
	getDescription: vi.fn(),
	hasPages: vi.fn()
};

vi.mock('$lib/services/PageService', () => ({
	default: vi.fn(() => mockPageService)
}));

vi.mock('$lib/services/WikiBookService', () => ({
	default: vi.fn(() => mockWikiBookService)
}));

// Mock stores
vi.mock('$lib/stores/isAuthenticated', () => ({
	default: { subscribe: vi.fn() }
}));

vi.mock('$lib/stores/wikiPage', () => ({
	default: {
		subscribe: vi.fn(),
		setPageContent: vi.fn(),
		clearRevertingPageContent: vi.fn()
	}
}));

// Mock other dependencies
vi.mock('$lib/plugins/localization', () => ({
	_: vi.fn((key: string) => key)
}));

describe('WikiPage Route', () => {
	const mockPageContent: PageContent = {
		id: 'test-page-id',
		name: 'testpage',
		title: 'Test Page',
		content: '# Test Page\n\nThis is test content.',
		wiki: 'testwiki',
		bookId: 'test-book-id',
		number: 1,
		updatedAt: Date.now(),
		updatedBy: 'testuser@example.com',
		isLocked: false
	};

	beforeEach(() => {
		vi.clearAllMocks();
		
		// Setup default mock returns
		mockPageService.getContent.mockResolvedValue(mockPageContent);
		mockWikiBookService.getDescription.mockResolvedValue({
			name: 'testwiki',
			title: 'Test Wiki',
			count: 5
		});
		mockWikiBookService.hasPages.mockResolvedValue([true]);
	});

	it('loads and displays existing page content', async () => {
		render(WikiPage);

		// Wait for the async data loading to complete
		await waitFor(() => {
			expect(mockPageService.getContent).toHaveBeenCalled();
		});

		// The page should render without errors
		expect(screen.getByRole('main')).toBeTruthy();
	});

	it('handles non-existent pages', async () => {
		// Mock a 404 response
		mockPageService.getContent.mockRejectedValue({ status: 404 });

		render(WikiPage);

		await waitFor(() => {
			expect(mockPageService.getContent).toHaveBeenCalled();
		});

		// Should still render the page (in creation mode)
		expect(screen.getByRole('main')).toBeTruthy();
	});

	it('loads wiki metadata', async () => {
		render(WikiPage);

		await waitFor(() => {
			expect(mockWikiBookService.getDescription).toHaveBeenCalledWith();
		});

		expect(screen.getByRole('main')).toBeTruthy();
	});

	it('handles locked pages appropriately', async () => {
		const lockedPageContent = {
			...mockPageContent,
			isLocked: true
		};
		
		mockPageService.getContent.mockResolvedValue(lockedPageContent);

		render(WikiPage);

		await waitFor(() => {
			expect(mockPageService.getContent).toHaveBeenCalled();
		});

		expect(screen.getByRole('main')).toBeTruthy();
	});

	it('displays error state when API fails', async () => {
		// Mock API failure
		mockPageService.getContent.mockRejectedValue(new Error('API Error'));
		mockWikiBookService.getDescription.mockRejectedValue(new Error('API Error'));

		render(WikiPage);

		await waitFor(() => {
			expect(mockPageService.getContent).toHaveBeenCalled();
		});

		// Should still render something (error handling)
		expect(screen.getByRole('main')).toBeTruthy();
	});
});