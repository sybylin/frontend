import { boot } from 'quasar/wrappers';
import { globalStore } from 'src/stores/global';
import type { lang } from 'src/i18n';

export default boot((ctx) => {
	const store = globalStore();

	if (!ctx.ssrContext) {
		const darkMode = window.localStorage.getItem('darkMode');
		const lang = window.localStorage.getItem('lang') as lang;
		const isConnected = window.localStorage.getItem('isConnected');

		if (darkMode)
			store.setDarkMode(darkMode === 'true');
		if (lang)
			store.setLang(lang);
		if (isConnected)
			store.setIsConnected(isConnected === 'true');
	}
});
