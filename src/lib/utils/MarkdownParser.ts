import { marked } from 'marked';

const isInternalLink = (href: string): boolean => {
	return /[^/]+/.test(href);
};

export const htmlFrom = (markdown: string): string => {
	return marked.parse(markdown);
};

export const enrichedHtmlFrom = (markdown: string, existingPageNames: string[] = []): string => {
	const linkClass = (href: string): string => {
		if (!isInternalLink(href)) return 'external';
		return existingPageNames.includes(href) ? 'internal-existing' : 'internal-new';
	};

	const linkTitle = (href: string): string => {
		return linkClass(href) == 'internal-new' ? 'create new page' : '';
	};

	const renderer = {
		link(href, title, text) {
			return `
					<a class="${linkClass(href)}" title="${linkTitle(href)}" href="${href}">
						${text}
					</a>`;
		}
	};

	const options = { renderer };
	marked.use(options);
	return marked.parse(markdown);
};

export const extractInternalLinks = (markdown: string): string[] => {
	const internalLinks: string[] = [];
	const tokens = marked.lexer(markdown);
	marked.walkTokens(tokens, (token) => {
		if (token.type === 'link' && isInternalLink(token.href)) {
			internalLinks.push(token.href);
		}
	});
	return internalLinks;
};
