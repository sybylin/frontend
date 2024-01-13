<template>
	<div
		:class="{
			flex: true,
			column: $props.inDrawer,
			row: !$props.inDrawer
		}"
	>
		<q-no-ssr>
			<template v-for="route in routes" :key="route.name">
				<div
					v-show="isShow(route)"
					:class="{
						'drawer-btn': $props.inDrawer,
						'btn': !$props.inDrawer
					}"
				>
					<q-btn
						v-if="route.name.localeCompare('user') === 0 && storeInstance.user !== null"
						square flat color="white"
						:label="storeInstance.user.name"
						:class="{
							'drawer-btn-content': $props.inDrawer,
							'btn-content': !$props.inDrawer
						}"
						:to="$generatePath({ name: route.name })"
					>
						<template v-slot:default>
							<q-img
								class="q-ml-sm avatar"
								:src="(storeInstance.user.avatar) ? `${baseURL}${storeInstance.user.avatar}` : '/imgs/background.jpg'"
							/>
						</template>
					</q-btn>
					<q-btn
						v-else
						square flat color="white"
						:label="$t(route.label)"
						:icon="route.icon"
						:class="{
							'drawer-btn-content': $props.inDrawer,
							'btn-content': !$props.inDrawer
						}"
						:to="$generatePath({ name: route.name })"
					/>
					<div
						v-if="$isInCurrentPath(route.name, $route.path, route.isRoot)"
						:class="{
							'right-line-if-selected': $props.inDrawer,
							'bottom-line-if-selected': !$props.inDrawer
						}"
					>
					</div>
				</div>
			</template>
		</q-no-ssr>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, watch } from 'vue';
import { globalStore } from 'src/stores/global';
import { baseURL } from 'src/boot/axios';
import { storeToRefs } from 'pinia';

interface routeList {
  name: string;
  icon: string;
  label: string;
	isRoot?: boolean;
	isConnected?: boolean;
	isModerator?: boolean;
}

export default defineComponent({
	name: 'MainMenu',
	props: {
		inDrawer: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	setup () {
		const storeInstance = globalStore();
		const store = storeToRefs(storeInstance);
		const routes = reactive<routeList[]>([
			{
				name: 'home',
				icon: 'home',
				label: 'menu.home',
				isRoot: true
			},
			{
				name: 'series',
				icon: 'apps',
				label: 'menu.series'
			},
			{
				name: 'selectSeries',
				icon: 'design_services',
				label: 'menu.create',
				isConnected: true
			},
			{
				name: 'dashboard',
				icon: 'dashboard',
				label: 'menu.dashboard',
				isConnected: true,
				isModerator: true
			},
			{
				name: 'user',
				icon: 'account_circle',
				label: 'user.account'
			}
		]);
		const userIndex = routes.findIndex((e) => e.name === 'user');

		const isShow = (route: routeList) => {
			if (route.isConnected) {
				if (route.isModerator)
					return storeInstance.isConnected && storeInstance.role !== 'user';
				return storeInstance.isConnected;
			}
			return true;
		};

		const updateUserRoute = (isConnected: boolean) => {
			routes[userIndex].name = (isConnected)
				? 'user'
				: 'login';
		};

		onMounted(() => {
			updateUserRoute(storeInstance.isConnected);
			watch(store.isConnected, (v) => updateUserRoute(v));
		});

		return {
			baseURL,
			storeInstance,
			routes,
			isShow,
			updateUserRoute
		};
	}
});
</script>

<style scoped>
.drawer-btn {
	width: auto;
	height: 48px;
	position: relative;
}
.btn {
	width: auto;
	height: auto;
	position: relative;
}

.btn-content {
	width: 100%;
	height: 100%;
}
.drawer-btn-content {
	width: 100%;
	height: 48px;
}

.right-line-if-selected {
	position: absolute;
	top: 0;
	right: 0;
	height: 100%;
	width: .2em;
	background-color: white;
}
.bottom-line-if-selected {
	position: absolute;
	bottom: 0;
	height: .2em;
	width: 100%;
	background-color: white;
}

.avatar {
	border-radius: 50%;
	width: 2.8em;
	height: 2.8em;
}
</style>
