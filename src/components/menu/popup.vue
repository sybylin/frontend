<template>
	<q-btn
		square flat color="white"
		:label="$capitalize($t('menu.options'))" icon="settings"
	>
		<q-popup-proxy class="popup" :offset="[-10, 10]">
			<q-card
				square flat :class="{
					card: true,
					'card-mobile': $q.platform.is.mobile,
					'card-mobile--dark': $q.platform.is.mobile && $q.dark.isActive
				}"
			>
				<lang />
				<div class="row no-wrap justify-between items-center">
					<span>{{ $capitalize($t('menu.dark')) }}</span>
					<dark-mode class="q-pt-xs" />
				</div>
				<q-btn
					class="full-width"
					outline
					:color="($q.dark.isActive) ? 'white' : 'grey-10'"
					:label="$t('main.gdpr')"
					icon="cookie"
					@click="gdpr"
				/>
			</q-card>
		</q-popup-proxy>
	</q-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import darkMode from './darkMode.vue';
import lang from './lang.vue';

export default defineComponent({
	name: 'Popup',
	components: {
		darkMode,
		lang
	},
	setup () {
		return {
			gdpr: () => {
				document.dispatchEvent(
					new CustomEvent('gdpr', {
						bubbles: true,
						cancelable: false
					})
				);
			}
		};
	}
});
</script>

<style scoped lang="scss">
.popup {
	box-shadow: none;
}
.card {
	padding: 1em;
	background-color: rgba(0,0,0,.1);
}
.card-mobile {
	background-color: white;
}
.card-mobile--dark {
	background-color: var(--q-dark-page);
}
</style>
