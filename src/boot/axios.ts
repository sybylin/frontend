import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';

export const api = axios.create({
	baseURL: (import.meta.env.DEV)
		? 'http://localhost:3000'
		: 'https://api.sibyllin.app',
	proxy: (import.meta.env.DEV)
		? false
		: undefined
});

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    /**
		 * Get axios instance
		 */
		$axios: AxiosInstance;
		/**
		 * Get axios instance connected to official api
		 */
    $api: AxiosInstance;
  }
}

export default boot(({ app }) => {
	app.config.globalProperties.$axios = axios;
	app.config.globalProperties.$api = api;
});
