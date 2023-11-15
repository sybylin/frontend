import { useI18n } from 'vue-i18n';
import { useLink } from 'vue-router';
import { boot } from 'quasar/wrappers';
import localeOptions from 'src/i18n/options';

/**
 * Generate path with correct lang
 * Don't forget in setup() to pass user lang
 */
export const generatePath = (
	search: { name?: string, path?: string },
	localeLang?: string
): Record<string, unknown> => {
	const locale = (localeLang) || useI18n().locale.value;

	if (!search.name && !search.path)
		throw Error('Search need a name or a path');
	if (search.name) {
		return {
			name: search.name,
			params: {
				lang: locale
			}
		};
	}
	return {
		path: `/${locale}${search.path}`
	};
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
		return (userPath.localeCompare('/') === 0 || userPath.localeCompare(checkPath) === 0);
	return userPath.startsWith(checkPath);
};

declare module '@vue/runtime-core' {
	/**
	 * Generate path with correct lang
	 */
  interface ComponentCustomProperties {
		$generatePath: (search: { name?: string, path?: string }, localeLang?: string) => Record<string, unknown>;
		$isInCurrentPath: (name: string, fullPath: string, isRoot?: boolean) => boolean
  }
}

export default boot(({ app, router, ssrContext }) => {
	app.config.globalProperties.$generatePath = generatePath;
	app.provide('$generatePath', generatePath);

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
