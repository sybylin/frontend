export interface enigma {
	id: number;
	series_id: number;
	title: string;
	image: string | null;
	description: string;
	points: number;
	creation_date: Date | null;
	modification_date: Date | null;
	add?: boolean;
}

export interface series {
	id: number;
	title: string;
	image: string | null;
	description: string;
	points: number;
	published: boolean;
	creation_date: Date;
	modification_date: Date;
	series_enigma_order: {
		order: number;
		series_id: number;
		enigma_id: number;
		enigma: enigma
	}[];
}
