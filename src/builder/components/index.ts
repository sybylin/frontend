import type { Editor } from 'grapesjs';
import type { PluginOptions } from '../interface';
import Audio from './Audio';
import Container from './Container';

export default (editor: Editor, opts: PluginOptions) => {
	Audio(editor, opts);
	Container(editor, opts);
};
