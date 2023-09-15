<template>
	<q-no-ssr>
		<q-header
			class="bg-light-blue-9 text-white row items-center justify-between"
			height-hint="98"
		>
			<div class="titlebar">
				<router-link to="/" aria-label="Go to home page">
					<img
						src="/imgs/icon.png"
						alt="Logo of Sibyllin"
						width="60"
						height="60"
					/>
				</router-link>
				<template v-if="$q.screen.width > mobileScreen">
					<menu-vue />
					<div class="flex">
						<logout-vue />
						<q-separator color="white" vertical class="q-mb-sm q-mt-sm" />
						<popup />
					</div>
				</template>
				<template v-else>
					<q-btn
						dense flat
						size="lg" icon="menu"
						aria-label="Menu"
						@click="toggleDrawer"
					/>
				</template>
			</div>
		</q-header>
		<q-drawer
			v-if="$q.screen.width <= mobileScreen"
			v-model="openDrawer"
			class="bg-light-blue-9 text-white column no-wrap lt-md"
			side="right"
		>
			<menu-vue :in-drawer="true" />
			<q-separator v-if="store.isConnected" color="white" inset class="q-mb-sm q-mt-sm" />
			<logout-vue :in-drawer="true" />
			<q-separator color="white" inset class="q-mb-sm q-mt-sm" />
			<popup class="btn" />
		</q-drawer>
	</q-no-ssr>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { globalStore } from 'src/stores/global';
import logoutVue from '../menu/logout.vue';
import menuVue from '../menu/menu.vue';
import popup from '../menu/popup.vue';

export default defineComponent({
	name: 'LayoutHeader',
	components: {
		logoutVue,
		menuVue,
		popup
	},
	setup () {
		const store = globalStore();
		const openDrawer = ref(false);
		const mobileScreen = 880;

		const toggleDrawer = () => { openDrawer.value = !openDrawer.value; };

		return {
			store,
			openDrawer,
			mobileScreen,
			toggleDrawer
		};
	}
});
</script>

<style scoped>
.titlebar {
	width: 100vw;
	height: 5em;
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
}
.titlebar img {
	margin: .4em;
}
.flex {
	display: inherit;
}
.btn {
	height: 48px;
}
</style>
