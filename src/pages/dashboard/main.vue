<template>
	<h5>Hello world</h5>
	<h6>{{ hello }}</h6>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'PagesDashboard',
	setup () {
		return {
			hello: 'world'
		};
	}
});
</script>
