<template>
	<div class="column justify-center align-center full-width q-pt-xl q-pb-xl height">
		<div class="row full-width justify-center">
			<q-card
				class="q-pa-md"
				flat
				bordered
				:style="($q.screen.width > mobileScreen) ? 'width: 75%' : 'width: 90%'"
			>
				<template v-if="isVerify === null">
					<div class="full-width column justify-center items-center">
						<q-spinner-cube size="8em" color="primary" />
					</div>
				</template>
				<template v-else-if="isVerify === true">
					<div class="full-width column justify-center items-center">
						<h6>
							{{ $capitalize($t('user.verify')) }}
						</h6>
					</div>
					<q-separator />
					<div class="row full-width justify-center q-mt-md">
						<q-btn
							color="secondary"
							:label="$t('create.main.serie.return')"
							icon="arrow_back"
							@click="$router.back()"
						/>
					</div>
				</template>
				<components-pages-user-token-validation
					v-else
					:name="accountName"
					@complete="redirectIfValidate"
				/>
			</q-card>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';
import ComponentsPagesUserTokenValidation from 'components/pages/user/tokenValidation.vue';

export default defineComponent({
	name: 'PagesUserVerify',
	components: {
		ComponentsPagesUserTokenValidation
	},
	setup () {
		const router = useRouter();
		const isVerify = ref<boolean | null>(null);
		const accountName = ref<string | null>(null);

		const redirectIfValidate = () => router.push({ name: 'user' });

		onBeforeMount(() => {
			api.get('/user')
				.then((d) => d.data.user)
				.then((user) => {
					accountName.value = user.name;
					isVerify.value = user.verify;
				})
				.catch(() => {
					router.push({ name: 'user' });
				});

			watch(isVerify, (iV) => {
				if (iV === false) {
					try {
						api.post('/user/token', {
							name: accountName.value
						});
					} catch {
						///
					}
				}
			});
		});

		return {
			mobileScreen: 880,
			isVerify,
			accountName,
			redirectIfValidate
		};
	}
});
</script>

<style scoped>
.height {
	min-height: calc(100vh - 5em);
}
</style>
