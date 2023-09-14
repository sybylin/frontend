import { useI18n } from 'vue-i18n';
import { useLink } from 'vue-router';
import { boot } from 'quasar/wrappers';
import localeOptions from 'src/i18n/options';

import type { WritableComputedRef } from 'vue';

/**
 * Generate path with correct lang
 */
export const generatePath = (search: { name?: string, path?: string }, locale: WritableComputedRef<string> | string): string => {
	const getLocale = (): string => (typeof locale === 'string')
		? locale
		: locale.value;

	if (!search.name && !search.path)
		throw Error('Search need a name or a path');
	if (search.name) {
		const link = useLink({
			to: {
				name: search.name,
				params: {
					lang: getLocale()
				}
			}
		});
		return link.route.value.fullPath;
	}
	return `/${getLocale()}${search.path}`;
};

/**
 * Check if user current path is in target path
 */
export const isInCurrentPath = (name: string, path: string, isRoot?: boolean): boolean => {
	const checkPath = useLink({ to: { name } }).route.value.path;
	let userPath = path.slice(6);
	if (!userPath.length)
		userPath = '/';
	if (isRoot)
		return (userPath === '/');
	return userPath.startsWith(checkPath);
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
