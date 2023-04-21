export interface PageContent {
	id: string;
	bookId: string;
	wiki: string;
	name: string;
	ownedBy?: string;
	updatedAt: number;
	updatedBy: string;
	number: number;
	content: string;
	isLocked: boolean;
}

export const updatingPageContent = (
	originalContent: PageContent,
	contentText: string,
	updater: string,
	isLocked = false
): PageContent => {
	return {
		...originalContent,
		content: contentText,
		updatedBy: updater,
		isLocked
	};
};

export const newPageContent = (wiki: string, name: string, updater: string): PageContent => {
	return {
		wiki,
		name,
		content: '',
		updatedBy: updater,
		id: '',
		bookId: '',
		updatedAt: 0,
		number: 0,
		isLocked: false
	};
};
