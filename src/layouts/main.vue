<template>
	<q-layout view="hhh LpR fff">
		<header-layout />
		<q-page-container>
			<q-page>
				<router-view v-slot="{ Component }">
					<div class="page">
						<q-no-ssr v-if="isRequiresAuth || $route.meta.noSSR === true">
							<component :is="Component" />
							<template v-slot:placeholder>
								<div class="full-width row justify-center q-pt-xl">
									<q-spinner-cube size="6em" color="deep-purple-7" />
								</div>
							</template>
						</q-no-ssr>
						<component :is="Component" v-else />
					</div>
				</router-view>
			</q-page>
		</q-page-container>
		<footer-layout />
	</q-layout>
	<q-no-ssr>
		<gdpr />
		<captcha debug />
	</q-no-ssr>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import HeaderLayout from 'src/components/layouts/header.vue';
import FooterLayout from 'src/components/layouts/footer.vue';
import Gdpr from 'src/components/gdpr.vue';
import Captcha from 'src/components/captcha.vue';
import type { RouteLocationNormalizedLoaded } from 'vue-router';

export default defineComponent({
	name: 'MainLayouts',
	components: {
		HeaderLayout,
		FooterLayout,
		Gdpr,
		Captcha
	},
	setup () {
		const route = useRoute();
		const $q = useQuasar();
		const { t } = useI18n();

		const isRequiresAuth = computed(() => {
			if (!Object.values(route.meta).length)
				return false;
			return (route.meta.noSSR === true || route.meta.requiresAuth === true);
		});

		const printNotification = (route: RouteLocationNormalizedLoaded) => {
			if (Object.keys(route.query).length && Object.prototype.hasOwnProperty.call(route.query, 'unauthorized')) {
				$q.notify({
					type: 'negative',
					icon: 'gpp_maybe',
					timeout: 5000,
					position: 'bottom-right',
					message: t('unauthorized')
				});
			}
		};

		onMounted(() => {
			printNotification(route);

			watch(route, (v) => printNotification(v));
		});

		return {
			isRequiresAuth
		};
	}
});
</script>

<style scoped>
.page {
	min-height: inherit;
}
</style>
