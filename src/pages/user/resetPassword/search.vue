<template>
	<div class="row full-width justify-center q-pb-md">
		<span class="text-h6">{{ $capitalize($t('user.connection.reset.start')) }}</span>
		<q-banner v-if="success" class="full-width bg-primary text-white bg-green-7 q-mt-md">
			<span>{{ $capitalize($t('user.connection.reset.startBanner')) }}</span>
		</q-banner>
	</div>

	<q-form
		class="q-gutter-md"
		@submit="onSubmit"
		@reset="onReset"
	>
		<q-input
			v-model="email"
			type="email"
			bottom-slots
			:label="$capitalize($t('user.connection.email'))"
			:error="isError"
			:error-message="isErrorMessage"
			:disable="apiCall"
		/>
		<div class="row justify-end">
			<q-btn
				:label="$capitalize($t('user.connection.step.1.submit'))" type="submit"
				color="primary" size="md"
				:disable="!email || !isEmail(email)"
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

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import isEmail from 'validator/lib/isEmail';
import { api } from 'src/boot/axios';
import { capitalize } from 'src/boot/custom';

export default defineComponent({
	name: 'PagesUserResetPassowrdSearch',
	setup () {
		const { t } = useI18n();

		const apiCall = ref<boolean>(false);
		const email = ref<string | null>(null);
		const error = ref<null | 'incorrect' | 'notExist' | false>(null);
		const success = ref<boolean>(false);

		const isError = computed(() => error.value !== null);
		const isErrorMessage = computed(() => {
			if (error.value === 'incorrect')
				return capitalize(t('user.connection.incorrect', { key: t('user.connection.email') }));
			if (error.value === 'notExist')
				return capitalize(t('user.connection.notExist', { key: t('user.connection.email') }));
			if (error.value === false)
				return capitalize(t('user.connection.mandatory', { key: t('user.connection.email') }));
			return undefined;
		});

		const onSubmit = () => {
			if (!email.value)
				return;
			if (!isEmail(email.value)) {
				error.value = 'incorrect';
				return;
			}
			error.value = null;
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
						error.value = 'notExist';
						break;
					case 'US_005':
						error.value = 'incorrect';
						break;
					case 'US_020':
						error.value = false;
					}
				})
				.finally(() => {
					apiCall.value = false;
				});
		};

		const onReset = () => {
			email.value = null;
			error.value = null;
		};

		return {
			apiCall,
			email,
			error,
			success,

			isError,
			isErrorMessage,

			isEmail,
			onSubmit,
			onReset
		};
	}
});
</script>
