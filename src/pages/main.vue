<template>
	<main-header @to-anchor="toReadMore()" />
	<div id="read-more" ref="readMore" class="column items-center">
		<h3>Start course</h3>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useMeta } from 'quasar';
import { useI18n } from 'vue-i18n';
import meta from '../meta';

import mainHeader from '../components/pages/main/header.vue';

export default defineComponent({
	name: 'PageMain',
	components: {
		mainHeader
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
					keywords: ['minecraft', 'sibyllin', 'generator', 'advancement', 'recipe', 'cutscene', 'trigger', 'music', 'sound', 'datapack']
				},
				og: {
					url: 'https://sibyllin.app',
					title: t('menu.home'),
					description: t('main.header.desc'),
					image: 'https://sibyllin.app/img/background.png'
				},
				twitter: {
					url: 'https://sibyllin.app',
					title: t('menu.home'),
					description: t('main.header.desc'),
					image: 'https://sibyllin.app/img/background.png'
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
