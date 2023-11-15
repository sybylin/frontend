import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { lang } from 'src/i18n';
import type { authorizationLevel } from 'src/boot/authorization';

export const globalStore = defineStore('global', () => {
	const darkMode = ref<boolean>(false);
	const lang = ref<lang>('en-US');
	const isConnected = ref<boolean>(false);
	const role = ref<authorizationLevel>('user');

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

	return {
		darkMode,
		lang,
		isConnected,
		role,
		setDarkMode,
		setLang,
		setIsConnected,
		setRole
	};
});
