import GrapesJs from 'grapesjs';
import plugin from './plugin';

export default (container: HTMLElement) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const editor = GrapesJs.init({
		container,
		fromElement: true,
		height: 'auto',
		width: 'auto',
		storageManager: {
			id: 'gjs-',
			type: 'local',
			autosave: true
		},
		deviceManager: {
			devices: [
				{
					id: 'desktop',
					name: 'Desktop',
					width: ''
				},
				{
					id: 'tablet',
					name: 'Tablet',
					width: '768px',
					widthMedia: '992px'
				},
				{
					id: 'mobilePortrait',
					name: 'Mobile portrait',
					width: '320px',
					widthMedia: '575px'
				}
			]
		},
		plugins: [
			plugin
		],
		canvas: {
			styles: [
				'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons',
				'https://cdn.jsdelivr.net/npm/quasar@2.12.7/dist/quasar.prod.css',
				'/node_modules/material-symbols/outlined.css'
			]
			/*
			scripts: [
				'https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js',
				'https://cdn.jsdelivr.net/npm/quasar@2.12.7/dist/quasar.umd.prod.js',
				'/js/vueApp.js'
			]
			*/
		}
	});

	return editor;
};
