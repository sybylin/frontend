import { tsParticles } from '@tsparticles/engine';
import { boot } from 'quasar/wrappers';
import { loadFull } from 'tsparticles';
import particlesComponent from 'src/components/pages/particles.vue';
import type { QSsrContext } from '@quasar/app-vite';
import type { Engine } from '@tsparticles/engine';
import type { App } from 'vue';

const initParticlesComponent = (
	app: App,
	ssrContext: QSsrContext | null | undefined,
	options: { init: (engine: Engine) => Promise<void> }) => {
	app.component('Particles', particlesComponent);
	(async () => {
		tsParticles.init();
		if (options.init)
			await options.init(tsParticles);
		if (!ssrContext)
			dispatchEvent(new CustomEvent('particlesInit', { detail: tsParticles }));
	})();
};

export default boot(({ app, ssrContext }) => {
	app.use(initParticlesComponent, ssrContext, {
		init: async (engine) => {
			await loadFull(engine);
		}
	});
});
