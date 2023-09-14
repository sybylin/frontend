<template>
	<div class="column justify-center align-center full-width height">
		<div class="row full-width justify-center">
			<q-card
				class="q-pa-md"
				flat
				bordered
				:style="($q.screen.width > mobileScreen) ? 'width: 75%' : 'width: 90%'"
			>
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
				<q-separator class="q-mt-lg q-mb-lg" />
				<div class="row justify-center">
					<q-btn
						:label="$capitalize($t('user.connection.redirectBtn.create'))"
						color="warning" icon="person_add"
						:to="{ path: $generatePath({ name: 'creation' }) }"
					/>
				</div>
			</q-card>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { api, xsrfName } from 'src/boot/axios';
import { generatePath } from 'src/boot/route';
import { globalStore } from 'src/stores/global';

export default defineComponent({
	name: 'PageUserLogin',
	components: {
	},
	setup () {
		const store = globalStore();
		const router = useRouter();
		const { locale } = useI18n();

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
				})
					.then((d) => d.data)
					.then(async (d) => {
						try {
							localStorage.setItem(xsrfName, JSON.stringify(d[xsrfName]));
							store.setIsConnected(true);
							await router.push({ path: generatePath({ name: 'user' }, locale) });
							apiCall.value = false;
						} catch (e) {
							console.error('router push to user failed');
						}
					})
					.catch((e) => {
						console.error('/user/check failed');
						if (e.response.data.userNotExist)
							incorrectName.value = true;
						if (e.response.data.incorrectPassword)
							incorrectPassword.value = true;
						apiCall.value = false;
					});
			}
		};

		const onReset = () => {
			incorrectName.value = false;
			incorrectPassword.value = false;
			name.value = null;
			password.value = null;
		};

		return {
			mobileScreen: 880,
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

<style scoped>
.height {
	height: calc(100vh - 5em);
}
</style>
