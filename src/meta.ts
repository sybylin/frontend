export interface meta {
	meta: {
		title: string,
		description: string,
		keywords?: string[]
	},
	og?: {
		type?: string,
		url?: string,
		title?: string,
		description?: string,
		image?: string
	},
	twitter?: {
		card?: string,
		url?: string,
		title?: string,
		description?: string,
		image?: string
	}
}

export const titleTemplate = (t: string) => `${t} - Sybylin`;

export default (meta: meta) => {
	const metaData: {
		title: string,
		titleTemplate: (t: string) => string,
		meta: Record<string, any>
	} = {
		title: meta.meta.title,
		titleTemplate,
		meta: {
			title: {
				name: 'title',
				content: meta.meta.title
			},
			description: {
				name: 'description',
				content: meta.meta.description
			},
			keywords: {
				name: 'keywords',
				content: [...meta.meta.keywords ?? [], 'sybylin'].join(' ')
			},
			equiv: {
				'http-equiv': 'Content-Type',
				content: 'text/html; charset=UTF-8'
			}
		}
	};

	if (meta.og) {
		metaData.meta.ogType = { property: 'og:type', content: meta.og.type ?? 'website' };
		metaData.meta.ogUrl = { property: 'og:url', content: meta.og.url ?? 'https://sybyl.in' };
		metaData.meta.ogTitle = { property: 'og:title', content: meta.og.title ?? 'Sybylin' };
		metaData.meta.ogDescription = { property: 'og:description', content: meta.og.description ?? 'Sybylin official website' };
		metaData.meta.ogImage = { property: 'og:image', content: meta.og.image ?? 'https://sybyl.in/img/background.png' };
	}
	if (meta.twitter) {
		metaData.meta.twitterCard = { property: 'twitter:card', content: meta.twitter.card ?? 'summary' };
		metaData.meta.twitterCard = { property: 'twitter:url', content: meta.twitter.url ?? 'https://sybyl.in' };
		metaData.meta.twitterCard = { property: 'twitter:title', content: meta.twitter.title ?? 'Sybylin' };
		metaData.meta.twitterCard = { property: 'twitter:description', content: meta.twitter.description ?? 'Sybyl.in official website' };
		metaData.meta.twitterCard = { property: 'twitter:image', content: meta.twitter.image ?? 'https://sybyl.in/img/background.png' };
	}

	return metaData;
};
