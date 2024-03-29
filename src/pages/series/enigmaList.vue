<template>
	<div v-if="!series && !error" class="row justify-center items-center q-pt-xl q-pb-xl">
		<q-spinner-cube color="deep-purple-6" size="6em" />
	</div>
	<template v-else>
		<div v-if="error === 'notAuthorized'" class="row justify-center">
			<unauthorized :code="401" />
		</div>
		<error v-else-if="error === 'notExist'" />
		<template v-else-if="series">
			<div class="row no-wrap justify-between q-pa-md">
				<q-btn
					v-show="!$q.screen.xs"
					:label="$t('create.main.series.return')"
					color="secondary"
					align="between"
					unelevated
					icon="arrow_back"
					:to="{ name: 'series', params: { lang: $route.params.lang } }"
				/>
				<span class="text-h5 orkney-regular">{{ series.title }}</span>
				<div
					v-if="seriesRating === null"
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
					:readonly="!store.isConnected"
					color="yellow-8"
					icon="star_border"
					icon-selected="star"
					icon-half="star_half"
					size="2em"
					:max="5"
				/>
			</div>
			<q-slide-transition>
				<div v-show="openTransition">
					<div class="q-pa-md row justify-evenly">
						<div class="column justify-center">
							<span class="text-h5 orkney-regular">
								{{ $capitalize($t('create.main.series.title')) }}
							</span>
							<span class="text-body1 q-ml-sm">
								{{ series.title }}
							</span>
							<span class="text-h5 orkney-regular">
								{{ $capitalize($t('create.main.series.description')) }}
							</span>
							<span class="text-body1 q-ml-sm">
								{{ series.description }}
							</span>
							<template v-if="series.series_finished && series.series_finished.length > 0">
								<span class="text-h5 orkney-regular">
									{{ $capitalize($t('create.main.series.finishedOn')) }}
								</span>
								<span class="text-body1 q-ml-sm">
									{{ date(series.series_finished[0]) }}
								</span>
							</template>
						</div>
						<div class="column items-center">
							<span class="text-h5 orkney-regular">
								{{ $capitalize($t('create.main.series.createdBy')) }}
							</span>
							<q-img
								:src="series.series_creator.length > 0 && series.series_creator[0].avatar ? `${baseURL}${series.series_creator[0].avatar ?? ''}` : '/imgs/background.jpg'"
								class="rounded"
								@click="$router.push({ name: 'profil', params: { lang: $route.params.lang, username: series.series_creator[0].name } })"
							/>
							<span class="text-h5 text-center">
								{{ $capitalize(series.series_creator[0].name) }}
							</span>
						</div>
					</div>
				</div>
			</q-slide-transition>
			<div
				:class="{
					'row': true,
					'no-wrap': true,
					'full-width': true,
					'items-center': true,
					'justify-between': !$q.screen.xs,
					'justify-center': $q.screen.xs
				}"
			>
				<q-separator v-show="!$q.screen.xs" class="q-ml-sm separator" />
				<q-btn
					flat
					round
					size="1.2em"
					color="dark"
					:text-color="$q.dark.isActive ? 'white' : 'dark'"
					:icon="(openTransition) ? 'expand_less' : 'expand_more'"
					@click="() => openTransition = !openTransition"
				/>
				<q-separator v-show="!$q.screen.xs" class="q-mr-sm separator" />
			</div>

			<div class="q-pa-xl row items-center justify-center q-gutter-md">
				<q-card
					v-for="enigma of series.series_enigma_order" :key="enigma.id"
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
							:icon-right="enigma.finished === 'RESUME' ? 'play_circle' : 'play_arrow'"
							:color="enigma.finished === 'RESUME' ? 'secondary' : 'green-7'"
							:label="enigma.finished === 'RESUME' ? $t('main.resume') : $t('main.start')"
							:disable="enigma.finished === 'UNAUTHORIZED'"
							:to="!(enigma.finished === 'UNAUTHORIZED')
								? {
									name: 'enigma',
									params: {
										lang: $route.params.lang,
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
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useQuasar, useMeta } from 'quasar';
import { api, baseURL } from 'src/boot/axios';
import { globalStore } from 'src/stores/global';
import meta from 'src/meta';
import Error from 'pages/error.vue';
import Unauthorized from 'components/error/unauthorized.vue';
import type { series } from 'src/types';
import { capitalize } from 'src/boot/custom';

export default defineComponent({
	name: 'SeriesDetailPage',
	components: {
		Error,
		Unauthorized
	},
	setup () {
		const $q = useQuasar();
		const { t } = useI18n();
		const route = useRoute();
		const store = globalStore();

		const openTransition = ref<boolean>(false);
		const error = ref<'notExist' | 'notAuthorized' | false>(false);
		const series = ref<series | null>(null);
		const seriesRating = ref<number | null>(null);
		const seriesRatingUpdate = ref<boolean>(false);
		const computedTitle = computed<string>(() => (series.value)
			? `${series.value.title} | ${t('series.meta.main.title')}`
			: t('series.meta.main.title'));
		const computedDesc = computed<string>(() => (series.value)
			? capitalize(series.value.description)
			: capitalize(t('series.meta.series.description')));

		const getNote = () => {
			api.post('/series/one/rating/user', {
				series_id: Number(route.params.id)
			})
				.then((d) => d.data)
				.then((d) => {
					if (Object.prototype.hasOwnProperty.call(d, 'rating'))
						seriesRating.value = Number(d.rating);
					watch(seriesRating, (n, o) => {
						if (o !== null && n !== null && o !== n) {
							seriesRatingUpdate.value = true;
							api.put('/series/one/rating', {
								series_id: Number(route.params.id),
								rating: n
							})
								.finally(() => {
									seriesRatingUpdate.value = false;
								});
						}
					});
				})
				.catch((e) => {
					$q.notify(e.response.data.info.message);
				});
		};

		const date = (date: Date) => {
			const _date = new Date(date);
			return `${_date.getUTCDate()}/${_date.getUTCMonth() + 1}/${_date.getUTCFullYear()} - ${_date.getUTCHours()}:${_date.getUTCMinutes()}`;
		};

		useMeta(() => {
			return meta({
				meta: {
					title: computedTitle.value,
					description: computedDesc.value,
					keywords: ['series']
				},
				og: {
					url: 'https://sybyl.in/series',
					title: computedTitle.value,
					description: computedDesc.value,
					image: 'https://sybyl.in/img/background.png'
				},
				twitter: {
					url: 'https://sybyl.in/series',
					title: computedTitle.value,
					description: computedDesc.value,
					image: 'https://sybyl.in/img/background.png'
				}
			});
		});

		onMounted(() => {
			api.post('/series/one', {
				series_id: Number(route.params.id)
			})
				.then(async (d) => {
					if (d.data.series === false)
						error.value = 'notAuthorized';
					else if (Object.prototype.hasOwnProperty.call(d.data.series, 'notExist'))
						error.value = 'notExist';
					else {
						series.value = d.data.series;
						seriesRating.value = Number(d.data.series.rating);
						if (store.isConnected)
							getNote();
					}
				})
				.catch((e) => {
					$q.notify(e.response.data.info.message);
				});
		});

		return {
			baseURL,
			store,
			openTransition,
			error,
			series,
			seriesRating,
			seriesRatingUpdate,
			date
		};
	}
});
</script>

<style scoped>
.card {
	width: 100%;
	max-width: 25em;
}
.separator {
	width: 43%;
}
.button {
	width: 14%;
}
.rounded {
	cursor: pointer;
	border-radius: 50%;
	height: 8em;
	width: 8em;
}
</style>
