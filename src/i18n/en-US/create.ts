export default {
	main: {
		list: {
			title: 'my series',
			edit: 'edit'
		},
		series: {
			return: 'return',
			unauthorized: 'you are not authorized to edit this series',
			enigmas: 'enigmas',
			options: 'options',
			title: 'title',
			description: 'description',
			points: 'points',
			incorrect: '{key} is incorrect',
			mandatory: '{key} is mandatory',
			publish: 'publish series',
			publishTooltip: 'makes the series visible to the public and searchable'
		},
		delete: 'delete',
		deleteDialog: {
			title: 'delete series',
			description: 'you\'re about to delete the entire series, this action is irreversible',
			explanation: 'to delete this series, enter its name and confirm the request',
			label: 'enter name of series',
			error: 'the name doesn\'t match'
		},
		deleteEnigma: {
			title: 'delete enigma',
			description: 'you\'re about to delete the entire enigma, this action is irreversible',
			explanation: 'to delete this enigma, enter its name and confirm the request',
			label: 'enter name of enigma',
			error: 'the name doesn\'t match'
		}
	},
	mobile: 'You\'re on mobile, enigma editor is more complicated on it. Please switch to desktop',
	dialogCreateSerie: {
		name: 'create new series',
		title: 'title of series',
		description: 'description of series',
		titleError: 'a series already exists with this name',
		required: 'is required'
	},
	dialogCreateEnigma: {
		name: 'create new enigma',
		title: 'title of enigma',
		description: 'description of enigma',
		titleError: 'a enigma already exists with this name',
		required: 'is required'
	}
};
