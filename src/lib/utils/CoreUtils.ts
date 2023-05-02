export function getLatestUpdates<T>(
	items: T[],
	keyProp: keyof T,
	compareProp: keyof T
): T[] {
	return Object.values(
		items.reduce((acc: Record<string, T>, item) => {
			const key = String(item[keyProp]);
			const compareValue = item[compareProp];
			const current = acc[key];
			if (
				!current ||
				(current[compareProp] < compareValue)
			) {
				acc[key] = item;
			}
			return acc;
		}, {})
	);
}