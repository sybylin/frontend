import en from './en-US';
import fr from './fr-FR';

export type lang = 'en-US' | 'fr-FR';

const _lang_ = {
	'en-US': en,
	'fr-FR': fr
} as Record<lang, any>;

export default _lang_;
