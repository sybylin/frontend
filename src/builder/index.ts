import GrapesJs, { Editor, ProjectData } from 'grapesjs';
import enUS from 'grapesjs/locale/en';
import frFR from 'grapesjs/locale/fr';
import plugin from './plugin';
import { api, baseURL } from 'src/boot/axios';
import { Notify } from 'quasar';
import { stringCompress, stringDecompress } from 'src/boot/brotli';

const uploadCheckMimetype = (mimetype: string) => ['image/jpeg', 'image/png', 'image/gif'].includes(mimetype.trim().toLowerCase());

export default (container: HTMLElement, id: number, series_id: number) => {
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
				if (filesRet.length < 2)
					formData.append('image', filesRet[0]);
				else
					filesRet.forEach((f, i) => formData.append(`image-${i + 1}`, f));
				api.post('/content/image', formData, {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				})
					.then((d) => editor.AssetManager.add(`${baseURL}${d.data.path}`))
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
		commands: {
			stylePrefix: 'sib',
			defaults: {
				'save-template': {
					run: (editor: Editor, sender: any) => {
						sender && sender.set('active');
						const templateData = {
							components: editor.getComponents(),
							style: editor.getStyle()
						};
						console.log(templateData);
					}
				}
			}
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

	editor.Commands.add('save-template', {});
	editor.Panels.removeButton('options', 'export-template');
	editor.Storage.add('remote', {
		async load () {
			let loadData: ProjectData = {};
			try {
				const serverData = await api.post('/enigmas/page/dev', { enigma_id: id, series_id });
				const serveAssets: string[] | null = (await api.get('/enigmas/content/list')).data.files.map((e: string) => `${baseURL}${e}`);

				if (serverData.data.enigma && (serverData.data.enigma as string).length) {
					const parse = JSON.parse(stringDecompress(serverData.data.enigma));
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
				Notify.create({ type: 'failed', message: e.response.data.info.message });
			}
			return loadData;
		},
		async store (data) {
			api.put('/enigmas/page/dev', {
				enigma_id: id,
				series_id,
				editor_data: stringCompress(JSON.stringify({ pages: data.pages, styles: data.styles }))
			})
				.catch((e) => Notify.create({ type: 'failed', message: e.response.data.info.message }));
		}
	});

	return editor;
};
