<template>
	<div class="q-pa-xl row items-start q-gutter-md">
		<q-card
			v-for="serie of series" :key="serie.id"
			class="card"
			flat bordered square
		>
			<q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
				<div class="absolute-bottom">
					<span class="text-h6">{{ serie.title }}</span>
				</div>
			</q-img>
			<q-card-actions class="row reverse">
				<q-btn
					unelevated square
					:icon-right="(serie.isStarted) ? 'play_circle' : 'play_arrow'"
					:color="(serie.isStarted) ? 'green-7' : 'orange-7'"
					:label="(serie.isStarted) ? $t('main.resume') : $t('main.start')"
					:to="{ name: 'seriesDetail', params: { id: serie.id } }"
				/>
			</q-card-actions>
		</q-card>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { series } from 'src/store';

export default defineComponent({
	name: 'SeriesPages',
	setup () {
		return {
			series
		};
	}
});
</script>

<style scoped>
.card {
	width: 100%;
	max-width: 25em;
}
</style>
