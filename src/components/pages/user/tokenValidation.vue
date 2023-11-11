<template>
	<div
		:class="{
			'full-width': $props.isInclude,
			'column': true,
			'justify-center': true,
			'items-center': true
		}"
	>
		<span class="text-h5">{{ $capitalize($t('user.connection.step.2.title')) }}</span>
		<q-separator class="full-width q-mb-sm q-mt-sm" inset />
		<p>{{ $capitalize($t('user.connection.step.2.text1')) }}</p>
		<p>{{ $capitalize($t('user.connection.step.2.text2')) }}</p>
		<components-pages-user-verification-code
			:fields="8"
			:disable="apiCall"
			:error="error"
			@complete="onSubmit"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { api } from 'src/boot/axios';
import ComponentsPagesUserVerificationCode from './verificationCode.vue';

export default defineComponent({
	name: 'ComponentsPagesUserCreation',
	components: {
		ComponentsPagesUserVerificationCode
	},
	props: {
		isInclude: {
			type: Boolean,
			required: false,
			default: true
		},
		name: {
			type: String,
			required: true
		},
		lastName: {
			type: String,
			required: false,
			default: undefined
		}
	},
	emits: ['complete'],
	setup (props, { emit }) {
		const apiCall = ref<boolean>(false);
		const error = ref<boolean>(false);

		const onSubmit = (token: number) => {
			apiCall.value = true;
			error.value = false;

			if (props.lastName) {
				setTimeout(() => {
					apiCall.value = false;
					error.value = true;
				}, Math.random() * (1243 - 2549) + 2549);
				return;
			}
			api.post('/user/token', {
				name: props.name,
				token
			})
				.then(() => emit('complete'))
				.catch(() => {
					error.value = true;
				})
				.finally(() => {
					apiCall.value = false;
				});
		};

		return {
			apiCall,
			error,
			onSubmit
		};
	}
});
</script>

<style scoped>

</style>
