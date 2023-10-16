export default {
	main: {
		list: {
			title: 'mes séries',
			edit: 'éditer'
		},
		serie: {
			return: 'retour',
			unauthorized: 'vous n\'êtes pas autorisé à éditer cette série',
			enigmas: 'énigmes',
			options: 'options',
			title: 'titre',
			description: 'description',
			points: 'points',
			incorrect: '{key} est incorrecte',
			mandatory: '{key} est obligatoire'
		},
		delete: 'supprimer',
		deleteDialog: {
			title: 'supprimer la série',
			description: 'vous êtes sur le point de supprimer toute la série, cette action est irréversible',
			explanation: 'pour supprimer cette série, saisissez son nom et confirmez la demande',
			label: 'saisir le nom de la série',
			error: 'le nom ne correspond pas'
		},
		deleteEnigma: {
			title: 'supprimer l\'énigme',
			description: 'vous êtes sur le point de supprimer toute l\'énigme, cette action est irréversible',
			explanation: 'pour supprimer cette énigme, saisissez son nom et confirmez la demande',
			label: 'saisir le nom de l\'énigme',
			error: 'le nom ne correspond pas'
		}
	},
	mobile: 'Vous êtes sur mobile, l\'éditeur d\'énigme est plus compliqué sur celui-ci. Veuillez passer sur un ordinateur de bureau',
	dialogCreateSerie: {
		name: 'créer une nouvelle série',
		title: 'nom de la série',
		description: 'description de la série',
		titleError: 'une série existe déjà sous ce nom',
		required: 'est requis'
	},
	dialogCreateEnigma: {
		name: 'créer une nouvelle énigme',
		title: 'titre de l\'énigme',
		description: 'description de l\'énigme',
		titleError: 'une énigme existe déjà sous ce nom',
		required: 'est requis'
	}
};
