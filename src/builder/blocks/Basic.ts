import type { Editor } from 'grapesjs';
import type { PluginOptions } from '../interface';
import { blocksList, mediaIcon } from '../plugin';
import { useI18n } from 'vue-i18n';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (editor: Editor, _opts: PluginOptions) => {
	const { Blocks } = editor;
	const { Basic } = blocksList;
	const { t } = useI18n();
	const category = t('builder.components.basic.title');

	Blocks.add(Basic[0], {
		label: t('builder.components.basic.image'),
		media: mediaIcon('image'),
		category,
		content: {
			tagName: 'img',
			type: 'image',
			attributes: { src: 'https://via.placeholder.com/350x250/78c5d6/fff' }
		}
	});
};
