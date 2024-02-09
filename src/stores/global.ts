import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { lang } from 'src/i18n';
import type { user } from 'src/types';
import type { authorizationLevel } from 'src/boot/authorization';

export const globalStore = defineStore('global', () => {
	const darkMode = ref<boolean>(false);
	const lang = ref<lang>('en-US');
	const isConnected = ref<boolean>(false);
	const role = ref<authorizationLevel>('user');
	const user = ref<user | null>(null);

	function setDarkMode (val: boolean) {
		darkMode.value = val;
		window.localStorage.setItem('darkMode', String(val));
	}

	function setLang (val: lang) {
		lang.value = val;
		window.localStorage.setItem('lang', String(val));
	}

	function setIsConnected (val: boolean) {
		isConnected.value = val;
	}

	function setRole (val: authorizationLevel) {
		role.value = val;
	}

	function setUser (val: user | null) {
		user.value = val;
	}

	return {
		darkMode,
		lang,
		isConnected,
		role,
		user,

		setDarkMode,
		setLang,
		setIsConnected,
		setRole,
		setUser
	};
});

export const hydrate = () => {
	const darkMode = window.localStorage.getItem('darkMode');
	const lang = window.localStorage.getItem('lang') as lang;
	const isConnected = window.localStorage.getItem('isConnected');

	if (darkMode)
		globalStore().setDarkMode(darkMode === 'true');
	if (lang)
		globalStore().setLang(lang);
	if (isConnected)
		globalStore().setIsConnected(isConnected === 'true');
};
