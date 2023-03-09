
import { modalStore } from '@skeletonlabs/skeleton';
import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton/utilities/Modal/types';

export const openModal = (modalComponent: ModalComponent) => {
    const settings: ModalSettings = {
        type: 'component',
        component: modalComponent,
    };
    modalStore.trigger(settings);
}

export const openAlert = (title = '', body = '', image = '') => {
    const settings: ModalSettings = {
        type: 'alert',
        title: title,
        body: body,
        image: image
    };
    modalStore.trigger(settings);
}

export const closeModal = () => { modalStore.close(); }
