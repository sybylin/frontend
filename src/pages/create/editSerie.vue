<template>
	<div v-if="!isCheck" class="row justify-center items-center q-pt-xl q-pb-xl">
		<q-spinner-cube color="deep-purple-6" size="6em" />
	</div>
	<template v-else>
		<div
			v-if="typeof isCheck === 'string' && isCheck === 'unauthorized'"
			style="min-height: inherit"
			class="row items-center justify-center full-width"
		>
			<span>{{ $capitalize($t('create.main.serie.unauthorized')) }}</span>
		</div>
		<div v-else class="q-pa-sm">
			<div v-if="!serie" class="row justify-center items-center q-pt-xl q-pb-xl">
				<q-spinner-cube color="deep-purple-6" size="6em" />
			</div>
			<template v-else>
				<div class="row no-wrap justify-between q-pl-sm q-pr-sm">
					<q-btn
						color="secondary"
						:label="$t('create.main.serie.return')"
						icon="arrow_back"
						:to="{ name: 'selectSerie' }"
					/>
					<span class="text-h5">{{ serie.title }}</span>
					<span></span>
				</div>
				<q-tabs
					v-model="tab"
					dense
					class="q-pt-sm"
					active-color="secondary"
					indicator-color="secondary"
					align="justify"
				>
					<q-tab name="enigmas" icon="reorder" :label="$t('create.main.serie.enigmas')" />
					<q-tab name="options" icon="settings" :label="$t('create.main.serie.options')" />
				</q-tabs>
				<q-separator />
				<q-tab-panels v-model="tab" animated class="transparent">
					<q-tab-panel name="enigmas">
						<components-pages-creation-serie-enigmas-list
							v-model="serie"
							@update="updateEnigmas"
						/>
					</q-tab-panel>
					<q-tab-panel name="options">
						<components-pages-creation-serie-option v-model="serie" />
					</q-tab-panel>
				</q-tab-panels>
			</template>
		</div>
	</template>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import ComponentsPagesCreationSerieOption from 'components/pages/creation/serieOption.vue';
import ComponentsPagesCreationSerieEnigmasList from 'components/pages/creation/serieEnigmasList.vue';

import type { enigma } from 'src/components/pages/creation/serieEnigmasList.vue';
import type { serieElement } from './selectSerie.vue';

export default defineComponent({
	name: 'PagesCreateEditSerie',
	components: {
		ComponentsPagesCreationSerieOption,
		ComponentsPagesCreationSerieEnigmasList
	},
	setup () {
		const $q = useQuasar();
		const isCheck = ref<boolean | 'unauthorized'>(false);
		const serie = ref<serieElement | null>(null);
		const tab = ref<'enigmas' | 'options'>('enigmas');
		const route = useRoute();

		const getSerie = () => {
			api.post('/serie/one', {
				serie_id: Number(route.params.serieId)
			})
				.then((d) => d.data)
				.then((d) => {
					serie.value = d.serie;
				})
				.catch((e) => $q.notify(e.response.info.message));
		};

		const updateEnigmas = (enigmasList: enigma[]) => {
			if (!serie.value)
				return;
			enigmasList.forEach((v, i) => {
				if ((serie.value as serieElement).serie_enigma_order[i]) {
					(serie.value as serieElement).serie_enigma_order[i].enigma = v;
					(serie.value as serieElement).serie_enigma_order[i].enigma_id = v.id;
				} else {
					(serie.value as serieElement).serie_enigma_order.push({
						serie_id: serie.value?.id,
						enigma_id: v.id,
						enigma: v,
						order: i + 1
					});
				}
			});

			api.post('/serie/update/order', {
				serie_id: Number(route.params.serieId),
				order: enigmasList.map((v) => ({ serie_id: v.serie_id, enigma_id: v.id }))
			})
				.catch((e) => $q.notify(e.response.info.message));
		};

		onBeforeMount(() => {
			api.post('/serie/isCreatedByUser', {
				serie_id: Number(route.params.serieId)
			})
				.then((d) => d.data)
				.then((d) => {
					getSerie();
					isCheck.value = (d.isCreatedByUser)
						? true
						: 'unauthorized';
				})
				.catch((e) => $q.notify(e.response.info.message));
		});

		return {
			isCheck,
			serie,
			tab,
			updateEnigmas
		};
	}
});
</script>

<style scoped>
.transparent {
	background-color: transparent;
}
</style>
