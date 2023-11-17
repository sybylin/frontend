<!-- eslint-disable vue/no-v-html -->
<template>
	<div v-if="!enigma && !notAuthorized" class="row justify-center items-center q-pt-xl q-pb-xl">
		<q-spinner-cube color="deep-purple-6" size="6em" />
	</div>
	<template v-else>
		<unauthorized v-if="notAuthorized" :code="401" />
		<template v-else-if="enigma">
			<div class="row no-wrap justify-between q-pa-sm">
				<q-btn
					:label="$t('create.main.series.return')"
					color="secondary"
					align="between"
					unelevated
					icon="arrow_back"
					:to="{
						name: 'dashboardSeriesList',
						params: {
							id: $route.params.id
						}
					}"
				/>
			</div>
			<q-img
				loading="lazy"
				fit="cover"
				style="height: 30em;"
				:src="(enigma.image) ? `${baseURL}${enigma.image}` : '/imgs/background.jpg' "
			>
				<div class="absolute-bottom">
					<span class="text-h5">{{ enigma.title }}</span>
				</div>
			</q-img>
			<div class="q-pa-sm" v-html="enigma.html"></div>
			<q-separator class="q-ma-sm" />
			<div class="q-ma-sm">
				<div class="row full-width">
					<span class="full-width text-center text-h4 text-weight-light q-pt-sm q-pb-sm">
						{{ $capitalize($t('create.main.tab.solution')) }}
					</span>
				</div>
				<div class="row">
					<div class="full-width row items-center">
						<span class="text-h6 q-pl-sm q-pr-sm">
							{{ $capitalize($t('dashboard.series.solutionType')) }}:
						</span>
						<span class="text-body1">
							{{ $capitalize($t(`create.main.solution.${solutionType}`)) }}
						</span>
					</div>
					<q-card
						class="full-width row q-pa-sm text-center"
						flat
						bordered
					>
						<template v-if="enigma.solution.type === 'STRING'">
							<span class="text-body1">{{ enigma.solution.solution }}</span>
						</template>
						<template v-else-if="enigma.solution.type === 'ARRAY'">
							<div
								v-for="(value, i) in enigma.solution.solution.list"
								:key="i"
								:class="{
									'row': true,
									'items-center': true,
									'q-pa-xs': true,
									'q-ma-xs': true,
									'bg-grey-8': !$q.dark.isActive,
									'bg-grey-1': $q.dark.isActive
								}"
								style="border-radius: 3px; width: fit-content;"
							>
								<span class="text-body1">{{ value }}</span>
							</div>
						</template>
						<template v-else>
							<div class="row text-h6">
								<div
									v-for="(value, key) in enigma.solution.solution"
									:key="key"
									class="full-width row items-center"
								>
									<span class="text-body1 orkney-medium">
										{{ key }}
									</span>
									<q-icon name="east" class="q-pl-sm q-pr-sm" />
									<span class="text-body1">
										{{ value }}
									</span>
								</div>
							</div>
						</template>
					</q-card>
				</div>
			</div>
		</template>
	</template>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute } from 'vue-router';
import { api, baseURL } from 'src/boot/axios';
import { brotliDecompress } from 'src/boot/brotli';
import Unauthorized from 'components/error/unauthorized.vue';

interface enigma {
	title: string;
	image: string | null;
	description: string;
	solution: { type: 'STRING'; solution: string; } |
	{ type: 'ARRAY'; solution: { keepOrder: boolean; list: string[]; }; } |
	{ type: 'OBJECT'; solution: Record<string, string>; };
	html: string;
}

export default defineComponent({
	name: 'PagesDashboardSeriesEnigma',
	components: {
		Unauthorized
	},
	setup () {
		const $q = useQuasar();
		const route = useRoute();
		const enigma = ref<enigma | null>(null);
		const notAuthorized = ref<boolean>(false);
		const solutionType = computed(() => {
			switch (enigma.value?.solution.type) {
			case 'ARRAY':
				return 'keywords';
			case 'OBJECT':
				return 'keyvalues';
			case 'STRING':
			default:
				return 'sentence';
			}
		});

		onMounted(() => {
			api.post('/enigma/page/prod', {
				enigma_id: Number(route.params.enigmaId),
				series_id: Number(route.params.id)
			})
				.then(async (d) => {
					if (!d.data.enigma || d.data.enigma === false)
						notAuthorized.value = true;
					else {
						enigma.value = {
							title: d.data.info.title,
							image: d.data.info.image,
							description: d.data.info.description,
							solution: {
								type: d.data.solution.type,
								solution: JSON.parse(d.data.solution.solution)
							},
							html: await brotliDecompress(d.data.enigma) ?? ''
						};
					}
				})
				.catch((e) => $q.notify(e.response.data.info.message));
		});

		return {
			baseURL,
			enigma,
			notAuthorized,
			solutionType
		};
	}
});
</script>
