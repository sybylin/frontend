<!-- eslint-disable vue/no-v-html -->
<template>
	<div v-if="!enigma" class="row justify-center items-center q-pt-xl q-pb-xl">
		<q-spinner-cube color="deep-purple-6" size="6em" />
	</div>
	<template v-else>
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
					@click="checkSolution = true"
				>
					{{ $t('series.solution.check.title') }}
					<template v-slot:loading>
						<q-spinner-hourglass class="on-left" />
						{{ $t('series.solution.check.load') }}
					</template>
				</q-btn>
			</div>
		</div>
	</template>
	<components-tsparticles
		v-if="statusSolution === 'valid'"
		:pop-confetti="true"
	/>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute } from 'vue-router';
import { brotliDecompress } from 'src/boot/brotli';
import { api, baseURL } from 'src/boot/axios';
import componentsStringSolution from 'src/components/pages/series/string.vue';
import componentsArraySolution from 'src/components/pages/series/array.vue';
import componentsObjectSolution from 'src/components/pages/series/object.vue';
import componentsTsparticles from 'src/components/pages/confetti.vue';
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
		componentsTsparticles
	},
	setup () {
		const $q = useQuasar();
		const route = useRoute();
		const enigma = ref<enigma | null>(null);
		const checkSolution = ref<boolean>(false);
		const statusSolution = ref<'valid' | 'invalid' | null>(null);
		const genColor = computed((): NamedColor => (checkSolution.value)
			? 'deep-purple-6'
			: 'green-6'
		);

		const check = (d: string | string[] | Record<string, string>) => {
			api.post('/enigma/check', {
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
					statusSolution.value = (d.isCorrect as boolean)
						? 'valid'
						: 'invalid';
				})
				.catch((e) => $q.notify(e.response.info.message))
				.finally(() => {
					checkSolution.value = false;
				});
		};

		onMounted(() => {
			api.post('/enigma/page/get/prod', {
				enigma_id: Number(route.params.enigmaId)
			})
				.then(async (d) => {
					enigma.value = {
						title: d.data.info.title,
						image: d.data.info.image,
						description: d.data.info.description,
						solutionType: d.data.solution,
						objectSolutionKeys: d.data.objectSolutionKeys,
						html: await brotliDecompress(d.data.enigma) ?? ''
					};
				})
				.catch((e) => $q.notify(e.response.info.message));
		});

		return {
			baseURL,
			enigma,
			checkSolution,
			statusSolution,
			genColor,
			check,
			click: () => {
				statusSolution.value = 'valid';
				setTimeout(() => {
					statusSolution.value = 'invalid';
				}, 1500);
			}
			// options
		};
	}
});
</script>
