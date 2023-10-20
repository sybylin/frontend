import { route } from 'quasar/wrappers';
import {
	createMemoryHistory,
	createRouter,
	createWebHashHistory,
	createWebHistory
} from 'vue-router';
import routes from './routes';

export default route(() => {
	const createHistory = process.env.SERVER
		? createMemoryHistory
		: (process.env.VUE_ROUTER_MODE === 'history'
			? createWebHistory
			: createWebHashHistory);

	const Router = createRouter({
		scrollBehavior: (to, from, savedPosition) => {
			if (savedPosition)
				return savedPosition;

			if (to.path === from.path && to.hash) {
				return {
					el: to.hash,
					behavior: 'smooth',
					left: 0,
					top: 0
				};
			}

			if (to.hash) {
				return new Promise((resolve) => {
					setTimeout(() => {
						resolve({
							el: to.hash,
							behavior: 'smooth',
							left: 0,
							top: 0
						});
					}, 500);
				});
			}

			return new Promise((resolve) => {
				setTimeout(() => {
					resolve({
						behavior: 'smooth',
						left: 0,
						top: 0
					});
				}, 100);
			});
		},
		routes,
		history: createHistory(process.env.VUE_ROUTER_BASE)
	});

	return Router;
});
