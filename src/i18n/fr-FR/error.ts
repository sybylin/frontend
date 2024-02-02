export default {
	meta: {
		title: 'Erreur'
	},
	title: 'Perdu ?',
	description: 'Probablement une erreur, heureusement sans gravité.\nN\'hésite pas à revenir sur d\'autres pages intéressants comme :',
	api: {
		fail: 'Une erreur s\'est produite avec l\'api, veuillez réessayer dans quelques minutes. Si l\'erreur persiste, contactez l\'administrateur',
		mail: 'Le système de courriel ne fonctionne plus, contactez l\'administrateur',
		db: 'Une erreur s\'est produite avec la base de données, contactez l\'administrateur'
	},
	unauthorized: {
		redirect: 'connectez-vous à votre compte pour accéder au contenu',
		jwt: 'vous devez vous connecter pour accéder au contenu',
		title: 'Et bien non, vous n\'avez pas le droit d\'être ici',
		subtitle: 'mais je vous promets qu\'il y a plein de belles choses ailleurs'
	},
	brotli: {
		title: 'Une erreur s\'est produite lors de la décompression des données envoyées par le serveur',
		description: 'Il serait bon d\'essayer de contacter le créateur de l\'énigme pour le mettre au courant'
	},
	captcha: 'Le captcha est incorrect, veuillez réessayer',
	report: {
		title: 'Rapport',
		description: 'Avez-vous trouvé un bug ? Vous pensez que l\'interface est mal conçue ? Avez-vous une idée pour améliorer le site ?',
		type: 'Type du rapport',
		message: 'Message',
		success: 'Le rapport a été envoyé avec succès, merci'
	}
};
