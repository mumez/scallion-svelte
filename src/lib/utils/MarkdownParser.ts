import { marked } from 'marked';

const externalCssClass = 'external';
const internalNewCssClass = 'internal-new';
const internalExistingCssClass = 'internal-existing';

const isInternalLink = (href: string): boolean => {
	return /[^/]+/.test(href);
};

export const htmlFrom = (markdown: string): string => {
	return marked.parse(markdown);
};

export const enrichedHtmlFrom = (markdown: string, existingPageNames: string[] = []): string => {
	const linkClass = (href: string): string => {
		if (!isInternalLink(href)) return externalCssClass;
		return existingPageNames.includes(href) ? internalExistingCssClass : internalNewCssClass;
	};

	const linkTitle = (href: string): string => {
		return linkClass(href) == internalNewCssClass ? 'create new page' : '';
	};

	const renderer = {
		link(href, title, text) {
			if (existingPageNames.length == 0) {
				return `<a href="${href}">
						${text}
						</a>`;
			}
			return `<a class="${linkClass(href)}" title="${linkTitle(href)}" href="${href}">
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
