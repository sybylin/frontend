<template>
	<q-footer class="bg-grey text-white">
		<div class="q-pa-xl">
			<div class="row justify-between">
				<div class="col-md-6 col-sm-4 col-12 q-pa-sm">
					<span class="text-h3 orkney-medium">{{ $t('catch') }}</span>
					<lang is-dark />
					<div class="row no-wrap items-center">
						<span>{{ $t('menu.dark') }}</span>
						<dark-mode />
					</div>
				</div>
				<div class="col-md-6 col-sm-6 col-12 row justify-end">
					<div class="column q-mb-md q-pa-xs footer-list width">
						<span class="text-light-blue-4 text-h6 light">{{ $t('menu.title') }}</span>
						<router-link :to="$generatePath({ name: 'home' })">
							<span>{{ $t('menu.home') }}</span>
						</router-link>
						<router-link :to="$generatePath({ name: 'series' })">
							<span>{{ $t('menu.series') }}</span>
						</router-link>
						<a href="https://discord.gg/PMEFsW3ac9" target="_blank">
							{{ $t('menu.discord') }}
						</a>
						<a href="https://github.com/mapcraft-app" target="_blank">
							{{ $t('menu.github') }}
						</a>
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
						<img src="/imgs/icon.png" width="150" alt="Logo of Sybillin" />
						<span class="q-pl-sm text-h4 orkney-light">{{ $t('title') }}</span>
					</div>
				</router-link>
				<div class="q-pa-xs">
					<q-btn
						label="tutu"
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

import lang from '../menu/lang.vue';
import darkMode from '../menu/darkMode.vue';

export default defineComponent({
	name: 'LayoutsFooter',
	components: {
		lang,
		darkMode
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

.light {
	font-weight: inherit;
	min-width: 10em;
}
.width {
	width: min-content;
}
</style>
