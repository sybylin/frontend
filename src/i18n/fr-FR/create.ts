export default {
	main: {
		list: {
			title: 'mes séries',
			edit: 'éditer'
		},
		tab: {
			info: 'info',
			editor: 'éditeur',
			solution: 'solution'
		},
		series: {
			return: 'retour',
			unauthorized: 'vous n\'êtes pas autorisé à éditer cette série',
			enigmas: 'énigmes',
			options: 'options',
			title: 'titre',
			description: 'description',
			createdBy: 'créé par',
			points: 'points',
			incorrect: '{key} est incorrecte',
			mandatory: '{key} est obligatoire',
			publish: 'publier la série',
			publishSubtitle: 'rendre la série visible au public et consultable',
			pendingExplanation: 'pour des raisons de sécurité, votre série doit être vérifiée par un modérateur afin de s\'assurer qu\'elle est conforme aux règlements',
			rejection: 'votre énigme a été refusée par un modérateur, la raison en est la suivante :',
			btn: {
				publishSeries: 'publier ma série',
				unpublishSeries: 'dépublier ma série',
				unpublished: 'non publié',
				pending: 'en attente',
				published: 'publié'
			}
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
		},
		solution: {
			sentence: 'phrase',
			sentenceBanner: 'cette phrase doit être écrite par l\'utilisateur pour que l\'énigme soit complète',
			keywords: 'mots-clés',
			sentenceKeywords: 'la liste des mots-clés doit être complète et peut être ordonnée ou non',
			toggleHelpKeywords: 'les utilisateurs doivent saisir les mots-clés exactement dans cet ordre pour que la solution soit valide',
			toggleKeywords: 'maintenir l\'ordre des mots-clés',
			key: 'clé',
			value: 'valeur',
			keyvalues: 'clés valeurs',
			sentenceKeyvalues: 'un objet qui peut contenir autant de couples clé/valeur que nécessaire, l\'ordre à l\'intérieur d\'un objet n\'est pas obligatoire'
		}
	},
	forbidden: {
		pending: 'la série est en cours de vérification, vous ne pouvez pas la modifier',
		published: 'la série est publiée, veuillez la remettre à l\'état non publié pour la modifier'
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
