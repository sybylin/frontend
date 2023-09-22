<template>
	<components-builder-main />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ComponentsBuilderMain from 'components/builder/main.vue';

export default defineComponent({
	name: 'PageBuilder',
	components: {
		ComponentsBuilderMain
	}
});
</script>
