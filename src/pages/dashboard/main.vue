<template>
	<div class="full-width text-center q-pt-xl">
		<span class="text-h4">
			{{ $capitalize($t('dashboard.development')) }}
		</span>
	</div>
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
					url: 'https://sybyl.in/dashboard/users',
					title: capitalize(t('dashboard.main.title')),
					description: capitalize(t('dashboard.main.desc')),
					image: 'https://sybyl.in/img/background.png'
				},
				twitter: {
					url: 'https://sybyl.in/dashboard/users',
					title: capitalize(t('dashboard.main.title')),
					description: capitalize(t('dashboard.main.desc')),
					image: 'https://sybyl.in/img/background.png'
				}
			});
		});
	}
});
</script>
