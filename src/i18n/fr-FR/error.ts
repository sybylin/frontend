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
	}
};
