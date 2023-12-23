export default {
	title: 'dashboard',
	main: {
		title: 'main',
		desc: 'main page of dashboard'
	},
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
		seriesTitle: 'series title',
		seriesDescription: 'series description',
		seriesCreator: 'series creator',
		solutionType: 'solution type',
		rejectionReason: 'rejection reason'
	}
};
