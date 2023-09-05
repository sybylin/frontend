import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { lang } from 'src/i18n';

export const globalStore = defineStore('global', () => {
	const darkMode = ref<boolean>(false);
	const lang = ref<lang>('en-US');

	function setDarkMode (val: boolean) {
		darkMode.value = val;
		window.localStorage.setItem('darkMode', String(val));
	}

	function setLang (val: lang) {
		lang.value = val;
		window.localStorage.setItem('lang', String(val));
	}

	return {
		darkMode,
		lang,
		setDarkMode,
		setLang
	};
});
