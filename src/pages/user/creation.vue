<template>
	<h1>UserCreation</h1>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// :style="($q.screen.width > mobileScreen) ? 'width: 75%' : 'width: 90%'"

export default defineComponent({
	name: 'PageUserCreation',
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
