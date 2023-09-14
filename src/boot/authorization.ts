import { boot } from 'quasar/wrappers';
import { api } from 'src/boot/axios';
import { globalStore } from 'src/stores/global';

export type authorizationLevel = 'user' | 'moderator' | 'administrator';

/**
 * Check if user has necessary right
 */
export const checkUserRights = async (role: authorizationLevel): Promise<boolean> => {
	return new Promise((resolve) => {
		api.get(`/rights/${role}`)
			.then((d) => {
				if (d.data.info.code === 'JW_101')
					globalStore().setIsConnected(true);
				resolve(true);
			})
			.catch((e) => {
				if (e.response.data.info.code === 'JW_001')
					globalStore().setIsConnected(false);
				resolve(false);
			});
	});
};

const checkUserRightsBoot = {
	user: () => checkUserRights('user'),
	moderator: () => checkUserRights('moderator'),
	administrator: () => checkUserRights('administrator')
};

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
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

export default boot(({ app, router }) => {
	app.config.globalProperties.$checkUserRight = checkUserRightsBoot;
	app.provide('$checkUserRight', checkUserRightsBoot);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	router.beforeResolve(async (to, from) => {
		if (to.meta.requiresAuth && !(await checkUserRights(to.meta.level ?? 'user'))) {
			if (globalStore().isConnected) {
				return {
					...from,
					query: {
						to: to.fullPath,
						error: 'true'
					}
				};
			}
			return {
				...from,
				name: 'login',
				query: {
					redirect: to.fullPath
				}
			};
		}
		return undefined;
	});
});
