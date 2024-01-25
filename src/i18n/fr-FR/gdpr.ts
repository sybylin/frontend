// Don't import this file in i18n, is for vanilla-cookieconsent

export default {
	consentModal: {
		title: '🍪 C\'est l\'heure des cookies !',
		description: 'Sybylin a besoin de cookies pour fonctionner correctement, mais nous vous laissons choisir ce que vous souhaitez autoriser.',
		acceptAllBtn: 'Tout accepter',
		acceptNecessaryBtn: 'Tout rejeter',
		showPreferencesBtn: 'Gérer mes préférences'
	},
	preferencesModal: {
		title: 'Préférences concernant les cookies',
		acceptAllBtn: 'Tout accepter',
		acceptNecessaryBtn: 'Tout rejeter',
		savePreferencesBtn: 'Sauvegarder mes préférences',
		closeIconLabel: 'Fermer',
		sections: [
			{
				title: 'Utilisation des cookies',
				description: 'Nous utilisons des cookies pour assurer les fonctionnalités de base du site web et pour améliorer votre expérience en ligne'
			},
			{
				title: 'Cookies strictement nécessaires',
				description: 'Ces cookies sont essentiels au bon fonctionnement de notre site web. Sans ceux-ci, le site ne fonctionnerait pas correctement',
				linkedCategory: 'necessary'
			},
			{
				title: 'Plus d\'informations',
				description: 'Pour toute question relative à notre politique en matière de cookies et à vos choix, veuillez <a class="cc-link" href="mailto:hello@sybyl.in">nous contacter</a>'
			}
		]
	}
};
