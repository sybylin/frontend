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
				path: 'builder',
				name: 'builder',
				meta: { noSSR: true },
				component: () => import('pages/builder.vue')
			},
			{
				path: 'series',
				name: 'seriesMain',
				meta: { requiresAuth: true, level: 'user' },
				children: [
					{
						path: '',
						name: 'series',
						component: () => import('pages/series/main.vue')
					},
					{
						path: ':id/(\\d+)/:path',
						name: 'enigma',
						component: () => import('pages/series/enigma.vue')
					},
					{
						path: ':id(\\d+)',
						name: 'enigmaList',
						component: () => import('pages/series/enigmaList.vue')
					}
				]
			},
			{
				path: 'user',
				name: 'userMain',
				meta: { noSSR: true },
				children: [
					{
						path: '',
						name: 'user',
						meta: { requiresAuth: true, level: 'user' },
						component: () => import('pages/user/main.vue')
					},
					{
						path: 'reset/:token?',
						name: 'resetPassword',
						component: () => import('pages/user/resetPassword.vue')
					},
					{
						path: 'login',
						name: 'login',
						component: () => import('pages/user/login.vue')
					},
					{
						path: 'creation',
						name: 'creation',
						component: () => import('pages/user/creation.vue')
					}
				]
			},
			{
				path: 'create',
				name: 'createMain',
				meta: { requiresAuth: true, level: 'user' },
				children: [
					{
						path: '',
						name: 'selectSerie',
						component: () => import('pages/create/selectSerie.vue')
					},
					{
						path: ':serieId',
						name: 'editSerie',
						component: () => import('pages/create/editSerie.vue')
					}
				]
			}
		]
	},
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
];

export default routes;
