import { browser } from '$app/environment';
import { init, register, _, locale, waitLocale } from 'svelte-v4-i18n';

const defaultLocale = 'en';

register('en', () => import('../../locales/en.json'));
register('ja', () => import('../../locales/ja.json'));

init({
	fallbackLocale: defaultLocale,
	initialLocale: browser ? window.navigator.language : defaultLocale
});

export { _, locale, waitLocale };
