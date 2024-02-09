import { boot } from 'quasar/wrappers';
import { hydrate as hydrateGlobal } from 'src/stores/global';
import { hydrate as hydrateTheme } from 'src/stores/theme';
import { hydrate as hydrateOptions } from 'src/stores/options';

export default boot((ctx) => {
	if (!ctx.ssrContext) {
		hydrateGlobal();
		hydrateTheme();
		hydrateOptions();
	}
});
