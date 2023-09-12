import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
	{
		path: '/:lang?',
		component: () => import('layouts/main.vue'),
		children: [
			{
				path: '',
				name: 'home',
				component: () => import('pages/main.vue')
			},
			{
				path: 'series',
				name: 'series',
				meta: { requiresAuth: true, level: 'user' },
				component: () => import('pages/series.vue')
			},
			{
				path: 'series/:id',
				name: 'seriesDetail',
				meta: { requiresAuth: true, level: 'user' },
				component: () => import('pages/seriesDetail.vue')
			},
			{
				path: 'series/:id/:path',
				name: 'enigma',
				meta: { requiresAuth: true, level: 'user' },
				component: () => import('pages/enigma.vue')
			},
			{
				path: 'user',
				name: 'userMain',
				children: [
					{
						path: '',
						name: 'user',
						meta: { requiresAuth: true, level: 'user' },
						component: () => import('pages/user.vue')
					},
					{
						path: 'login',
						name: 'login',
						component: () => import('pages/login.vue')
					},
					{
						path: 'creation',
						name: 'creation',
						component: () => import('pages/creation.vue')
					}
				]
			}
		]
	}
];

if (import.meta.env.MODE !== 'production' && process.env.MODE !== 'ssr') {
	routes.push({
		path: '/:lang?/search',
		name: 'search',
		component: () => import('pages/search.vue')
	});
}

routes.push(
	{
		path: '/500',
		name: '500',
		component: () => import('pages/error500.vue')
	},
	{
		path: '/:catchAll(.*)*',
		component: () => import('layouts/main.vue'),
		children: [
			{
				path: '',
				name: 'error',
				component: () => import('pages/error.vue')
			}
		]
	}
);

export default routes;
