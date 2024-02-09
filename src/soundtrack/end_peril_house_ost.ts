import type { soundtrack } from './types';

export default {
	name: 'Peril at End House',
	path: '/public/soundtrack/peril_at_end_house',
	cover: 'cover.webp',
	songs: [
		{
			name: 'In the end house',
			sources: [
				{
					file: 'in_the_end_house.ogg',
					type: 'audio/ogg'
				},
				{
					file: 'in_the_end_house.mp3',
					type: 'audio/mpeg'
				}
			]
		},
		{
			name: 'Looking for clues',
			sources: [
				{
					file: 'looking_for_clues.ogg',
					type: 'audio/ogg'
				},
				{
					file: 'looking_for_clues.mp3',
					type: 'audio/mpeg'
				}
			]
		},
		{
			name: 'Miss suspected',
			sources: [
				{
					file: 'miss_suspected.ogg',
					type: 'audio/ogg'
				},
				{
					file: 'miss_suspected.mp3',
					type: 'audio/mpeg'
				}
			]
		},
		{
			name: 'Walk by the seashore',
			sources: [
				{
					file: 'walk_by_the_seashore.ogg',
					type: 'audio/ogg'
				},
				{
					file: 'walk_by_the_seashore.mp3',
					type: 'audio/mpeg'
				}
			]
		}
	]
} as soundtrack;
