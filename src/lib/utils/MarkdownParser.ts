import { marked } from 'marked';

const externalCssClass = 'external';
const internalNewCssClass = 'internal-new';
const internalExistingCssClass = 'internal-existing';

const isInternalPageLink = (href: string): boolean => {
	return isInternalLink(href) && !isImageFileLink(href);
};

const isInternalLink = (href: string): boolean => {
	return /[^/]+/.test(href);
};

const isImageFileLink = (href: string): boolean => {
	const regex = /\.(jpg|jpeg|gif|png|svg)$/i;
	return regex.test(href);
};

const renderLink = (href: string, text: string, existingPageNames: string[]): string => {
	const linkHrefClass = (href: string): string => {
		if (!isInternalLink(href)) return externalCssClass;
		if (existingPageNames.length == 0) return '';
		if (existingPageNames.includes(href)) return internalExistingCssClass;
		return internalNewCssClass;
	};
	const linkHrefTitle = (href: string): string => {
		return linkHrefClass(href) == internalNewCssClass ? 'create new page' : '';
	};

	const renderHref = (href: string, text: string) => {
		return `<a class="${linkHrefClass(href)}" title="${linkHrefTitle(href)}" href="${href}">${text}</a>`;
	}
	const renderImage = (href: string, text: string) => {
		return `<img class="hoge" width="50%" alt="${text}" title="${text}" src="${href}"></img>`;
	}

	return (isImageFileLink(href)) ? renderImage(href, text) : renderHref(href, text);
};

export const htmlFrom = (markdown: string): string => {
	return marked.parse(markdown);
};

export const enrichedHtmlFrom = (markdown: string, existingPageNames: string[] = []): string => {
	const renderer = {
		link(href: string, title: string, text: string) {
			return renderLink(href, text, existingPageNames);
		}
	};
	const options = { renderer };
	marked.use(options);
	return marked.parse(markdown);
};

export const extractInternalPageLinks = (markdown: string): string[] => {
	const internalLinks: string[] = [];
	const tokens = marked.lexer(markdown);
	marked.walkTokens(tokens, (token) => {
		if (token.type === 'link' && isInternalPageLink(token.href)) {
			internalLinks.push(token.href);
		}
	});
	return internalLinks;
};
