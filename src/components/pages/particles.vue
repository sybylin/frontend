<template>
	<Particles
		:id="tsParticlesContainerId"
		:options="$props.options"
		:particles-init="particleInit"
	/>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { loadFull } from 'tsparticles';
import { loadConfettiPreset } from 'tsparticles-preset-confetti';
import type { Engine, ISourceOptions } from 'tsparticles-engine';

export default defineComponent({
	name: 'Particles',
	props: {
		options: {
			type: Object as PropType<ISourceOptions>,
			required: false,
			default: () => {}
		}
	},
	setup () {
		const tsParticlesContainerId = Math.random().toString(32).substring(2, 16);

		return {
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
