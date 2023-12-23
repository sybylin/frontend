export default {
	main: {
		list: {
			title: 'my series',
			edit: 'edit'
		},
		tab: {
			info: 'info',
			editor: 'editor',
			solution: 'solution'
		},
		series: {
			return: 'return',
			unauthorized: 'you are not authorized to edit this series',
			enigmas: 'enigmas',
			options: 'options',
			title: 'title',
			description: 'description',
			createdBy: 'created by',
			points: 'points',
			incorrect: '{key} is incorrect',
			mandatory: '{key} is mandatory',
			publish: 'publish series',
			publishSubtitle: 'makes the series visible to the public and searchable',
			pendingExplanation: 'for safety reasons, your series must be checked by a moderator to ensure that it complies with the rules',
			rejection: 'your enigma has been refused by a moderator, the reason is :',
			btn: {
				publishSeries: 'publish my series',
				unpublishSeries: 'unpublish my series',
				unpublished: 'unpublished',
				pending: 'pending',
				published: 'published'
			}
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
		},
		solution: {
			sentence: 'sentence',
			sentenceBanner: 'this sentence is needed from user for complete enigma',
			keywords: 'keywords',
			sentenceKeywords: 'the list of keywords must be complete, and can either be in order or not',
			toggleHelpKeywords: 'users must enter the keywords exactly in this order for the solution to be valid',
			toggleKeywords: 'keep keywords order',
			key: 'key',
			value: 'value',
			keyvalues: 'key values',
			sentenceKeyvalues: 'an object that can contain as many key/values pairs as required, the order within an object is not mandatory'
		}
	},
	forbidden: {
		pending: 'the series is being verified, you cannot modify it',
		published: 'the series is published, please set it to unpublished to modify it'
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
