<template>
	<div class="full-width">
		<q-linear-progress
			rounded
			size="1.6em"
			:value="progress"
			color="secondary"
			class="q-mt-sm"
		>
			<div class="absolute-full flex flex-center">
				<q-badge color="white" text-color="black" :label="`${Math.round(progress * 100)}%`" />
			</div>
		</q-linear-progress>
		<div class="row justify-between full-width q-pl-md q-pr-md q-pt-xs">
			<span class="text-weight-bold text-body1">{{ minLevel }}</span>
			<span class="text-weight-bold text-body1">{{ maxLevel }}</span>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, computed } from 'vue';

export default defineComponent({
	name: 'ComponentsPagesUserLevel',
	props: {
		points: {
			type: Number,
			required: false,
			default: 0
		}
	},
	setup (props) {
		const progress = ref<number>(0);
		const level = ref<number>(0);

		const calc = (points: number) => {
			const delta = 1.8;
			let min = 0, max = 0;

			level.value = 0;
			if (points > 0) {
				while (max < points) {
					min = max;
					max = (level.value === 0)
						? 100
						: Math.ceil(max * delta);
					++level.value;
				}
			}
			progress.value = (points > 0)
				? (points - min) / (max - min)
				: 0;
		};

		const minLevel = computed(() => (level.value - 1 < 0)
			? 0
			: level.value - 1
		);
		const maxLevel = computed(() => (level.value <= 0)
			? 1
			: level
		);

		onMounted(() => {
			calc(props.points);
			watch(props, (v) => calc(v.points), { deep: true });
		});

		return {
			progress,
			level,
			minLevel,
			maxLevel
		};
	}
});
</script>
