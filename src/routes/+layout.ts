import { browser } from '$app/environment';
import '$lib/plugins/localization';
import { locale, waitLocale } from '$lib/plugins/localization';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
	if (browser) {
		locale.set(window.navigator.language);
	}
	await waitLocale();
};
