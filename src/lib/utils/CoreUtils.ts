
export function debounce<F extends (...args: any) => any>(func: F, waitFor: number) {
	let timeoutId: ReturnType<typeof setTimeout> | undefined;
	return function (this: any, ...args: Parameters<F>) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func.apply(this, args), waitFor);
	};
}