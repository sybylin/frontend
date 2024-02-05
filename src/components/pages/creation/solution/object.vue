<template>
	<div class="row justify-center q-pb-sm">
		<q-btn
			color="secondary"
			unelevated
			icon="add"
			:label="$capitalize($t('create.main.solution.buttonKeyValues'))"
			@click="add()"
		/>
	</div>
	<div class="row wrap justify-left">
		<template v-for="(_value, index) in solutions" :key="index">
			<div
				:class="{
					'full-width': true,
					'row': true,
					'justify-evenly': true,
					'items-center': true,
					'no-wrap': true,
					'q-pa-xs': true,
					'q-mb-xs': true,
					'bg-grey-8': !$q.dark.isActive,
					'bg-grey-1': $q.dark.isActive,
				}"
			>
				<q-btn
					round
					color="red-7"
					icon="delete"
					@click="remove(index)"
				/>
				<q-input
					v-model="solutions[index].key"
					:label="$capitalize($t('create.main.solution.key'))"
					filled
					square
					:stack-label="false"
					class="top"
					:rules="[val => !!val || $t('create.main.series.mandatory', { key: $capitalize($t('create.main.solution.key')) })]"
				>
					<template v-slot:prepend>
						<q-icon name="key" />
					</template>
				</q-input>
				<q-input
					v-model="solutions[index].value"
					:label="$capitalize($t('create.main.solution.value'))"
					filled
					square
					class="top"
					:rules="[val => !!val || $t('create.main.series.mandatory', { key: $capitalize($t('create.main.solution.value')) })]"
				>
					<template v-slot:prepend>
						<q-icon name="tag" />
					</template>
				</q-input>
			</div>
		</template>
	</div>
</template>

<script lang="ts">
import { PropType, defineComponent, onMounted, ref, watch } from 'vue';
import type { objectSolution } from 'src/types';

export default defineComponent({
	name: 'ComponentsPagesCreationSolutionObject',
	props: {
		modelValue: {
			type: Object as PropType<objectSolution>,
			required: true
		}
	},
	emits: ['update:model-value'],
	setup (props, { emit }) {
		const solutions = ref<{ key: string, value: string }[]>([]);
		const add = () => solutions.value.push({ key: '', value: '' });
		const remove = (index: number) => solutions.value.splice(index, 1);

		onMounted(() => {
			solutions.value = Object.entries(props.modelValue)
				.map((e) => ({ key: e[0], value: e[1] }));

			watch(solutions, (newVal) => {
				if (!newVal)
					return;
				const ret: Record<string, string | null> = {};
				newVal
					.filter((e) => e.key)
					.forEach((e) => {
						ret[e.key] = e.value;
					});
				emit('update:model-value', ret);
			}, { deep: true });
		});

		return {
			solutions,
			add,
			remove
		};
	}
});
</script>

<style scoped>
.top {
	padding-top: 20px;
}
</style>
