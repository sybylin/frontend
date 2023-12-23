<template>
	<div class="full-width text-center q-pt-xl">
		<span class="text-h4">{{ $capitalize($t('create.main.list.title')) }}</span>
	</div>
	<div v-if="!seriesList" class="row justify-center items-center q-pt-xl q-pb-xl">
		<q-spinner-cube size="7em" color="deep-purple-6" />
	</div>
	<div v-else class="fit row wrap justify-center q-pt-xl q-pb-xl">
		<q-card
			v-for="series of seriesList"
			:key="series.id"
			flat
			bordered
			class="card q-ma-sm"
		>
			<q-img
				loading="lazy"
				:src="(series.image) ? `${baseURL}${series.image}` : '/imgs/background.jpg'"
				style="height: 65%"
			/>
			<q-card-section class="row full-width justify-center">
				<div class="text-h6">
					<span>{{ series.title }}</span>
				</div>
			</q-card-section>
			<q-card-actions class="reverse row">
				<q-btn
					color="deep-purple-6"
					:label="$t('create.main.list.edit')"
					icon-right="edit"
					:to="{ name: 'editSeries', params: { lang: $route.params.lang, seriesId: series.id } }"
				/>
			</q-card-actions>
		</q-card>

		<q-card
			flat
			square
			:class="{ 'dark': $q.dark.isActive }"
			class="card add q-ma-sm"
			@click="openCreationDialog = true"
		>
			<q-card-section class="full-width full-height row justify-center items-center">
				<q-icon name="add" size="6em" />
				<span style="position: absolute; bottom: 5em" class="text-h6">{{ $capitalize($t('create.dialogCreateSerie.name')) }}</span>
			</q-card-section>
		</q-card>
	</div>
	<components-pages-creation-dialog-create-series
		v-model="openCreationDialog"
		@validate="addSerieToList"
	/>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref, watch } from 'vue';
import { baseURL, api } from 'src/boot/axios';
import ComponentsPagesCreationDialogCreateSeries from 'components/pages/creation/dialogCreateSeries.vue';
import type { series } from 'src/types';

export default defineComponent({
	name: 'SelectSeries',
	components: {
		ComponentsPagesCreationDialogCreateSeries
	},
	setup () {
		const seriesList = ref<series[] | null>(null);
		const selectedSerie = ref<series | null>(null);
		const openCreationDialog = ref<boolean>(false);

		const selectSerieEvent = (s: series) => {
			selectedSerie.value = s;
		};

		const returnToSeries = () => {
			selectedSerie.value = null;
		};

		const addSerieToList = (s: series) => {
			seriesList.value?.push(s);
			openCreationDialog.value = false;
		};

		const editSeries = (s: series) => {
			if (!seriesList.value)
				return;
			for (const i in seriesList.value) {
				if (seriesList.value[i].id === s.id) {
					seriesList.value[i] = s;
					return;
				}
			}
		};

		onBeforeMount(() => {
			api.get('/series/createByUser')
				.then((d) => d.data)
				.then((d) => {
					seriesList.value = d.series;
				})
				.catch(() => {
					/// make nothing if error
				});

			watch(selectedSerie, () => {

			}, { deep: true });
		});

		return {
			baseURL,
			seriesList,
			selectedSerie,
			openCreationDialog,

			selectSerieEvent,
			returnToSeries,
			addSerieToList,
			editSeries
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
