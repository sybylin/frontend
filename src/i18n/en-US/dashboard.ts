export default {
	title: 'dashboard',
	main: {
		title: 'main',
		desc: 'main page of dashboard'
	},
	development: 'under development',
	users: {
		title: 'users',
		desc: 'manage users',
		noUsers: 'no users',
		sort: {
			nameAsc: 'name ascending',
			nameDesc: 'name descending',
			creationDateAsc: 'creation date ascending',
			creationDateDesc: 'creation date descending'
		},
		table: {
			avatar: 'avatar',
			name: 'name',
			email: 'email',
			role: 'role',
			verify: 'verify',
			creationDate: 'creation date',
			actions: 'actions',
			page: 'page'
		},
		role: {
			administrator: 'administrator',
			moderator: 'moderator',
			user: 'user'
		},
		cantChange: 'you cannot modify your own data for security reasons',
		block: {
			title: 'block user',
			block: 'block',
			unblock: 'unblock',
			beforeTime: 'you cannot select an earlier date than the current one'
		}
	},
	series: {
		title: 'series',
		desc: 'verify series of enigmas',
		verifyBtn: 'check series',
		verifyBtnEnigma: 'check enigma',
		emptyEnigma: 'this enigma has no content',
		emptySolution: 'this enigma has no solution',
		seriesTitle: 'series title',
		seriesDescription: 'series description',
		seriesCreator: 'series creator',
		solutionType: 'solution type',
		rejectionReason: 'rejection reason'
	},
	report: {
		title: 'report',
		desc: 'read send report',
		table: {
			id: 'id',
			tags: 'tags',
			date: 'creation date',
			message: 'message',
			status: 'status'
		},
		type: {
			title: 'type',
			bug: 'bug',
			improvement: 'improvement',
			ui: 'ui'
		},
		status: {
			title: 'status',
			open: 'open',
			progress: 'progress',
			complete: 'complete',
			refused: 'refused'
		}
	}
};
