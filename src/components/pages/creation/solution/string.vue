<template>
	<q-input
		v-model="str"
		filled
		:label="$capitalize($t('create.main.solution.sentence'))"
	/>
</template>

<script lang="ts">
import { PropType, defineComponent, onMounted, ref, watch } from 'vue';

export default defineComponent({
	name: 'ComponentsPagesCreationSolutionString',
	props: {
		modelValue: {
			type: String as PropType<string | null>,
			required: false,
			default: null
		}
	},
	emits: ['update:model-value'],
	setup (props, { emit }) {
		const str = ref<string | null>(props.modelValue);

		onMounted(() => {
			watch(str, (v) => emit('update:model-value', v));
		});

		return {
			str
		};
	}
});
</script>
