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
			attributes: {
				src: 'https://via.placeholder.com/350x250/78c5d6/fff',
				loading: 'lazy'
			}
		}
	});

	Blocks.add(Basic[1], {
		label: t('builder.components.basic.audio'),
		media: mediaIcon('music_note'),
		category,
		content: {
			tagName: 'div',
			type: 'container',
			attributes: { class: 'q-pa-xs full-width' },
			components: [
				{
					tagName: 'audio',
					type: 'audio',
					attributes: { class: 'full-width' }
				}
			]
		}
	});

	Blocks.add(Basic[2], {
		label: t('builder.components.basic.video'),
		media: mediaIcon('movie'),
		category,
		content: {
			tagName: 'video',
			type: 'video',
			attributes: {
				control: true,
				preload: 'metadata',
				width: 620,
				src: '/video/builder.mp4'
			}
		}
	});

	Blocks.add(Basic[3], {
		label: t('builder.components.basic.card'),
		media: mediaIcon('check_box_outline_blank'),
		category,
		content: {
			tagName: 'div',
			type: 'container',
			attributes: { class: 'q-card', style: 'min-width: 250px' },
			components: [
				{
					tagName: 'img',
					type: 'image',
					attributes: { src: 'https://via.placeholder.com/350x250/78c5d6/fff' }
				},
				{
					tagName: 'div',
					type: 'default',
					attributes: { class: 'q-card__section q-card__section--vert q-pl-sm q-pr-sm' },
					components: [
						{
							tagName: 'div',
							type: 'default',
							components: [{
								tagName: 'span',
								type: 'text',
								attributes: { class: 'text-h6' },
								content: 'Card title'
							}]
						},
						{
							tagName: 'div',
							type: 'default',
							attributes: { class: 'q-pt-sm' },
							components: [{
								tagName: 'span',
								type: 'text',
								attributes: { class: 'text-subtitle2' },
								content: 'Card subtitle'
							}]
						}
					]
				},
				{
					tagName: 'div',
					type: 'default',
					attributes: { class: 'q-card__section q-card__section--vert q-pt-none q-pl-sm q-pr-sm' },
					components: [
						{
							tagName: 'p',
							type: 'text',
							content: 'Placeholder text of card'
						}
					]
				}
			]
		}
	});
};
