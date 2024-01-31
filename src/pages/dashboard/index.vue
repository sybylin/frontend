<template>
	<div class="row no-wrap min-height">
		<div
			:class="{
				'col-2': $q.screen.gt.sm,
				'col-1': !$q.screen.gt.sm,
				'text-white': true,
				'bg-grey-2': true
			}"
		>
			<div class="column tabs">
				<div
					v-for="(tab, i) in tabs"
					:key="i"
					class="btn"
				>
					<div
						v-if="$isInCurrentPath(tab.to, $route.path, tab.root)"
						class="right-line-if-selected"
					>
					</div>
					<q-btn
						square flat color="white"
						:label="($q.screen.gt.sm) ? $t(`dashboard.${tab.name}.title`) : undefined"
						:icon="tab.icon"
						class="btn-content"
						:to="$generatePath({ name: tab.to })"
					/>
				</div>
			</div>
		</div>
		<div
			:class="{
				'q-pa-xs': true,
				'col-10': $q.screen.gt.sm,
				'col-11': !$q.screen.gt.sm
			}"
		>
			<router-view />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { globalStore } from 'src/stores/global';

export default defineComponent({
	name: 'PagesDashboard',
	setup () {
		const storeInstance = globalStore();
		const splitter = ref<number>(20);
		const selectTabs = ref<string>('main');
		const tabs: { name: string, icon: string, to: string, admin?: boolean, root?: boolean }[] = [
			{ name: 'main', icon: 'home', to: 'dashboard', root: true },
			{ name: 'users', icon: 'group', to: 'dashboardUsers', admin: true },
			{ name: 'report', icon: 'bug_report', to: 'dashboardReport', admin: true },
			{ name: 'series', icon: 'list_alt', to: 'dashboardSeries' }
		];

		return {
			storeInstance,
			splitter,
			selectTabs,
			tabs
		};
	}
});
</script>

<style scoped lang="scss">
.btn {
	width: auto;
	height: auto;
	position: relative;
}
.btn-content {
	width: 100%;
	min-height: 4.5em;
}
.right-line-if-selected {
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: .2em;
	background-color: $teal;
}
.min-height {
	min-height: inherit;
}
.tabs {
	height: fit-content;
	position: sticky;
	top: 0;
}
</style>
