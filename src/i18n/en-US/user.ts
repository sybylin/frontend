export default {
	meta: {
		main: {
			title: 'Account',
			description: 'Manage your account and much more'
		},
		login: {
			title: 'Login',
			description: 'Log in into your account'
		},
		creation: {
			title: 'Account creation',
			description: 'Create a new account'
		},
		reset: {
			title: 'Reset password',
			description: 'Reset your password account'
		}
	},
	account: 'account',
	verify: 'this account is verified',
	unverify: 'this account is unverified',
	update: 'update',
	accountUpdate: 'your account has been successfully modified',
	forbiddenUsername: 'this username cannot be used',
	invalidToken: 'the reset link is incorrect',
	connection: {
		username: 'pseudonym',
		lastName: 'last name',
		email: 'email',
		oldPassword: 'old password',
		password: 'password',
		passwords: 'passwords',
		rememberMe: 'remember me for 7 days',
		forgot: 'i forgot my password',
		repeatPassword: 'repeat password',
		newPassword: 'new password',
		newPasswordRepeat: 'new repeat password',
		alreadyTaken: 'this {key} is already taken',
		mandatory: '{key} is mandatory',
		mandatoryBefore: 'the {key} is mandatory',
		different: '{key} are different',
		notExist: '{key} not exist',
		incorrect: '{key} is incorrect',
		redirectBtn: {
			create: 'create a new account',
			login: 'login to my account'
		},
		reset: {
			newPassword: 'enter your new password',
			start: 'to reset your password, enter the e-mail address linked to your account',
			startBanner: 'if an account is linked to this address, you will received an e-mail containing the link to reset your password',
			banner: 'your password has been successfully modified'
		},
		step: {
			1: {
				title: 'create your account',
				submit: 'submit',
				reset: 'reset'
			},
			2: {
				title: 'validate your account',
				text1: 'you will shortly receive an e-mail with a code to enter in the field below',
				text2: 'this code is valid for 15 minutes'
			},
			3: {
				title: 'account is validated',
				btn: 'redirect to account connection'
			}
		}
	},
	checkPassword: {
		ko: 'password does not meet minimum requirements',
		size: 'password length',
		lower: 'lowercase',
		upper: 'uppercase',
		number: 'number',
		special: 'special character'
	},
	delete: {
		title: 'delete my account',
		description: 'you\'re about to delete your account, this action is irreversible.',
		descriptionMore: 'deleting your account will result in the complete deletion of all related data, including puzzles, series, achievements, and more.',
		explanation: 'to delete your account, enter your pseudonym and confirm the request.',
		label: 'enter your pseudonym',
		error: 'the pseudonym doesn\'t match',
		ok: 'you\'re account is deleted'
	}
};
