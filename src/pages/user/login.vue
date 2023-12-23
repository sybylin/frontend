<template>
	<div class="column justify-center align-center full-width q-pt-xl q-pb-xl height">
		<div class="row full-width justify-center">
			<q-card
				v-if="$route.query.redirect"
				class="q-pa-md q-mb-md text-center bg-red-7 text-white"
				flat
				bordered
				:style="($q.screen.width > mobileScreen) ? 'width: 75%' : 'width: 90%'"
			>
				<span class="text-h6 orkney-regular">
					{{ $capitalize($t('error.unauthorized.redirect')) }}
				</span>
			</q-card>
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
						:disable="apiCall"
						:label="$capitalize($t('user.connection.username'))"
						:error="incorrectName"
						:error-message="(incorrectName)
							? $capitalize($t('user.connection.notExist', { key: $t('user.connection.username') }))
							: undefined
						"
						:rules="[val => !incorrectName && val && val.length > 0 || $capitalize($t('user.connection.mandatoryBefore', { key: $t('user.connection.username') }))]"
					/>
					<q-input
						v-model="password"
						bottom-slots
						:type="togglePassword ? 'password' : 'text'"
						:disable="apiCall"
						:label="$capitalize($t('user.connection.password'))"
						:error="incorrectPassword"
						:error-message="(incorrectPassword)
							? $capitalize($t('user.connection.incorrect', { key: $t('user.connection.password') }))
							: undefined
						"
						:rules="[val => !incorrectPassword && val && val.length > 0 || $capitalize($t('user.connection.mandatoryBefore', { key: $t('user.connection.password') }))]"
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
					<q-toggle
						v-model="remember"
						:label="$capitalize($t('user.connection.rememberMe'))"
					/>
					<div class="row justify-end">
						<q-btn
							:label="$capitalize($t('user.connection.step.1.submit'))" type="submit"
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
				<q-separator class="q-mt-lg q-mb-lg" />
				<div class="row justify-center">
					<q-btn
						:label="$capitalize($t('user.connection.redirectBtn.create'))"
						color="green-7" icon="person_add"
						:to="$generatePath({ name: 'creation' })"
					/>
				</div>
				<div class="row justify-center q-mt-lg">
					<q-btn
						:label="$capitalize($t('user.connection.forgot'))" type="submit"
						color="warning" icon="no_accounts"
						:to="$generatePath({ name: 'resetPassword' })"
					/>
				</div>
			</q-card>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'quasar';
import meta from 'src/meta';
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
		const route = useRoute();
		const { t } = useI18n();

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
							if (route.query.redirect)
								await router.push({ path: route.query.redirect as string });
							else
								await router.push(generatePath({ name: 'user' }, store.lang));
							apiCall.value = false;
						} catch {
							//
						}
					})
					.catch((e) => {
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

		useMeta(() => {
			return meta({
				meta: {
					title: t('user.meta.login.title'),
					description: t('user.meta.login.description'),
					keywords: ['Sibyllin', 'user', 'login']
				},
				og: {
					url: 'https://sibyllin.app/user/login',
					title: t('user.meta.login.title'),
					description: t('user.meta.login.description'),
					image: 'https://sibyllin.app/img/background.png'
				},
				twitter: {
					url: 'https://sibyllin.app/user/login',
					title: t('user.meta.login.title'),
					description: t('user.meta.login.description'),
					image: 'https://sibyllin.app/img/background.png'
				}
			});
		});

		onMounted(() => {
			watch(name, () => {
				if (incorrectName.value)
					incorrectName.value = false;
			});
			watch(password, () => {
				if (incorrectPassword.value)
					incorrectPassword.value = false;
			});
		});

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
	min-height: calc(100vh - 5em);
}
</style>
