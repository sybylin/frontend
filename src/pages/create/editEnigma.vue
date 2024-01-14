<template>
	<div v-if="!isCheck" class="full-width row justify-center q-pt-xl q-pb-xl">
		<q-spinner-cube color="deep-purple-6" size="6em" />
	</div>
	<template v-else>
		<div
			v-if="!isNotCreatedByUser"
			style="min-height: inherit"
			class="row items-center justify-center full-width"
		>
			<span class="text-h4">{{ $capitalize($t('create.main.series.unauthorized')) }}</span>
		</div>
		<div v-else class="q-pa-sm" style="min-height: inherit;">
			<div class="row no-wrap justify-between q-pl-sm q-pr-sm">
				<q-btn
					color="secondary"
					:label="$t('create.main.series.return')"
					icon="arrow_back"
					:to="{ name: 'editSeries', params: { lang: $route.params.lang, seriesId: $route.params.seriseId } }"
				/>
				<span class="text-h5">{{ enigma?.title }}</span>
				<span></span>
			</div>

			<q-tabs
				v-model="tabs"
				dense
				class="q-pt-sm text-teal full-width"
				active-color="secondary"
				indicator-color="secondary"
				align="justify"
			>
				<q-tab name="info" icon="info" :label="$t('create.main.tab.info')" />
				<q-tab name="editor" icon="wysiwyg" :label="$t('create.main.tab.editor')" />
				<q-tab name="solution" icon="emoji_objects" :label="$t('create.main.tab.solution')" />
			</q-tabs>
			<q-tab-panels
				v-model="tabs"
				animated
				keep-alive
				transition-prev="jump-left"
				transition-next="jump-right"
				class="transparent"
			>
				<q-tab-panel name="info">
					<enigma-info v-if="enigma" v-model="enigma" />
				</q-tab-panel>
				<q-tab-panel name="editor">
					<components-builder-main v-if="enigma" :id="enigma.id" :series-id="enigma.series_id ?? -1" />
				</q-tab-panel>
				<q-tab-panel name="solution">
					<enigma-solution v-if="enigma" :id="enigma.id" />
				</q-tab-panel>
			</q-tab-panels>
		</div>
	</template>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref } from 'vue';
import { useQuasar, useMeta } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { api } from 'src/boot/axios';
import meta from 'src/meta';
import ComponentsBuilderMain from 'components/builder/main.vue';
import EnigmaInfo from 'components/pages/creation/enigmaInfo.vue';
import EnigmaSolution from 'components/pages/creation/enigmaSolution.vue';
import type { enigma } from 'src/types';
import { capitalize } from 'src/boot/custom';

export default defineComponent({
	name: 'PagesCreateEditEnigma',
	components: {
		ComponentsBuilderMain,
		EnigmaInfo,
		EnigmaSolution
	},
	setup () {
		const $q = useQuasar();
		const { t } = useI18n();
		const route = useRoute();

		const isCheck = ref<boolean>(false);
		const isNotCreatedByUser = ref<boolean>(false);
		const enigma = ref<enigma | null>(null);
		const splitter = ref<number>(15);
		const tabs = ref<'info' | 'editor' | 'solution'>('info');
		const computedTitle = computed<string>(() => (enigma.value)
			? `${enigma.value.title} | ${capitalize(t('series.meta.enigma.title'))}`
			: t('series.meta.main.title'));

		useMeta(() => {
			return meta({
				meta: {
					title: computedTitle.value,
					description: capitalize(t('create.main.enigma.description')),
					keywords: ['select', 'series']
				},
				og: {
					url: 'https://sybyl.in/series',
					title: computedTitle.value,
					description: capitalize(t('create.main.enigma.description')),
					image: 'https://sybyl.in/img/background.png'
				},
				twitter: {
					url: 'https://sybyl.in/series',
					title: computedTitle.value,
					description: capitalize(t('create.main.enigma.description')),
					image: 'https://sybyl.in/img/background.png'
				}
			});
		});

		onBeforeMount(() => {
			api.post('/enigmas/createByUser', { id: route.params.enigmaId })
				.then((d) => {
					isNotCreatedByUser.value = d.data.isCreator ?? false;
					isCheck.value = true;
					if (isNotCreatedByUser.value) {
						api.post('/enigmas/one', { id: route.params.enigmaId })
							.then((d) => {
								enigma.value = d.data.enigma;
							})
							.catch((e) => $q.notify(e.response.data.info.message));
					}
				})
				.catch((e) => $q.notify(e.response.data.info.message));
		});

		return {
			isCheck,
			isNotCreatedByUser,
			enigma,
			splitter,
			tabs
		};
	}
});
</script>

<style scoped>
.transparent {
	background-color: transparent;
}
</style>
