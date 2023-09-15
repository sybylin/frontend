<template>
	<q-no-ssr>
		<div :class="(!$props.inDrawer) ? 'flex row' : 'flex column'">
			<template v-for="route in routes" :key="route.name">
				<div
					v-show="!route.wall || (route.wall && storeInstance.isConnected)"
					:class="($props.inDrawer) ? 'drawer-btn' : 'btn'"
				>
					<q-btn
						square flat color="white"
						:label="$t(route.label)"
						:icon="route.icon"
						:class="($props.inDrawer) ? 'drawer-btn-content' : 'btn-content'"
						:to="$generatePath({ name: route.name })"
					/>
					<div
						v-if="$isInCurrentPath(route.name, $route.path, route.isRoot)"
						:class="($props.inDrawer) ? 'right-line-if-selected' : 'bottom-line-if-selected'"
					>
					</div>
				</div>
			</template>
		</div>
	</q-no-ssr>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, watch } from 'vue';
import { globalStore } from 'src/stores/global';
import { storeToRefs } from 'pinia';

interface routeList {
  name: string;
  icon: string;
  label: string;
  isRoot?: boolean;
  wall?: boolean;
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
				label: 'menu.series',
				wall: true
			},
			{
				name: 'user',
				icon: 'account_circle',
				label: 'user.account'
			}
		]);

		onMounted(() => {
			watch(store.isConnected, (v) => {
				routes[2].name = (v)
					? 'user'
					: 'login';
			});
		});

		return {
			storeInstance,
			routes
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
</style>
