import { blocksList, mediaIcon } from '../plugin';
import { useI18n } from 'vue-i18n';
import type { Editor } from 'grapesjs';
import type { PluginOptions } from '../interface';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (editor: Editor, _opts: PluginOptions) => {
	const { Blocks } = editor;
	const { Header } = blocksList;
	const { t } = useI18n();
	const category = t('builder.components.header.title');

	for (const label of Header) {
		const reg = /^\w+-(\d+)/.exec(label)?.[1];
		if (!reg)
			continue;
		Blocks.add(label, {
			label: t(`builder.components.header.h${reg}`),
			media: mediaIcon(`format_h${reg}`, true),
			category,
			content: {
				tagName: `h${reg}`,
				type: 'text',
				content: 'Placeholder',
				droppable: false
			}
		});
	}
};
