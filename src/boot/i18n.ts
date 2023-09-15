import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';
import messages from 'src/i18n';

import type { I18n } from 'vue-i18n';
import type { lang } from 'src/i18n';

export type MessageLanguages = keyof typeof messages;
export type MessageSchema = typeof messages['en-US'];
// eslint-disable-next-line @typescript-eslint/ban-types
export type i18nInstance = I18n<Record<lang, any>, {}, {}, string, false>;

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
		/**
		 * Get instance of i18n
		 */
		$i18nInstance: i18nInstance
  }
}

export default boot(({ app }) => {
	const i18n = createI18n({
		fallbackLocale: 'en-US',
		globalInjection: true,
		legacy: false,
		lazy: false,
		locale: 'en-US',
		messages
	});

	app.config.globalProperties.$i18nInstance = i18n;
	app.provide('$i18nInstance', i18n);
	app.use(i18n);
});
