<template>
	<main-header @to-anchor="toReadMore()" />
	<div id="read-more" ref="readMore" class="column items-center">
		<main-row
			:title="$t('main.body.1.title')"
			:description="$t('main.body.1.description')"
			:video="'/video/solve_enigma_sd.mp4'"
		/>
		<main-row
			:title="$t('main.body.2.title')"
			:description="$t('main.body.2.description')"
			:video="'/video/levels_success_sd.mp4'"
			inverse
		/>
		<main-row
			:title="$t('main.body.3.title')"
			:description="$t('main.body.3.description')"
			:video="'/video/create_sd.mp4'"
		/>
	</div>
	<main-row
		bottom
		inverse
		:title="$t('main.end.title')"
		:description="$t('main.end.description')"
	/>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useMeta } from 'quasar';
import { useI18n } from 'vue-i18n';
import meta from 'src/meta';

import mainHeader from 'src/components/pages/main/header.vue';
import mainRow from 'src/components/pages/main/row.vue';

export default defineComponent({
	name: 'PageMain',
	components: {
		mainHeader,
		mainRow
	},
	setup () {
		const { t } = useI18n();
		const readMore = ref<HTMLDivElement | null>(null);

		const toReadMore = () => {
			if (readMore.value)
				readMore.value.scrollIntoView();
		};

		useMeta(() => {
			return meta({
				meta: {
					title: t('menu.home'),
					description: t('main.header.desc'),
					keywords: ['enigmas', 'series', 'mystery', 'riddle', 'problem']
				},
				og: {
					url: 'https://sybyl.in',
					title: t('menu.home'),
					description: t('main.header.desc'),
					image: 'https://sybyl.in/img/background.png'
				},
				twitter: {
					url: 'https://sybyl.in',
					title: t('menu.home'),
					description: t('main.header.desc'),
					image: 'https://sybyl.in/img/background.png'
				}
			});
		});

		return {
			readMore,
			toReadMore
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
</style>
