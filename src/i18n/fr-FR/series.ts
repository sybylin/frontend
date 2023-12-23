export default {
	meta: {
		main: {
			title: 'Séries',
			description: 'Sélectionnez la série d\'énigmes que vous souhaitez compléter'
		}
	},
	main: {
		search: 'recherche par nom de série ou créateur',
		noSeries: 'aucune série',
		sort: {
			title: 'trier par',
			filter: 'filtrer',
			titleAsc: 'titre croissant',
			titleDesc: 'titre décroissant',
			creationDateAsc: 'date de création croissante',
			creationDateDesc: 'date de création décroissante',
			bestRated: 'les mieux notés',
			lowestRated: 'les moins bien notés',
			started: 'en cours',
			finished: 'complète',
			all: 'toutes'
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
