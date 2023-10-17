<template>
	{{ series }}
	<div class="q-pa-xl row items-center justify-center q-gutter-md">
		<q-card
			v-for="serie of series" :key="serie.id"
			class="card"
			flat bordered square
		>
			<q-img
				loading="lazy"
				style="max-height: 20em;"
				:src="(serie.image) ? `${baseURL}${serie.image}` : '/imgs/background.jpg' "
			>
				<div class="absolute-bottom">
					<span class="text-h6">{{ serie.title }}</span>
				</div>
			</q-img>
			<q-card-actions class="row reverse">
				<q-btn
					unelevated square
					:icon-right="(serie.series_started.length) ? 'play_circle' : 'play_arrow'"
					:color="(serie.series_started.length) ? 'green-7' : 'orange-7'"
					:label="(serie.series_started.length) ? $t('main.resume') : $t('main.start')"
					:to="{ name: 'enigmaList', params: { id: serie.id } }"
				/>
			</q-card-actions>
		</q-card>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'quasar';
import { api, baseURL } from 'src/boot/axios';
import meta from 'src/meta';

interface serieList {
	id: number;
	title: string;
	image: string | null;
	modification_date: Date | null;
	series_finished: { completion_date: Date | null }[];
	series_started: { started_date: Date | null }[];
}

export default defineComponent({
	name: 'SeriesPages',
	setup () {
		const { t } = useI18n();
		const series = ref<serieList[]>([]);

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
				.then((d) => d.data)
				.then((d) => {
					series.value = d.series;
				})
				.catch((e) => console.error(e));
		});

		return {
			baseURL,
			series
		};
	}
});
</script>

<style scoped>
.card {
	width: 100%;
	max-width: 25em;
}
</style>
