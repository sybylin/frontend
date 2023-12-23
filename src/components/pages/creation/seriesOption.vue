<template>
	<div class="q-pa-md">
		<div class="row">
			<div class="col-sm-4 col-xs-12">
				<div class="row full-height justify-center items-center">
					<image-upload
						v-model="image"
						api-path="/series/update/image"
						:api-data="{ series_id: $props.modelValue.id }"
						:disable="isPublished"
						@forbidden="notifyError()"
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
						:disable="isPublished || apiWait"
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
						:disable="isPublished || apiWait"
						:label="$capitalize($t('create.main.series.description'))"
						:error="descriptionError === true"
						:error-message="$capitalize($t('create.main.series.incorrect', { key: $t('create.main.series.title') }))"
						autogrow
					/>
					<q-separator />
					<span class="text-center text-h6 orkney-medium q-pa-sm">
						{{ $capitalize($t('create.main.series.publish')) }}
						<q-icon :name="iconName" :color="iconColor" size="sm">
							<q-tooltip
								anchor="center end"
								self="center left"
								:class="`text-body2 text-center bg-${iconColor}`"
								:offset="[10,0]"
							>
								{{ $capitalize($t(`create.main.series.btn.${iconText}`)) }}
							</q-tooltip>
						</q-icon>
					</span>
					<span class="text-center text-body2">
						{{ $capitalize($t('create.main.series.publishSubtitle')) }}
					</span>
					<div class="column q-pb-sm">
						<q-card
							v-if="rejectionError"
							class="q-ma-sm border-error"
							flat
							bordered
						>
							<q-card-section class="row">
								<span class="text-body1 orkney-medium full-width text-center">
									{{ $capitalize($t('create.main.series.rejection')) }}
								</span>
								<q-separator class="full-width q-ma-sm" />
								<span class="text-body2 full-width text-center">
									{{ $capitalize(rejectionError) }}
								</span>
							</q-card-section>
						</q-card>

						<q-card
							v-if="published === 'PENDING'"
							class="q-ma-sm border"
							flat
							bordered
						>
							<q-card-section class="text-center">
								<span class="text-body2">
									{{ $capitalize($t('create.main.series.pendingExplanation')) }}
								</span>
							</q-card-section>
						</q-card>
						<q-btn
							v-if="published !== 'PUBLISHED'"
							color="green-7"
							:disable="published === 'PENDING'"
							:label="$capitalize($t('create.main.series.btn.publishSeries'))"
							@click="pendingSeries"
						/>
						<q-btn
							v-else
							color="red-7"
							:label="$capitalize($t('create.main.series.btn.unpublishSeries'))"
							@click="unpublishSeries"
						/>
					</div>
					<q-separator />
					<div class="q-pt-md row reverse">
						<q-btn
							color="red-7"
							:disable="isPublished"
							:label="$t('create.main.delete')"
							@click="deleteDialog = true"
						/>
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
import { PropType, computed, defineComponent, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import isEmpty from 'validator/lib/isEmpty';
import { api } from 'src/boot/axios';
import { capitalize } from 'src/boot/custom';
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
		const { t } = useI18n();
		const router = useRouter();

		const deleteDialog = ref<boolean>(false);
		const apiWait = ref<boolean>(false);
		const isPublished = computed<boolean>(() => (props.modelValue.published !== 'UNPUBLISHED'));
		const title = ref<string | null>(props.modelValue.title);
		const description = ref<string | null>(props.modelValue.description);
		const rejectionError = ref<string | null>(
			props.modelValue.series_verified_by
				? props.modelValue.series_verified_by[0].rejection_reason
				: null
		);
		const published = ref<'UNPUBLISHED' | 'PENDING' | 'PUBLISHED'>(props.modelValue.published);
		const image = ref<string | null>(props.modelValue.image);

		const titleError = ref<boolean | 'isExist'>(false);
		const descriptionError = ref<boolean>(false);
		const pointsError = ref<boolean>(false);

		const deleteName = ref<string | null>(null);

		const iconColor = computed(() => {
			if (published.value === 'UNPUBLISHED')
				return 'red-7';
			if (published.value === 'PENDING')
				return 'deep-purple-6';
			return 'green';
		});
		const iconText = computed(() => {
			if (published.value === 'UNPUBLISHED')
				return 'unpublished';
			if (published.value === 'PENDING')
				return 'pending';
			return 'published';
		});
		const iconName = computed(() => {
			if (published.value === 'UNPUBLISHED')
				return 'lock';
			if (published.value === 'PENDING')
				return 'pending_actions';
			return 'public';
		});

		const sendEmit = (part: 'title' | 'description' | 'image' | 'published', val: unknown) => {
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
				.catch((e) => $q.notify(e.response.data.info.message));
		};

		const onResetDelete = () => {
			deleteName.value = null;
		};

		const pendingSeries = () => {
			setWait(true);
			api.post('/series/publish/pending', {
				series_id: props.modelValue.id
			})
				.then(() => {
					sendEmit('published', 'PENDING');
					published.value = 'PENDING';
					rejectionError.value = null;
				})
				.catch((e) => $q.notify(e.response.data.info.message))
				.finally(() => setWait(false));
		};

		const unpublishSeries = () => {
			api.post('/series/publish/unpublish', {
				series_id: props.modelValue.id
			})
				.then(() => {
					sendEmit('published', 'UNPUBLISHED');
					published.value = 'UNPUBLISHED';
					rejectionError.value = null;
				})
				.catch((e) => $q.notify(e.response.data.info.message))
				.finally(() => setWait(false));
		};

		const notifyError = () => $q.notify({
			type: 'negative',
			message: capitalize(t(`create.forbidden.${(props.modelValue.published === 'PENDING')
				? 'pending'
				: 'published'}`
			))
		});

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
					.catch((e) => $q.notify(e.response.data.info.message))
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
					.catch((e) => $q.notify(e.response.data.info.message))
					.finally(() => setWait(false));
			});

			watch(image, (i) => sendEmit('image', i));
		});

		return {
			deleteDialog,
			apiWait,
			isPublished,
			title,
			description,
			rejectionError,
			published,
			image,

			titleError,
			descriptionError,
			pointsError,

			deleteName,

			iconColor,
			iconText,
			iconName,

			onSubmitDelete,
			onResetDelete,
			pendingSeries,
			unpublishSeries,
			notifyError
		};
	}
});
</script>

<style scoped lang="scss">
.closeBtn {
	right: 1.1em;
	top: 1.1em;
}
.border {
	border-color: $deep-purple-6;
}
.border-error {
	border-color: $red-7;
}
</style>
