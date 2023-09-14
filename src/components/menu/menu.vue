<template>
	<q-tabs
		align="right"
		outside-arrows
		inline-label
		:vertical="inDrawer"
		:class="height"
	>
		<q-route-tab :to="{ path: $generatePath({ name: 'home' }) }" :label="$t('menu.home')" icon="home" exact />
		<q-route-tab :to="{ path: $generatePath({ name: 'series' }) }" :label="$t('menu.series')" icon="apps" exact />
		<q-route-tab :to="{ path: $generatePath({ name: 'user' }) }" :label="$t('user.account')" icon="account_circle" />
	</q-tabs>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
	name: 'MainMenu',
	props: {
		inDrawer: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	setup (props) {
		return {
			height: computed(() => {
				if (props.inDrawer)
					return 'text-white menu-tab-height';
				return 'text-white';
			})
		};
	}
});
</script>

<style>
.menu-tab-height {
	height: fit-content;
}
.invert-color img {
	filter: invert(1);
}
</style>
