<template>
	<h1>UserMain</h1>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'PageUserMain',
	components: {
	},
	setup () {
		return {
			mobileScreen: 880
		};
	}
});
</script>

<style scoped>
.height {
	height: calc(100vh - 5em);
}
</style>
