<template>
	<div class="full-width text-center q-pt-xl">
		<span class="text-h4">My series</span>
	</div>
	<div class="fit row wrap justify-center q-pt-xl q-pb-xl">
		<q-card
			flat
			bordered
			class="card q-ma-sm"
		>
			<q-img loading="lazy" src="https://cdn.quasar.dev/img/mountains.jpg" style="height: 65%" />
			<q-card-section class="row full-width justify-center">
				<div class="text-h6">
					<span>Welcome to the world</span>
				</div>
			</q-card-section>
			<q-separator />
			<q-card-actions class="reverse row">
				<q-btn
					color="deep-purple-6"
					label="edit"
					icon-right="edit"
				/>
			</q-card-actions>
		</q-card>
		<q-card
			flat
			square
			:class="{ 'dark': $q.dark.isActive }"
			class="card add q-ma-sm"
			@click="addSeries"
		>
			<q-card-section class="full-width full-height row justify-center items-center">
				<q-icon name="add" size="6em" />
				<span style="position: absolute; bottom: 5em" class="text-h6">Create new serie</span>
			</q-card-section>
		</q-card>
	</div>
	<components-pages-creation-dialog-create-serie v-model="openCreationDialog" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import ComponentsPagesCreationDialogCreateSerie from './dialogCreateSerie.vue';

export default defineComponent({
	name: 'PagesCreationMain',
	components: {
		ComponentsPagesCreationDialogCreateSerie
	},
	setup () {
		const openCreationDialog = ref<boolean>(false);

		const addSeries = () => {
			openCreationDialog.value = true;
		};

		return {
			openCreationDialog,
			addSeries
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
