<template>
	<div class="q-pa-md">
		<div class="row">
			<div class="col-sm-4 col-xs-12">
				<div class="row full-height justify-center items-center">
					<image-upload v-model="options.image" />
				</div>
			</div>
			<div class="col-sm-8 col-xs-12 q-pl-sm q-pr-sm">
				<q-form
					class="full-height full-width column justify-center"
					@submit="onSubmit"
					@reset="onReset"
				>
					<q-input
						v-model="options.title"
						bottom-slots
						:label="$capitalize($t('create.main.serie.title'))"
						:error="titleError === true || titleError === 'isExist'"
						:error-message="titleError === 'isExist'
							? $capitalize($t('create.dialogCreateSerie.titleError'))
							: $capitalize($t('create.main.serie.incorrect', { key: $t('create.main.serie.title') }))
						"
						:rules="[(v) => !titleError && v && v.length > 0 || $t('create.main.serie.mandatory', { key: $t('create.main.serie.title') })]"
					/>
					<q-input
						v-model="options.description"
						bottom-slots
						:label="$capitalize($t('create.main.serie.description'))"
						:error="descriptionError === true"
						:error-message="$capitalize($t('create.main.serie.incorrect', { key: $t('create.main.serie.title') }))"
						autogrow
					/>
					<q-input
						v-model.number="options.points"
						bottom-slots
						:label="$capitalize($t('create.main.serie.points'))"
						type="number"
						min="0"
						max="2000"
						step="1"
					/>
				</q-form>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { PropType, defineComponent, onBeforeMount, reactive, ref, watch } from 'vue';
import type { serieElement } from 'src/pages/create/selectSerie.vue';
import ImageUpload from '../imageUpload.vue';

export default defineComponent({
	name: 'ComponentsPagesCreationSerieOption',
	components: {
		ImageUpload
	},
	props: {
		modelValue: {
			type: Object as PropType<serieElement>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const options = reactive(props.modelValue);
		const titleError = ref<boolean | 'isExist'>(false);
		const descriptionError = ref<boolean>(false);
		const pointsError = ref<boolean>(false);

		const onSubmit = () => {
			console.log('on submit');
		};

		const onReset = () => {
			console.log('on reset');
		};

		onBeforeMount(() => {
			watch(options, (o) => emit('update:modelValue', o));
		});

		return {
			options,
			titleError,
			descriptionError,
			pointsError,
			onSubmit,
			onReset
		};
	}
});
</script>
