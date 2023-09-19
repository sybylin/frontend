/* eslint-disable eqeqeq */
import { boot } from 'quasar/wrappers';
import { Dialog } from 'quasar';
import ComponentsAchievementIsEarned from 'components/achievement/isEarned.vue';

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

export const hasAchievement = (id: string) => {
	Dialog.create({
		component: ComponentsAchievementIsEarned,
		componentProps: {
			id
		}
	});
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
  }
}

export default boot(({ app }) => {
	app.config.globalProperties.$capitalize = capitalize;
	app.provide('$capitalize', capitalize);

	app.config.globalProperties.$os = os;
	app.provide('$os', os);
});
