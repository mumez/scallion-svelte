import { marked } from 'marked';
import { LinkRenderer } from './LinkRenderer';

const isInternalPageLink = (href: string): boolean => {
	return isInternalLink(href) && !isImageFileLink(href);
};

export const isInternalLink = (href: string): boolean => {
	return /^[^/]+$/.test(href);
};

export const isImageFileLink = (href: string): boolean => {
	const regex = /\.(jpg|jpeg|gif|png|svg)$/i;
	return regex.test(href);
};

const renderLink = (
	href: string,
	text: string,
	wikiName: string,
	existingPageNames: string[],
	baseImageUrl = ''
): string => {
	const linkRenderer = new LinkRenderer(wikiName, existingPageNames, baseImageUrl);
	return linkRenderer.render(href, text);
};

export const htmlFrom = (markdown: string): string => {
	return marked.parse(markdown);
};

export const enrichedHtmlFrom = (
	markdown: string,
	wikiName: string,
	existingPageNames: string[] = [],
	baseImageUrl = ''
): string => {
	const renderer = {
		link(href: string, title: string, text: string) {
			return renderLink(href, text, wikiName, existingPageNames, baseImageUrl);
		},
		image(href: string, title: string, text: string) {
			return renderLink(href, text, wikiName, existingPageNames, baseImageUrl);
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
