<template>
	<div class="row no-wrap q-pa-xl">
		<div class="col-md-5 col-12 column justify-center items-center q-pl-sm q-pr-md">
			<div>
				<h2 class="q-ma-none q-pb-md orkney-medium">
					{{ $capitalize($t('error.unauthorized.title')) }}
				</h2>
				<span class="text-body1 text-weight-regular">
					{{ $capitalize($t('error.unauthorized.subtitle')) }}
				</span>
			</div>
		</div>
		<div class="gt-sm col-md-7 row justify-center items-center">
			<q-img
				ref="img"
				src="/imgs/svg/door.svg"
				alt="Screen with application"
				fit="contain"
				style="width: 20vw;"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'quasar';
import type { QImg } from 'quasar';
import meta from '../meta';

export default defineComponent({
	name: 'PageError',
	setup () {
		const { t } = useI18n({ useScope: 'global' });
		const img = ref<QImg | null>(null);

		useMeta(() => {
			return meta({
				meta: {
					title: t('error.meta.title'),
					description: t('error.description'),
					keywords: ['minecraft', 'sibyllin', 'error', '400']
				},
				og: {
					url: 'https://sibyllin.app/error',
					title: `sibyllin - ${t('error.meta.title')}`,
					description: t('error.description')
				},
				twitter: {
					url: 'https://sibyllin.app/error',
					title: `sibyllin - ${t('error.meta.title')}`,
					description: t('error.description')
				}
			});
		});

		onMounted(() => {

		});

		return {
			img
		};
	}
});
</script>

<style scoped>
.background-light {
	background-color: rgba(0, 0, 0, .05);
}
.background-night {
	background-color: rgba(255, 255, 255, .05);
}
.width {
	width: 60%;
}
</style>
