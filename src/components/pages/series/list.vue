<template>
	<div class="q-pa-xl row items-center justify-center q-gutter-md">
		<div v-if="!$props.series.length" class="row justify-center full-width">
			<span class="text-h4 text-weight-light">{{ $capitalize($t('series.main.noSeries')) }}</span>
		</div>
		<q-card
			v-for="serie of $props.series" :key="serie.id"
			class="card"
			flat bordered square
		>
			<q-img
				loading="lazy"
				style="max-height: 20em;"
				:src="(serie.image) ? `${baseURL}${serie.image}` : '/imgs/background.jpg' "
			>
				<div class="absolute-top transparent row reverse">
					<q-avatar
						v-if="!serie.creator"
						color="secondary"
						icon="person"
					/>
					<q-avatar v-else>
						<q-img
							loading="lazy"
							class="border"
							:src="(serie.creator.avatar) ? `${baseURL}${serie.creator.avatar}` : '/imgs/background.jpg' "
						>
							<q-tooltip
								anchor="center left"
								self="center right"
								class="bg-secondary text-body2"
							>
								<span>{{ $capitalize(serie.creator.name) }}</span>
							</q-tooltip>
						</q-img>
					</q-avatar>
				</div>
				<div class="absolute-bottom">
					<span class="text-h6">{{ serie.title }}</span>
				</div>
			</q-img>
			<q-card-actions class="row justify-between">
				<q-rating
					v-model="serie.rating"
					readonly
					color="yellow-8"
					icon="star_border"
					icon-selected="star"
					size="2em"
					:max="5"
				/>
				<q-btn
					unelevated square
					:icon-right="(serie.series_started) ? 'play_circle' : 'play_arrow'"
					:color="(serie.series_started) ? 'orange-7' : 'green-7'"
					:label="(serie.series_started) ? $t('main.resume') : $t('main.start')"
					:to="{ name: 'enigmaList', params: { id: serie.id } }"
				/>
			</q-card-actions>
		</q-card>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { baseURL } from 'src/boot/axios';
import type { seriesList } from 'src/types';

export default defineComponent({
	name: 'ComponentsPagesSeriesList',
	props: {
		series: {
			type: Array as PropType<seriesList[]>,
			required: true
		}
	},
	setup () {
		return {
			baseURL
		};
	}
});
</script>

<style scoped lang="scss">
.card {
	width: 100%;
	max-width: 25em;
}
.border {
	border: 2px solid $grey-8;
	border-radius: 50%;
}
</style>
