import main from './main';
import error from './error';
import user from './user';

export default {
	title: 'Sibyllin',
	catch: 'Enigma',
	searchError: 'Une erreur s\'est produite lors de la recherche',
	unauthorized: 'Vous ne disposez pas des droits nécessaires pour accéder à ce contenu',
	menu: {
		title: 'Menu',
		home: 'Accueil',
		series: 'Séries',
		license: 'Licence',
		documentation: 'Documentation',
		discord: 'Discord',
		github: 'Github',
		dark: 'Mode sombre'
	},
	main,
	error,
	user
};
