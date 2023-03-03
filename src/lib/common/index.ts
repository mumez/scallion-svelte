export interface Some<T> {
	type: 'Some';
	value: T;
}
export interface None {
	type: 'None';
	value: null;
}
export type Option<T> = Some<T> | None;

export const none: None = {
	type: 'None',
	value: null
};

export function some<T>(obj: any): Some<T> {
	return {
		type: 'Some',
		value: obj
	};
}
