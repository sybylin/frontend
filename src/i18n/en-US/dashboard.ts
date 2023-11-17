export default {
	title: 'dashboard',
	main: {
		title: 'main'
	},
	users: {
		title: 'users',
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
		verifyBtn: 'check series',
		verifyBtnEnigma: 'check enigma',
		seriesTitle: 'series title',
		seriesDescription: 'series description',
		seriesCreator: 'series creator',
		solutionType: 'solution type',
		rejectionReason: 'rejection reason'
	}
};
