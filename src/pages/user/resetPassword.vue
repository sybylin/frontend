<template>
	<div class="row justify-center items-center q-pt-xl q-pb-xl height">
		<q-card
			class="q-pa-md"
			flat
			bordered
			:style="($q.screen.width > mobileScreen) ? 'width: 75%' : 'width: 90%'"
		>
			<template v-if="isToken">
				<div class="row full-width justify-center q-pb-md">
					<span class="text-h6">{{ $capitalize($t('user.connection.reset.newPassword')) }}</span>
				</div>
				<div v-if="success" class="row full-width justify-center q-pb-md">
					<q-banner class="full-width bg-primary text-white bg-green-7 q-mt-md">
						<span>{{ $capitalize($t('user.connection.reset.banner')) }}</span>
						<template v-slot:action>
							<q-btn
								flat
								:label="$capitalize($t('user.connection.redirectBtn.login'))"
								:to="$generatePath({ name: 'login' })"
							/>
						</template>
					</q-banner>
				</div>
				<q-form
					class="q-gutter-md"
					@submit="onSubmit"
					@reset="onReset"
				>
					<q-input
						v-model="password"
						bottom-slots
						:label="$capitalize($t('user.connection.newPassword'))"
						:error="incorrectPassword === true || incorrectPassword === 'notTheSame'"
						:error-message="(incorrectPassword === 'notTheSame')
							? $capitalize($t('user.connection.different', { key: $t('user.connection.passwords') }))
							: $capitalize($t('user.connection.mandatory', { key: $t('user.connection.passwords') }))
						"
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
					<q-input
						v-model="repeatPassword"
						bottom-slots
						:label="$capitalize($t('user.connection.newPasswordRepeat'))"
						:error="incorrectPassword === true || incorrectPassword === 'notTheSame'"
						:error-message="(incorrectPassword === 'notTheSame')
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
					<div class="row justify-end">
						<q-btn
							:label="$capitalize($t('user.connection.step.1.submit'))" type="submit"
							color="primary" size="md"
							:disable="!password || !repeatPassword"
							:loading="apiCall"
						/>
						<q-btn
							:label="$capitalize($t('user.connection.step.1.reset'))" type="reset"
							color="primary" flat class="q-ml-sm"
							:disable="apiCall"
						/>
					</div>
				</q-form>
			</template>
			<template v-else>
				<div class="row full-width justify-center q-pb-md">
					<span class="text-h6">{{ $capitalize($t('user.connection.reset.start')) }}</span>
					<q-banner v-if="success" class="full-width bg-primary text-white bg-green-7 q-mt-md">
						<span>{{ $capitalize($t('user.connection.reset.startBanner')) }}</span>
					</q-banner>
				</div>
				<q-form
					class="q-gutter-md"
					@submit="onSubmitStart"
					@reset="onResetStart"
				>
					<q-input
						v-model="email"
						type="email"
						bottom-slots
						:label="$capitalize($t('user.connection.email'))"
						:error="
							incorrectEmail === true ||
								incorrectEmail === 'incorrectEmail' ||
								incorrectEmail === 'notExist'
						"
						:error-message="emailError"
						:disable="apiCall"
					/>
					<div class="row justify-end">
						<q-btn
							:label="$capitalize($t('user.connection.step.1.submit'))" type="submit"
							color="primary" size="md"
							:disable="!email"
							:loading="apiCall"
						/>
						<q-btn
							:label="$capitalize($t('user.connection.step.1.reset'))" type="reset"
							color="primary" flat class="q-ml-sm"
							:disable="apiCall"
						/>
					</div>
				</q-form>
				<q-separator class="q-mt-md q-mb-md" />
				<div class="row justify-center">
					<q-btn
						:label="$capitalize($t('user.connection.redirectBtn.login'))"
						color="secondary" icon="account_circle"
						:to="$generatePath({ name: 'login' })"
					/>
				</div>
			</template>
		</q-card>
	</div>
</template>

<script lang="ts">
import { capitalize, computed, defineComponent, onMounted, ref, watch } from 'vue';
import { useMeta } from 'quasar';
import meta from 'src/meta';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { api } from 'src/boot/axios';
import isEmail from 'validator/lib/isEmail';

type errorType = 'resetTokenIsInvalid' | 'differentPassword' | 'updateError' | 'mailError' | null;

export default defineComponent({
	name: 'PagesResetPassword',
	setup () {
		const { t } = useI18n();
		const route = useRoute();

		const email = ref<string | null>(null);
		const incorrectEmail = ref<boolean | 'incorrectEmail' | 'notExist'>(false);
		const password = ref<string | null>(null);
		const repeatPassword = ref<string | null>(null);
		const incorrectPassword = ref<boolean | 'notTheSame'>(false);
		const togglePassword = ref<boolean>(true);
		const toggleRepeatPassword = ref<boolean>(true);

		const apiCall = ref<boolean>(false);
		const success = ref<boolean>(false);
		const error = ref<errorType>(null);

		const onSubmit = () => {
			if (route.params.token && password.value && repeatPassword.value) {
				incorrectPassword.value = false;

				if (password.value.localeCompare(repeatPassword.value) !== 0) {
					incorrectPassword.value = 'notTheSame';
					return;
				}
				apiCall.value = true;
				api.post('/user/reset/update', {
					token: route.params.token,
					password: password.value,
					repeatPassword: repeatPassword.value
				})
					.then(() => {
						success.value = true;
					})
					.catch((e) => {
						if (e.response.data.resetTokenIsInvalid)
							error.value = 'resetTokenIsInvalid';
						else if (e.response.data.differentPassword)
							error.value = 'differentPassword';
						else if (e.response.data.info.code === 'GE_001')
							error.value = 'updateError';
						else if (e.response.data.info.code === 'GE_002')
							error.value = 'mailError';
						else
							error.value = null;
					})
					.finally(() => {
						apiCall.value = false;
					});
			}
		};

		const onReset = () => {
			password.value = null;
			repeatPassword.value = null;
			incorrectPassword.value = false;
		};

		const onSubmitStart = () => {
			if (!incorrectEmail.value && !route.params.token && email.value) {
				incorrectEmail.value = false;

				if (!isEmail(email.value)) {
					incorrectEmail.value = 'incorrectEmail';
					return;
				}
				apiCall.value = true;
				api.post('/user/reset/init', {
					email: email.value
				})
					.then(() => {
						success.value = true;
					})
					.catch((e) => {
						switch (e.response.data.info.code) {
						case 'US_001':
							incorrectEmail.value = 'notExist';
							break;
						case 'US_005':
							incorrectEmail.value = 'incorrectEmail';
							break;
						case 'US_020':
							incorrectEmail.value = false;
						}
					})
					.finally(() => {
						apiCall.value = false;
					});
			}
		};

		const onResetStart = () => {
			email.value = null;
			incorrectEmail.value = false;
		};

		const isToken = computed(() => route.params && route.params.token);

		const emailError = computed(() => {
			if (incorrectEmail.value === 'incorrectEmail')
				return capitalize(t('user.connection.incorrect', { key: t('user.connection.email') }));
			else if (incorrectEmail.value === 'notExist')
				return capitalize(t('user.connection.notExist', { key: t('user.connection.email') }));
			else
				return capitalize(t('user.connection.mandatory', { key: t('user.connection.email') }));
		});

		useMeta(() => {
			return meta({
				meta: {
					title: t('user.meta.reset.title'),
					description: t('user.meta.reset.description'),
					keywords: ['account', 'password', 'reset']
				},
				og: {
					url: 'https://sybyl.in/reset',
					title: t('user.meta.reset.title'),
					description: t('user.meta.reset.description'),
					image: 'https://sybyl.in/img/background.png'
				},
				twitter: {
					url: 'https://sybyl.in/reset',
					title: t('user.meta.reset.title'),
					description: t('user.meta.reset.description'),
					image: 'https://sybyl.in/img/background.png'
				}
			});
		});

		onMounted(() => {
			const removePasswordError = () => {
				if (incorrectPassword.value)
					incorrectPassword.value = false;
			};
			const removeEmailError = () => {
				if (incorrectEmail.value)
					incorrectEmail.value = false;
			};

			watch(password, removePasswordError);
			watch(repeatPassword, removePasswordError);
			watch(email, removeEmailError);
		});

		return {
			mobileScreen: 880,
			email,
			incorrectEmail,
			password,
			repeatPassword,
			incorrectPassword,
			togglePassword,
			toggleRepeatPassword,
			apiCall,
			success,
			error,
			onSubmit,
			onReset,
			onSubmitStart,
			onResetStart,
			isToken,
			emailError
		};
	}
});
</script>

<style scoped>
.height {
	min-height: calc(100vh - 5em);
}
</style>
