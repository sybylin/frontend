<template>
	<div :class="(!$props.inDrawer) ? 'flex row' : 'flex column'">
		<template v-for="route in routes" :key="route.name">
			<div
				v-show="isShow(route)"
				:class="($props.inDrawer) ? 'drawer-btn' : 'btn'"
			>
				<q-btn
					square flat color="white"
					:label="$t(route.label)"
					:icon="route.icon"
					:class="($props.inDrawer) ? 'drawer-btn-content' : 'btn-content'"
					:to="{ path: $generatePath({ name: route.name }) }"
				/>
				<div
					v-if="$isInCurrentPath(route.name, $route.path, route.isRoot)"
					:class="($props.inDrawer) ? 'right-line-if-selected' : 'bottom-line-if-selected'"
				>
				</div>
			</div>
		</template>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { globalStore } from 'src/stores/global';

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
		const store = globalStore();

		const routes: routeList[] = [
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
		];

		const isShow = (route: routeList) => !route.wall || (route.wall && store.isConnected);

		return {
			routes,
			isShow
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
