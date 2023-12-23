import main from './main';
import error from './error';
import user from './user';
import series from './series';
import achievement from './achievement';
import create from './create';
import builder from './builder';
import dashboard from './dashboard';

export default {
	title: 'Sibyllin',
	searchError: 'Une erreur s\'est produite lors de la recherche',
	unauthorized: 'Vous ne disposez pas des droits nécessaires pour accéder à ce contenu',
	menu: {
		title: 'Menu',
		home: 'Accueil',
		series: 'Séries',
		create: 'Créer',
		dashboard: 'Tableau de bord',
		license: 'Licence',
		documentation: 'Documentation',
		discord: 'Discord',
		github: 'Github',
		dark: 'Mode sombre'
	},
	main,
	error,
	user,
	series,
	achievement,
	create,
	builder,
	dashboard
};
