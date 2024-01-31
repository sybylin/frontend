export default {
	meta: {
		title: 'Error'
	},
	title: 'Are you lost ?',
	description: 'Probably a mistake, fortunately not serious.\nDon\'t hesitate to come back on other interesting pages like :',
	api: {
		fail: 'An error occurred with the api, please try again in a few minutes. If the error persists, contact the administrator',
		mail: 'Mail system no longer works, contact the administrator',
		db: 'An error has occurred with the database, contact the administrator'
	},
	unauthorized: {
		redirect: 'login to your account to access content',
		jwt: 'you need to connect to access content',
		title: 'well, no, you\'re not allowed to go here',
		subtitle: 'but I promise there\'s plenty of nice stuff elsewhere'
	},
	brotli: {
		title: 'An error has occurred while decompressing data sent by the server',
		description: 'It would be a good idea to try and contact the enigma\'s creator to let him know.'
	},
	captcha: 'The captcha is incorrect, please try again',
	report: {
		title: 'Report',
		description: 'Have you found a bug ? Do you think the interface is poorly designed ? Do you have an idea for improving the site ?',
		type: 'Type of report',
		message: 'Message'
	}
};
