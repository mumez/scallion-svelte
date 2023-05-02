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

const renderLink = (
	href: string,
	text: string,
	wikiName: string,
	existingPageNames: string[],
	context = {
		wikiBasePart: 'wikis',
		attachmentsBaseUrl: '',
		isAttachmentOnly: false
	}
): string => {
	const linkRenderer = new LinkRenderer(
		wikiName,
		existingPageNames,
		context.wikiBasePart,
		context.attachmentsBaseUrl
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
	wikiBasePart = '',
	attachmentsBaseUrl = ''
): string => {
	const renderer = {
		code(code: string, language: string) {
			return renderCodeBlock(code, language);
		},
		link(href: string, title: string, text: string) {
			return renderLink(
				href,
				text,
				wikiName,
				existingPageNames,
				{
					wikiBasePart,
					attachmentsBaseUrl,
					isAttachmentOnly: false
				}
			);
		},
		image(href: string, title: string, text: string) {
			return renderLink(
				href,
				text,
				wikiName,
				existingPageNames,
				{
					wikiBasePart,
					attachmentsBaseUrl,
					isAttachmentOnly: true
				}
			);
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
