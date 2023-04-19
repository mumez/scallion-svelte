export function debounce<F extends (...args: Parameters<F>) => unknown>(func: F, waitFor: number) {
	let timeoutId: ReturnType<typeof setTimeout> | undefined;
	return function (this: unknown, ...args: Parameters<F>) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func.apply(this, args), waitFor);
	};
}
