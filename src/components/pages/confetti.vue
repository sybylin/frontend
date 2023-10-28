<template>
	<Particles
		:id="tsParticlesContainerId"
		:options="$props.options"
		:particles-init="particleInit"
	/>
	<canvas ref="confettiIndex" class="confetti-index"></canvas>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, PropType } from 'vue';
import { loadFull } from 'tsparticles';
import { confetti } from 'tsparticles-confetti';
import { loadConfettiPreset } from 'tsparticles-preset-confetti';
import type { Engine, ISourceOptions } from 'tsparticles-engine';

export default defineComponent({
	name: 'Confetti',
	props: {
		popConfetti: {
			type: Boolean,
			required: false,
			default: false
		},
		options: {
			type: Object as PropType<ISourceOptions>,
			required: false,
			default: () => {}
		}
	},
	setup (props) {
		const confettiIndex = ref<HTMLCanvasElement | null>(null);
		const tsParticlesContainerId = Math.random().toString(32).substring(2, 16);

		const successConfetti = async () => {
			if (confettiIndex.value && !(confettiIndex.value as any)?.confetti)
				(confettiIndex.value as any).confetti = await confetti.create(confettiIndex.value, { resize: true } as any);

			const currentDate = new Date();
			const end = currentDate.getTime() + 3 * 1000;
			const options = {};

			if (currentDate.getDate() === 14 && currentDate.getMonth() === 1) {
				// valentine day
				Object.assign(options, {
					scalar: 3,
					shapes: ['heart'],
					colors: ['FFC0CB', 'FF69B4', 'FF1493', 'C71585']
				});
			} else if (currentDate.getDate() === 31 && currentDate.getMonth() === 9) {
				// halloween
				Object.assign(options, {
					scalar: 1.5,
					shapes: ['text', 'circle'],
					colors: ['8929bf', 'fd7708', 'fde500', '2e2e2e'],
					shapeOptions: {
						text: {
							value: ['🎃', '🦇', '👻']
						}
					}
				});
			} else if (currentDate.getDate() === 25 && currentDate.getMonth() === 11) {
				// christmas
				Object.assign(options, {
					scalar: 1.5,
					shapes: ['text', 'circle', 'square', 'star'],
					colors: ['165b33', '146b3a', 'f8b229', 'ea4630', 'bb2528'],
					shapeOptions: {
						text: {
							value: ['🎅', '🎁', '🎄']
						}
					}
				});
			} else if (currentDate.getDate() === 31 && currentDate.getMonth() === 11) {
				// new year
				Object.assign(options, {
					scalar: 1.5,
					shapes: ['text', 'circle', 'square', 'star'],
					colors: ['ffe400', 'ffbd00', 'e89400', 'ffca6c', 'fdffb8'],
					shapeOptions: {
						text: {
							value: ['🎉', '🥂', '✨']
						}
					}
				});
			}
			(function frame () {
				(confettiIndex.value as any)?.confetti(Object.assign({
					particleCount: 2,
					angle: 60,
					spread: 55,
					origin: { x: 0 }
				}, options));
				(confettiIndex.value as any)?.confetti(Object.assign({
					particleCount: 2,
					angle: 120,
					spread: 55,
					origin: { x: 1 }
				}, options));
				if (Date.now() < end)
					requestAnimationFrame(frame);
			})();
		};

		onMounted(() => {
			if (props.popConfetti)
				successConfetti();
			watch(props, (newVal) => {
				if (newVal.popConfetti)
					successConfetti();
			});
		});

		return {
			confettiIndex,
			tsParticlesContainerId
		};
	},
	methods: {
		async particleInit (engine: Engine) {
			if (!this.$props.options)
				return;
			if (
				this.$props.options.preset &&
				(
					(Array.isArray(this.$props.options.preset) && this.$props.options.preset.includes('confetti')) ||
					(typeof this.$props.options.preset === 'string' && this.$props.options.preset.localeCompare('confetti') === 0)
				)
			)
				await loadConfettiPreset(engine);
			else
				await loadFull(engine);
		}
	}
});
</script>

<style scoped>
.confetti-index {
	position: fixed;
  z-index: 3000;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
	pointer-events: none;
}
</style>
