import { blocksList } from '../plugin';
import { useI18n } from 'vue-i18n';
import type { Editor } from 'grapesjs';
import type { PluginOptions } from '../interface';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (editor: Editor, _opts: PluginOptions) => {
	const { Blocks } = editor;
	const { Grid } = blocksList;
	const { t } = useI18n();
	const category = t('builder.components.grid.title');

	const nms: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
	const svgs = [
		'<svg style="width: 48px; height: 48px" width="126.2mm" height="91.509mm" version="1.1" viewBox="0 0 126.2 91.509" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-14.104 -12.691)"><rect x="16.302" y="14.889" width="121.81" height="87.112" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4.3963"/></g>',
		'<svg style="width: 48px; height: 48px" width="125.51mm" height="90.816mm" version="1.1" viewBox="0 0 125.51 90.816" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-14.45 -13.037)" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="3.7042"><rect x="16.302" y="14.889" width="55.798" height="87.112"/><rect x="82.31" y="14.889" width="55.798" height="87.112"/></g></svg>',
		'<svg style="width: 48px; height: 48px" width="126.2mm" height="91.509mm" version="1.1" viewBox="0 0 126.2 91.509" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-14.104 -12.691)" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="3.7042"><rect x="16.302" y="14.889" width="36.056" height="87.112"/><rect x="102.05" y="14.889" width="36.056" height="87.112"/><rect x="59.176" y="14.889" width="36.056" height="87.112"/></g></svg>',
		'<svg style="width: 48px; height: 48px" width="124.35mm" height="90.816mm" version="1.1" viewBox="0 0 124.35 90.816" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-15.613 -13.037)" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="3.7042"><rect x="17.465" y="14.889" width="22.693" height="87.112"/><rect x="50.115" y="14.889" width="22.693" height="87.112"/><rect x="82.764" y="14.889" width="22.693" height="87.112"/><rect x="115.41" y="14.889" width="22.693" height="87.112"/></g></svg>'
	];

	for (const label of Grid) {
		const reg = /^([a-z]+)-/.exec(label)?.[1];
		if (!reg)
			continue;
		const size = 12 / nms[reg];
		Blocks.add(label, {
			label: t(`builder.components.grid.${reg}`),
			media: svgs[nms[reg] - 1],
			category,
			content: {
				tagName: 'div',
				type: 'container',
				attributes: {
					class: 'row q-pa-sm',
					style: 'min-height: 4em'
				},
				components: new Array(nms[reg]).fill({
					tagName: 'div',
					type: 'grid',
					attributes: {
						class: `col-sm-${size} col-xs-12${nms[reg] === 1
							? ' full-width'
							: ''}`,
						style: 'min-height: 3em'
					}
				})
			}
		});
	}
};
