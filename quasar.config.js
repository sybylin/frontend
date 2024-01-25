/* eslint-env node */

const { configure } = require('quasar/wrappers');
const { resolve } = require('path');

module.exports = configure((/* ctx */) => {
	return {
		eslint: {
			fix: false,
			warnings: true,
			errors: true
		},

		// https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
		preFetch: true,

		// https://v2.quasar.dev/quasar-cli-vite/boot-files
		boot: [
			'axios',
			'brotli',
			'custom',
			'gdrp',
			'hydratation',
			'i18n',
			'route',
			'authorization'
		],

		// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#css
		css: [
			'app.scss',
			'builder.scss',
			'font/orkney.scss'
		],

		// https://github.com/quasarframework/quasar/tree/dev/extras
		extras: [
			'roboto-font',
			'material-icons'
		],

		// Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#build
		build: {
			extendViteConf: (config) => {
				config.optimizeDeps.exclude = (!config.optimizeDeps.exclude)
					? [
						'brotli-wasm',
						'brotli-wasm/pkg.bundler/brotli_wasm_bg.wasm'
					]
					: config.optimizeDeps.exclude.push([
						'brotli-wasm',
						'brotli-wasm/pkg.bundler/brotli_wasm_bg.wasm'
					]);
			},
			polyfillModulePreload: true,
			target: {
				browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
				node: 'node18'
			},
			vueRouterMode: 'history',
			vueOptionsAPI: true,
			rebuildCache: true,
			minify: true,
			vitePlugins: [
				['@intlify/vite-plugin-vue-i18n', {
					include: resolve(__dirname, './src/i18n/**')
				}]
			]
		},

		//  https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#devServer
		devServer: {
			https: false,
			open: false
		},

		// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#framework
		framework: {
			iconSet: 'material-icons',
			lang: 'en-US',
			plugins: [
				'AppFullscreen',
				'Cookies',
				'Dialog',
				'Loading',
				'LocalStorage',
				'SessionStorage',
				'Meta',
				'Notify'
			],
			config: {
				loading: {
					delay: 400,
					spinner: 'QSpinnerCube',
					spinnerSize: 80,
					spinnerColor: 'cyan-7'
				},
				notify: {
					color: 'light-blue-7',
					position: 'bottom',
					timeout: '3000'
				}
			}
		},

		// https://quasar.dev/quasar-cli-vite/quasar-config-js#htmlvariables
		htmlVariables: {},

		// https://v2.quasar.dev/options/animations
		animations: [
			'fadeIn',
			'fadeOut',
			'fadeInUp',
			'fadeInDown'
		],

		// https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr
		ssr: {
			pwa: false,
			prodPort: process.env.FRONT_PORT || process.env.PORT || 4040,
			middlewares: [
				'render'
			]
		}
	};
});
