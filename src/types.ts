export interface enigma {
	id: number;
	title: string;
	image: string | null;
	description: string;
	finished: boolean | null;
}

export interface series {
	id: number;
	title: string;
	description: string;
	published: boolean;
	image: string | null;
	modification_date: Date;
	series_enigma_order: {
		enigma: enigma
	}[];
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
