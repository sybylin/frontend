import { useI18n } from 'vue-i18n';
import { frontBaseUrl } from 'src/boot/axios';
import type { Editor, AddComponentTypeOptions } from 'grapesjs';
import type { PluginOptions } from '../interface';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (editor: Editor, _opts: PluginOptions) => {
	const { t } = useI18n();

	editor.DomComponents.addType('audio', {
		isComponent: el => el.tagName === 'AUDIO',
		model: {
			defaults: {
				traits: [
					{
						type: 'text',
						label: t('builder.components.audio'),
						name: 'src'
					}
				],
				tagName: 'audio',
				droppable: false,
				draggable: true,
				stylable: false,
				attributes: {
					class: 'full-width',
					controls: true,
					preload: 'metadata',
					src: `${frontBaseUrl}/audio/toony.mp3`
				}
			}
		}
	} as AddComponentTypeOptions);
};
