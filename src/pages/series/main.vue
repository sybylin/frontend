<template>
	<div v-if="!series" class="row justify-center items-center q-pt-xl q-pb-xl">
		<q-spinner-cube color="deep-purple-6" size="6em" />
	</div>
	<unauthorized v-else-if="series === 'error'" :code="401" />
	<template v-else>
		<div class="row justify-around q-pa-md">
			<q-input
				v-model="search"
				:loading="seriesSearchLoading"
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
				v-model="sort"
				class="col-md-4 col-12 q-pa-sm"
				filled
				:label="$capitalize($t('series.main.sort.title'))"
				:options="[
					{ label: $capitalize($t('series.main.sort.titleAsc')), value: 'titleAsc' },
					{ label: $capitalize($t('series.main.sort.titleDesc')), value: 'titleDesc' },
					{ label: $capitalize($t('series.main.sort.creationDateAsc')), value: 'creationDateAsc' },
					{ label: $capitalize($t('series.main.sort.creationDateDesc')), value: 'creationDateDesc' },
					{ label: $capitalize($t('series.main.sort.bestRated')), value: 'bestRated' },
					{ label: $capitalize($t('series.main.sort.lowestRated')), value: 'lowestRated' }
				]"
			>
				<template v-slot:append>
					<q-icon name="sort" />
				</template>
			</q-select>
		</div>
		<series-card :series="seriesSearch" />
	</template>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar, useMeta } from 'quasar';
import { api, baseURL } from 'src/boot/axios';
import fuzzy from 'src/fuzzy';
import meta from 'src/meta';
import { capitalize } from 'src/boot/custom';
import Unauthorized from 'components/error/unauthorized.vue';
import SeriesCard from 'components/pages/series/list.vue';
import type { seriesList } from 'src/types';

type SortType = 'titleAsc' | 'titleDesc' | 'creationDateAsc' | 'creationDateDesc' | 'bestRated' | 'lowestRated';

export default defineComponent({
	name: 'SeriesPages',
	components: {
		Unauthorized,
		SeriesCard
	},
	setup () {
		const $q = useQuasar();
		const { t } = useI18n();
		const search = ref<string | null>(null);
		const series = ref<seriesList[] | 'error' | null>(null);
		const seriesSearch = ref<seriesList[]>([]);
		const seriesSearchLoading = ref<boolean>(false);
		const sort = ref<{ label: string, value: SortType }>({ label: capitalize(t('series.main.sort.titleAsc')), value: 'titleAsc' });

		const sortFunction = (newSort: { label: string, value: SortType }) => {
			const getData = (sortType: SortType, first: seriesList, second: seriesList) => {
				switch (sortType) {
				case 'bestRated':
					return { f: second.rating, s: first.rating };
				case 'lowestRated':
					return { f: first.rating, s: second.rating };
				case 'titleAsc':
					return { f: first.title, s: second.title };
				case 'titleDesc':
					return { f: second.title, s: first.title };
				case 'creationDateAsc':
					return { f: new Date(first.modification_date ?? '').getTime(), s: new Date(second.modification_date ?? '').getTime() };
				case 'creationDateDesc':
				default:
					return { f: new Date(second.modification_date ?? '').getTime(), s: new Date(first.modification_date ?? '').getTime() };
				}
			};

			seriesSearch.value.sort((first, second) => {
				const compareData = getData(newSort.value, first, second);
				if (!compareData.f || !compareData.s)
					return 0;
				if (compareData.f < compareData.s)
					return -1;
				if (compareData.f > compareData.s)
					return 1;
				return 0;
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
			api.get('/series/published')
				.then((d) => {
					series.value = d.data.series;
					seriesSearch.value = d.data.series;
					sortFunction(sort.value);
				})
				.catch((e) => {
					series.value = 'error';
					$q.notify({ type: 'error', message: e.response.data.info.message });
				});

			watch(search, (searchValue) => {
				seriesSearchLoading.value = true;
				if (!searchValue || !searchValue.length)
					seriesSearch.value = series.value as seriesList[];
				else if (searchValue && Array.isArray(series.value)) {
					const lowerOfEqualThan = 4;
					seriesSearch.value = [];
					series.value.forEach((e) => {
						const fuzz = {
							creator: (e.creator)
								? fuzzy(e.creator.name.toLowerCase(), searchValue.toLowerCase(), lowerOfEqualThan)
								: null,
							name: fuzzy(e.title.toLowerCase(), searchValue.toLowerCase(), lowerOfEqualThan)
						};
						if ((fuzz.creator !== null && fuzz.creator) || fuzz.name)
							seriesSearch.value.push(e);
					});
				}
				seriesSearchLoading.value = false;
			});

			watch(sort, (newSort) => sortFunction(newSort), { deep: true });
		});

		return {
			baseURL,
			series,
			seriesSearch,
			seriesSearchLoading,
			search,
			sort
		};
	}
});
</script>
