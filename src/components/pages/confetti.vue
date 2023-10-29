<template>
	<canvas ref="canvas" class="confetti-index"></canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { confetti } from 'tsparticles-confetti';
import type { ConfettiFirstParam } from 'tsparticles-confetti';
import type { IConfettiOptions } from 'tsparticles-confetti/types/IConfettiOptions';
import type { Container, RecursivePartial } from 'tsparticles-engine';

type ConfettiFunc = (idOrOptions: ConfettiFirstParam, confettiOptions?: RecursivePartial<IConfettiOptions>) => Promise<Container | undefined>;
interface ConfettiCanvas extends HTMLCanvasElement {
	confetti: ConfettiFunc
}

export default defineComponent({
	name: 'Confetti',
	props: {
		modelValue: {
			type: Boolean,
			required: true
		}
	},
	emits: ['update:model-value', 'finish'],
	setup (props, { emit }) {
		const canvasId = Math.random().toString(32).substring(2, 16);
		const canvas = ref<ConfettiCanvas | null>(null);
		const emitConfetti = ref<boolean>(props.modelValue);

		const specialDay = (day: number, month: number) => {
			if (day === 14 && month === 2) {
				// valentine day
				return {
					scalar: 3,
					shapes: ['heart'],
					colors: ['FFC0CB', 'FF69B4', 'FF1493', 'C71585']
				};
			}
			if (day === 31 && month === 10) {
				// halloween
				return {
					scalar: 1.3,
					shapes: ['text', 'circle'],
					colors: ['8929bf', 'fd7708', 'fde500', '2e2e2e'],
					shapeOptions: {
						text: {
							value: ['🎃', '🦇', '👻']
						}
					}
				};
			}
			if (day === 25 && month === 12) {
				// christmas
				return {
					scalar: 1.3,
					shapes: ['text', 'circle', 'square', 'star'],
					colors: ['165b33', '146b3a', 'f8b229', 'ea4630', 'bb2528'],
					shapeOptions: {
						text: {
							value: ['🎅', '🎁', '🎄']
						}
					}
				};
			}
			if (day === 31 && month === 12) {
				// new year
				return {
					scalar: 1.3,
					shapes: ['text', 'circle', 'square', 'star'],
					colors: ['ffe400', 'ffbd00', 'e89400', 'ffca6c', 'fdffb8'],
					shapeOptions: {
						text: {
							value: ['🎉', '🥂', '✨']
						}
					}
				};
			}
		};

		const startAnimation = async () => {
			const currentDate = new Date();
			const end = currentDate.getTime() + 3 * 1000;
			const options = specialDay(currentDate.getDate(), currentDate.getMonth() + 1);
			const left = Object.assign({
				particleCount: 2,
				angle: 60,
				spread: 55,
				origin: { x: 0 }
			}, options);
			const right = Object.assign({
				particleCount: 2,
				angle: 120,
				spread: 55,
				origin: { x: 1 }
			}, options);

			(function frame () {
				if (canvas.value) {
					canvas.value.confetti(canvasId, left);
					canvas.value.confetti(canvasId, right);
				}
				if (Date.now() < end)
					requestAnimationFrame(frame);
				else {
					emitConfetti.value = false;
					emit('finish');
				}
			})();
		};

		onMounted(async () => {
			if (canvas.value)
				canvas.value.confetti = canvas.value.confetti || await confetti.create(canvas.value, {});
			if (props.modelValue)
				startAnimation();

			watch(props, (val) => {
				emitConfetti.value = val.modelValue;
				if (emitConfetti.value === true)
					startAnimation();
			}, { deep: true });

			watch(emitConfetti, (newVal) => {
				emit('update:model-value', newVal);
			});
		});

		return {
			canvas,
			emitConfetti
		};
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
