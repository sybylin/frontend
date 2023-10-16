export default {
	main: {
		list: {
			title: 'my series',
			edit: 'edit'
		},
		serie: {
			return: 'return',
			unauthorized: 'you are not authorized to edit this serie',
			enigmas: 'enigmas',
			options: 'options',
			title: 'title',
			description: 'description',
			points: 'points',
			incorrect: '{key} is incorrect',
			mandatory: '{key} is mandatory'
		},
		delete: 'delete',
		deleteDialog: {
			title: 'delete serie',
			description: 'you\'re about to delete the entire series, this action is irreversible',
			explanation: 'to delete this series, enter its name and confirm the request',
			label: 'enter name of serie',
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
		name: 'create new serie',
		title: 'title of serie',
		description: 'description of serie',
		titleError: 'a serie already exists with this name',
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
