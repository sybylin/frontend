<template>
	<div></div>
</template>

<script lang="ts">
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import { defineComponent, onMounted, onUnmounted, watch } from 'vue';
import * as gdpr from 'vanilla-cookieconsent';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { globalStore } from 'src/stores/global';
import enUS from 'src/i18n/en-US/gdpr';
import frFR from 'src/i18n/fr-FR/gdpr';
import type { CookieConsentConfig, Translation } from 'vanilla-cookieconsent';

export default defineComponent({
	name: 'Gdpr',
	setup () {
		const store = globalStore();
		const { darkMode } = storeToRefs(store);
		const { locale } = useI18n();

		const event = () => gdpr.showPreferences();
		const gdprConfig: CookieConsentConfig = {
			autoShow: true,
			guiOptions: {
				consentModal: {
					layout: 'box inline',
					position: 'bottom right'
				},
				preferencesModal: {
					layout: 'box'
				}
			},
			categories: {
				necessary: {
					readOnly: true,
					enabled: true
				}
			},
			language: {
				default: 'en-US',
				translations: {
					'en-US': enUS as Translation,
					'fr-FR': frFR as Translation
				}
			}
		};

		onMounted(async () => {
			await gdpr.run(gdprConfig);
			await gdpr.setLanguage(locale.value, true);

			document.addEventListener('gdpr', event);

			watch(darkMode, (val) => {
				document.documentElement.classList[
					(val)
						? 'add'
						: 'remove'
				]('cc--darkmode');
			});

			watch(locale, async (val) => {
				await gdpr.setLanguage(val, true);
			});
		});

		onUnmounted(() => {
			document.removeEventListener('gdpr', event);
		});

		return {
			gdpr,
			gdprConfig
		};
	}
});
</script>
