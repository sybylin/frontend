<template>
	<div
		:id="$props.id"
		style="width: 100%; height: 500px;"
	></div>
</template>

<script lang="ts">
import { PropType, defineComponent, nextTick, onUnmounted, onMounted, ref } from 'vue';
import { loadFull } from 'tsparticles';
import { tsParticles } from '@tsparticles/engine';
import type { Container, ISourceOptions } from '@tsparticles/engine';

export default defineComponent({
	name: 'Particles',
	props: {
		id: {
			type: String,
			required: false,
			default: Math.random().toString(32).substring(2, 16)
		},
		options: {
			type: Object as PropType<ISourceOptions>,
			required: false,
			default: {} as ISourceOptions
		}
	},
	emits: ['loaded'],
	setup (props, { emit }) {
		const container = ref<Container | undefined>(undefined);

		onMounted(() => {
			nextTick(async () => {
				tsParticles.init();
				loadFull(tsParticles);
				container.value = await tsParticles.load({
					id: props.id,
					options: props.options
				});
				emit('loaded', container);
			});
		});

		onUnmounted(() => {
			if (!container.value)
				return;
			container.value.destroy();
			container.value = undefined;
		});
	}
});
</script>
