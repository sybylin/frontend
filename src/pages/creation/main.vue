<template>
	<components-pages-creation-select-serie v-if="tab === 'series'" />
	<h4 v-else>
		else
	</h4>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import ComponentsPagesCreationSelectSerie from 'components/pages/creation/selectSerie.vue';

export default defineComponent({
	name: 'PagesCreationMain',
	components: {
		ComponentsPagesCreationSelectSerie
	},
	setup () {
		const tab = ref<'series' | 'enigmas'>('series');

		return {
			tab
		};
	}
});
</script>

<style scoped>
.card {
	width: 24em;
	height: 24em;
}
.add {
	border: .35em dashed rgba(0, 0, 0, 0.12);
	color: rgba(0, 0, 0, 0.12);
	cursor: pointer;
	transition: color .4s, border-color .4s;
}
.add:hover {
	border-color: rgba(0, 0, 0, 0.75);
	color: rgba(0, 0, 0, 0.75);
}
.add.dark {
	border: .35em dashed #989898;
	color: #989898;
}
.add.dark:hover {
	border: .35em dashed #dadada;
	color: #dadada;
}

</style>
