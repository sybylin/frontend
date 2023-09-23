import type { Editor } from 'grapesjs';
import type { PluginOptions } from './interface';
import Blocks from './blocks';
import Components from './components';

export const blocksList = {
	Grid: ['one-column', 'two-column', 'three-column', 'four-column'],
	Header: ['header-1', 'header-2', 'header-3', 'header-4', 'header-5', 'header-6'],
	Text: ['text-1', 'text-2'],
	Basic: ['image', 'audio', 'video', 'card']
};

export const mediaIcon = (name: string, span: boolean = false) => `<span aria-hidden="true" role="presentation" class="q-icon notranslate material-icons ${span
	? 'material-symbols-outlined'
	: undefined}" style="font-size: 4.4em;">${name}</span>`;

export default (editor: Editor, opt: Record<string, unknown>) => {
	const options: PluginOptions = {
		blocks: [
			...blocksList.Grid,
			...blocksList.Header,
			...blocksList.Text
		],
		block: () => ({}),
		codeViewerTheme: 'hopscotch',
		importPlaceholder: '',
		imagePlaceholderSrc: '',
		overwriteExport: true,
		preRender: '',
		postRender: '',
		resetBlocks: true,
		resetStyleManager: true,
		resetDevices: true,
		hideSelector: true,
		useXmlParser: false,
		useCustomTheme: true,
		columnsPadding: '10px 0',
		i18n: {},
		fonts: {},
		...opt
	};

	const config = editor.getConfig();
	config.forceClass = false;
	config.devicePreviewMode = true;

	if (options.hideSelector) {
		const smConfig = editor.SelectorManager.getConfig();
		smConfig.custom = true;
	}
	if (options.useXmlParser)
    editor.Parser.getConfig().optionsHtml!.htmlType = 'text/xml';

	[
		Blocks,
		Components
	].forEach((m) => m(editor, options));
};
