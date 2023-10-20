<template>
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
				<div class="absolute-top transparent row reverse">
					<q-avatar
						v-if="!serie.creator"
						color="secondary"
						icon="person"
					/>
					<q-avatar v-else>
						<q-img
							loading="lazy"
							class="border"
							:src="(serie.creator.avatar) ? `${baseURL}${serie.creator.avatar}` : '/imgs/background.jpg' "
						>
							<q-tooltip
								anchor="center left"
								self="center right"
								class="bg-secondary text-body2"
							>
								<span>{{ $capitalize(serie.creator.name) }}</span>
							</q-tooltip>
						</q-img>
					</q-avatar>
				</div>
				<div class="absolute-bottom">
					<span class="text-h6">{{ serie.title }}</span>
				</div>
			</q-img>
			<q-card-actions class="row justify-between">
				<q-rating
					v-model="serie.rating"
					readonly
					color="yellow-8"
					icon="star_border"
					icon-selected="star"
					size="2em"
					:max="5"
				/>
				<q-btn
					unelevated square
					:icon-right="(serie.series_started) ? 'play_circle' : 'play_arrow'"
					:color="(serie.series_started) ? 'orange-7' : 'green-7'"
					:label="(serie.series_started) ? $t('main.resume') : $t('main.start')"
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

interface seriesList {
	id: number;
	title: string;
	image: string | null;
	rating: number;
	creator: { name: string; avatar: string | null } | null;
	modification_date: Date | null;
	series_finished: Date | null;
	series_started: Date | null;
}

export default defineComponent({
	name: 'SeriesPages',
	setup () {
		const { t } = useI18n();
		const series = ref<seriesList[]>([]);

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

<style scoped lang="scss">
.card {
	width: 100%;
	max-width: 25em;
}
.border {
	border: 2px solid $grey-8;
	border-radius: 50%;
}
</style>
