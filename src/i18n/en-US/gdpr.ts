// Don't import this file in i18n, is for vanilla-cookieconsent

export default {
	consentModal: {
		title: '🍪 It\'s cookie time !',
		description: 'Sybylin needs cookies to work properly, but we let you choose what you want to allow',
		acceptAllBtn: 'Accept all',
		acceptNecessaryBtn: 'Reject all',
		showPreferencesBtn: 'Manage preferences'
	},
	preferencesModal: {
		title: 'Cookie preferences',
		acceptAllBtn: 'Accept all',
		acceptNecessaryBtn: 'Reject all',
		savePreferencesBtn: 'Save preferences',
		closeIconLabel: 'Close',
		sections: [
			{
				title: 'Cookie usage',
				description: 'We use cookies to ensure the basic functionalities of the website and to enhance your online experience'
			},
			{
				title: 'Strictly necessary cookies',
				description: 'These cookies are essential for the proper functioning of this website. Without these cookies, the website would not work properly',
				linkedCategory: 'necessary'
			},
			{
				title: 'More information',
				description: 'For any queries in relation to our policy on cookies and your choices, please <a class="cc-link" href="mailto:hello@sybyl.in">contact us</a>.'
			}
		]
	}
};
