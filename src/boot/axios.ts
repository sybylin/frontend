import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { hasAchievement } from './custom';
import { globalStore } from 'src/stores/global';

export type serverAchievement = { name: string, timestamp: Date };
export const xsrfName = 'x-xsrf-token';
export const frontBaseUrl = (import.meta.env.DEV)
	? 'http://localhost:9100'
	: 'https://sybyl.in';
export const baseURL = (import.meta.env.DEV)
	? 'http://localhost:3000'
	: 'https://api.sybyl.in';
export const api = axios.create({
	baseURL,
	proxy: (import.meta.env.DEV)
		? false
		: undefined,
	withCredentials: true
});

/**
 * Automatically add xsrf header and lang to request
 */
api.interceptors.request.use(
	(c) => {
		const { lang } = globalStore();
		const xsrfHeader = (typeof localStorage !== 'undefined')
			? localStorage.getItem(xsrfName) ?? undefined
			: undefined;
		if (c.method) {
			if (
				['get', 'delete'].includes(c.method.toLowerCase()) ||
				!c.data
			) {
				if (!c.params)
					c.params = { lang };
				else
					c.params.lang = lang;
			} else {
				if (c.data instanceof FormData)
					(c.data as FormData).append('lang', lang);
				else if (!Object.keys(c.data).length)
					c.data = { lang };
				else
					c.data.lang = lang;
			}
		}
		if (xsrfHeader !== undefined)
			c.headers.set(xsrfName, JSON.parse(xsrfHeader));
		return c;
	}
);

/**
 * Intercept achievements send by server to client
 */
const sortAchievements = (a: serverAchievement, b: serverAchievement): number => {
	const aTime = new Date(a.timestamp).getTime(), bTime = new Date(b.timestamp).getTime();

	if (aTime < bTime)
		return -1;
	if (aTime > bTime)
		return 1;
	return 0;
};

api.interceptors.response.use(
	(c) => {
		if (c.data && Object.prototype.hasOwnProperty.call(c.data, 'achievements')) {
			const achievements = (c.data.achievements as { name: string, timestamp: Date }[]).sort(sortAchievements);
			for (const achievement of achievements)
				hasAchievement(achievement);
		}
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
