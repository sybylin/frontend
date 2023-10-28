<template>
	<q-input
		v-model="solution"
		:disable="$props.check"
		:label="$capitalize($t('create.main.solution.sentence'))"
		class="full-width"
		outlined
	/>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';

export default defineComponent({
	name: 'ComponentsPagesSeriesString',
	props: {
		check: {
			type: Boolean,
			required: true
		}
	},
	emits: ['check'],
	setup (props, { emit }) {
		const solution = ref<string | null>(null);

		onMounted(() => {
			watch(props, (newVal) => {
				if (newVal.check) {
					emit(
						'check',
						(!solution.value || !solution.value.length)
							? null
							: solution.value
					);
				}
			});
		});

		return {
			solution
		};
	}
});
</script>
