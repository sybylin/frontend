import type { Editor } from 'grapesjs';
import type { PluginOptions } from '../interface';
import { blocksList, mediaIcon } from '../plugin';
import { useI18n } from 'vue-i18n';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (editor: Editor, _opts: PluginOptions) => {
	const { Blocks } = editor;
	const { Text } = blocksList;
	const { t } = useI18n();
	const category = t('builder.components.text.title');

	Blocks.add(Text[0], {
		label: t('builder.components.text.t1'),
		media: mediaIcon('text_fields', true),
		category,
		content: {
			tagName: 'p',
			attributes: { class: 'text-body1' },
			type: 'text',
			content: 'Placeholder'
		}
	});

	Blocks.add(Text[1], {
		label: t('builder.components.text.t2'),
		media: mediaIcon('text_fields', true),
		category,
		content: {
			tagName: 'p',
			attributes: { class: 'text-body2' },
			type: 'text',
			content: 'Placeholder'
		}
	});
};
