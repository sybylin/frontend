<template>
	<q-btn square flat color="white" label="Options" icon="settings">
		<q-popup-proxy style="box-shadow: none" :offset="[-10, 10]">
			<q-card square flat class="card">
				<lang />
				<div class="row no-wrap justify-between items-center">
					<span>{{ $t('menu.dark') }}</span>
					<dark-mode />
				</div>
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
	}
});
</script>

<style scoped>
.popup {
	box-shadow: none;
}
.card {
	padding: 1em;
	background-color: rgba(0,0,0,.1);
}
</style>
