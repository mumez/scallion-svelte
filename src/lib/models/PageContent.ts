interface PageContent {
    id: string;
    bookId: string;
    name: string;
    updatedAt: number;
    updatedBy: string;
    number: number;
    content: string;
    isLocked: boolean;
}

export default PageContent;
