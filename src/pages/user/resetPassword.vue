<template>
	<div class="row justify-center items-center q-pt-xl q-pb-xl height">
		<q-card
			class="q-pa-md"
			flat
			bordered
			:style="($q.screen.width > mobileScreen) ? 'width: 75%' : 'width: 90%'"
		>
			<with-token
				v-if="($route.params && $route.params.token)"
				:token="($route.params.token as string)"
			/>
			<without-token v-else />
		</q-card>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'quasar';
import meta from 'src/meta';
import withToken from './resetPassword/change.vue';
import withoutToken from './resetPassword/search.vue';

export default defineComponent({
	name: 'PagesResetPassword',
	components: {
		withToken,
		withoutToken
	},
	setup () {
		const { t } = useI18n();

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
		return {
			mobileScreen: 880
		};
	}
});
</script>

<style scoped>
.height {
	min-height: calc(100vh - 5em);
}
</style>
