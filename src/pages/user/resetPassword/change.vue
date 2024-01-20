<template>
	<div class="row full-width justify-center q-pb-md">
		<span class="text-h6">{{ $capitalize($t('user.connection.reset.newPassword')) }}</span>
	</div>

	<div v-if="success" class="row full-width justify-center q-pb-md">
		<q-banner class="full-width text-white bg-green-7 q-mt-md">
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

	<div
		v-if="error === 'resetTokenIsInvalid' || error === 'updateError'"
		class="row full-width justify-center q-pb-md"
	>
		<q-banner class="full-width bg-red-7 text-white q-mt-md text-center">
			<span>{{ (error === 'resetTokenIsInvalid')
				? $capitalize($t('user.invalidToken'))
				: $capitalize($t('error.api.db'))
			}}</span>
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
			:disable="apiCall"
			:type="togglePassword ? 'password' : 'text'"
			:error="isUserError"
			:error-message="isErrorMessage"
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
			v-model="checkIfPasswordIsWellFormated"
			:password="password"
		/>
		<q-input
			v-model="repeatPassword"
			bottom-slots
			:label="$capitalize($t('user.connection.newPasswordRepeat'))"
			:disable="apiCall"
			:type="toggleRepeatPassword ? 'password' : 'text'"
			:error="isUserError"
			:error-message="isErrorMessage"
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

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { api } from 'src/boot/axios';
import { capitalize } from 'src/boot/custom';
import componentsPagesUserCheckPassword from 'src/components/pages/user/checkPassword.vue';

type error = null | 'notTheSame' | 'resetTokenIsInvalid' | 'differentPassword' | 'updateError' | 'malformed';

export default defineComponent({
	name: 'PagesUserResetPasswordChange',
	components: {
		componentsPagesUserCheckPassword
	},
	props: {
		token: {
			type: String,
			required: true
		}
	},
	setup () {
		const { t } = useI18n();
		const route = useRoute();

		const apiCall = ref<boolean>(false);
		const password = ref<string | null>(null);
		const repeatPassword = ref<string | null>(null);
		const togglePassword = ref<boolean>(true);
		const toggleRepeatPassword = ref<boolean>(true);
		const checkIfPasswordIsWellFormated = ref<boolean | null>(null);

		const error = ref<error>(null);
		const success = ref<boolean>(false);

		const isUserError = computed(() => !(
			error.value === null ||
			error.value === 'resetTokenIsInvalid' ||
			error.value === 'updateError'
		));

		const isErrorMessage = computed(() => {
			if (isUserError.value) {
				switch (error.value) {
				case 'differentPassword':
					return capitalize(t('user.connection.different', { key: t('user.connection.passwords') }));
				case 'notTheSame':
					return capitalize(t('user.connection.different', { key: t('user.connection.passwords') }));
				case 'malformed':
					return capitalize(t('user.checkPassword.ko'));
				}
			}
			return undefined;
		});

		const onSubmit = () => {
			if (!password.value || !repeatPassword.value)
				return;
			if (password.value.localeCompare(repeatPassword.value) !== 0) {
				error.value = 'notTheSame';
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
					else if (e.response.data.info.code) {
						switch (e.response.data.info.code) {
						case 'GE_001':
							error.value = 'updateError';
							break;
						case 'US_012':
						default:
							error.value = 'malformed';
						}
					} else
						error.value = null;
				})
				.finally(() => {
					apiCall.value = false;
				});
		};

		const onReset = () => {
			password.value = null;
			repeatPassword.value = null;
			error.value = null;
			checkIfPasswordIsWellFormated.value = null;
		};

		return {
			apiCall,
			password,
			repeatPassword,
			togglePassword,
			toggleRepeatPassword,
			checkIfPasswordIsWellFormated,
			error,
			success,

			isUserError,
			isErrorMessage,

			onSubmit,
			onReset
		};
	}
});
</script>
