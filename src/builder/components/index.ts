import type { Editor } from 'grapesjs';
import type { PluginOptions } from '../interface';

export default (editor: Editor, opts: PluginOptions) => {
	const { Components } = editor;
	const ComponentsView = Components.ComponentView;
	const sandboxElement = document.createElement('div');
};
