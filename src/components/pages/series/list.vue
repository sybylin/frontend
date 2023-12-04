<template>
	<div class="q-pa-xl column items-center justify-center q-gutter-md">
		<div v-if="!$props.series.length" class="row justify-center full-width">
			<span class="text-h4 text-weight-light">{{ $capitalize($t('series.main.noSeries')) }}</span>
		</div>
		<q-card
			v-for="serie of $props.series" :key="serie.id"
			class="card"
			flat bordered square
		>
			{{ serie.rating }}
			<q-img
				loading="lazy"
				style="max-height: 20em;"
				:src="(serie.image) ? `${baseURL}${serie.image}` : '/imgs/background.jpg' "
			>
				<div class="absolute-top transparent row reverse">
					<q-avatar
						v-if="!serie.name"
						color="secondary"
						icon="person"
					/>
					<q-avatar v-else>
						<q-img
							loading="lazy"
							class="border"
							:src="(serie.avatar) ? `${baseURL}${serie.avatar}` : '/imgs/background.jpg' "
						>
							<q-tooltip
								anchor="center left"
								self="center right"
								class="bg-secondary text-body2"
							>
								<span>{{ $capitalize(serie.name) }}</span>
							</q-tooltip>
						</q-img>
					</q-avatar>
				</div>
				<div class="absolute-bottom">
					<span class="text-h6">{{ serie.title }}</span>
				</div>
			</q-img>
			<q-card-actions
				:class="{
					row: true,
					'justify-between': serie.rating !== null,
					'justify-end': serie.rating === null
				}"
			>
				<q-rating
					v-if="serie.rating !== null"
					v-model="serie.rating"
					readonly
					color="yellow-8"
					icon="star_border"
					icon-half="star_half"
					icon-selected="star"
					size="2em"
					:max="5"
				/>
				<q-btn
					unelevated square
					:icon-right="(serie.started_date) ? 'play_circle' : 'play_arrow'"
					:color="(serie.started_date) ? 'orange-7' : 'green-7'"
					:label="(serie.started_date) ? $t('main.resume') : $t('main.start')"
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
	width: 2em;
	height: 2em;
}
</style>
