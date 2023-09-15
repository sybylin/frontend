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
				switch (e.response.data.info.code) {
				case 'JW_002':
					globalStore().setIsConnected(true);
					break;
				case 'JW_001':
				default:
					globalStore().setIsConnected(false);
				}
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

export default boot(({ app, router, ssrContext }) => {
	app.config.globalProperties.$checkUserRight = checkUserRightsBoot;
	app.provide('$checkUserRight', checkUserRightsBoot);

	/**
	 * The authorization system must be checked only on the front and not on the
	 * back, as the back does not have proper access to the browser's cookies and
	 * storage, and may make a hydration error at any time
	 */
	if (!ssrContext) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		router.beforeResolve(async (to, from) => {
			if (to.meta.requiresAuth) {
				const isAuthorization: boolean = await checkUserRights(to.meta.level ?? 'user');
				const isConnected: boolean = globalStore().isConnected;

				if (!isAuthorization) {
					return {
						name: (!isConnected)
							? 'login'
							: 'user',
						params: {
							lang: to.params.lang ?? globalStore().lang ?? 'en-US'
						},
						query: {
							redirect: (!isConnected)
								? to.fullPath
								: undefined,
							unauthorized: (isConnected)
								? 'true'
								: undefined
						}
					};
				}
			}
			return true;
		});
	}
});
