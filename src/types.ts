export type Role = 'USER' | 'MODERATOR' | 'ADMINISTRATOR';
export type Published = 'UNPUBLISHED' | 'PENDING' | 'PUBLISHED';
export type Solution = 'STRING' | 'ARRAY' | 'OBJECT';

export interface user {
	id: number;
  name: string;
	email: string;
	avatar: string | null;
	role: Role;
	verify: boolean;
	blocked: boolean;
	creation_date: Date;
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
	published: Published;
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
		rejection_reason: string | null;
	}
}

export interface seriesList {
	id: number;
	image: string | null;
	title: string;
	creation_date: Date | null;
	name: string;
	avatar: string | null
	rating: number;
	started_date: Date | null;
	completion_date: Date | null;
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
