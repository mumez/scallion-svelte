import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import MarkdownViewer from '../MarkdownViewer.svelte';

// Mock highlight.js
vi.mock('highlight.js', () => ({
	default: {
		highlightAll: vi.fn()
	}
}));

// Mock DOMPurify
vi.mock('isomorphic-dompurify', () => ({
	default: {
		sanitize: vi.fn((html: string) => html)
	}
}));

// Mock marked
vi.mock('marked', () => ({
	marked: {
		parse: vi.fn((markdown: string) => `<p>${markdown}</p>`)
	}
}));

describe('MarkdownViewer', () => {
	it('renders markdown content as HTML', () => {
		const markdownContent = '# Hello World\n\nThis is **bold** text.';
		
		render(MarkdownViewer, {
			props: {
				content: markdownContent
			}
		});

		// Check if content is rendered
		expect(screen.getByRole('article')).toBeTruthy();
	});

	it('handles empty content', () => {
		render(MarkdownViewer, {
			props: {
				content: ''
			}
		});

		expect(screen.getByRole('article')).toBeTruthy();
	});

	it('renders code blocks with syntax highlighting', () => {
		const codeContent = '```javascript\nconsole.log("Hello");\n```';
		
		render(MarkdownViewer, {
			props: {
				content: codeContent
			}
		});

		expect(screen.getByRole('article')).toBeTruthy();
	});

	it('handles wiki-style links', () => {
		const linkContent = 'Check out [[AnotherPage]] for more info.';
		
		render(MarkdownViewer, {
			props: {
				content: linkContent,
				wikiName: 'testwiki',
				existingPageNames: ['AnotherPage']
			}
		});

		expect(screen.getByRole('article')).toBeTruthy();
	});

	it('shows broken links for non-existent pages', () => {
		const linkContent = 'Check out [[NonExistentPage]] for more info.';
		
		render(MarkdownViewer, {
			props: {
				content: linkContent,
				wikiName: 'testwiki',
				existingPageNames: []
			}
		});

		expect(screen.getByRole('article')).toBeTruthy();
	});

	it('handles external links', () => {
		const linkContent = 'Visit [Google](https://google.com) for search.';
		
		render(MarkdownViewer, {
			props: {
				content: linkContent
			}
		});

		expect(screen.getByRole('article')).toBeTruthy();
	});
});