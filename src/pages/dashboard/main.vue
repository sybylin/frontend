<template>
	Main
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'quasar';
import { capitalize } from 'src/boot/custom';
import meta from 'src/meta';

export default defineComponent({
	name: 'PagesDashboardMain',
	setup () {
		const { t } = useI18n();

		useMeta(() => {
			return meta({
				meta: {
					title: capitalize(t('dashboard.main.title')),
					description: capitalize(t('dashboard.main.desc'))
				},
				og: {
					url: 'https://sibyllin.app/dashboard/users',
					title: capitalize(t('dashboard.main.title')),
					description: capitalize(t('dashboard.main.desc')),
					image: 'https://sibyllin.app/img/background.png'
				},
				twitter: {
					url: 'https://sibyllin.app/dashboard/users',
					title: capitalize(t('dashboard.main.title')),
					description: capitalize(t('dashboard.main.desc')),
					image: 'https://sibyllin.app/img/background.png'
				}
			});
		});
	}
});
</script>
