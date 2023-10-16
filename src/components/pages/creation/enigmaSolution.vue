<template>
	<span>{{ toto }}</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'ComponentsPagesCreationEnigmaSolution',
	setup () {
		return {
			toto: 'tutu'
		};
	}
});
</script>
