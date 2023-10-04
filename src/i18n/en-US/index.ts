import main from './main';
import error from './error';
import user from './user';
import series from './series';
import achievement from './achievement';
import create from './create';
import builder from './builder';

export default {
	title: 'Sibyllin',
	catch: 'Enigma',
	searchError: 'An error has occurred during the search',
	unauthorized: 'You do not have the necessary rights to access this content',
	menu: {
		title: 'Menu',
		home: 'Home',
		series: 'Series',
		create: 'Create',
		license: 'License',
		documentation: 'Documentation',
		discord: 'Discord',
		github: 'Github',
		dark: 'Dark mode'
	},
	main,
	error,
	user,
	series,
	achievement,
	create,
	builder
};
