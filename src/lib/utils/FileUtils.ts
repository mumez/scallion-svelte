export const isImage = (fileName: string): boolean => {
	return /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(fileName);
};

export const extensionFrom = (fileName: string): string => {
	return fileName.slice((Math.max(0, fileName.lastIndexOf('.')) || Infinity) + 1);
};

export const concatPath = (pathA: string, pathB: string): string => {
	if (pathA.length == 0) return pathB;
	if (pathA.endsWith('/')) return `${pathA}${pathB}`;
	return `${pathA}/${pathB}`;
};
