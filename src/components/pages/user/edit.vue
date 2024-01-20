<template>
	<q-spinner-cube
		v-if="!fullUser || !Object.keys(fullUser).length"
		color="primary" size="6em"
	/>
	<q-banner
		v-if="isModified"
		inline-actions :class="{
			'text-white': true,
			'bg-green': true,
			'partial': $q.screen.gt.sm,
			'full': !$q.screen.gt.sm
		}"
	>
		<span>{{ $capitalize($t('user.accountUpdate')) }}</span>
		<template v-slot:action>
			<q-btn
				flat round icon="close"
				@click="isModified = false"
			/>
		</template>
	</q-banner>
	<q-form
		class="q-gutter-md"
		@submit="onSubmit"
		@reset="onReset"
	>
		<div class="row">
			<q-input
				v-model="name"
				bottom-slots
				:maxlength="255"
				:label="$capitalize($t('user.connection.username'))"
				:class="size"
				:debounce="500"
				:error="incorrectName !== false"
				:error-message="nameErrorMessage"
				:rules="[val => !!val || $capitalize($t('user.connection.incorrect', { key: $t('user.connection.username') }))]"
			>
				<template v-slot:before>
					<q-icon name="badge" />
				</template>
			</q-input>
			<q-input
				v-model="email"
				bottom-slots
				type="email"
				:label="$capitalize($t('user.connection.email'))"
				:error="incorrectEmail"
				:error-message="$capitalize($t('user.connection.incorrect', { key: $t('user.connection.email') }))"
				:class="size"
				:debounce="500"
			>
				<template v-slot:before>
					<q-icon name="mail" />
				</template>
			</q-input>

			<q-card
				v-if="name && emailIsChanged"
				bordered
				flat
				:class="{
					partial: $q.screen.gt.sm,
					full: !$q.screen.gt.sm,
					transparent: true
				}"
			>
				<token-validation
					:is-include="false"
					:name="name"
					@complete="emailIsVerified"
				/>
			</q-card>

			<q-input
				v-model="oldPassword"
				bottom-slots
				:class="size"
				:label="$capitalize($t('user.connection.oldPassword'))"
				:error="incorrectOldPassword === true || incorrectOldPassword === 'incorrect'"
				:error-message="
					(incorrectOldPassword === 'incorrect')
						? $capitalize($t('user.connection.incorrect', { key: $t('user.connection.oldPassword') }))
						: $capitalize($t('user.connection.mandatory', { key: $t('user.connection.oldPassword') }))
				"
				:type="toggleNewPassword ? 'password' : 'text'"
				:disable="apiCall"
			>
				<template v-slot:before>
					<q-icon name="key" />
				</template>
				<template v-slot:append>
					<q-icon
						class="cursor-pointer"
						:disable="apiCall"
						:name="toggleNewPassword ? 'visibility_off' : 'visibility'"
						@click="toggleNewPassword = !toggleNewPassword"
					/>
				</template>
			</q-input>
			<q-input
				v-model="newPassword"
				bottom-slots
				:class="size"
				:label="$capitalize($t('user.connection.newPassword'))"
				:error="incorrectNewPassword"
				:error-message="passwordErrorMessage"
				:type="toggleRepeatNewPassword ? 'password' : 'text'"
				:disable="apiCall"
			>
				<template v-slot:before>
					<q-icon name="key" />
				</template>
				<template v-slot:append>
					<q-icon
						class="cursor-pointer"
						:disable="apiCall"
						:name="toggleRepeatNewPassword ? 'visibility_off' : 'visibility'"
						@click="toggleRepeatNewPassword = !toggleRepeatNewPassword"
					/>
				</template>
			</q-input>
			<components-pages-user-check-password
				v-model="notFormatedPassword"
				:password="newPassword"
				:class="size"
			/>
		</div>
		<div :class="size">
			<q-btn
				:label="$capitalize($t('user.update'))" type="submit"
				color="primary" size="md"
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
import { computed, defineComponent, ref, onMounted, PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import { api, xsrfName } from 'src/boot/axios';
import { capitalize } from 'src/boot/custom';
import tokenValidation from './tokenValidation.vue';
import componentsPagesUserCheckPassword from 'components/pages/user/checkPassword.vue';
import type { user } from 'src/types';

interface FullUser {
  name: string;
	email: string;
	role: 'USER' | 'MODERATOR' | 'ADMINISTRATOR',
  avatar: string | null;
  verify: boolean | null;
	creation_date: Date | null;
	modification_date: Date | null;
}

export default defineComponent({
	name: 'ComponentsPagesUserEdit',
	components: {
		tokenValidation,
		componentsPagesUserCheckPassword
	},
	props: {
		user: {
			type: Object as PropType<user>,
			required: true
		}
	},
	emits: {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		change: (_v: { name: string, email: string, verify: boolean | null }) => true
	},
	setup (_props, { emit }) {
		const $q = useQuasar();
		const { t } = useI18n();

		const isModified = ref<boolean>(false);
		const apiCall = ref<boolean>(false);
		const fullUser = ref<FullUser | null>(null);
		const name = ref<string | null>(null);
		const incorrectName = ref<boolean | 'forbidden'>(false);
		const email = ref<string | null>(null);
		const incorrectEmail = ref<boolean>(false);
		const emailIsChanged = ref<boolean>(false);
		const avatar = ref<string | null>(null);
		const size = computed(() => ({
			partial: $q.screen.gt.sm,
			full: !$q.screen.gt.sm,
			'q-pb-md': true,
			row: true,
			'justify-end': true
		}));

		const oldPassword = ref<string | null>(null);
		const newPassword = ref<string | null>(null);
		const incorrectOldPassword = ref<boolean | 'incorrect'>(false);
		const incorrectNewPassword = ref<boolean>(false);
		const toggleNewPassword = ref<boolean>(true);
		const toggleRepeatNewPassword = ref<boolean>(true);
		const notFormatedPassword = ref<boolean | null>(null);

		const nameErrorMessage = computed(() => {
			if (incorrectName.value === 'forbidden')
				return capitalize(t('user.forbiddenUsername'));
			return capitalize(t('user.connection.alreadyTaken', { key: t('user.connection.username') }));
		});

		const passwordError = computed(() => (notFormatedPassword.value === false || incorrectNewPassword.value === true));
		const passwordErrorMessage = computed(() => {
			if (notFormatedPassword.value === false)
				return capitalize(t('user.checkPassword.ko'));
			return capitalize(t('user.connection.mandatory', { key: t('user.connection.passwords') }));
		});

		const onSubmit = () => {
			isModified.value = false;
			incorrectName.value = false;
			incorrectEmail.value = false;
			incorrectOldPassword.value = false;
			incorrectNewPassword.value = false;

			if (!fullUser.value)
				return;
			if (!name.value || !name.value.length) {
				incorrectName.value = true;
				return;
			}
			if (!email.value || !email.value.length) {
				incorrectEmail.value = true;
				return;
			}
			if (
				(oldPassword.value && (!newPassword.value || !newPassword.value?.length)) ||
				(newPassword.value && (!oldPassword.value || !oldPassword.value?.length))
			) {
				incorrectOldPassword.value = true;
				incorrectNewPassword.value = true;
				return;
			}
			if (
				fullUser.value.name.localeCompare(name.value) === 0 &&
				fullUser.value.email.localeCompare(email.value) === 0 &&
				(!oldPassword.value || !oldPassword.value.length) &&
				(!newPassword.value || !newPassword.value.length)
			)
				return;
			api.put('/user', {
				name: name.value,
				email: email.value,
				oldPassword: oldPassword.value,
				newPassword: newPassword.value
			})
				.then((d) => {
					if (fullUser.value?.email.localeCompare(d.data.user.email) !== 0)
						emailIsChanged.value = true;
					fullUser.value = d.data.user;
					oldPassword.value = null;
					newPassword.value = null;
					localStorage.setItem(xsrfName, JSON.stringify(d.data[xsrfName]));
					emit('change', {
						name: (d.data.user as FullUser).name,
						email: (d.data.user as FullUser).email,
						verify: (d.data.user as FullUser).verify
					});
					isModified.value = true;
				})
				.catch((e) => {
					if (e.response.data.info.code === 'US_031')
						incorrectName.value = 'forbidden';
					if (e.response.data.info.code === 'US_002')
						incorrectOldPassword.value = 'incorrect';
					else if (e.response.data.info.code === 'US_005')
						incorrectEmail.value = true;
					else
						$q.notify({ type: 'error', message: e.response.data.info.message });
				});
		};

		const onReset = () => {
			if (fullUser.value) {
				incorrectName.value = false;
				incorrectEmail.value = false;
				incorrectOldPassword.value = false;
				incorrectNewPassword.value = false;
				name.value = fullUser.value.name;
				email.value = fullUser.value.email;
				avatar.value = fullUser.value.avatar;
				oldPassword.value = null;
				newPassword.value = null;
			}
		};

		const emailIsVerified = () => {
			if (fullUser.value) {
				emailIsChanged.value = false;
				fullUser.value.verify = true;
				emit('change', {
					name: fullUser.value.name,
					email: fullUser.value.email,
					verify: fullUser.value.verify
				});
			}
		};

		onMounted(() => {
			api.get('/user/all')
				.then((d) => {
					fullUser.value = d.data.user;
					name.value = d.data.user.name;
					email.value = d.data.user.email;
					avatar.value = d.data.user.avatar;
				})
				.catch((e) => {
					console.error(e);
				});
		});

		return {
			isModified,
			apiCall,
			fullUser,
			name,
			incorrectName,
			email,
			incorrectEmail,
			emailIsChanged,
			avatar,
			size,

			oldPassword,
			newPassword,
			incorrectOldPassword,
			incorrectNewPassword,
			toggleNewPassword,
			toggleRepeatNewPassword,
			notFormatedPassword,

			nameErrorMessage,
			passwordError,
			passwordErrorMessage,
			onSubmit,
			onReset,
			emailIsVerified
		};
	}
});
</script>

<style scoped>
.transparent {
	background-color: transparent;
}
.full {
	width: 100%;
}
.partial {
	width: 80%;
}
</style>
