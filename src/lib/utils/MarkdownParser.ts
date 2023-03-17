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

class LinkRenderer {
	existingPageNames: string[];
	constructor(existingPageNames: string[]) {
		this.existingPageNames = existingPageNames;
	}
	private linkHrefClass(href: string): string {
		if (!isInternalLink(href)) return externalCssClass;
		if (this.existingPageNames.length == 0) return '';
		if (this.existingPageNames.includes(href)) return internalExistingCssClass;
		return internalNewCssClass;
	}
	private linkHrefTitle(href: string): string {
		return this.linkHrefClass(href) == internalNewCssClass ? 'create new page' : '';
	}

	private renderHref(href: string, text: string) {
		return `<a class="${this.linkHrefClass(href)}" title="${this.linkHrefTitle(
			href
		)}" href="${href}">${text}</a>`;
	}
	private renderImage(src: string, text: string) {
		const srcPath = this.adjustImageSrcPath(src);
		return `<img class="w-full object-contain max-w-2xl" alt="${text}" title="${text}" src="${srcPath}"></img>`;
	}

	private adjustImageSrcPath(src: string) {
		if (!isInternalLink(src)) return src;
		return src;
	}

	public render(href: string, text: string): string {
		return isImageFileLink(href) ? this.renderImage(href, text) : this.renderHref(href, text);
	}
}

const renderLink = (href: string, text: string, existingPageNames: string[]): string => {
	const linkRenderer = new LinkRenderer(existingPageNames);
	return linkRenderer.render(href, text);
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
