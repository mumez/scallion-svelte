import { marked } from 'marked';
import { LinkRenderer } from './LinkRenderer';
import highlighter from '$lib/plugins/highlight';

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

const renderCodeBlock = (code: string, language: string): string => {
	const highlightedCode = highlighter.highlight(code, language);
	return `<pre><code class="hljs ${language}">${highlightedCode}</code></pre>`;
};


const renderLink = (
	href: string,
	text: string,
	wikiName: string,
	existingPageNames: string[],
	baseAttachmentUrl = '',
	isAttachmentOnly = false
): string => {
	const linkRenderer = new LinkRenderer(wikiName, existingPageNames, baseAttachmentUrl);
	return isAttachmentOnly
		? linkRenderer.renderForAttachment(href, text)
		: linkRenderer.render(href, text);
};

export const htmlFrom = (markdown: string): string => {
	return marked.parse(markdown);
};

export const enrichedHtmlFrom = (
	markdown: string,
	wikiName: string,
	existingPageNames: string[] = [],
	baseAttachmentUrl = ''
): string => {
	const renderer = {
		code(code: string, language: string) {
			return renderCodeBlock(code, language);
		},
		link(href: string, title: string, text: string) {
			return renderLink(href, text, wikiName, existingPageNames, baseAttachmentUrl, false);
		},
		image(href: string, title: string, text: string) {
			return renderLink(href, text, wikiName, existingPageNames, baseAttachmentUrl, true);
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
