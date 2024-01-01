<!-- eslint-disable vue/no-v-html -->
<template>
	<div v-if="!enigma && !error" class="row justify-center items-center q-pt-xl q-pb-xl">
		<q-spinner-cube color="deep-purple-6" size="6em" />
	</div>
	<template v-else>
		<unauthorized v-if="error === 'brotliError'" :code="422" :message="$t('error.brotli.title')" />
		<unauthorized v-else-if="error === 'notAuthorized'" :code="401" />
		<error v-else-if="error === 'notExist'" />
		<template v-else>
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
			<div
				v-if="error === 'empty'"
				class="full-width row justify-center"
			>
				<h5 class="orkney-regular">
					{{ $capitalize($t('dashboard.series.emptyEnigma')) }}
				</h5>
			</div>
			<template v-else-if="enigma">
				<q-img
					loading="lazy"
					fit="cover"
					class="img"
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
							<div
								v-if="enigma.solution === null"
								class="full-width row justify-center"
							>
								<q-icon name="warning" size="2em" color="red" />
								<span class="q-ml-sm q-mr-sm orkney-regular text-h6">
									{{ $capitalize($t('dashboard.series.emptySolution')) }}
								</span>
								<q-icon name="warning" size="2em" color="red" />
							</div>
							<template v-else>
								<span v-if="enigma.solution.type === 'STRING'" class="text-body1">
									{{ enigma.solution.solution }}
								</span>
								<template v-else-if="enigma.solution.type === 'ARRAY'">
									<div
										v-for="(value, i) in enigma.solution.solution.list"
										:key="i"
										:class="{
											'row': true,
											'items-center': true,
											'q-pa-xs': true,
											'q-ma-xs': true,
											'keyword': true,
											'bg-grey-8': !$q.dark.isActive,
											'bg-grey-1': $q.dark.isActive
										}"
									>
										<span class="text-body1">{{ value }}</span>
									</div>
								</template>
								<div v-else class="row text-h6">
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
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute } from 'vue-router';
import { api, baseURL } from 'src/boot/axios';
import { brotliDecompress } from 'src/boot/brotli';
import Error from 'pages/error.vue';
import Unauthorized from 'components/error/unauthorized.vue';

interface enigma {
	title: string;
	image: string | null;
	description: string;
	solution:
	{ type: 'STRING'; solution: string; } |
	{ type: 'ARRAY'; solution: { keepOrder: boolean; list: string[]; }; } |
	{ type: 'OBJECT'; solution: Record<string, string>; } |
	null;
	html: string;
}

export default defineComponent({
	name: 'PagesDashboardSeriesEnigma',
	components: {
		Error,
		Unauthorized
	},
	setup () {
		const $q = useQuasar();
		const route = useRoute();

		const enigma = ref<enigma | null>(null);
		const error = ref<'notExist' | 'notAuthorized' | 'brotliError' | 'empty' | false>(false);
		const solutionType = computed(() => {
			if (!enigma.value?.solution)
				return 'null';
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
			api.post('/enigmas/page/moderator', {
				enigma_id: Number(route.params.enigmaId),
				series_id: Number(route.params.id)
			})
				.then(async (d) => {
					if (d.data.enigma === false)
						error.value = 'notAuthorized';
					else if (Object.prototype.hasOwnProperty.call(d.data.enigma, 'notExist'))
						error.value = 'notExist';
					else if (Object.prototype.hasOwnProperty.call(d.data.enigma, 'empty'))
						error.value = 'empty';
					else {
						enigma.value = {
							title: d.data.info.title,
							image: d.data.info.image,
							description: d.data.info.description,
							solution: (d.data.solution)
								? {
									type: d.data.solution.type ?? null,
									solution: JSON.parse(d.data.solution.solution ?? {})
								}
								: null,
							html: await brotliDecompress(d.data.enigma) ?? ''
						};
					}
				})
				.catch((e) => {
					console.log(e);
					if (typeof e === 'string' && (e as string).includes('Brotli'))
						error.value = 'brotliError';
					else
						$q.notify({ type: 'negative', message: e.response.data.info.message });
				});
		});

		return {
			baseURL,
			enigma,
			error,
			solutionType
		};
	}
});
</script>

<style scoped>
.img {
	height: 30em;
}
.keyword {
	border-radius: 3px;
	width: fit-content;
}
</style>
