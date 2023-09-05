export interface interfaceSeries {
	title: string;
	id: number;
	isStarted: boolean;
}

export interface interfaceEnigmas {
	title: string;
	path: string;
	finish: boolean;
	code: string;
}

export const series = [
	{
		title: 'First serie',
		id: 1,
		isStarted: false
	},
	{
		title: 'Second serie',
		id: 2,
		isStarted: true
	}
] as interfaceSeries[];

export const enigmas = [
	{
		title: 'First enigma',
		path: 'first-enigma',
		finish: true,
		code: '<h1>Hello world 1</h1>'
	},
	{
		title: 'Second enigma',
		path: 'second-enigma',
		finish: true,
		code: '<h1>Hello world 2</h1>'
	},
	{
		title: 'Third enigma',
		path: 'third-enigma',
		finish: false,
		code: '<h1>Hello world 3</h1>'
	},
	{
		title: 'Four enigma',
		path: 'four-enigma',
		finish: false,
		code: '<h1>Hello world 4</h1>'
	}
] as interfaceEnigmas[];
