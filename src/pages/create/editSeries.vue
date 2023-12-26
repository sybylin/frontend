<template>
	<div v-if="!isCheck" class="row justify-center items-center q-pt-xl q-pb-xl">
		<q-spinner-cube color="deep-purple-6" size="6em" />
	</div>
	<template v-else>
		<div
			v-if="typeof isCheck === 'string' && isCheck === 'unauthorized'"
			style="min-height: inherit"
			class="row items-center justify-center full-width"
		>
			<span class="text-h4">{{ $capitalize($t('create.main.series.unauthorized')) }}</span>
		</div>
		<div v-else class="q-pa-sm">
			<div v-if="!series" class="row justify-center items-center q-pt-xl q-pb-xl">
				<q-spinner-cube color="deep-purple-6" size="6em" />
			</div>
			<template v-else>
				<div class="row no-wrap justify-between q-pl-sm q-pr-sm">
					<q-btn
						color="secondary"
						:label="$t('create.main.series.return')"
						icon="arrow_back"
						:to="{ name: 'selectSeries', params: { lang: $route.params.lang, } }"
					/>
					<span class="text-h5">{{ series.title }}</span>
					<span></span>
				</div>

				<q-tabs
					v-model="tab"
					dense
					class="q-pt-sm"
					active-color="secondary"
					indicator-color="secondary"
					align="justify"
				>
					<q-tab name="enigmas" icon="reorder" :label="$t('create.main.series.enigmas')" />
					<q-tab name="options" icon="settings" :label="$t('create.main.series.options')" />
				</q-tabs>
				<q-separator />
				<q-tab-panels
					v-model="tab"
					animated
					transition-prev="jump-left"
					transition-next="jump-right"
					class="transparent"
				>
					<q-tab-panel name="enigmas">
						<components-pages-creation-series-enigmas-list
							v-model="series"
							@update="updateEnigmas"
						/>
					</q-tab-panel>
					<q-tab-panel name="options">
						<components-pages-creation-series-option v-model="series" />
					</q-tab-panel>
				</q-tab-panels>
			</template>
		</div>
	</template>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useQuasar, useMeta } from 'quasar';
import { api } from 'src/boot/axios';
import { capitalize } from 'src/boot/custom';
import meta from 'src/meta';
import ComponentsPagesCreationSeriesOption from 'components/pages/creation/seriesOption.vue';
import ComponentsPagesCreationSeriesEnigmasList from 'components/pages/creation/seriesEnigmasList.vue';

import type { enigma, series } from 'src/types';

export default defineComponent({
	name: 'PagesCreateEditSeries',
	components: {
		ComponentsPagesCreationSeriesOption,
		ComponentsPagesCreationSeriesEnigmasList
	},
	setup () {
		const { t } = useI18n();
		const $q = useQuasar();
		const route = useRoute();

		const isCheck = ref<boolean | 'unauthorized'>(false);
		const series = ref<series | null>(null);
		const tab = ref<'enigmas' | 'options'>('enigmas');
		const computedTitle = computed<string>(() => (series.value)
			? `${series.value.title} | ${capitalize(t('create.main.list.title'))}`
			: t('series.meta.main.title'));

		const getSerie = () => {
			api.post('/series/one', {
				series_id: Number(route.params.seriesId)
			})
				.then((d) => d.data)
				.then((d) => {
					series.value = d.series;
				})
				.catch((e) => $q.notify(e.response.data.info.message));
		};

		const updateEnigmas = (enigmasList: enigma[]) => {
			if (!series.value)
				return;
			enigmasList.forEach((v, i) => {
				if (series.value?.series_enigma_order[i])
					series.value.series_enigma_order[i] = v;
				else
					series.value?.series_enigma_order.push(v);
				/*
				if ((series.value as series).series_enigma_order[i]) {
					(series.value as series).series_enigma_order[i].enigma = v;
					(series.value as series).series_enigma_order[i].enigma_id = v.id;
				} else {
					(series.value as series).series_enigma_order.push({
						series_id: series.value?.id ?? 0,
						enigma_id: v.id,
						enigma: v,
						order: i + 1
					});
				}
				*/
			});

			api.post('/series/update/order', {
				series_id: Number(route.params.seriesId),
				order: enigmasList.map((v) => (v.id))
			})
				.catch((e) => $q.notify(e.response.data.info.message));
		};

		useMeta(() => {
			return meta({
				meta: {
					title: computedTitle.value,
					description: capitalize(t('create.main.enigmaList.description')),
					keywords: ['select', 'series']
				},
				og: {
					url: 'https://sibyllin.app/series',
					title: computedTitle.value,
					description: capitalize(t('create.main.enigmaList.description')),
					image: 'https://sibyllin.app/img/background.png'
				},
				twitter: {
					url: 'https://sibyllin.app/series',
					title: computedTitle.value,
					description: capitalize(t('create.main.enigmaList.description')),
					image: 'https://sibyllin.app/img/background.png'
				}
			});
		});

		onBeforeMount(() => {
			api.post('/series/isCreatedByUser', {
				series_id: Number(route.params.seriesId)
			})
				.then((d) => d.data)
				.then((d) => {
					getSerie();
					isCheck.value = (d.isCreatedByUser)
						? true
						: 'unauthorized';
				})
				.catch((e) => $q.notify(e.response.data.info.message));
		});

		return {
			isCheck,
			series,
			tab,
			updateEnigmas
		};
	}
});
</script>

<style scoped>
.transparent {
	background-color: transparent;
}
</style>
