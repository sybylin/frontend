<template>
	<h1>Enigma</h1>
	<div v-html="enigma.code"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { enigmas } from 'src/store';
import { useRoute } from 'vue-router';

export default defineComponent({
	name: 'EnigmaPages',
	setup () {
		const route = useRoute();
		const enigma = enigmas.find((e) => route.params.path === e.path);

		return {
			enigma
		};
	}
});
</script>
