<template>
	<div class="q-pa-md">
		<div class="row">
			<div class="col-sm-4 col-xs-12">
				<div class="row full-height justify-center items-center">
					<image-upload
						v-model="image"
						api-path="/series/update/image"
						:api-data="{ series_id: $props.modelValue.id }"
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
					<q-slider
						v-model.number="points"
						class="q-pt-xl q-pb-md"
						debounce="500"
						bottom-slots
						:min="0"
						:max="1500"
						:step="10"
						label
						:label-value="`${points} ${$t('create.main.series.points')}`"
						label-always
						color="light-blue-8"
					/>
					<div class="row no-wrap justify-end items-center">
						<span class="text-body-1">
							{{ $capitalize($t('create.main.series.publish')) }}
							<q-icon name="help" size="sm" color="light-blue-8">
								<q-tooltip
									anchor="bottom middle" self="bottom middle" class="bg-light-blue-8 text-body2 text-center"
									:offset="[0,40]"
								>
									{{ $capitalize($t('create.main.series.publishTooltip')) }}
								</q-tooltip>
							</q-icon>
						</span>
						<q-toggle
							v-model="published"
							:disable="apiWait"
							size="xl"
							color="green"
							keep-color
							checked-icon="public"
							unchecked-icon="lock"
						/>
					</div>
					<q-separator />
					<div class="q-pt-md row reverse">
						<q-btn color="red-7" :label="$t('create.main.delete')" @click="deleteDialog = true" />
					</div>
				</div>
			</div>
		</div>
	</div>
	<q-dialog
		v-model="deleteDialog"
		@hide="onResetDelete"
	>
		<q-card style="width: 700px; max-width: 80vw;">
			<q-card-section class="relative-position">
				<span class="row justify-center text-h6">
					{{ $capitalize($t('create.main.deleteDialog.title')) }}
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
					{{ $capitalize($t('create.main.deleteDialog.description')) }}
				</p>
				<p class="text-body1">
					{{ $capitalize($t('create.main.deleteDialog.explanation')) }}
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
						:label="$capitalize($t('create.main.deleteDialog.label'))"
						lazy-rules
						:rules="[ val => val && val.length > 0 && val.localeCompare($props.modelValue.title) === 0 || $capitalize($t('create.main.deleteDialog.error'))]"
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
import type { series } from 'src/types';

export default defineComponent({
	name: 'ComponentsPagesCreationSeriesOption',
	components: {
		ImageUpload
	},
	props: {
		modelValue: {
			type: Object as PropType<series>,
			required: true
		}
	},
	emits: ['update:modelValue', 'wait'],
	setup (props, { emit }) {
		const $q = useQuasar();
		const router = useRouter();

		const deleteDialog = ref<boolean>(false);
		const apiWait = ref<boolean>(false);
		const title = ref<string | null>(props.modelValue.title);
		const description = ref<string | null>(props.modelValue.description);
		const points = ref<number | null>(props.modelValue.points);
		const published = ref<boolean>(props.modelValue.published);
		const image = ref<string | null>(props.modelValue.image);

		const titleError = ref<boolean | 'isExist'>(false);
		const descriptionError = ref<boolean>(false);
		const pointsError = ref<boolean>(false);

		const deleteName = ref<string | null>(null);

		const sendEmit = (part: 'title' | 'description' | 'points' | 'image' | 'published', val: unknown) => {
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
			api.delete(`/series/${props.modelValue.id}`)
				.then(() => router.push({ name: 'selectSeries' }))
				.catch((e) => $q.notify(e.response.info.message));
		};

		const onResetDelete = () => {
			deleteName.value = null;
		};

		onMounted(() => {
			watch(title, (t) => {
				if (titleError.value || !t || isEmpty(t))
					return;
				setWait(true);
				api.post('/series/update/title', {
					series_id: props.modelValue.id,
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
				api.post('/series/update/description', {
					series_id: props.modelValue.id,
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
				api.post('/series/update/points', {
					series_id: props.modelValue.id,
					points: p
				})
					.then(() => sendEmit('points', p))
					.catch((e) => $q.notify(e.response.info.message))
					.finally(() => setWait(false));
			});

			watch(published, (p) => {
				setWait(true);
				api.post('/series/update/published', {
					series_id: props.modelValue.id,
					published: p
				})
					.then(() => sendEmit('published', p))
					.catch((e) => $q.notify(e.response.info.message))
					.finally(() => setWait(false));
			});

			watch(image, (i) => sendEmit('image', i));
		});

		return {
			deleteDialog,
			apiWait,
			title,
			description,
			points,
			published,
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
