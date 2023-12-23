<template>
	<draggable
		v-model="enigmas"
		group="enigmas"
		item-key="id"
		direction="horizontal"
		tag="transition-group"
		class="fit row wrap justify-center q-pt-xl q-pb-xl"
		handle=".move-icon"
		:disabled="disable"
		:component-data="{
			tag: 'div',
			type: 'transition-group',
			name: 'fade'
		}"
		@start="drag = true"
		@end="drag = false"
	>
		<template #item="{ element, index }">
			<div>
				<q-card
					v-if="!element.add"
					flat
					bordered
					class="card q-ma-sm"
				>
					<div class="img">
						<q-img
							loading="lazy"
							:src="(element.image) ? `${baseURL}${element.image}` : '/imgs/background.jpg' "
							style="height: 100%"
						/>
						<div class="row justify-between img-top">
							<q-icon
								:class="{
									'bg-primary': true,
									'text-white': true,
									'move-icon': true,
									disable: disable
								}"
								name="open_with"
								size="1.8em"
							/>
							<span class="text-h6 bg-secondary text-white index">{{ index + 1 }}</span>
						</div>
					</div>
					<q-card-section class="column">
						<span class="text-h6">{{ element.title }}</span>
					</q-card-section>
					<q-card-actions class="reverse row">
						<q-btn
							color="deep-purple-6"
							:label="$t('create.main.list.edit')"
							:disable="disable"
							icon-right="edit"
							:to="{ name: 'editEnigma', params: { lang: $route.params.lang, seriesId: $props.modelValue.id, enigmaId: element.id } }"
						/>
					</q-card-actions>
				</q-card>
			</div>
		</template>
		<template #footer>
			<div :key="-1">
				<q-card
					flat
					square
					:class="{
						card: true,
						add: true,
						disable: disable,
						'q-ma-sm': true,
						'dark': $q.dark.isActive
					}"
					@click="($props.modelValue.published === 'UNPUBLISHED') ? openCreationDialog = true : notifyError()"
				>
					<q-card-section class="full-width full-height row justify-center items-center">
						<q-icon name="add" size="6em" />
						<span style="position: absolute; bottom: 5em" class="text-h6">{{ $capitalize($t('create.dialogCreateSerie.name')) }}</span>
					</q-card-section>
				</q-card>
			</div>
		</template>
	</draggable>
	<components-pages-creation-dialog-create-enigma
		v-model="openCreationDialog"
		:series-id="$props.modelValue.id"
		:order="enigmas.length"
		@validate="addEnigmaToList"
	/>
</template>

<script lang="ts">
import { computed, defineComponent, ref, onMounted, watch, PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import { baseURL } from 'src/boot/axios';
import draggable from 'zhyswan-vuedraggable';
import ComponentsPagesCreationDialogCreateEnigma from 'src/components/pages/creation/dialogCreateEnigma.vue';
import type { enigma, series } from 'src/types';
import { capitalize } from 'src/boot/custom';

export default defineComponent({
	name: 'ComponentsPagesCreationSeriesEnigmasList',
	components: {
		draggable,
		ComponentsPagesCreationDialogCreateEnigma
	},
	props: {
		modelValue: {
			type: Object as PropType<series>,
			required: true
		}
	},
	emits: ['update'],
	setup (props, { emit }) {
		const $q = useQuasar();
		const { t } = useI18n();

		const disable = computed<boolean>(() => (props.modelValue.published !== 'UNPUBLISHED'));
		const openCreationDialog = ref<boolean>(false);
		const drag = ref<boolean>(false);
		const enigmas = ref(props.modelValue.series_enigma_order);

		const initDebounce = () => {
			let timeout: any | null = null;
			return (fn: any, delay?: number) => {
				clearTimeout(timeout);
				timeout = setTimeout(() => fn(), delay || 500);
			};
		};
		const watchDebounce = initDebounce();

		const addEnigmaToList = (e: enigma) => {
			enigmas.value?.push(e);
			openCreationDialog.value = false;
		};

		const notifyError = () => $q.notify({
			type: 'negative',
			message: capitalize(t(`create.forbidden.${(props.modelValue.published === 'PENDING')
				? 'pending'
				: 'published'}`
			))
		});

		onMounted(() => {
			watch(enigmas, (newEnigmas) => {
				watchDebounce(() => emit('update', newEnigmas));
			}, { deep: true });
		});

		return {
			baseURL,
			disable,
			openCreationDialog,
			drag,
			enigmas,
			addEnigmaToList,
			notifyError
		};
	}
});
</script>

<style scoped>
.card {
	width: 24em;
	height: 24em;
}

.img {
	position: relative;
	height: 65%;
}
.img-top {
	position: absolute;
  width: 100%;
  top: 0;
  left: 0;
}
.move-icon {
	border-radius: 50%;
	padding: .2em;
	margin: .3em;
	cursor: move;
}

.index {
	display: flex;
  align-items: center;
  justify-content: center;
	border-radius: 50%;
	padding: .2em;
	margin: .3em;
	width: 1.8em;
	height: 1.8em;
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
.disable {
	cursor: not-allowed !important;
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
