import { useI18n } from 'vue-i18n';
import { boot } from 'quasar/wrappers';
import localeOptions from 'src/i18n/options';
import routes from 'src/router/routes';

import type { RouteRecordRaw } from 'vue-router';
import type { WritableComputedRef } from 'vue';

interface accumulatorRet {
	name: string;
	path: string;
}

const searchRoute = (childs: RouteRecordRaw[], name: string) => {
	const accumulator: accumulatorRet[] = [];
	const fnAcc = (chls: RouteRecordRaw[], nm: string, acc: accumulatorRet[]): accumulatorRet | accumulatorRet[] | undefined => {
		for (const r of chls) {
			if (r.name === nm) {
				acc.push({ name: r.name, path: r.path });
				return { name: r.name, path: r.path };
			}
			if (r.children && r.children.length) {
				acc.push({ name: r.name as string, path: r.path });
				return fnAcc(r.children, nm, acc);
			}
		}
		return undefined;
	};

	fnAcc(childs, name, accumulator);
	return accumulator.filter((e) => e.path !== '/:lang?' && e.path !== '/:catchAll(.*)*');
};

/**
 * Generate path with correct lang
 */
export const generatePath = (search: { name?: string, path?: string }, locale: WritableComputedRef<string>): string => {
	if (!search.name && !search.path)
		throw Error('Search need a name or a path');
	if (search.name) {
		const routesList = searchRoute(routes, search.name);

		if (!routesList.length)
			throw Error(`Route with name ${search.name} not exist`);
		const genPath = routesList.reduce((prev, curr) => `${prev}/${curr.path}`, '');
		const ret = ['/', locale.value];
		if (genPath.at(0) !== '/')
			ret.push('/');
		ret.push(genPath);
		return ret.join('');
	}
	return `/${locale.value}${search.path}`;
};

/**
 * Check if current path is in target path
 */
export const isInCurrentPath = (name: string, fullPath: string, isRoot?: boolean): boolean => {
	const routesList = searchRoute(routes, name);
	if (!routesList.length)
		throw Error(`Route with name ${name} not exist`);
	const cleanFullPath = fullPath.slice(6);
	if (isRoot)
		return cleanFullPath === '/';
	return cleanFullPath.includes(routesList.reduce((prev, curr) => `${prev}/${curr.path}`, ''));
};

const generatePathForTemplate = (search: { name?: string, path?: string }): string => {
	const { locale } = useI18n();
	return generatePath(search, locale);
};

declare module '@vue/runtime-core' {
	/**
	 * Generate path with correct lang
	 */
  interface ComponentCustomProperties {
		$generatePath: (search: { name?: string, path?: string }) => string;
		$isInCurrentPath: (name: string, fullPath: string, isRoot?: boolean) => boolean
  }
}

export default boot(({ app, router, ssrContext }) => {
	app.config.globalProperties.$generatePath = generatePathForTemplate;
	app.provide('$generatePath', generatePathForTemplate);
	app.config.globalProperties.$isInCurrentPath = isInCurrentPath;
	app.provide('$isInCurrentPath', isInCurrentPath);

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
