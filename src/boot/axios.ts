import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { hasAchievement } from './custom';

export const xsrfName = 'x-xsrf-token';
export const achievementName = 'x-achievement';

export const api = axios.create({
	baseURL: (import.meta.env.DEV)
		? 'http://localhost:3000'
		: 'https://api.sibyllin.app',
	proxy: (import.meta.env.DEV)
		? false
		: undefined,
	withCredentials: true
});

/**
 * Automatically add xsrf header to request
 */
api.interceptors.request.use(
	(c) => {
		if (typeof localStorage !== 'undefined') {
			const xsrfHeader = localStorage.getItem(xsrfName);
			if (xsrfHeader)
				c.headers.set(xsrfName, JSON.parse(xsrfHeader));
		}
		return c;
	},
	(e) => {
		if (import.meta.env.DEV)
			console.error('Axios interceptor request', e);
	}
);

api.interceptors.response.use(
	(c) => {
		const achievementHeader = c.headers[achievementName] as string | null;
		if (achievementHeader)
			hasAchievement(achievementHeader);
		return c;
	}
);

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
	app.provide('$axios', axios);

	app.config.globalProperties.$api = api;
	app.provide('$api', api);
});
