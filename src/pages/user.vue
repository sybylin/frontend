<template>
	<div class="column justify-center align-center full-width height">
		<div class="row full-width justify-center">
			<component-connection-connect
				:style="($q.screen.width > mobileScreen) ? 'width: 75%' : 'width: 90%'"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ComponentConnectionConnect from 'components/connection/connect.vue';

export default defineComponent({
	name: 'UserPage',
	components: {
		ComponentConnectionConnect
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
