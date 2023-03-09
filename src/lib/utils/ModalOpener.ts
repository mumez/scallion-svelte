import { modalStore } from '@skeletonlabs/skeleton';
import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton/utilities/Modal/types';

export const asModalComponent = (component: unknown, props = {}): ModalComponent => {
	return {
		ref: component,
		props: props,
		slot: ''
	};
};

export const openModal = (component: unknown, props = {}) => {
	const modalComponent = asModalComponent(component, props);
	const settings: ModalSettings = {
		type: 'component',
		component: modalComponent
	};
	modalStore.trigger(settings);
};

export const openAlert = (title = '', body = '', image = '') => {
	const settings: ModalSettings = {
		type: 'alert'
	};
	if (title) {
		settings.title = title;
	}
	if (body) {
		settings.body = body;
	}
	if (image) {
		settings.image = image;
	}
	modalStore.trigger(settings);
};

export const closeModal = () => {
	modalStore.close();
};
