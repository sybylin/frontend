<template>
	<div class="row wrap justify-evenly full-width">
		<template v-for="(_v, index) in solution" :key="index">
			<div
				:class="{
					'row': true,
					'justify-evenly': true,
					'items-center': true,
					'no-wrap': true,
					'q-pa-xs': true,
					'q-ml-lg': true,
					'q-mr-lg': true,
					'q-mb-xs': true
				}"
			>
				<q-input
					v-model="solution[index]"
					:disable="$props.check"
					:label="$capitalize($t('create.main.solution.value'))"
					outlined
					square
				>
					<template v-slot:before>
						<span
							:class="{
								'text-grey-8': $q.dark.isActive,
								'text-grey-1': !$q.dark.isActive,
							}"
						>
							{{ keys[index] }}
						</span>
					</template>
				</q-input>
			</div>
		</template>
	</div>
</template>

<script lang="ts">
import { PropType, defineComponent, ref, onMounted, watch } from 'vue';

export default defineComponent({
	name: 'ComponentsPagesSeriesObject',
	props: {
		check: {
			type: Boolean,
			required: true
		},
		keys: {
			type: Array as PropType<string[]>,
			required: false,
			default: () => []
		}
	},
	emits: ['check'],
	setup (props, { emit }) {
		const solution = ref<(string | null)[]>(new Array(props.keys.length).fill(null));

		onMounted(() => {
			watch(props, (newVal) => {
				if (newVal.check) {
					const ret: Record<string, string | null> = {};
					solution.value.forEach((e, i) => {
						ret[props.keys[i]] = e;
					});
					emit('check', ret);
				}
			});
		});

		return {
			solution
		};
	}
});
</script>
