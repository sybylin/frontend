import { boot } from 'quasar/wrappers';
import { api, xsrfName } from 'src/boot/axios';
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

const checkUserRightsAndVerify = async (role: authorizationLevel): Promise<{ hasRight: boolean, isVerify: boolean }> => {
	return new Promise((resolve) => {
		api.get(`/rights/${role}`)
			.then((d) => {
				if (d.data.info.code === 'JW_101')
					globalStore().setIsConnected(true);
				resolve({ hasRight: true, isVerify: d.data.userIsVerify });
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
				resolve({ hasRight: false, isVerify: false });
			});
	});
};

const genName = (isConnected: boolean, isAuthorization: { hasRight: boolean; isVerify: boolean }) => {
	if (!isConnected)
		return 'login';
	if (!isAuthorization.isVerify)
		return 'verify';
	return 'user';
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
		router.beforeResolve(async (to, _from) => {
			if (to.meta.requiresAuth) {
				const isAuthorization = await checkUserRightsAndVerify(to.meta.level ?? 'user');
				const isConnected = globalStore().isConnected;

				if (!isAuthorization.hasRight) {
					return {
						name: genName(isConnected, isAuthorization),
						params: {
							lang: to.params.lang ?? globalStore().lang ?? 'en-US'
						},
						query: {
							redirect: (!isConnected && to.name !== 'user')
								? to.fullPath
								: undefined,
							unauthorized: (isConnected)
								? 'true'
								: undefined
						}
					};
				} else if (!isAuthorization.isVerify) {
					return {
						name: 'verify',
						params: {
							lang: to.params.lang ?? globalStore().lang ?? 'en-US'
						}
					};
				}
			} else if (
				!globalStore().isConnected &&
				typeof window.localStorage !== 'undefined' && localStorage.getItem(xsrfName)
			)
				await checkUserRights('user');
			return true;
		});
	}
});
