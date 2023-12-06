<template>
	<q-select
		v-model="type"
		class="col-md-4 col-12 q-pa-sm"
		filled
		:label="$capitalize($t('series.main.sort.filter'))"
		:options="[
			{ label: $capitalize($t('series.main.sort.all')), value: 'all' },
			{ label: $capitalize($t('series.main.sort.started')), value: 'started' },
			{ label: $capitalize($t('series.main.sort.finished')), value: 'finished' }
		]"
	>
		<template v-slot:append>
			<q-icon name="sort" />
		</template>
	</q-select>
	<series-card v-if="series" :series="seriesSearch" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { capitalize } from 'src/boot/custom';
import SeriesCard from 'components/pages/series/list.vue';
import type { user, seriesList } from 'src/types';

type SortType = 'all' | 'started' | 'finished';

export default defineComponent({
	name: 'ComponentsPagesUserSeries',
	components: {
		SeriesCard
	},
	props: {
		user: {
			type: Object as PropType<user>,
			required: true
		}
	},
	setup () {
		const $q = useQuasar();
		const { t } = useI18n();
		const type = ref<{ label: string, value: SortType }>(
			{
				label: capitalize(t('series.main.sort.all')),
				value: 'all'
			});
		const series = ref<seriesList[] | 'error' | null>(null);
		const seriesSearch = ref<seriesList[]>([]);

		const sortFunction = (newSort: { label: string, value: SortType }) => {
			if (!series.value || series.value === 'error')
				return;
			if (newSort.value === 'all')
				seriesSearch.value = series.value;
			else {
				seriesSearch.value = series.value.filter((e) => {
					return (
						(newSort.value === 'started' && e.started_date && !e.completion_date) ||
						(newSort.value === 'finished' && e.started_date)
					);
				});
			}
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

		onMounted(() => {
			api.get('series/user')
				.then((d) => {
					series.value = d.data.series.map(setElement);
					seriesSearch.value = d.data.series.map(setElement);
				})
				.catch((e) => {
					series.value = 'error';
					$q.notify({ type: 'error', message: e.response.data.info.message });
				});

			watch(type, (newType) => sortFunction(newType), { deep: true });
		});

		return {
			type,
			series,
			seriesSearch
		};
	}
});
</script>
