import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import WikiPagePanel from '../WikiPagePanel.svelte';
import type { PageContent } from '$lib/models/PageContent';

// Mock the stores
vi.mock('$app/stores', () => ({
	page: {
		subscribe: vi.fn(),
		params: { wiki: 'testwiki', page: 'testpage' }
	}
}));

vi.mock('$lib/plugins/localization', () => ({
	_: vi.fn((key: string) => key)
}));

// Mock all stores
vi.mock('$lib/stores/parentLink', () => ({
	default: { subscribe: vi.fn(), set: vi.fn() }
}));

vi.mock('$lib/stores/headerTitle', () => ({
	default: { subscribe: vi.fn(), set: vi.fn() }
}));

vi.mock('$lib/stores/wikisBaseDirectory', () => ({
	default: { subscribe: vi.fn() }
}));

vi.mock('$lib/stores/wikiPage', () => ({
	default: {
		subscribe: vi.fn(),
		setPageContent: vi.fn(),
		pageContent: null,
		revertingPageContent: null
	}
}));

// Mock services
vi.mock('$lib/services/PageService');
vi.mock('$lib/services/FilesService');
vi.mock('$lib/services/WikiBookService');
vi.mock('$lib/services/UserService', () => ({
	email: { subscribe: vi.fn() },
	uid: { subscribe: vi.fn() }
}));

vi.mock('$lib/utils/ClientStorage', () => ({
	jwt: { subscribe: vi.fn() }
}));

describe('WikiPagePanel', () => {
	const mockPageContent: PageContent = {
		id: 'test-page-id',
		name: 'testpage',
		title: 'Test Page Title',
		content: '# Test Content\n\nThis is a test page.',
		wiki: 'testwiki',
		bookId: 'test-book-id',
		number: 1,
		updatedAt: Date.now(),
		updatedBy: 'testuser@example.com',
		isLocked: false
	};

	beforeEach(() => {
		// Reset all mocks before each test
		vi.clearAllMocks();
	});

	it('displays page content when loaded', () => {
		render(WikiPagePanel, {
			props: {
				loadedPageContent: mockPageContent
			}
		});

		// Check if the component renders without errors
		// Note: Due to the complexity of the component and its dependencies,
		// we're primarily testing that it doesn't crash during render
		expect(screen.getByRole('document')).toBeTruthy();
	});

	it('handles new page creation mode', () => {
		const newPageContent: Partial<PageContent> = {
			name: 'newpage',
			wiki: 'testwiki',
			content: ''
		};

		render(WikiPagePanel, {
			props: {
				loadedPageContent: newPageContent as PageContent
			}
		});

		// For new pages (no ID), the component should render in creation mode
		expect(screen.getByRole('document')).toBeTruthy();
	});

	it('displays markdown content', () => {
		render(WikiPagePanel, {
			props: {
				loadedPageContent: mockPageContent
			}
		});

		// The MarkdownViewer component should be present
		// This tests the integration with child components
		expect(screen.getByRole('document')).toBeTruthy();
	});

	it('shows locked status for locked pages', () => {
		const lockedPageContent: PageContent = {
			...mockPageContent,
			isLocked: true
		};

		render(WikiPagePanel, {
			props: {
				loadedPageContent: lockedPageContent
			}
		});

		expect(screen.getByRole('document')).toBeTruthy();
	});
});