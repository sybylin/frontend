<template>
	<q-form
		class="q-gutter-md"
		@submit="onSubmit"
		@reset="onReset"
	>
		<q-input
			v-model="name"
			bottom-slots
			:label="$capitalize($t('user.connection.username'))"
			:error-message="$capitalize($t('user.connection.notExist', { key: $t('user.connection.username') }))"
			:error="incorrectName"
			:disable="apiCall"
			lazy-rules
			:rules="[val => val && val.length > 0 || $capitalize($t('user.connection.mandatory', { key: $t('user.connection.username') }))]"
		/>
		<q-input
			v-model="password"
			bottom-slots
			:type="togglePassword ? 'password' : 'text'"
			:label="$capitalize($t('user.connection.password'))"
			:error-message="$capitalize($t('user.connection.incorrect', { key: $t('user.connection.password') }))"
			:error="incorrectPassword"
			:disable="apiCall"
			lazy-rules
			:rules="[val => val && val.length > 0 || $capitalize($t('user.connection.mandatory', { key: $t('user.connection.password') }))]"
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
		<q-toggle v-model="remember" label="Remember me for 7 days" />
		<div class="row justify-end">
			<q-btn
				label="Submit" type="submit"
				color="primary" size="md"
				:loading="apiCall"
			/>
			<q-btn
				label="Reset" type="reset"
				color="primary" flat class="q-ml-sm"
				:disable="apiCall"
			/>
		</div>
	</q-form>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { api } from 'src/boot/axios';

export default defineComponent({
	name: 'ComponentsConnectionConnect',
	setup () {
		const xsrfName = 'x-xsrf-token';

		const name = ref<string | null>(null);
		const incorrectName = ref<boolean>(false);
		const password = ref<string | null>(null);
		const incorrectPassword = ref<boolean>(false);
		const remember = ref<boolean>(false);
		const togglePassword = ref<boolean>(true);
		const apiCall = ref<boolean>(false);

		const onSubmit = () => {
			if (name.value && password.value) {
				incorrectName.value = false;
				incorrectPassword.value = false;
				apiCall.value = true;
				api.post('/user/check', {
					name: name.value,
					password: password.value,
					remember: remember.value
				}, {
					withCredentials: true
				})
					.then((d) => d.data)
					.then((d) => {
						if (d.userNotExist) {
							incorrectName.value = true;
							return;
						}
						if (d.incorrectPassword) {
							incorrectPassword.value = true;
							return;
						}
						localStorage.setItem(xsrfName, JSON.stringify(d[xsrfName]));
						console.log('connected');
					})
					.catch((e) => {
						console.error(e);
					})
					.finally(() => {
						apiCall.value = false;
					});
			}
		};

		onMounted(() => {
			const xsrfToken: string | null = localStorage.getItem(xsrfName);
			if (!xsrfToken)
				return;
			api.get('/user/check', {
				withCredentials: true,
				headers: {
					'x-xsrf-token': JSON.parse(xsrfToken)
				}
			})
				.then((d) => d.data)
				.then((d) => {
					console.log('one', d);
				})
				.catch((e) => console.error(e));
		});

		const onReset = () => {
			incorrectName.value = false;
			incorrectPassword.value = false;
			name.value = null;
			password.value = null;
		};

		/*
		onMounted(() => {
			api.get('/user/check', { withCredentials: true })
				.then((d) => d.data)
				.then((d) => console.log('one', d))
				.catch((e) => console.error(e));
		});
		*/

		return {
			name,
			incorrectName,
			password,
			incorrectPassword,
			remember,
			togglePassword,
			apiCall,

			onSubmit,
			onReset
		};
	}
});
</script>
