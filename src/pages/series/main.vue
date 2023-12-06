<template>
	<div class="row justify-around q-pa-md">
		<q-input
			v-model="search"
			:loading="apiGetSeries"
			class="col-md-6 col-12 q-pa-sm"
			filled
			debounce="500"
			type="search"
			:label="$capitalize($t('series.main.search'))"
		>
			<template v-slot:append>
				<q-icon name="search" />
			</template>
		</q-input>
		<q-select
			v-model="sortBy"
			class="col-md-4 col-12 q-pa-sm"
			filled
			:label="$capitalize($t('series.main.sort.title'))"
			:readonly="apiGetSeries"
			:options="[
				{ label: $capitalize($t('series.main.sort.titleAsc')), value: 1 },
				{ label: $capitalize($t('series.main.sort.titleDesc')), value: 2 },
				{ label: $capitalize($t('series.main.sort.creationDateAsc')), value: 3 },
				{ label: $capitalize($t('series.main.sort.creationDateDesc')), value: 4 },
				{ label: $capitalize($t('series.main.sort.bestRated')), value: 5 },
				{ label: $capitalize($t('series.main.sort.lowestRated')), value: 6 }
			]"
		>
			<template v-slot:append>
				<q-icon name="sort" />
			</template>
		</q-select>
	</div>
	<unauthorized v-if="seriesList === 'error'" :code="401" />
	<q-infinite-scroll
		ref="infiniteScroll"
		class="full-width"
		:offset="400"
		:debounce="100"
		@load="onLoad"
	>
		<series-card
			v-if="seriesList !== 'error'"
			:series="seriesList"
		/>
		<template v-slot:loading>
			<div class="row justify-center q-pa-sm">
				<q-spinner-dots size="6em" color="deep-purple-6" />
			</div>
		</template>
	</q-infinite-scroll>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar, useMeta } from 'quasar';
import { api, baseURL } from 'src/boot/axios';
import meta from 'src/meta';
import { capitalize } from 'src/boot/custom';
import Unauthorized from 'components/error/unauthorized.vue';
import SeriesCard from 'components/pages/series/list.vue';
import type { QInfiniteScroll } from 'quasar';
import type { seriesList } from 'src/types';

export default defineComponent({
	name: 'SeriesPages',
	components: {
		Unauthorized,
		SeriesCard
	},
	setup () {
		const $q = useQuasar();
		const { t } = useI18n();
		const infiniteScroll = ref<QInfiniteScroll | null>(null);
		const apiGetSeries = ref<boolean>(false);
		const seriesList = ref<seriesList[] | 'error' | null>(null);
		const sortBy = ref<{ label: string, value: number }>({ label: capitalize(t('series.main.sort.titleAsc')), value: 1 });
		const search = ref<string | null>(null);
		const size = 100;

		const triggerLoader = () => {
			seriesList.value = null;
			infiniteScroll.value?.resume();
			infiniteScroll.value?.trigger();
		};

		const getLastElement = () => {
			if (!seriesList.value || !seriesList.value.length || seriesList.value === 'error')
				return undefined;
			if (sortBy.value.value <= 2)
				return seriesList.value[seriesList.value.length - 1].title;
			if (sortBy.value.value >= 3 && sortBy.value.value <= 4)
				return seriesList.value[seriesList.value.length - 1].creation_date;
			return seriesList.value[seriesList.value.length - 1].rating;
		};

		const setElement = (e: any) => ({
			id: e.id,
			image: e.image,
			title: e.title,
			creation_date: e.creation_date,
			name: e.name,
			avatar: e.avatar,
			rating: Number(e.rating),
			started_date: e.started_date,
			completion_date: e.completion_date
		});

		const onLoad = (_id: number, done: (stop?: boolean) => void) => {
			apiGetSeries.value = true;
			api.post('/series/published', {
				sort: sortBy.value.value,
				last_element: getLastElement(),
				search: search.value ?? undefined
			})
				.then((d) => {
					if (!seriesList.value)
						seriesList.value = d.data.series.map(setElement);
					else
						(seriesList.value as seriesList[])?.push(...d.data.series.map(setElement));
					done(d.data.series.length < size);
				})
				.catch((e) => $q.notify(e.response.data.info.message))
				.finally(() => {
					apiGetSeries.value = false;
				});
		};

		useMeta(() => {
			return meta({
				meta: {
					title: t('series.meta.main.title'),
					description: t('series.meta.main.description'),
					keywords: ['Sibyllin', 'series', 'enigmas', 'selection']
				},
				og: {
					url: 'https://sibyllin.app/series',
					title: t('series.meta.main.title'),
					description: t('series.meta.main.description'),
					image: 'https://sibyllin.app/img/background.png'
				},
				twitter: {
					url: 'https://sibyllin.app/series',
					title: t('series.meta.main.title'),
					description: t('series.meta.main.description'),
					image: 'https://sibyllin.app/img/background.png'
				}
			});
		});

		onMounted(() => {
			triggerLoader();
			watch(search, () => triggerLoader(), { immediate: false, flush: 'post' });
			watch(sortBy, () => triggerLoader(), { immediate: false, flush: 'post' });
		});

		return {
			baseURL,
			infiniteScroll,
			apiGetSeries,
			seriesList,
			size,
			sortBy,
			search,
			onLoad
		};
	}
});
</script>
