import type { Editor } from 'grapesjs';
import type { PluginOptions } from '../interface';
import Basic from './Basic';
import Grid from './Grid';
import Header from './Header';
import Text from './Text';

export default (editor: Editor, opts: PluginOptions) => {
	Grid(editor, opts);
	Header(editor, opts);
	Text(editor, opts);
	Basic(editor, opts);
};
