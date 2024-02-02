<template>
	<q-footer class="bg-grey text-white">
		<div class="q-pa-xl">
			<div class="row justify-between">
				<div class="col-md-6 col-sm-4 col-12 q-pa-sm">
					<span class="text-h3 orkney-medium">{{ $t('title') }}</span>
					<lang is-dark />
					<div class="q-mt-sm row no-wrap items-center">
						<span class="q-pr-sm">{{ $t('menu.dark') }}</span>
						<dark-mode />
					</div>
				</div>
				<div class="col-md-6 col-sm-6 col-12 row justify-end">
					<div class="column q-mb-md q-pa-xs footer-list width">
						<span class="text-light-blue-4 text-h6 light">{{ $t('menu.title') }}</span>
						<router-link :to="$generatePath({ name: 'home' })">
							<span>{{ $t('menu.home') }}</span>
						</router-link>
						<q-no-ssr class="column q-mb-md footer-list no-ssr">
							<router-link
								v-if="storeInstance.isConnected"
								:to="$generatePath({ name: 'selectSeries' })"
							>
								<span>{{ $t('menu.create') }}</span>
							</router-link>
							<router-link
								v-if="storeInstance.isConnected && storeInstance.role !== 'user'"
								:to="$generatePath({ name: 'dashboard' })"
							>
								<span>{{ $t('menu.dashboard') }}</span>
							</router-link>
						</q-no-ssr>
						<router-link :to="$generatePath({ name: 'series' })">
							<span>{{ $t('menu.series') }}</span>
						</router-link>
						<router-link :to="(storeInstance.isConnected) ? $generatePath({ name: 'user' }) : $generatePath({ name: 'login' })">
							<span>{{ $capitalize($t('user.account')) }}</span>
						</router-link>
						<router-link :to="$generatePath({ name: 'report' })">
							<span>{{ $capitalize($t('error.report.title')) }}</span>
						</router-link>
					</div>
				</div>
			</div>
			<q-separator color="light-blue-8" class="q-mt-md q-mb-md" />
			<div class="row justify-between items-center q-pl-md q-pr-md">
				<router-link
					:to="$generatePath({ name: 'home' })"
					class="neutral"
					aria-label="Go to home page"
				>
					<div class="flex items-center q-pa-xs">
						<img
							:src="`${themeInstance.linkToSnakeIcon}favicon-128x128.png`"
							alt="Logo of sybyl.in"
						/>
						<span class="q-pl-sm text-h4 orkney-light">{{ $t('title') }}</span>
					</div>
				</router-link>
				<div class="q-pa-xs">
					<q-btn
						:label="$capitalize($t('menu.series'))"
						:to="$generatePath({ name: 'series' })"
						color="light-blue-9"
						unelevated
						rounded
						size="md"
					/>
				</div>
			</div>
		</div>
	</q-footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { globalStore } from 'src/stores/global';
import { themeStore } from 'src/stores/theme';
import lang from '../menu/lang.vue';
import darkMode from '../menu/darkMode.vue';

export default defineComponent({
	name: 'LayoutsFooter',
	components: {
		lang,
		darkMode
	},
	setup () {
		const storeInstance = globalStore();
		const themeInstance = themeStore();

		return {
			storeInstance,
			themeInstance
		};
	}
});
</script>

<style scoped>
.neutral,
.neutral:hover,
.neutral:focus,
.neutral:active {
	text-decoration: none;
	color: inherit;
}
.no-ssr {
	margin-top: 0;
  margin-bottom: 0;
}
.light {
	font-weight: inherit;
	min-width: 10em;
}
.width {
	width: min-content;
}
</style>
