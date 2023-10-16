import { blocksList, mediaIcon } from '../plugin';
import { useI18n } from 'vue-i18n';
import { frontBaseUrl } from 'src/boot/axios';
import type { Editor } from 'grapesjs';
import type { PluginOptions } from '../interface';

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
			tagName: 'div',
			droppable: false,
			attributes: { class: 'q-img', 'aria-label': 'image' },
			components: [
				{
					tagName: 'div',
					attributes: { style: 'padding-bottom: 100%' }
				},
				{
					tagName: 'div',
					attributes: { class: 'q-img__container absolute-full' },
					components: {
						tagName: 'img',
						type: 'image',
						attributes: {
							src: `${frontBaseUrl}/public/imgs/builder/default.png`,
							loading: 'lazy',
							fetchpriority: 'auto',
							'aria-hidden': 'true',
							draggable: 'false',
							class: 'q-img__image q-img__image--with-transition q-img__image--loaded',
							style: 'object-fit: cover; object-position: 50% 50%;'
						}
					}
				},
				{
					tagName: 'div',
					attributes: { class: 'q-img__content absolute-full q-anchor--skip' }
				}
			]
		}
	});

	Blocks.add(Basic[1], {
		label: t('builder.components.basic.audio'),
		media: mediaIcon('music_note'),
		category,
		content: {
			tagName: 'div',
			droppable: false,
			attributes: { class: 'full-width' },
			components: {
				tagName: 'audio',
				type: 'audio',
				attributes: {
					class: 'full-width',
					controls: true,
					preload: 'metadata',
					src: `${frontBaseUrl}/public/audio/toony.mp3`
				}
			}
		}
	});

	Blocks.add(Basic[2], {
		label: t('builder.components.basic.video'),
		media: mediaIcon('movie'),
		category,
		content: {
			tagName: 'video',
			type: 'video',
			droppable: false,
			attributes: {
				control: true,
				preload: 'metadata',
				width: 620,
				src: `${frontBaseUrl}/public/video/builder.mp4`
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
			droppable: false,
			attributes: { class: 'q-card', style: 'min-width: 250px' },
			components: [
				{
					tagName: 'img',
					type: 'image',
					attributes: { src: `${frontBaseUrl}/public/imgs/builder/default.png` }
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
