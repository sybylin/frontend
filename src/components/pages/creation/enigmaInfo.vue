<template>
	<div class="q-pa-md">
		<div class="row">
			<div class="col-sm-4 col-xs-12">
				<div class="row full-height justify-center items-center">
					<image-upload
						v-model="image"
						api-path="/enigmas/update/image"
						:api-data="{ enigma_id: $props.modelValue.id }"
					/>
				</div>
			</div>
			<div class="col-sm-8 col-xs-12 q-pl-md q-pr-sm">
				<div class="column full-height justify-center">
					<q-input
						v-model="title"
						debounce="500"
						bottom-slots
						:loading="apiWait"
						:disable="apiWait"
						:label="$capitalize($t('create.main.series.title'))"
						:error="titleError === true || titleError === 'isExist'"
						:error-message="titleError === 'isExist'
							? $capitalize($t('create.dialogCreateSerie.titleError'))
							: $capitalize($t('create.main.series.incorrect', { key: $t('create.main.series.title') }))
						"
						:rules="[(v) => !titleError && v && v.length > 0 || $t('create.main.series.mandatory', { key: $t('create.main.series.title') })]"
					/>
					<q-input
						v-model="description"
						debounce="500"
						bottom-slots
						:loading="apiWait"
						:disable="apiWait"
						:label="$capitalize($t('create.main.series.description'))"
						:error="descriptionError === true"
						:error-message="$capitalize($t('create.main.series.incorrect', { key: $t('create.main.series.title') }))"
						autogrow
					/>
					<q-separator />
					<div class="q-pt-md row reverse">
						<q-btn color="red-7" :label="$t('create.main.delete')" @click="deleteEnigma = true" />
					</div>
				</div>
			</div>
		</div>
	</div>
	<q-dialog
		v-model="deleteEnigma"
		@hide="onResetDelete"
	>
		<q-card style="width: 700px; max-width: 80vw;">
			<q-card-section class="relative-position">
				<span class="row justify-center text-h6">
					{{ $capitalize($t('create.main.deleteEnigma.title')) }}
				</span>
				<q-btn
					v-close-popup
					icon="close" flat
					round dense
					class="absolute closeBtn"
				/>
			</q-card-section>
			<q-separator />
			<q-card-section class="text-center">
				<p class="text-body1">
					{{ $capitalize($t('create.main.deleteEnigma.description')) }}
				</p>
				<p class="text-body1">
					{{ $capitalize($t('create.main.deleteEnigma.explanation')) }}
				</p>
				<div class="bg-indigo-6 text-white">
					<p class="text-h5">
						{{ $props.modelValue.title }}
					</p>
				</div>
			</q-card-section>
			<q-card-section>
				<q-form
					@submit="onSubmitDelete"
					@reset="onResetDelete"
				>
					<q-input
						v-model="deleteName"
						bottom-slots
						outlined
						:label="$capitalize($t('create.main.deleteEnigma.label'))"
						lazy-rules
						:rules="[ val => val && val.length > 0 && val.localeCompare($props.modelValue.title) === 0 || $capitalize($t('create.main.deleteEnigma.error'))]"
					/>
					<div class="row reverse">
						<q-btn
							:label="$capitalize($t('user.connection.step.1.submit'))"
							type="submit"
							color="red-7"
							:disable="!deleteName || deleteName.localeCompare($props.modelValue.title) !== 0"
							class="q-ml-sm"
						/>
						<q-btn
							:label="$capitalize($t('user.connection.step.1.reset'))"
							type="reset"
							color="red-7"
							flat
						/>
					</div>
				</q-form>
			</q-card-section>
		</q-card>
	</q-dialog>
</template>

<script lang="ts">
import { PropType, defineComponent, onMounted, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import isEmpty from 'validator/lib/isEmpty';
import { api } from 'src/boot/axios';
import ImageUpload from '../imageUpload.vue';
import type { enigma } from 'src/types';

export default defineComponent({
	name: 'ComponentsPagesCreationEnigmaInfo',
	components: {
		ImageUpload
	},
	props: {
		modelValue: {
			type: Object as PropType<enigma>,
			required: true
		}
	},
	emits: ['update:modelValue', 'wait'],
	setup (props, { emit }) {
		const $q = useQuasar();
		const router = useRouter();

		const deleteEnigma = ref<boolean>(false);
		const apiWait = ref<boolean>(false);
		const title = ref<string | null>(props.modelValue.title);
		const description = ref<string | null>(props.modelValue.description);
		const image = ref<string | null>(props.modelValue.image);

		const titleError = ref<boolean | 'isExist'>(false);
		const descriptionError = ref<boolean>(false);
		const pointsError = ref<boolean>(false);

		const deleteName = ref<string | null>(null);

		const sendEmit = (part: 'title' | 'description' | 'image', val: unknown) => {
			const modelValue = props.modelValue;
			modelValue[part] = val as never;
			emit('update:modelValue', modelValue);
		};

		const setWait = (set: boolean) => {
			apiWait.value = set;
			emit('wait', set);
		};

		const onSubmitDelete = () => {
			if (!deleteName.value || deleteName.value.localeCompare(props.modelValue.title) !== 0)
				return;
			api.delete(`/enigmas/${props.modelValue.id}`)
				.then(() => router.push({ name: 'editSeries', params: { seriesId: props.modelValue.series_id } }))
				.catch((e) => $q.notify(e.response.data.info.message));
		};

		const onResetDelete = () => {
			deleteName.value = null;
		};

		onMounted(() => {
			watch(title, (t) => {
				if (titleError.value || !t || isEmpty(t))
					return;
				setWait(true);
				api.post('/enigmas/update/title', {
					enigma_id: props.modelValue.id,
					title: t
				})
					.then(() => sendEmit('title', t))
					.catch((e) => $q.notify(e.response.data.info.message))
					.finally(() => setWait(false));
			});

			watch(description, (d) => {
				if (descriptionError.value || !d || isEmpty(d))
					return;
				setWait(true);
				api.post('/enigmas/update/description', {
					enigma_id: props.modelValue.id,
					description: d
				})
					.then(() => sendEmit('description', d))
					.catch((e) => $q.notify(e.response.data.info.message))
					.finally(() => setWait(false));
			});

			watch(image, (i) => sendEmit('image', i));
		});

		return {
			deleteEnigma,
			apiWait,
			title,
			description,
			image,

			titleError,
			descriptionError,
			pointsError,

			deleteName,

			onSubmitDelete,
			onResetDelete
		};
	}
});
</script>

<style>
.closeBtn {
	right: 1.1em;
	top: 1.1em;
}
</style>
