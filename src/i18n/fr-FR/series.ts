export default {
	meta: {
		main: {
			title: 'Séries',
			description: 'Sélectionnez la série d\'énigmes que vous souhaitez compléter'
		}
	},
	main: {
		search: 'Recherche par nom de série ou créateur',
		sort: {
			title: 'Trier par',
			titleAsc: 'Titre croissant',
			titleDesc: 'Titre décroissant',
			creationDateAsc: 'Date de création croissante',
			creationDateDesc: 'Date de création décroissante',
			bestRated: 'Les mieux notés',
			lowestRated: 'Les moins bien notés'
		}
	},
	solution: {
		redirect: 'vous serez automatiquement redirigé vers la liste d\'énigmes',
		check: {
			title: 'vérifier ma solution',
			load: 'votre solution est en cours de vérification',
			error: 'votre solution est incorrecte',
			success: 'votre solution est correcte'
		}
	}
};
