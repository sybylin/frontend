import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';

import messages from 'src/i18n';

export type MessageLanguages = keyof typeof messages;
export type MessageSchema = typeof messages['en-US'];

export default boot(({ app }) => {
	const i18n = createI18n({
		fallbackLocale: 'en-US',
		globalInjection: true,
		legacy: false,
		lazy: false,
		locale: 'en-US',
		messages
	});
	app.use(i18n);
});
