<template>
	<div class="q-pa-md">
		<div class="row">
			<div class="col-sm-4 col-xs-12">
				<div class="row full-height justify-center items-center">
					<image-upload
						v-model="image"
						api-path="/serie/update/image"
						:api-data="{ serie_id: $props.modelValue.id }"
					/>
				</div>
			</div>
			<div class="col-sm-8 col-xs-12 q-pl-sm q-pr-sm">
				<div class="column">
					<q-input
						v-model="title"
						debounce="500"
						bottom-slots
						:loading="apiWait"
						:disable="apiWait"
						:label="$capitalize($t('create.main.serie.title'))"
						:error="titleError === true || titleError === 'isExist'"
						:error-message="titleError === 'isExist'
							? $capitalize($t('create.dialogCreateSerie.titleError'))
							: $capitalize($t('create.main.serie.incorrect', { key: $t('create.main.serie.title') }))
						"
						:rules="[(v) => !titleError && v && v.length > 0 || $t('create.main.serie.mandatory', { key: $t('create.main.serie.title') })]"
					/>
					<q-input
						v-model="description"
						debounce="500"
						bottom-slots
						:loading="apiWait"
						:disable="apiWait"
						:label="$capitalize($t('create.main.serie.description'))"
						:error="descriptionError === true"
						:error-message="$capitalize($t('create.main.serie.incorrect', { key: $t('create.main.serie.title') }))"
						autogrow
					/>
					<q-input
						v-model.number="points"
						debounce="500"
						bottom-slots
						:loading="apiWait"
						:disable="apiWait"
						:label="$capitalize($t('create.main.serie.points'))"
						type="number"
						min="0"
						max="2000"
						step="1"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { PropType, defineComponent, onMounted, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import isEmpty from 'validator/lib/isEmpty';
import { api } from 'src/boot/axios';
import ImageUpload from '../imageUpload.vue';
import type { serieElement } from 'src/pages/create/selectSerie.vue';

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
	emits: ['update:modelValue', 'wait'],
	setup (props, { emit }) {
		const $q = useQuasar();

		const apiWait = ref<boolean>(false);
		const title = ref<string | null>(props.modelValue.title);
		const description = ref<string | null>(props.modelValue.description);
		const points = ref<number | null>(props.modelValue.points);
		const image = ref<string | null>(props.modelValue.image);

		const titleError = ref<boolean | 'isExist'>(false);
		const descriptionError = ref<boolean>(false);
		const pointsError = ref<boolean>(false);

		const sendEmit = (part: 'title' | 'description' | 'points' | 'image', val: unknown) => {
			const modelValue = props.modelValue;
			modelValue[part] = val as never;
			emit('update:modelValue', modelValue);
		};

		const setWait = (set: boolean) => {
			apiWait.value = set;
			emit('wait', set);
		};

		onMounted(() => {
			watch(title, (t) => {
				if (titleError.value || !t || isEmpty(t))
					return;
				setWait(true);
				api.post('/serie/update/title', {
					serie_id: props.modelValue.id,
					title: t
				})
					.then(() => sendEmit('title', t))
					.catch((e) => $q.notify(e.response.info.message))
					.finally(() => setWait(false));
			});

			watch(description, (d) => {
				if (descriptionError.value || !d || isEmpty(d))
					return;
				setWait(true);
				api.post('/serie/update/description', {
					serie_id: props.modelValue.id,
					description: d
				})
					.then(() => sendEmit('description', d))
					.catch((e) => $q.notify(e.response.info.message))
					.finally(() => setWait(false));
			});

			watch(points, (p) => {
				if (pointsError.value || !p || typeof p !== 'number' || p < 0 || p > 5000)
					return;
				setWait(true);
				api.post('/serie/update/points', {
					serie_id: props.modelValue.id,
					points: p
				})
					.then(() => sendEmit('points', p))
					.catch((e) => $q.notify(e.response.info.message))
					.finally(() => setWait(false));
			});

			watch(image, (i) => {
				console.log(i);
			});
		});

		return {
			apiWait,
			title,
			description,
			points,
			image,

			titleError,
			descriptionError,
			pointsError
		};
	}
});
</script>
