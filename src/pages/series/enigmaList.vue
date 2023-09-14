<template>
	<div class="q-pa-xl row items-start q-gutter-md">
		<q-card
			v-for="(enigma, index) of enigmas" :key="enigma.path"
			class="card"
			flat bordered square
		>
			<q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
				<div class="absolute-bottom">
					<span class="text-h6">{{ enigma.title }}</span>
				</div>
			</q-img>
			<q-card-actions class="row reverse">
				<q-btn
					unelevated square
					:icon-right="(enigma.finish) ? 'play_circle' : 'play_arrow'"
					:color="(enigma.finish) ? 'orange-7' : 'green-7'"
					:label="(enigma.finish) ? $t('main.resume') : $t('main.start')"
					:disable="isDesactivated(enigma, enigmas, index)"
					:to="!isDesactivated(enigma, enigmas, index) ? { name: 'enigma', params: { id: $route.params.id, path: enigma.path } } : undefined"
				/>
			</q-card-actions>
		</q-card>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { enigmas } from 'src/store';

export default defineComponent({
	name: 'SeriesDetailPage',
	setup () {
		const isDesactivated = (enigma: any, enigmas: any, index: number) => !enigma.finish && index > 1 && !enigmas[index - 1].finish;

		return {
			isDesactivated,
			enigmas
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
