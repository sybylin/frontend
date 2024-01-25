<template>
	<router-view />
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import localeOptions from 'src/i18n/options';
import 'material-symbols/outlined.css';

export default defineComponent({
	name: 'AppVue',
	setup () {
		const $q = useQuasar();
		const router = useRouter();
		const { locale } = useI18n();

		const updateLang = (fullPath: string) => {
			const lang = /^\/(?<lang>[a-zA-Z]{2}-[a-zA-Z]{2})\/?.*$/m.exec(fullPath);
			const windowLang = window.localStorage.getItem('lang');

			if (windowLang && lang && lang.groups) {
				const localeLang = localeOptions.find((e) => e.value === lang?.groups?.lang);

				if (!localeLang)
					return;
				if (lang.groups.lang !== windowLang || locale.value !== windowLang) {
					locale.value = localeLang.value;
					$q.lang.set(localeLang.quasar);
					window.localStorage.setItem('lang', localeLang.value);
				}
			}
		};

		onMounted(() => {
			updateLang(router.currentRoute.value.fullPath);
			watch(() => router.currentRoute, (newPath) => updateLang(newPath.value.fullPath));
		});
	}
});
</script>
