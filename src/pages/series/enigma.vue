<!-- eslint-disable vue/no-v-html -->
<template>
	<div v-if="!enigma && !error" class="row justify-center items-center q-pt-xl q-pb-xl">
		<q-spinner-cube color="deep-purple-6" size="6em" />
	</div>
	<template v-else>
		<unauthorized v-if="error === 'brotliError'" :code="422" :message="$t('error.brotli.title')" />
		<unauthorized v-else-if="error === 'notAuthorized' || error === 'empty'" :code="401" />
		<error v-else-if="error === 'notExist'" />
		<template v-else-if="enigma">
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
					<div
						v-if="statusSolution === 'invalid'"
						class="row justify-center items-center full-width text-white bg-red-7 q-pa-sm q-mb-md"
						style="position: relative;"
					>
						<q-btn
							flat
							round
							icon="close"
							size="xs"
							style="position: absolute; right: 5px; top: 5px"
							@click="() => statusSolution = null"
						/>
						<span class="text-h6 text-weight-light text-light">
							{{ $capitalize($t('series.solution.check.error')) }}
						</span>
					</div>
					<components-string-solution
						v-if="enigma.solutionType === 'STRING'"
						:check="checkSolution"
						@check="check"
					/>
					<components-array-solution
						v-else-if="enigma.solutionType === 'ARRAY'"
						:check="checkSolution"
						@check="check"
					/>
					<components-object-solution
						v-else-if="enigma.objectSolutionKeys"
						:check="checkSolution"
						:keys="enigma.objectSolutionKeys"
						@check="check"
					/>
					<q-btn
						class="q-ma-md full-width"
						:color="genColor"
						:loading="checkSolution"
						:disable="computedIsEmpty || statusSolution === 'valid'"
						@click="checkSolution = true"
					>
						{{ $t('series.solution.check.title') }}
						<template v-slot:loading>
							<q-spinner-hourglass class="on-left" />
							{{ $t('series.solution.check.load') }}
						</template>
						<q-tooltip
							v-if="computedIsEmpty"
							:class="`bg-${genColor} text-body2`"
							:offset="[10, 10]"
						>
							<q-icon name="warning" size="2em" color="red" />
							<span class="q-ml-sm q-mr-sm orkney-regular text-h6">
								{{ $capitalize($t('dashboard.series.emptySolution')) }}
							</span>
							<q-icon name="warning" size="2em" color="red" />
						</q-tooltip>
					</q-btn>
				</div>
			</div>
			<audio-player />
		</template>
	</template>
	<components-confetti
		v-model="confetti"
		@finish="finishAndRedirect"
	/>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useQuasar, useMeta } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { brotliDecompress } from 'src/boot/brotli';
import { api, baseURL } from 'src/boot/axios';
import { capitalize } from 'src/boot/custom';
import meta from 'src/meta';
import componentsStringSolution from 'src/components/pages/series/string.vue';
import componentsArraySolution from 'src/components/pages/series/array.vue';
import componentsObjectSolution from 'src/components/pages/series/object.vue';
import componentsConfetti from 'src/components/pages/confetti.vue';
import Unauthorized from 'components/error/unauthorized.vue';
import Error from 'pages/error.vue';
import AudioPlayer from 'src/components/audio/player.vue';
import type { NamedColor } from 'quasar';
import type { Solution } from 'src/types';

interface enigma {
	title: string;
	image: string | null;
	description: string;
	solutionType: Solution;
	objectSolutionKeys?: string[] | null;
	html: string;
}

export default defineComponent({
	name: 'EnigmaPages',
	components: {
		componentsStringSolution,
		componentsArraySolution,
		componentsObjectSolution,
		componentsConfetti,
		Error,
		Unauthorized,
		AudioPlayer
	},
	setup () {
		const $q = useQuasar();
		const route = useRoute();
		const router = useRouter();
		const { t } = useI18n();

		const error = ref<'notExist' | 'notAuthorized' | 'brotliError' |'empty' | false>(false);
		const enigma = ref<enigma | null>(null);
		const checkSolution = ref<boolean>(false);

		const statusSolution = ref<'valid' | 'invalid' | null>(null);
		const confetti = ref<boolean>(false);
		const genColor = computed((): NamedColor => (checkSolution.value)
			? 'deep-purple-6'
			: 'green-6'
		);
		const computedTitle = computed(() => (enigma.value)
			? `${enigma.value.title} | ${t('series.meta.enigma.title')}`
			: t('series.meta.enigma.title'));
		const computedDesc = computed(() => (enigma.value)
			? capitalize(enigma.value.description)
			: t('series.meta.enigma.description'));
		const computedIsEmpty = computed(() => !!(enigma.value && !enigma.value.solutionType && !enigma.value.objectSolutionKeys));

		const check = (d: string | string[] | Record<string, string>) => {
			if (computedIsEmpty.value)
				return;
			statusSolution.value = null;
			api.post('/enigmas/solution/check', {
				id: Number(route.params.enigmaId),
				solution: {
					type: enigma.value?.solutionType ?? 'STRING',
					solution: d
				}
			})
				.then((d) => d.data)
				.then((d) => {
					if (d.isCorrect === null)
						statusSolution.value = null;
					if ((d.isCorrect as boolean)) {
						confetti.value = true;
						statusSolution.value = 'valid';
						$q.notify({
							type: 'info',
							message: capitalize(t('series.solution.redirect'))
						});
					} else
						statusSolution.value = 'invalid';
				})
				.catch((e) => $q.notify(e.response.data.info.message))
				.finally(() => {
					checkSolution.value = false;
				});
		};

		const finishAndRedirect = () => {
			setTimeout(() => {
				router.push({
					name: 'enigmaList',
					params: {
						id: Number(route.params.id)
					}
				});
			}, 1500);
		};

		useMeta(() => {
			return meta({
				meta: {
					title: computedTitle.value,
					description: computedDesc.value,
					keywords: ['enigma']
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
			api.post('/enigmas/page/prod', {
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
							solutionType: d.data.solution,
							objectSolutionKeys: d.data.objectSolutionKeys,
							html: await brotliDecompress(d.data.enigma) ?? ''
						};
					}
				})
				.catch((e) => {
					if ((e as string).includes('Brotli'))
						error.value = 'brotliError';
					else
						$q.notify({ type: 'negative', message: e.response.data.info.message });
				});
		});

		return {
			baseURL,
			enigma,
			checkSolution,
			error,
			statusSolution,
			genColor,
			confetti,
			computedIsEmpty,
			check,
			finishAndRedirect
		};
	}
});
</script>
