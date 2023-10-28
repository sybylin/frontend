<template>
	<div v-if="!series" class="row justify-center items-center q-pt-xl q-pb-xl">
		<q-spinner-cube color="deep-purple-6" size="6em" />
	</div>
	<template v-else>
		<div class="row no-wrap justify-between q-pa-sm">
			<q-btn
				label="Return"
				color="secondary"
				align="between"
				unelevated
				icon="arrow_back"
				:to="{ name: 'series' }"
			/>
			<span class="text-h5">{{ series.title }}</span>
			<div
				v-if="!seriesRating"
				class="row items-center q-pr-md"
			>
				<q-spinner-puff
					color="primary"
					size="2.5em"
				/>
			</div>
			<q-rating
				v-else
				v-model="seriesRating"
				:disable="seriesRatingUpdate"
				color="yellow-8"
				icon="star_border"
				icon-selected="star"
				size="2em"
				:max="5"
			/>
		</div>
		<q-separator class="q-ml-sm q-mr-sm" />
		<div class="row justify-center">
			<blockquote class="text-body1">
				{{ series.description }}
			</blockquote>
		</div>
		<q-separator class="q-ml-sm q-mr-sm" />
		<div class="q-pa-xl row items-center justify-center q-gutter-md">
			<q-card
				v-for="(enigma, index) of enigmas" :key="enigma.id"
				class="card"
				flat bordered square
			>
				<q-img
					loading="lazy"
					style="height: 19em;"
					:src="(enigma.image) ? `${baseURL}${enigma.image}` : '/imgs/background.jpg' "
				>
					<div class="absolute-bottom">
						<span class="text-h6">{{ enigma.title }}</span>
					</div>
				</q-img>
				<q-card-actions class="row reverse">
					<q-btn
						unelevated square
						:icon-right="(startResumeOrUnauthorized(index) === 3) ? 'play_circle' : 'play_arrow'"
						:color="(startResumeOrUnauthorized(index) === 3) ? 'secondary' : 'green-7'"
						:label="(startResumeOrUnauthorized(index) === 3) ? $t('main.resume') : $t('main.start')"
						:disable="(startResumeOrUnauthorized(index) === 2)"
						:to="!(startResumeOrUnauthorized(index) === 2)
							? {
								name: 'enigma',
								params: {
									id: $route.params.id,
									enigmaId: enigma.id
								}
							}
							: undefined
						"
					/>
				</q-card-actions>
			</q-card>
		</div>
	</template>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { api, baseURL } from 'src/boot/axios';
import type { enigma, series } from 'src/types';

enum enigmaStatus {
	start = 1,
	unauthorized,
	resume
}

export default defineComponent({
	name: 'SeriesDetailPage',
	setup () {
		const $q = useQuasar();
		const route = useRoute();
		const series = ref<series | null>(null);
		const enigmas = ref<enigma[] | null>(null);
		const seriesRating = ref<number | null>(null);
		const seriesRatingUpdate = ref<boolean>(false);

		const startResumeOrUnauthorized = (index: number): enigmaStatus => {
			if (index <= 0) {
				return (!enigmas.value?.[index].finished)
					? enigmaStatus.start
					: enigmaStatus.resume;
			}
			if (enigmas.value?.[index - 1].finished && !enigmas.value?.[index].finished)
				return enigmaStatus.start;
			return enigmaStatus.unauthorized;
		};

		onMounted(() => {
			api.post('/series/one/rating/user', {
				series_id: Number(route.params.id)
			})
				.then((d) => d.data)
				.then((d) => {
					seriesRating.value = Number(d.rating);
					watch(seriesRating, (n, o) => {
						if (o && n && o !== n) {
							seriesRatingUpdate.value = true;
							api.put('/series/one/rating', {
								series_id: series.value?.id,
								rating: n
							})
								.finally(() => {
									seriesRatingUpdate.value = false;
								});
						}
					});
				})
				.catch((e) => {
					console.error(e.response);
					$q.notify(e.response.info.message);
				});

			api.post('/series/one', {
				series_id: Number(route.params.id)
			})
				.then((d) => d.data)
				.then((d) => {
					console.log(d);
					series.value = d.series;
					enigmas.value = d.series.series_enigma_order.map((e: any) => ({
						id: e.enigma.id,
						title: e.enigma.title,
						description: e.enigma.description,
						image: e.enigma.image,
						finished: ((e.enigma.enigma_finished as any[]).length > 0)
					})) as enigma[];
				})
				.catch((e) => {
					console.error(e);
					$q.notify(e.response.info.message);
				});
		});

		return {
			baseURL,
			series,
			enigmas,
			seriesRating,
			seriesRatingUpdate,
			startResumeOrUnauthorized
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
