<template>
	<q-separator />
	<template v-if="solutionType">
		<div class="row justify-center q-pt-md q-pb-md">
			<q-option-group
				v-model="solutionType"
				inline
				:options="[
					{ label: $capitalize($t('create.main.solution.sentence')), value: 'STRING' },
					{ label: $capitalize($t('create.main.solution.keywords')), value: 'ARRAY' },
					{ label: $capitalize($t('create.main.solution.keyvalues')), value: 'OBJECT' }
				]"
			/>
		</div>
		<q-separator style="margin-left: 16px; margin-right: 16px;" />
		<q-tab-panels
			v-model="solutionType"
			animated
			vertical
			class="transparent"
			transition-prev="jump-left"
			transition-next="jump-right"
		>
			<q-tab-panel name="STRING">
				<q-banner class="bg-primary text-white text-center q-mb-sm">
					<span>{{ $capitalize($t('create.main.solution.sentenceBanner')) }}</span>
				</q-banner>
				<components-pages-creation-solution-string v-model="stringSolution" />
			</q-tab-panel>
			<q-tab-panel name="ARRAY">
				<q-banner class="bg-primary text-white text-center q-mb-sm">
					<span>{{ $capitalize($t('create.main.solution.sentenceKeywords')) }}</span>
				</q-banner>
				<components-pages-creation-solution-array v-if="arraySolution" v-model="arraySolution" />
			</q-tab-panel>
			<q-tab-panel name="OBJECT">
				<q-banner class="bg-primary text-white text-center q-mb-sm">
					<span>{{ $capitalize($t('create.main.solution.sentenceKeyvalues')) }}</span>
				</q-banner>
				<components-pages-creation-solution-object v-if="objectSolution" v-model="objectSolution" />
			</q-tab-panel>
		</q-tab-panels>
	</template>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import ComponentsPagesCreationSolutionString from 'src/components/pages/creation/solution/string.vue';
import ComponentsPagesCreationSolutionArray from 'src/components/pages/creation/solution/array.vue';
import ComponentsPagesCreationSolutionObject from 'src/components/pages/creation/solution/object.vue';
import { api } from 'src/boot/axios';
import type { prodArraySolution, objectSolution, Solution } from 'src/types';

export default defineComponent({
	name: 'ComponentsPagesCreationEnigmaSolution',
	components: {
		ComponentsPagesCreationSolutionString,
		ComponentsPagesCreationSolutionArray,
		ComponentsPagesCreationSolutionObject
	},
	props: {
		id: {
			type: Number,
			required: true
		}
	},
	setup (props) {
		const $q = useQuasar();
		const solutionType = ref<Solution | null>(null);
		const stringSolution = ref<string | null>(null);
		const arraySolution = ref<prodArraySolution | null>(null);
		const objectSolution = ref<objectSolution | null>(null);

		const initDebounce = () => {
			let timeout: any | null = null;
			return (fn: any, delay?: number) => {
				clearTimeout(timeout);
				timeout = setTimeout(() => fn(), delay || 500);
			};
		};
		const watchDebounce = initDebounce();

		const save = async (type: Solution, data: unknown) => {
			api.post('/enigma/solution/save', {
				id: props.id,
				type,
				solution: JSON.stringify(data)
			})
				.catch((e) => $q.notify(e.response.data.info.message));
		};

		onMounted(() => {
			api.post('/enigma/solution/get', {
				id: props.id
			})
				.then((d) => {
					let data: any | null;

					const solution = d.data.solution?.solution ?? '';
					solutionType.value = d.data.solution?.type ?? 'STRING';
					try {
						data = JSON.parse(solution ?? '');
					} catch {
						data = null;
					}
					stringSolution.value = (solutionType.value === 'STRING' && data)
						? data
						: null;
					arraySolution.value = (solutionType.value === 'ARRAY')
						? { keepOrder: data?.keepOrder ?? false, list: data?.list ?? [] }
						: { keepOrder: false, list: [] };
					objectSolution.value = (solutionType.value === 'OBJECT' && data)
						? data
						: {};
				})
				.catch((e) => $q.notify(e.response.data.info.message));

			watch(stringSolution, (newVal) => watchDebounce(() => {
				if (solutionType.value !== 'STRING' || !newVal || !newVal.length)
					return;
				save('STRING', newVal);
			})
			);

			watch(arraySolution, (newVal) => watchDebounce(() => {
				if (solutionType.value !== 'ARRAY' || !newVal)
					return;
				save('ARRAY', newVal);
			}),
			{ deep: true });

			watch(objectSolution, (newVal) => watchDebounce(() => {
				if (solutionType.value !== 'OBJECT' || !newVal)
					return;
				save('OBJECT', newVal);
			}),
			{ deep: true });
		});

		onUnmounted(() => {
			const getData = (type: Solution) => {
				if (type === 'STRING')
					return stringSolution.value;
				if (type === 'ARRAY')
					return arraySolution.value;
				return objectSolution.value;
			};
			if (solutionType.value)
				save(solutionType.value, getData(solutionType.value));
		});

		return {
			solutionType,
			stringSolution,
			arraySolution,
			objectSolution
		};
	}
});
</script>

<style scoped>
.move-icon {
	border-radius: 50%;
	padding: .2em;
	margin: .3em;
	cursor: move;
}
</style>
