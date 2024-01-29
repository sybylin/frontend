<template>
	<div class="column justify-center align-center full-width q-pt-xl q-pb-xl height">
		<div class="row justify-center full-width">
			<q-stepper
				v-model="step"
				contracted flat bordered
				:style="($q.screen.width > mobileScreen) ? 'width: 75%' : 'width: 90%'"
			>
				<q-step
					:name="1" :done="step > 1"
					title="" icon="person_add"
				>
					<q-banner
						v-if="incorrectPost || incorrectCaptcha === true"
						class="text-white bg-red text-center"
					>
						<span v-if="!incorrectCaptcha">
							{{ (incorrectPost.info.code === 'GE_002') ? $t('error.api.mail') : $t('error.api.db') }}
						</span>
						<span v-else>
							{{ $t('error.captcha') }}
						</span>
					</q-banner>
					<div class="row justify-center">
						<span class="text-h5">{{ $capitalize($t('user.connection.step.1.title')) }}</span>
					</div>
					<q-separator class="full-width q-mb-sm q-mt-sm" inset />
					<q-form
						class="q-gutter-md"
						@submit="onSubmit"
						@reset="onReset"
					>
						<q-input
							v-model="lastName"
							bottom-slots
							class="form-input"
							:label="$capitalize($t('user.connection.lastName'))"
							:disable="apiCall"
						/>
						<q-input
							v-model="name"
							bottom-slots
							:maxlength="255"
							:label="$capitalize($t('user.connection.username'))"
							:error="incorrectName !== false"
							:error-message="nameError"
							:disable="apiCall"
						/>
						<q-input
							v-model="email"
							type="email"
							bottom-slots
							:label="$capitalize($t('user.connection.email'))"
							:error="incorrectEmail === true || incorrectEmail === 'alreadyTaken'"
							:error-message="(incorrectEmail === 'alreadyTaken'
								? $capitalize($t('user.connection.alreadyTaken', { key: $t('user.connection.email') }))
								: $capitalize($t('user.connection.incorrect', { key: $t('user.connection.email') }))
							)"
							:disable="apiCall"
						/>
						<q-input
							v-model="password"
							bottom-slots
							:maxlength="255"
							:label="$capitalize($t('user.connection.password'))"
							:error="passwordError"
							:error-message="passwordErrorMessage"
							:type="togglePassword ? 'password' : 'text'"
							:disable="apiCall"
						>
							<template v-slot:append>
								<q-icon
									class="cursor-pointer"
									:disable="apiCall"
									:name="togglePassword ? 'visibility_off' : 'visibility'"
									@click="togglePassword = !togglePassword"
								/>
							</template>
						</q-input>
						<components-pages-user-check-password
							v-model="notFormatedPassword"
							:password="password"
						/>
						<q-input
							v-model="repeatPassword"
							bottom-slots
							:maxlength="255"
							:label="$capitalize($t('user.connection.repeatPassword'))"
							:error="incorrectRepeatPassword === true || incorrectRepeatPassword === 'notTheSame'"
							:error-message="(incorrectRepeatPassword === 'notTheSame')
								? $capitalize($t('user.connection.different', { key: $t('user.connection.passwords') }))
								: $capitalize($t('user.connection.mandatory', { key: $t('user.connection.passwords') }))
							"
							:type="toggleRepeatPassword ? 'password' : 'text'"
							:disable="apiCall"
						>
							<template v-slot:append>
								<q-icon
									class="cursor-pointer"
									:disable="apiCall"
									:name="toggleRepeatPassword ? 'visibility_off' : 'visibility'"
									@click="toggleRepeatPassword = !toggleRepeatPassword"
								/>
							</template>
						</q-input>
						<div class="row justify-center full-width">
							<captcha
								v-model="captcha"
								:error="incorrectCaptcha"
							/>
						</div>
						<div class="row justify-end">
							<q-btn
								:label="$capitalize($t('user.connection.step.1.submit'))" type="submit"
								color="primary" size="md"
								:disable="!activateSubmitButton"
								:loading="apiCall"
							/>
							<q-btn
								:label="$capitalize($t('user.connection.step.1.reset'))" type="reset"
								color="primary" flat class="q-ml-sm"
								:disable="apiCall"
							/>
						</div>
					</q-form>
					<q-separator class="q-mt-lg q-mb-lg" />
					<div class="row justify-center">
						<q-btn
							:label="$capitalize($t('user.connection.redirectBtn.login'))"
							color="secondary" icon="account_circle"
							:to="$generatePath({ name: 'login' })"
						/>
					</div>
				</q-step>
				<q-step
					:name="2" :done="step > 2"
					title="" icon="verified"
				>
					<components-pages-user-token-validation
						:name="name"
						:last-name="lastName"
						@complete="() => step = 3"
					/>
				</q-step>
				<q-step
					:name="3" :done="step > 3"
					title="" icon="how_to_reg"
				>
					<div class="full-width column justify-center items-center">
						<span class="text-h5">{{ $capitalize($t('user.connection.step.3.title')) }}</span>
						<q-separator class="full-width q-mb-sm q-mt-sm" inset />
						<q-btn
							color="light-green-8"
							size="lg"
							:label="$capitalize($t('user.connection.step.3.btn'))"
							:to="$generatePath({ name: 'login' })"
						/>
					</div>
				</q-step>
			</q-stepper>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'quasar';
import meta from 'src/meta';
import isEmail from 'validator/lib/isEmail';
import { api } from 'src/boot/axios';
import { capitalize } from 'src/boot/custom';

import ComponentsPagesUserTokenValidation from 'components/pages/user/tokenValidation.vue';
import ComponentsPagesUserCheckPassword from 'components/pages/user/checkPassword.vue';
import Captcha from 'src/components/captcha.vue';

export default defineComponent({
	name: 'PageUserCreation',
	components: {
		ComponentsPagesUserTokenValidation,
		ComponentsPagesUserCheckPassword,
		Captcha
	},
	setup () {
		const { t } = useI18n();
		const step = ref<number>(1);

		const name = ref<string | null>(null);
		const lastName = ref<string | null>(null);
		const email = ref<string | null>(null);
		const password = ref<string | null>(null);
		const repeatPassword = ref<string | null>(null);
		const togglePassword = ref<boolean>(true);
		const toggleRepeatPassword = ref<boolean>(true);
		const captcha = ref<string | null>(null);

		const apiCall = ref<boolean>(false);
		const incorrectName = ref<boolean | 'alreadyTaken' | 'forbidden'>(false);
		const incorrectEmail = ref<boolean | 'alreadyTaken'>(false);
		const incorrectPassword = ref<boolean | 'notTheSame' | 'malformed'>(false);
		const notFormatedPassword = ref<boolean | null>(null);
		const incorrectRepeatPassword = ref<boolean | 'notTheSame'>(false);
		const incorrectPost = ref<any | null>(null);
		const incorrectCaptcha = ref<boolean | null>(null);

		const nameError = computed(() => {
			if (incorrectName.value === 'alreadyTaken')
				return capitalize(t('user.connection.alreadyTaken', { key: t('user.connection.username') }));
			return capitalize(t('user.forbiddenUsername'));
		});

		const passwordError = computed(() => (notFormatedPassword.value === false || incorrectPassword.value !== false));
		const passwordErrorMessage = computed(() => {
			if (notFormatedPassword.value === false)
				return capitalize(t('user.checkPassword.ko'));
			switch (incorrectPassword.value) {
			case true:
				return capitalize(t('user.connection.different', { key: t('user.connection.passwords') }));
			case 'malformed':
				return capitalize(t('user.checkPassword.ko'));
			case 'notTheSame':
			default:
				return capitalize(t('user.connection.mandatory', { key: t('user.connection.passwords') }));
			}
		});

		const activateSubmitButton = computed(() =>
			name.value && email.value && password.value && repeatPassword.value && captcha.value
		);

		const onSubmit = () => {
			if (name.value && email.value && password.value && repeatPassword.value) {
				let isError = false;
				incorrectName.value = false;
				incorrectEmail.value = false;
				incorrectPassword.value = false;
				incorrectRepeatPassword.value = false;
				incorrectCaptcha.value = null;

				if (!isEmail(email.value)) {
					isError = true;
					incorrectEmail.value = true;
				}
				if (password.value.localeCompare(repeatPassword.value) !== 0) {
					isError = true;
					incorrectPassword.value = 'notTheSame';
					incorrectRepeatPassword.value = 'notTheSame';
				}
				if (isError)
					return;
				apiCall.value = true;
				if (lastName.value) {
					setTimeout(() => { apiCall.value = false; step.value = 2; }, Math.random() * (1243 - 2549) + 2549);
					return;
				}
				api.post('/user/create', {
					name: name.value,
					password: password.value,
					email: email.value,
					captcha: captcha.value
				})
					.then(() => {
						step.value = 2;
					})
					.catch((e) => {
						if (e.response.data.info.code === 'US_007' || e.response.data.info.code === 'US_006')
							incorrectEmail.value = 'alreadyTaken';
						if (e.response.data.info.code === 'US_031')
							incorrectName.value = 'forbidden';
						if (e.response.data.info.code === 'US_012')
							incorrectPassword.value = 'malformed';
						if (e.response.data.info.code === 'CA_001')
							incorrectCaptcha.value = true;
						if (e.response.data.incorrectPassword)
							incorrectPassword.value = true;
						if (
							!incorrectCaptcha.value &&
							!incorrectEmail.value &&
							!incorrectName.value &&
							!incorrectPassword.value
						)
							incorrectPost.value = e.response.data;
					})
					.finally(() => {
						apiCall.value = false;
					});
			}
		};

		const onReset = () => {
			incorrectName.value = false;
			incorrectEmail.value = false;
			incorrectPassword.value = false;
			incorrectRepeatPassword.value = false;
			incorrectPost.value = null;
			name.value = null;
			email.value = null;
			password.value = null;
			repeatPassword.value = null;
			notFormatedPassword.value = false;
		};

		useMeta(() => {
			return meta({
				meta: {
					title: t('user.meta.creation.title'),
					description: t('user.meta.creation.description'),
					keywords: ['Sybilin', 'user', 'creation']
				},
				og: {
					url: 'https://sybyl.in/user/creation',
					title: t('user.meta.creation.title'),
					description: t('user.meta.creation.description'),
					image: 'https://sybyl.in/img/background.png'
				},
				twitter: {
					url: 'https://sybyl.in/user/creation',
					title: t('user.meta.creation.title'),
					description: t('user.meta.creation.description'),
					image: 'https://sybyl.in/img/background.png'
				}
			});
		});

		return {
			mobileScreen: 880,
			step,

			name,
			lastName,
			email,
			password,
			repeatPassword,
			togglePassword,
			toggleRepeatPassword,
			captcha,

			apiCall,
			incorrectName,
			incorrectEmail,
			incorrectPassword,
			notFormatedPassword,
			incorrectRepeatPassword,
			incorrectPost,
			nameError,
			incorrectCaptcha,

			passwordError,
			passwordErrorMessage,

			activateSubmitButton,
			onSubmit,
			onReset
		};
	}
});
</script>

<style scoped>
.height {
	min-height: calc(100vh - 5em);
}
.form-input {
	opacity: 0;
	position: absolute;
	top: 0;
	left: 0;
	height: 0;
	width: 0;
	z-index: -1;
}
</style>
