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
			<q-card-actions class="row reverse justify-between">
				<q-btn
					unelevated square
					icon-right="shield"
					color="green-7"
					:label="$t('dashboard.series.verifyBtn')"
					:to="{ name: 'dashboardSeriesList', params: { id: serie.id } }"
				/>
			</q-card-actions>
		</q-card>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { api, baseURL } from 'src/boot/axios';
import type { seriesList } from 'src/types';

export default defineComponent({
	name: 'PagesDashboardSeries',
	setup () {
		const $q = useQuasar();
		const series = ref<seriesList[] | null>(null);

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
}
</style>
