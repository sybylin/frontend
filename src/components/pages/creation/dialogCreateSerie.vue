<template>
	<q-dialog
		v-model="dialog"
		@hide="() => name = null"
	>
		<q-card style="width: 700px; max-width: 80vw;">
			<q-card-section class="row items-center">
				<span class="text-h5">Create new serie</span>
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
			<q-card-section class="q-pt-none">
				<q-input
					v-model="name"
					label="Name of serie"
					:rules="[val => val && val.length || 'Field is required']"
				/>
			</q-card-section>

			<q-card-actions align="right" class="bg-white text-teal">
				<q-btn
					flat
					color="primary"
					label="Submit"
					:disable="!name?.length"
					:loading="loading"
					@click="submit()"
				/>
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import isEmpty from 'validator/lib/isEmpty';
import { api } from 'src/boot/axios';

export default defineComponent({
	name: 'ComponentsPagesCreationDialogCreateSerie',
	props: {
		modelValue: {
			type: Boolean,
			required: true
		}
	},
	emits: ['update:modelValue', 'validate', 'quit'],
	setup (props, { emit }) {
		const dialog = ref<boolean>(props.modelValue);
		const name = ref<string | null>(null);
		const loading = ref<boolean>(false);

		const submit = () => {
			if (name.value && !isEmpty(name.value)) {
				api.post('/series/create', {
					name: name.value
				})
					.then((d) => d.data)
					.then((d) => {
						console.log(d);
					})
					.catch((e) => {
						console.log(e.response);
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
			name,
			loading,
			submit
		};
	}
});
</script>
