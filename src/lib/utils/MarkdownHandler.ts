import { marked } from 'marked';
import { LinkRenderer } from './LinkRenderer';
import highlighter from '$lib/plugins/highlight';

const defaultOptions = { mangle: false, headerIds: false };

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
	context = {
		wikisBaseDirectory: 'wikis',
		attachmentsBaseUrl: '',
		isAttachmentOnly: false,
		newPageLinkTitle: ''
	}
): string => {
	const linkRenderer = new LinkRenderer(
		wikiName,
		existingPageNames,
		context.wikisBaseDirectory,
		context.attachmentsBaseUrl,
		context.newPageLinkTitle
	);
	return context.isAttachmentOnly
		? linkRenderer.renderForAttachment(href, text)
		: linkRenderer.render(href, text);
};

const renderCodeBlock = (code: string, language: string): string => {
	const detectedLanguage = highlighter.getLanguage(language);
	const validLanguage = detectedLanguage?.name ?? 'plaintext';
	const highlightedCode = highlighter.highlightAuto(code, [validLanguage]).value;
	return `<pre><code class="hljs ${validLanguage}">${highlightedCode}</code></pre>`;
};

export const htmlFrom = (markdown: string): string => {
	return marked.parse(markdown);
};

export const enrichedHtmlFrom = (
	markdown: string,
	wikiName: string,
	existingPageNames: string[] = [],
	wikisBaseDirectory = '',
	attachmentsBaseUrl = '',
	newPageLinkTitle = ''
): string => {
	const renderer = {
		code(code: string, language: string) {
			return renderCodeBlock(code, language);
		},
		link(href: string, title: string, text: string) {
			return renderLink(href, text, wikiName, existingPageNames, {
				wikisBaseDirectory,
				attachmentsBaseUrl,
				isAttachmentOnly: false,
				newPageLinkTitle
			});
		},
		image(href: string, title: string, text: string) {
			return renderLink(href, text, wikiName, existingPageNames, {
				wikisBaseDirectory,
				attachmentsBaseUrl,
				isAttachmentOnly: true,
				newPageLinkTitle
			});
		}
	};
	const options = { renderer, ...defaultOptions };
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
