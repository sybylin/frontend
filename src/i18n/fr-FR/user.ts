export default {
	meta: {
		main: {
			title: 'Compte',
			description: 'Gérer votre compte et bien plus encore'
		},
		login: {
			title: 'Connexion',
			description: 'Connectez-vous à votre compte'
		},
		creation: {
			title: 'Création d\'un compte',
			description: 'Créer un nouveau compte'
		}
	},
	account: 'compte',
	verify: 'ce compte est vérifié',
	unverify: 'ce compte n\'est pas vérifié',
	connection: {
		username: 'pseudonyme',
		lastName: 'nom de famille',
		email: 'e-mail',
		password: 'mot de passe',
		passwords: 'mots de passe',
		rememberMe: 'se souvenir de moi pendant 7 jours',
		forgot: 'j\'ai oublié mon mot de passe',
		repeatPassword: 'répéter le mot de passe',
		newPassword: 'nouveau mot de passe',
		newPasswordRepeat: 'répéter le nouveau mot de passe',
		alreadyTaken: 'cette {key} est déjà prise',
		mandatory: '{before}{key} est obligatoire',
		mandatoryBefore: 'le {key} est obligatoire',
		different: '{key} sont différentes',
		notExist: '{key} n\'existe pas',
		incorrect: '{key} est incorrect',
		redirectBtn: {
			create: 'créer un nouveau compte',
			login: 'se connecter à mon compte'
		},
		reset: {
			newPassword: 'entrez votre nouveau mot de passe',
			start: 'pour réinitialiser votre mot de passe, entrez l\'adresse e-mail liée à votre compte',
			startBanner: 'vous recevrez un e-mail contenant le lien pour réinitialiser votre mot de passe',
			banner: 'votre mot de passe a été modifié avec succès'
		},
		step: {
			1: {
				title: 'créer votre compte',
				submit: 'soumettre',
				reset: 'réinitialiser'
			},
			2: {
				title: 'valider votre compte',
				text1: 'vous recevrez sous peu un e-mail contenant un code à saisir dans le champ ci-dessous',
				text2: 'ce code est valable pendant 15 minutes'
			},
			3: {
				title: 'le compte est validé',
				btn: 'redirection vers la connexion au compte'
			}
		}
	}
};
