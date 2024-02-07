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
				path: 'unauthorized',
				name: 'unauthorized',
				component: () => import('pages/unauthorized.vue')
			},
			{
				path: 'report',
				name: 'report',
				component: () => import('pages/report.vue')
			},
			{
				path: 'dashboard',
				name: 'dashboardMain',
				meta: { requiresAuth: true, level: 'moderator' },
				component: () => import('pages/dashboard/index.vue'),
				children: [
					{
						path: '',
						name: 'dashboard',
						component: () => import('pages/dashboard/main.vue')
					},
					{
						path: 'users',
						name: 'dashboardUsers',
						meta: { requiresAuth: true, level: 'administrator' },
						component: () => import('pages/dashboard/users.vue')
					},
					{
						path: 'report',
						name: 'dashboardReport',
						meta: { requiresAuth: true, level: 'administrator' },
						component: () => import('pages/dashboard/report.vue')
					},
					{
						path: 'series',
						name: 'dashboardSeries',
						component: () => import('pages/dashboard/series/series.vue')
					},
					{
						path: 'series/:id(\\d+)/:enigmaId(\\d+)',
						name: 'dashboardSeriesEnigma',
						component: () => import('pages/dashboard/series/seriesEnigma.vue')
					},
					{
						path: 'series/:id(\\d+)',
						name: 'dashboardSeriesList',
						component: () => import('pages/dashboard/series/seriesList.vue')
					}
				]
			},
			{
				path: 'series',
				name: 'seriesMain',
				children: [
					{
						path: '',
						name: 'series',
						component: () => import('pages/series/main.vue')
					},
					{
						path: ':id(\\d+)/:enigmaId(\\d+)',
						name: 'enigma',
						meta: { requiresAuth: true, level: 'user' },
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
					},
					{
						path: 'verify',
						name: 'verify',
						meta: { noSSR: true },
						component: () => import('pages/user/verify.vue')
					},
					{
						path: 'profil/:username',
						name: 'profil',
						meta: { requiresAuth: true, level: 'user' },
						component: () => import('pages/profil/main.vue')
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
						name: 'selectSeries',
						component: () => import('pages/create/selectSeries.vue')
					},
					{
						path: ':seriesId/:enigmaId',
						name: 'editEnigma',
						component: () => import('pages/create/editEnigma.vue')
					},
					{
						path: ':seriesId',
						name: 'editSeries',
						component: () => import('pages/create/editSeries.vue')
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
		name: 'error',
		component: () => import('layouts/main.vue'),
		children: [
			{
				path: '',
				name: 'error404',
				component: () => import('pages/error.vue')
			}
		]
	}
];

export default routes;
