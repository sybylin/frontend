import { useI18n } from 'vue-i18n';
import { boot } from 'quasar/wrappers';
import localeOptions from 'src/i18n/options';
import routes from 'src/router/routes';
import type { RouteRecordRaw } from 'vue-router';

const searchRoute = (childs: RouteRecordRaw[], name: string): RouteRecordRaw | undefined => {
	for (const r of childs) {
		if (r.name === name)
			return r;
		if (r.children && r.children.length)
			return searchRoute(r.children, name);
	}
	return undefined;
};

/**
  * Generate path with correct lang
*/
export const generatePath = (search: { name?: string, path?: string }): string => {
	const { locale } = useI18n();

	if (!search.name && !search.path)
		throw Error('Search need a name or a path');
	if (search.name) {
		const route = searchRoute(routes, search.name);
		if (!route)
			throw Error(`Route with name ${search.name} not exist`);
		const ret = ['/', locale.value];
		if (route.path.at(0) !== '/')
			ret.push('/');
		ret.push(route.path);
		return ret.join('');
	}
	return `/${locale.value}${search.path}`;
};

declare module '@vue/runtime-core' {
	/**
	 * Generate path with correct lang
	 */
  interface ComponentCustomProperties {
		$generatePath: (search: { name?: string, path?: string }) => string;
  }
}

export default boot(({ app, router, ssrContext }) => {
	app.config.globalProperties.$generatePath = generatePath;
	app.provide('$generatePath', generatePath);

	const reg = /^\/(?<lang>[a-zA-Z]{2}-[a-zA-Z]{2})\/?.*$/m;
	router.beforeEach((to, from, next) => {
		const toRoute = (lang: string) => next({ path: `/${lang}${to.fullPath}` });
		const lang = reg.exec(to.fullPath);
		const oldLang = reg.exec(from.fullPath);

		if (!lang || (lang.groups && !lang.groups.lang)) {
			if (ssrContext)
				toRoute(localeOptions[0].value);
			else {
				const windowLang = window.localStorage.getItem('lang');
				if (windowLang) {
					const lang = localeOptions.find((e) => e.value === windowLang);
					if (lang)
						toRoute(lang.value);
				} else {
					window.localStorage.setItem('lang', localeOptions[0].value);
					app.config.globalProperties.$q.lang.set(localeOptions[0].quasar);
					toRoute(localeOptions[0].value);
				}
			}
			return;
		}

		if (!ssrContext && lang && lang.groups && oldLang && oldLang.groups && lang.groups.lang !== oldLang.groups.lang) {
			const localeLang = localeOptions.find((e) => e.value === lang?.groups?.lang);

			if (localeLang) {
				window.localStorage.setItem('lang', localeLang.value);
				app.config.globalProperties.$i18n.locale = localeLang.value;
			}
		}

		next();
	});
});
