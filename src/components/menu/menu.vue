<template>
	<div :class="(!$props.inDrawer) ? 'flex row' : 'flex column'">
		<template v-for="route in routes" :key="route.name">
			<div :class="($props.inDrawer) ? 'drawer-btn' : 'btn'">
				<q-btn
					square flat color="white"
					:label="$t(route.label)"
					:icon="route.icon"
					:class="($props.inDrawer) ? 'drawer-btn-content' : 'btn-content'"
					:to="{ path: $generatePath({ name: route.name }) }"
				/>
				<div
					v-if="$isInCurrentPath(route.name, $route.fullPath, route.isRoot)"
					:class="($props.inDrawer) ? 'right-line-if-selected' : 'bottom-line-if-selected'"
				>
				</div>
			</div>
		</template>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

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
		return {
			routes: [
				{ name: 'home', icon: 'home', label: 'menu.home', isRoot: true },
				{ name: 'series', icon: 'apps', label: 'menu.series' },
				{ name: 'account', icon: 'account_circle', label: 'user.account' }
			]
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
