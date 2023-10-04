<template>
	<q-dialog
		v-model="dialog"
		@hide="onReset"
	>
		<q-card class="card">
			<q-card-section class="row items-center">
				<span class="text-h5">{{ $capitalize($t('create.dialogCreateEnigma.name')) }}</span>
				<q-space />
				<q-btn
					v-close-popup
					icon="close"
					flat
					round
					dense
				/>
			</q-card-section>
			<q-separator />
			<q-form @submit="onSubmit">
				<q-card-section class="q-pt-none">
					<q-input
						v-model="title"
						:label="$capitalize($t('create.dialogCreateEnigma.title'))"
						:disable="loading"
						:error="titleError"
						:error-message="(titleError)
							? $capitalize($t('create.dialogCreateEnigma.titleError'))
							: undefined
						"
						:rules="[val => val && val.length || $capitalize($t('create.dialogCreateEnigma.required'))]"
					/>
					<q-input
						v-model="description"
						:label="$capitalize($t('create.dialogCreateEnigma.description'))"
						:disable="loading"
						:rules="[val => val && val.length || $capitalize($t('create.dialogCreateEnigma.required'))]"
					/>
				</q-card-section>

				<q-card-actions align="right">
					<q-btn
						flat
						color="primary"
						:label="$capitalize($t('user.connection.step.1.submit'))"
						:disable="disabled"
						:loading="loading"
						type="submit"
					/>
				</q-card-actions>
			</q-form>
		</q-card>
	</q-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import isEmpty from 'validator/lib/isEmpty';
import { api } from 'src/boot/axios';

export default defineComponent({
	name: 'ComponentsPagesCreationDialogCreateEnigma',
	props: {
		modelValue: {
			type: Boolean,
			required: true
		},
		serieId: {
			type: Number,
			required: true
		},
		order: {
			type: Number,
			required: true
		}
	},
	emits: ['update:modelValue', 'validate', 'quit'],
	setup (props, { emit }) {
		const dialog = ref<boolean>(props.modelValue);
		const title = ref<string | null>(null);
		const titleError = ref<boolean>(false);
		const description = ref<string | null>(null);
		const loading = ref<boolean>(false);
		const disabled = computed(() => {
			if (title.value && title.value.length && description.value && description.value.length)
				return false;
			return true;
		});

		const onReset = () => {
			title.value = null;
			titleError.value = false;
			description.value = null;
		};

		const onSubmit = () => {
			if (title.value && description.value && !isEmpty(title.value) && !isEmpty(description.value)) {
				api.post('/enigma/create', {
					serie_id: props.serieId,
					title: title.value,
					description: description.value,
					order: props.order + 1
				})
					.then((d) => d.data)
					.then((d) => emit('validate', d.enigma))
					.catch((e) => {
						if (e.response.data.info.code === 'EN_004')
							titleError.value = true;
					});
			}
		};

		onMounted(() => {
			watch(props, (v) => {
				dialog.value = v.modelValue;
			});
			watch(dialog, (v) => emit('update:modelValue', v));
		});

		return {
			dialog,
			title,
			titleError,
			description,
			loading,
			disabled,

			onReset,
			onSubmit
		};
	}
});
</script>

<style scoped>
.card {
	width: 700px;
	max-width: 80vw;
}
</style>
