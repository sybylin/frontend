import main from './main';
import error from './error';
import user from './user';
import series from './series';
import achievement from './achievement';
import create from './create';
import builder from './builder';
import dashboard from './dashboard';
import profil from './profil';

export default {
	title: 'Sybylin',
	searchError: 'An error has occurred during the search',
	unauthorized: 'You do not have the necessary rights to access this content',
	menu: {
		title: 'Menu',
		home: 'Home',
		series: 'Series',
		create: 'Create',
		dashboard: 'Dashboard',
		license: 'License',
		documentation: 'Documentation',
		discord: 'Discord',
		github: 'Github',
		dark: 'Dark mode',
		options: 'Options'
	},
	main,
	error,
	user,
	series,
	achievement,
	create,
	builder,
	dashboard,
	profil
};
