import { isInternalLink, isImageFileLink } from '$lib/utils/MarkdownHandler';

export const externalCssClass = 'external';
export const internalNewCssClass = 'internal-new';
export const internalExistingCssClass = 'internal-existing';

export class LinkRenderer {
	wikiName: string;
	existingPageNames: string[];
	baseAttachmentUrl = '';
	isInternal = false;
	constructor(wikiName: string, existingPageNames: string[], baseAttachmentUrl = '') {
		this.wikiName = wikiName;
		this.existingPageNames = existingPageNames;
		this.baseAttachmentUrl = baseAttachmentUrl;
	}

	public render(href: string, text: string): string {
		this.isInternal = isInternalLink(href);
		return isImageFileLink(href) ? this.renderImage(href, text) : this.renderPageHref(href, text);
	}
	public renderForAttachment(href: string, text: string): string {
		this.isInternal = isInternalLink(href);
		return isImageFileLink(href)
			? this.renderImage(href, text)
			: this.renderAttachmentHref(href, text);
	}

	private renderPageHref(href: string, text: string) {
		return `<a class="${this.linkHrefClass(href)}" title="${this.linkHrefTitle(
			href
		)}" href="${this.renderHrefLinkValue(href)}">${text}</a>`;
	}
	private renderAttachmentHref(href: string, text: string) {
		return `<a title="${this.linkAttachmentHrefTitle(href)}" href="${this.renderAttachmentHrefLinkValue(
			href
		)}">${text}</a>`;
	}
	private linkHrefClass(href: string): string {
		if (!this.isInternal) return externalCssClass;
		if (this.existingPageNames.length == 0) return internalNewCssClass;
		if (this.existingPageNames.includes(href)) return internalExistingCssClass;
		return internalNewCssClass;
	}
	private linkHrefTitle(href: string): string {
		const isInternalNew = this.linkHrefClass(href) == internalNewCssClass;
		return isInternalNew ? 'create new page' : href;
	}
	private linkAttachmentHrefTitle(href: string): string {
		return href;
	}

	private renderHrefLinkValue(href: string) {
		if (this.isInternal) return this.renderInternalHrefLinkValue(href);
		return href;
	}
	private renderInternalHrefLinkValue(href: string) {
		return `/wikis/${this.wikiName}/${href}`;
	}
	private renderAttachmentHrefLinkValue(href: string) {
		return this.adjustAttachmentPath(href);
	}
	private renderImage(path: string, text: string) {
		const srcPath = this.adjustAttachmentPath(path);
		return `<img class="w-full object-contain max-w-2xl" alt="${text}" title="${text}" src="${srcPath}"></img>`;
	}

	private adjustAttachmentPath(path: string) {
		if (isInternalLink(path)) return `${this.baseAttachmentUrl}/${path}`;
		return path;
	}
}
