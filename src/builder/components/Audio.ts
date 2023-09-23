import type { Editor, AddComponentTypeOptions } from 'grapesjs';
import type { PluginOptions } from '../interface';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (editor: Editor, _opts: PluginOptions) => {
	editor.DomComponents.addType('audio', {
		isComponent: el => el.tagName === 'AUDIO',
		model: {
			defaults: {
				traits: [
					{
						type: 'text',
						label: 'Souce',
						name: 'src'
					}
				],
				tagName: 'audio',
				droppable: false,
				draggable: true,
				stylable: false,
				attributes: {
					controls: true,
					src: '/audio/toony.mp3'
				}
			}
		}
	} as AddComponentTypeOptions);
};
