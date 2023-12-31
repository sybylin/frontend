import type { Editor, AddComponentTypeOptions } from 'grapesjs';
import type { PluginOptions } from '../interface';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (editor: Editor, _opts: PluginOptions) => {
	editor.DomComponents.addType('container', {
		isComponent: el => el.tagName === 'DIV',
		model: {
			defaults: {
				tagName: 'div',
				droppable: true,
				draggable: true,
				stylable: true
			}
		}
	} as AddComponentTypeOptions);

	editor.DomComponents.addType('grid', {
		isComponent: el => el.tagName === 'DIV',
		model: {
			defaults: {
				tagName: 'div',
				droppable: true,
				draggable: true,
				stylable: false
			}
		}
	} as AddComponentTypeOptions);
};
