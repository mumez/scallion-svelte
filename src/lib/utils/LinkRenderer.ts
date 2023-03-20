import { isInternalLink, isImageFileLink } from '$lib/utils/MarkdownParser';

export const externalCssClass = 'external';
export const internalNewCssClass = 'internal-new';
export const internalExistingCssClass = 'internal-existing';

export class LinkRenderer {
    existingPageNames: string[];
    baseImageUrl = '';
    constructor(existingPageNames: string[], baseImageUrl = '') {
        this.existingPageNames = existingPageNames;
        this.baseImageUrl = baseImageUrl;
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
        if (isInternalLink(src)) return `${this.baseImageUrl}${src}`;
        return src;
    }

    public render(href: string, text: string): string {
        return isImageFileLink(href) ? this.renderImage(href, text) : this.renderHref(href, text);
    }
}
