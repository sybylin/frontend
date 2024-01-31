export default {
	title: 'tableau de bord',
	main: {
		title: 'accueil',
		desc: 'page principale du tableau de bord'
	},
	development: 'en cours de développement',
	users: {
		title: 'utilisateurs',
		desc: 'gérer les utilisateurs',
		noUsers: 'pas d\'utilisateurs',
		sort: {
			nameAsc: 'nom par ordre croissant',
			nameDesc: 'nom par ordre décroissant',
			creationDateAsc: 'date de création par ordre croissant',
			creationDateDesc: 'date de création par ordre décroissant'
		},
		table: {
			avatar: 'avatar',
			name: 'nom',
			email: 'email',
			role: 'role',
			verify: 'vérifier',
			creationDate: 'date de création',
			actions: 'actions',
			page: 'page'
		},
		role: {
			administrator: 'administrateur',
			moderator: 'modérateur',
			user: 'utilisateur'
		},
		cantChange: 'vous ne pouvez pas modifier vos propres données pour des raisons de sécurité',
		block: {
			title: 'bloquer l\'utilisateur',
			block: 'bloquer',
			unblock: 'débloquer',
			beforeTime: 'vous ne pouvez pas sélectionner une date antérieure à la date actuelle'
		}
	},
	series: {
		title: 'séries',
		desc: 'vérifier les séries d\'énigmes',
		verifyBtn: 'vérifier la série',
		verifyBtnEnigma: 'vérifier l\'énigme',
		emptyEnigma: 'cette énigme n\'a pas de contenu',
		emptySolution: 'cette énigme n\'a pas de solution',
		seriesTitle: 'titre de la série',
		seriesDescription: 'description de la série',
		seriesCreator: 'créateur de la série',
		solutionType: 'type de la solution',
		rejectionReason: 'motif du rejet'
	},
	report: {
		title: 'rapport',
		desc: 'lire les rapports envoyer',
		table: {
			id: 'id',
			tags: 'étiquettes',
			date: 'date de création',
			message: 'message',
			status: 'status'
		},
		type: {
			title: 'type',
			bug: 'bug',
			improvement: 'amélioration',
			ui: 'ui'
		},
		status: {
			title: 'status',
			open: 'ouvert',
			progress: 'en progression',
			complete: 'complété',
			refused: 'refusé'
		}
	}
};
