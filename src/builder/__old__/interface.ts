import type { BlockProperties } from 'grapesjs';

export const icon = (name: string, outlined: boolean = false) => {
	if (!outlined)
		return `<i class="q-icon notranslate material-icons" style="font-size:4em" aria-hidden="true" role="presentation">${name}</i>`;
	return `<i class="q-icon notranslate material-icons material-symbols-outlined" style="font-size:4em" aria-hidden="true" role="presentation">${name}</i>`;
};

export interface component {
	name: string;
	data: BlockProperties;
}
