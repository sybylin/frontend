<template>
	<div class="row no-wrap q-pa-xl">
		<div class="col-md-5 col-12 column justify-center items-center q-pl-sm q-pr-md">
			<div>
				<h2 class="q-ma-none q-pb-md orkney-medium">
					{{ $t('error.title') }}
				</h2>
				<span class="text-body1 text-weight-regular">{{ $t('error.description') }}</span>
				<div class="q-pt-md q-mb-md column">
					<q-btn
						flat size="md" align="left"
						color="light-blue-8" class="width"
						:label="$t('menu.home')" icon="home"
						:to="$generatePath({ name: 'home' })"
					/>
					<q-btn
						flat size="md" align="left"
						color="light-blue-8" class="width"
						:label="$t('menu.download')" icon="download"
						:to="$generatePath({ name: 'course' })"
					/>
					<q-btn
						flat size="md" align="left"
						color="light-blue-8" class="width"
						:label="$t('menu.documentation')" icon="description"
						:to="$generatePath({ path: '/docs' })"
					/>
				</div>
			</div>
		</div>
		<div class="gt-sm col-md-7 row justify-center items-center">
			<q-img
				src="/imgs/icon.png"
				class="main-img"
				alt="Screen with application"
				style="filter: grayscale(100%); width: inherit"
				fit="none"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'quasar';

import meta from '../meta';

export default defineComponent({
	name: 'PageError',
	setup () {
		const { t, locale } = useI18n({ useScope: 'global' });

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

		return {
			genPath: (path: string) => `/${locale.value}/docs${path}`
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
