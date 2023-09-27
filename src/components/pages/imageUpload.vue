<template>
	<div class="main">
		<q-img
			ref="image"
			loading="lazy"
			:ratio="1"
			fit="cover"
			:class="{ rounded: $props.rounded }"
			:src="(inputUrl) ? inputUrl : '/imgs/background.jpg'"
		/>
		<div
			class="select row justify-center items-center"
			@click="click"
		>
			<q-icon class="icon" name="add_photo_alternate" size="4em" />
		</div>
	</div>
	<input
		ref="file"
		type="file"
		class="hidden"
		accept="image/png, image/jpeg"
		@change="onChange"
	/>
</template>

<script lang="ts">
import { PropType, defineComponent, onMounted, ref, watch } from 'vue';
import type { QImg } from 'quasar';

export default defineComponent({
	name: 'ComponentsPagesCreationImageUpload',
	props: {
		modelValue: {
			type: String as PropType<string | null>,
			required: false,
			default: ''
		},
		rounded: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const image = ref<QImg | null>(null);
		const file = ref<HTMLInputElement | null>(null);
		const inputUrl = ref<string | null>(props.modelValue ?? null);

		const click = () => {
			if (!file.value)
				return;
			file.value.click();
		};

		const onChange = () => {
			if (!file.value || !file.value.files) {
				inputUrl.value = null;
				return;
			}
			const reader = new FileReader();
			reader.readAsDataURL(file.value.files[0]);
			reader.addEventListener('load', () => {
				inputUrl.value = reader.result as string;
			});
		};

		onMounted(() => {
			watch(inputUrl, (i) => emit('update:modelValue', i));
		});

		return {
			image,
			file,
			inputUrl,
			click,
			onChange
		};
	}
});
</script>

<style scoped>
.main {
	position: relative;
	width: 100%;
	max-width: 25em;
}
.rounded {
	border-radius: 50%;
}
.select {
	position: absolute;
	z-index: 2;
	top: 0;
	height: 100%;
	width: 100%;
	cursor: pointer;
}
.select i {
	display: none;
}
.select:hover i {
	display: block;
	color: rgb(220, 220, 220);
}
.select:hover {
	background-color: rgba(0, 0, 0, .2);
	border: .5em dashed rgb(220, 220, 220);
	color: rgb(220, 220, 220);
}
</style>