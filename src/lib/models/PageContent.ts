export interface PageContent {
    id: string;
    bookId: string;
    name: string;
    updatedAt: number;
    updatedBy: string;
    number: number;
    content: string;
    isLocked: boolean;
}

export const updatingPageContent = (originalContent: PageContent, contentText: string, updater: string): PageContent => {
    return {
        ...originalContent,
        content: contentText,
        updatedBy: updater,
    }
}