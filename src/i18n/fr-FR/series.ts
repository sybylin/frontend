export default {
	meta: {
		main: {
			title: 'Séries',
			description: 'Sélectionnez la série d\'énigmes que vous souhaitez compléter'
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
