import { isInternalLink, isImageFileLink } from '$lib/utils/MarkdownParser';

export const externalCssClass = 'external';
export const internalNewCssClass = 'internal-new';
export const internalExistingCssClass = 'internal-existing';

export class LinkRenderer {
	wikiName: string;
	existingPageNames: string[];
	baseImageUrl = '';
	constructor(wikiName: string, existingPageNames: string[], baseImageUrl = '') {
		this.wikiName = wikiName;
		this.existingPageNames = existingPageNames;
		this.baseImageUrl = baseImageUrl;
	}
	private linkHrefClass(href: string, isInternal: boolean): string {
		if (!isInternal) return externalCssClass;
		if (this.existingPageNames.length == 0) return '';
		if (this.existingPageNames.includes(href)) return internalExistingCssClass;
		return internalNewCssClass;
	}
	private linkHrefTitle(href: string, isInternal: boolean): string {
		return isInternal ? 'create new page' : this.baseImageUrl;
	}
	private renderHref(href: string, text: string) {
		const isInternal = isInternalLink(href);
		return `<a class="${this.linkHrefClass(href, isInternal)}" title="${this.linkHrefTitle(
			href, isInternal
		)}" href="${this.renderHrefLinkValue(href, isInternal)}">${text}</a>`;
	}
	private renderHrefLinkValue(href: string, isInternal: boolean) {
		if (isInternal) return `/wikis/${this.wikiName}/${href}`;
		return href;
	}
	private renderImage(path: string, text: string) {
		const srcPath = this.adjustImageSrcPath(path);
		return `<img class="w-full object-contain max-w-2xl" alt="${text}" title="${text}" src="${srcPath}"></img>`;
	}

	private adjustImageSrcPath(path: string) {
		if (isInternalLink(path)) return `${this.baseImageUrl}/${path}`;
		return path;
	}

	public render(href: string, text: string): string {
		return isImageFileLink(href) ? this.renderImage(href, text) : this.renderHref(href, text);
	}
}
