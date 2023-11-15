export interface user {
	name: string;
	creationDate: Date;
	avatar: string | null;
	verify?: boolean;
	id?: number;
	role?: 'USER' | 'MODERATOR' | 'ADMINISTRATOR';
	points?: number;
}

export interface enigma {
	id: number;
	series_id: number;
	title: string;
	image: string | null;
	description: string;
	finished: boolean | null;
}

export interface series {
	id: number;
	title: string;
	description: string;
	published: 'UNPUBLISHED' | 'PENDING' | 'PUBLISHED';
	image: string | null;
	modification_date: Date;
	series_creator: {
		name: string;
		avatar: string;
	};
	series_enigma_order: {
		series_id?: number ;
		enigma_id?: number;
		enigma: enigma;
		order?: number;
	}[];
	series_verified_by: {
		rejectionReason: string | null;
	}
}

export interface seriesList {
	id: number;
	title: string;
	image: string | null;
	rating: number;
	creator: { name: string; avatar: string | null } | null;
	modification_date: Date | null;
	series_finished: Date | null;
	series_started: Date | null;
}

export interface devArraySolution {
	keepOrder: boolean;
	list: {
		id?: string;
		keyword: string;
	}[];
}

export interface prodArraySolution {
	keepOrder: boolean;
	list: string[];
}

export type objectSolution = Record<string, string>;

export type Solution = 'STRING' | 'ARRAY' | 'OBJECT';
