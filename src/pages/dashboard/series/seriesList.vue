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
			<div class="row no-wrap justify-between q-pa-sm">
				<q-btn
					:label="$t('create.main.series.return')"
					color="secondary"
					align="between"
					unelevated
					icon="arrow_back"
					:to="{ name: 'dashboardSeries', params: { lang: $route.params.lang } }"
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
					<span class="text-h6 q-pl-sm q-pr-sm orkney-regular">
						{{ $capitalize($t('dashboard.series.seriesCreator')) }}:
					</span>
					<span class="text-body1">
						<template v-for="(creator, i) of series.series_creator">
							{{ creator.name }}{{ i + 1 < series.series_creator.length ? '/' : '' }}
						</template>
					</span>
				</div>
				<div class="full-width row items-center">
					<span class="text-h6 q-pl-sm q-pr-sm orkney-regular">
						{{ $capitalize($t('dashboard.series.seriesTitle')) }}:
					</span>
					<span class="text-body1">{{ series.title }}</span>
				</div>
				<div class="full-width row items-center">
					<span class="text-h6 q-pl-sm q-pr-sm orkney-regular">
						{{ $capitalize($t('dashboard.series.seriesDescription')) }}:
					</span>
					<span class="text-body1">{{ series.description }}</span>
				</div>
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
							color="secondary"
							:label="$t('dashboard.series.verifyBtnEnigma')"
							:to="{
								name: 'dashboardSeriesEnigma',
								params: {
									lang: $route.params.lang,
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
import Error from 'pages/error.vue';
import Unauthorized from 'components/error/unauthorized.vue';
import type { series } from 'src/types';

export default defineComponent({
	name: 'PagesDashboardSeriesList',
	components: {
		Error,
		Unauthorized
	},
	setup () {
		const $q = useQuasar();
		const route = useRoute();
		const router = useRouter();

		const error = ref<'notExist' | 'notAuthorized' | false>(false);
		const series = ref<series | null>(null);
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
				.then(async (d) => {
					if (d.data.series === false)
						error.value = 'notAuthorized';
					else if (Object.prototype.hasOwnProperty.call(d.data.series, 'notExist'))
						error.value = 'notExist';
					else
						series.value = d.data.series;
				})
				.catch((e) => $q.notify(e.response.data.info.message));
		});

		return {
			baseURL,
			error,
			series,
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
