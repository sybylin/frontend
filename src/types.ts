export type Role = 'USER' | 'MODERATOR' | 'ADMINISTRATOR';
export type Published = 'UNPUBLISHED' | 'PENDING' | 'PUBLISHED';
export type Finished = 'START' | 'RESUME' | 'UNAUTHORIZED';
export type Solution = 'STRING' | 'ARRAY' | 'OBJECT';

export enum ReportType {
	BUG = 'BUG',
	IMPROVEMENT = 'IMPROVEMENT',
	UI = 'UI'
}

export enum ReportStatus {
	OPEN = 'OPEN',
	PROGRESS = 'PROGRESS',
	COMPLETE = 'COMPLETE',
	REFUSED = 'REFUSED'
}

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
	series_id?: number;
	image: string | null;
	title: string;
	description: string;
	finished: Finished;
	enigma_finished: {
		completion_date: Date | null;
	}[];
}

export interface series {
	id: number;
	title: string;
	description: string;
	image: string | null;
	rating: number;
	creation_date: Date | null;
	published: Published;
	series_enigma_order: enigma[];
	series_finished?: Date[];
	series_creator: {
		id: number;
		name: string
		avatar: string | null;
  }[];
	series_verified_by?: {
		verified: boolean;
    rejection_reason: string | null;
  }[];
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
