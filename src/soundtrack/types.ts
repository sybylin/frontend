export interface songs {
	name: string;
	sources: {
		file: string;
		type: 'audio/ogg' | 'audio/mpeg'
	}[]
}

export interface soundtrack {
	name: string;
	path: string;
	cover: string;
	songs: songs[]
}
