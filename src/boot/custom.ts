/* eslint-disable eqeqeq */
import { boot } from 'quasar/wrappers';

/**
 * Get mapcraft api url
 */
export const apiUrl = (path?: string): string => {
	if (path) {
		return (import.meta.env.DEV)
			? `http://localhost:3000/${path}`
			: `https://api.sibyllin.app/${path}`;
	}
	return (import.meta.env.DEV)
		? 'http://localhost:3000'
		: 'https://api.sibyllin.app';
};

/**
 * Capitalize string
*/
export const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Get os name of user
 */
export type osType = 'windows' | 'macintosh' | 'linux' | 'android' | 'ios' | undefined;
export const os = (): osType => {
	if (navigator.userAgent.indexOf('Win') != -1) return 'windows';
	if (navigator.userAgent.indexOf('Mac') != -1) return 'macintosh';
	if (navigator.userAgent.indexOf('Linux') != -1) return 'linux';
	if (navigator.userAgent.indexOf('Android') != -1) return 'android';
	if (navigator.userAgent.indexOf('like Mac') != -1) return 'ios';
	return undefined;
};

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
		/**
		 * Get mapcraft api url
		 */
		$apiUrl: () => string;

		/**
		 * Capitalize string
		 */
		$capitalize: (str: string) => string;

		/**
		 * Get os name of user
		 */
		$os: () => osType;
  }
}

export default boot(({ app }) => {
	app.config.globalProperties.$apiUrl = apiUrl;
	app.provide('$apiUrl', apiUrl);

	app.config.globalProperties.$capitalize = capitalize;
	app.provide('$capitalize', capitalize);

	app.config.globalProperties.$os = os;
	app.provide('$os', os);
});
