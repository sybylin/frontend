<template>
	<q-layout view="hhh LpR fff">
		<header-layout />
		<q-page-container>
			<q-page>
				<router-view v-slot="{ Component }">
					<div class="page">
						<q-no-ssr
							v-if="isRequiresAuth || $route.meta.noSSR === true"
							placeholder="This part is rendered on client"
						>
							<component :is="Component" />
						</q-no-ssr>
						<component :is="Component" v-else />
					</div>
				</router-view>
			</q-page>
		</q-page-container>
		<footer-layout />
	</q-layout>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import HeaderLayout from '../components/layouts/header.vue';
import FooterLayout from '../components/layouts/footer.vue';

export default defineComponent({
	name: 'MainLayouts',
	components: {
		HeaderLayout,
		FooterLayout
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

		onMounted(() => {
			watch(route, (v) => {
				if (Object.keys(v.query).length && Object.prototype.hasOwnProperty.call(v.query, 'unauthorized')) {
					$q.notify({
						type: 'negative',
						icon: 'gpp_maybe',
						timeout: 5000,
						position: 'bottom-right',
						message: t('unauthorized')
					});
				}
			});
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
