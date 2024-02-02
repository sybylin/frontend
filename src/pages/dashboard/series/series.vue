<template>
	<div class="q-pa-xl row items-center justify-center q-gutter-md">
		<div v-if="!series || !series.length" class="row justify-center full-width">
			<span class="text-h4 text-weight-light">{{ $capitalize($t('series.main.noSeries')) }}</span>
		</div>
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
					<q-avatar>
						<q-img
							loading="lazy"
							class="border"
							:src="(serie.avatar) ? `${baseURL}${serie.avatar}` : '/imgs/background.jpg' "
						>
							<q-tooltip
								anchor="center left"
								self="center right"
								class="bg-secondary text-body2"
							>
								<span>{{ $capitalize(serie.name) }}</span>
							</q-tooltip>
						</q-img>
					</q-avatar>
				</div>
				<div class="absolute-bottom">
					<span class="text-h6">{{ serie.title }}</span>
				</div>
			</q-img>
			<q-card-actions class="row reverse justify-between">
				<q-btn
					unelevated square
					icon-right="shield"
					color="green-7"
					:label="$t('dashboard.series.verifyBtn')"
					:to="{ name: 'dashboardSeriesList', params: { lang: $route.params.lang, id: serie.id } }"
				/>
			</q-card-actions>
		</q-card>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useQuasar, useMeta } from 'quasar';
import { useI18n } from 'vue-i18n';
import { api, baseURL } from 'src/boot/axios';
import { capitalize } from 'src/boot/custom';
import meta from 'src/meta';
import type { seriesList } from 'src/types';

export default defineComponent({
	name: 'PagesDashboardSeries',
	setup () {
		const $q = useQuasar();
		const { t } = useI18n();
		const series = ref<seriesList[] | null>(null);

		useMeta(() => {
			return meta({
				meta: {
					title: capitalize(t('dashboard.series.title')),
					description: capitalize(t('dashboard.series.desc'))
				},
				og: {
					url: 'https://sybyl.in/dashboard/users',
					title: capitalize(t('dashboard.series.title')),
					description: capitalize(t('dashboard.series.desc')),
					image: 'https://sybyl.in/img/background.png'
				},
				twitter: {
					url: 'https://sybyl.in/dashboard/users',
					title: capitalize(t('dashboard.series.title')),
					description: capitalize(t('dashboard.series.desc')),
					image: 'https://sybyl.in/img/background.png'
				}
			});
		});

		onMounted(() => {
			api.get('/series/publish/pending')
				.then((d) => {
					series.value = d.data.pending;
				})
				.catch((e) => $q.notify(e.response.data.info.message));
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
	width: 2em;
	height: 2em;
}
</style>
