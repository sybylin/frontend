import GrapesJs, { ProjectData } from 'grapesjs';
import { useI18n } from 'vue-i18n';
import enUS from './lang/en';
import frFR from './lang/fr';
import plugin from './plugin';
import { api, baseURL } from 'src/boot/axios';
import { Notify } from 'quasar';
import { brotliDecompress } from 'src/boot/brotli';

const uploadCheckMimetype = (mimetype: string) => ['image/jpeg', 'image/png', 'image/gif'].includes(mimetype.trim().toLowerCase());

interface attribute {
	height: number;
	src: string;
	type: 'image' | string;
	unitDim: 'px' | 'em';
	width: number;
}

export default (container: HTMLElement, id: number, series_id: number) => {
	const { t } = useI18n();

	const editor = GrapesJs.init({
		container,
		fromElement: true,
		height: 'auto',
		width: 'auto',
		storageManager: {
			type: 'remote',
			autosave: true,
			autoload: true,
			stepsBeforeSave: 3
		},
		assetManager: {
			assets: [],
			uploadFile: (e) => {
				const formData = new FormData();
				const filesRet: File[] = [];
				const files = e.dataTransfer
					? e.dataTransfer.files
					: (e.target as HTMLInputElement).files;
				if (!files)
					return;
				for (const i in files) {
					if (typeof files[i] !== 'object' || !uploadCheckMimetype(files[i].type))
						continue;
					filesRet.push(files[i]);
				}
				if (!filesRet.length)
					return;
				for (const file of filesRet)
					formData.append('images', file);

				api.postForm('enigmas/content', formData)
					.then((d) => {
						editor.AssetManager.add(d.data.paths.map((f: string) => `${baseURL}${f}`));
					})
					.catch((e) => Notify.create({ type: 'negative', message: e.response.data.info.message }));
			},
			autoAdd: false
		},
		i18n: {
			locale: 'en-US',
			localeFallback: 'en-US',
			messages: {
				'en-US': enUS,
				'fr-FR': frFR
			}
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

	editor.Panels.removeButton('options', 'export-template');
	editor.Storage.add('remote', {
		async load () {
			let loadData: ProjectData = {};
			let serveAssets: string[] | null = null;

			try {
				const serverData = await api.post('/enigmas/page/dev', { enigma_id: id, series_id });
				serveAssets = (await api.get('/enigmas/content')).data.files.map((e: string) => `${baseURL}${e}`);

				if (serverData.data.enigma && (serverData.data.enigma as string).length) {
					const parse = JSON.parse(await brotliDecompress(serverData.data.enigma) ?? '');
					loadData = {
						assets: [],
						pages: parse.pages,
						styles: parse.styles
					};
				} else
					loadData = editor.getProjectData();
				if (serveAssets !== null)
					loadData.assets = serveAssets;
			} catch (e: any) {
				if (e instanceof SyntaxError || (typeof e === 'string' && (e as string).includes('Brotli'))) {
					loadData = editor.getProjectData();
					if (serveAssets !== null)
						loadData.assets = serveAssets;
					Notify.create({ type: 'warning', textColor: 'white', message: t('builder.jsonError') });
				} else
					Notify.create({ type: 'failed', message: e.response.data.info.message });
			}
			return loadData;
		},
		async store (data) {
			api.put('/enigmas/page/dev', {
				enigma_id: id,
				series_id,
				editor_data: JSON.stringify({ pages: data.pages, styles: data.styles })
			})
				.catch((e) => Notify.create({ type: 'failed', message: e.response.data.info.message }));
		}
	});

	editor.on('asset:remove', (e: { attributes: attribute }) => {
		const url = new URL(e.attributes.src);
		api.delete('enigmas/content', {
			params: {
				f: url.pathname.substring(url.pathname.lastIndexOf('/') + 1)
			}
		})
			.catch((error) => {
				editor.AssetManager.add(e.attributes.src);
				Notify.create({ type: 'negative', message: error.response.data.info.message });
			});
	});

	return editor;
};
