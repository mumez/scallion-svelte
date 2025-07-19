import { writable } from 'svelte/store';

export interface ModalComponent {
	ref: unknown;
	props: any;
	slot: string;
}

export interface ModalState {
	isOpen: boolean;
	component?: unknown;
	props?: any;
	type?: 'component' | 'alert';
	title?: string;
	body?: string;
	image?: string;
}

export const modalState = writable<ModalState>({
	isOpen: false
});

export const asModalComponent = (component: unknown, props = {}): ModalComponent => {
	return {
		ref: component,
		props: props,
		slot: ''
	};
};

export const openModal = (component: unknown, props = {}) => {
	modalState.set({
		isOpen: true,
		component,
		props,
		type: 'component'
	});
};

export const openAlert = (title = '', body = '', image = '') => {
	modalState.set({
		isOpen: true,
		type: 'alert',
		title,
		body,
		image
	});
};

export const closeModal = () => {
	modalState.update(state => ({ ...state, isOpen: false }));
};
