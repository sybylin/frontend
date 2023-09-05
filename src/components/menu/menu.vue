<template>
	<q-tabs
		align="right"
		outside-arrows
		inline-label
		:vertical="inDrawer"
		:class="height"
	>
		<q-route-tab :to="{ path: $generatePath({ name: 'home' }) }" :label="$t('menu.home')" />
		<q-route-tab :to="{ path: $generatePath({ name: 'series' }) }" :label="$t('menu.series')" />
		<q-route-tab
			href="https://discord.gg/PMEFsW3ac9"
			target="_blank"
			:label="$t('menu.discord')"
			icon="img:/imgs/svg/discord.svg"
			class="invert-color"
		/>
		<q-route-tab
			href="https://github.com/mapcraft-app"
			target="_blank"
			:label="$t('menu.github')"
			icon="img:/imgs/svg/github.svg"
			class="invert-color"
		/>
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
