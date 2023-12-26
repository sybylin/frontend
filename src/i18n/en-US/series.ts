export default {
	meta: {
		main: {
			title: 'Series',
			description: 'Select the series of enigmas you wish to complete'
		},
		series: {
			description: 'Start or continue the enigmas in the series'
		},
		enigma: {
			title: 'Enigma',
			description: 'Resolve enigma'
		}
	},
	main: {
		search: 'search by series name or creator',
		noSeries: 'no series',
		sort: {
			title: 'sort by',
			filter: 'filter',
			titleAsc: 'title ascending',
			titleDesc: 'title descending',
			creationDateAsc: 'creation date ascending',
			creationDateDesc: 'creation date descending',
			bestRated: 'best rated',
			lowestRated: 'lowest rated',
			started: 'in progress',
			finished: 'complete',
			all: 'all'
		}
	},
	solution: {
		redirect: 'you will be redirected automatically to enigma list',
		check: {
			title: 'check my solution',
			load: 'your solution is being verified',
			error: 'your solution is incorrect',
			success: 'your solution is correct'
		}
	}
};
