/* eslint-disable eqeqeq */
import { boot } from 'quasar/wrappers';
import { api } from 'src/boot/axios';

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

/**
 * Check if user has necessary right
 */
export type authorizationLevel = 'user' | 'moderator' | 'administrator';
export const checkUserRights = async (role: authorizationLevel): Promise<boolean> => {
	try {
		await api.get(`/rights/${role}`);
		return true;
	} catch (e) {
		return false;
	}
};
const checkUserRightsBoot = {
	user: () => checkUserRights('user'),
	moderator: () => checkUserRights('moderator'),
	administrator: () => checkUserRights('administrator')
};

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
		/**
		 * Capitalize string
		 */
		$capitalize: (str: string) => string;

		/**
		 * Get os name of user
		 */
		$os: () => osType;

		/**
		 * Check if user has necessary right
		 */
		$checkUserRight: {
			user: () => Promise<boolean>;
			moderator: () => Promise<boolean>;
			administrator: () => Promise<boolean>;
		}
  }
}

export default boot(({ app }) => {
	app.config.globalProperties.$capitalize = capitalize;
	app.provide('$capitalize', capitalize);

	app.config.globalProperties.$os = os;
	app.provide('$os', os);

	app.config.globalProperties.$checkUserRight = checkUserRightsBoot;
	app.provide('$checkUserRight', checkUserRightsBoot);
});
