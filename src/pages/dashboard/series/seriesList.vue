<template>
	<div v-if="!series && !notAuthorized" class="row justify-center items-center q-pt-xl q-pb-xl">
		<q-spinner-cube color="deep-purple-6" size="6em" />
	</div>
	<template v-else>
		<div v-if="notAuthorized" class="row justify-center">
			<unauthorized :code="401" />
		</div>
		<template v-else-if="series">
			<div class="row no-wrap justify-between q-pa-sm">
				<q-btn
					:label="$t('create.main.series.return')"
					color="secondary"
					align="between"
					unelevated
					icon="arrow_back"
					:to="{ name: 'dashboardSeries' }"
				/>
				<div class="row items-center">
					<q-btn
						unelevated
						color="red-7"
						icon="unpublished"
						label="decline"
						class="q-mr-sm"
					>
						<q-popup-proxy>
							<q-form @submit="declineSeries">
								<q-banner>
									<q-input
										v-model="rejection"
										:label="$capitalize($t('dashboard.series.rejectionReason'))"
										outlined
										autogrow
									/>
									<template v-slot:action>
										<q-btn
											unelevated
											color="green"
											round
											icon="check"
											type="submit"
										/>
									</template>
								</q-banner>
							</q-form>
						</q-popup-proxy>
					</q-btn>
					<q-btn
						unelevated
						color="green-7"
						icon="check_circle"
						label="validate"
						@click="validateSeries"
					/>
				</div>
			</div>
			<div class="row">
				<div class="full-width row items-center">
					<span class="text-h6 q-pl-sm q-pr-sm">
						{{ $capitalize($t('dashboard.series.seriesCreator')) }}:
					</span>
					<span class="text-body1">{{ series.series_creator.name }}</span>
				</div>
				<div class="full-width row items-center">
					<span class="text-h6 q-pl-sm q-pr-sm">
						{{ $capitalize($t('dashboard.series.seriesTitle')) }}:
					</span>
					<span class="text-body1">{{ series.title }}</span>
				</div>
				<div class="full-width row items-center">
					<span class="text-h6 q-pl-sm q-pr-sm">
						{{ $capitalize($t('dashboard.series.seriesDescription')) }}:
					</span>
					<span class="text-body1">{{ series.description }}</span>
				</div>
			</div>
			<div class="q-pa-xl row items-center justify-center q-gutter-md">
				<q-card
					v-for="(enigma) of enigmas" :key="enigma.id"
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
							color="secondary"
							:label="$t('dashboard.series.verifyBtnEnigma')"
							:to="{
								name: 'dashboardSeriesEnigma',
								params: {
									id: $route.params.id,
									enigmaId: enigma.id
								}
							}
							"
						/>
					</q-card-actions>
				</q-card>
			</div>
		</template>
	</template>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { api, baseURL } from 'src/boot/axios';
import Unauthorized from 'components/error/unauthorized.vue';
import type { enigma, series } from 'src/types';

export default defineComponent({
	name: 'PagesDashboardSeriesList',
	components: {
		Unauthorized
	},
	setup () {
		const $q = useQuasar();
		const route = useRoute();
		const router = useRouter();
		const notAuthorized = ref<boolean>(false);
		const series = ref<series | null>(null);
		const enigmas = ref<enigma[] | null>(null);
		const rejection = ref<string | null>(null);

		const declineSeries = () => {
			api.post('/series/publish/unpublish', {
				series_id: Number(route.params.id),
				reason: rejection.value
			})
				.then(() => {
					router.push({
						name: 'dashboardSeries'
					});
				})
				.catch((e) => $q.notify(e.response.data.info.message));
		};

		const validateSeries = () => {
			api.post('/series/publish', {
				series_id: Number(route.params.id)
			})
				.then(() => {
					router.push({
						name: 'dashboardSeries'
					});
				})
				.catch((e) => $q.notify(e.response.data.info.message));
		};

		onMounted(() => {
			api.post('/series/one', {
				series_id: Number(route.params.id)
			})
				.then((d) => d.data)
				.then(async (d) => {
					if (d.series === null || d.series === false)
						notAuthorized.value = true;
					else {
						series.value = d.series;
						enigmas.value = d.series.series_enigma_order.map((e: any) => ({
							id: e.enigma.id,
							title: e.enigma.title,
							description: e.enigma.description,
							image: e.enigma.image,
							finished: ((e.enigma.enigma_finished as any[]).length > 0)
						})) as enigma[];
					}
				})
				.catch((e) => $q.notify(e.response.data.info.message));
		});

		return {
			baseURL,
			notAuthorized,
			series,
			enigmas,
			rejection,
			declineSeries,
			validateSeries
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
