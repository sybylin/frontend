<template>
	<q-layout view="hhh LpR fff">
		<header-layout />
		<q-page-container>
			<q-page>
				<router-view v-slot="{ Component }">
					<transition
						enter-active-class="animated fadeIn"
						leave-active-class="animated fadeOut"
					>
						<div>
							<template v-if="isRequiresAuth">
								<q-no-ssr>
									<component :is="Component" />
								</q-no-ssr>
							</template>
							<template v-else>
								<component :is="Component" />
							</template>
						</div>
					</transition>
				</router-view>
			</q-page>
		</q-page-container>
		<footer-layout />
	</q-layout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useRoute } from 'vue-router';
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
		const isRequiresAuth = computed(() => {
			if (!Object.values(route.meta).length)
				return false;
			return (route.meta.noSSR === true || route.meta.requiresAuth === true);
		});

		return {
			isRequiresAuth
		};
	}
});
</script>
