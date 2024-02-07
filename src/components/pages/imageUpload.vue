<template>
	<div
		:class="{
			main: true,
			rounded: $props.rounded
		}"
		@dragover="manageBorder.add"
		@mouseenter="manageBorder.add"
		@mouseleave="manageBorder.remove"
		@dragleave="manageBorder.remove"
	>
		<div
			v-show="requestSend"
			:class="{
				loader: true,
				rounded: $props.rounded,
				row: true,
				'items-center': true,
				'justify-center': true,
			}"
		>
			<q-spinner-rings
				color="white"
				size="5em"
			/>
		</div>
		<div
			v-show="isOverWithFile && !requestSend"
			:class="{
				over: true,
				rounded: $props.rounded,
				row: true,
				'items-center': true,
				'justify-center': true,
			}"
			@click="() => true"
		>
			<q-spinner-cube
				v-if="requestSend"
				color="white"
				size="4em"
			/>
			<q-icon
				v-else
				class="icon"
				name="add_photo_alternate"
				size="4em"
			/>
		</div>
		<q-img
			ref="image"
			loading="lazy"
			:ratio="1"
			:alt="$props.alt"
			fit="cover"
			:class="{
				rounded: $props.rounded,
				img: true
			}"
			:src="inputUrl ? `${baseURL}${inputUrl}` : '/imgs/background.jpg'"
		/>
		<input
			ref="file"
			type="file"
			name="file"
			accept="image/png, image/jpeg"
			:disabled="requestSend"
			:class="{
				rounded: $props.rounded,
				'request-send': requestSend,
				input: true,
			}"
			@change="onChange"
			@drop="onDrop"
		/>
	</div>
</template>

<script lang="ts">
import { PropType, defineComponent, onMounted, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { baseURL, api } from 'src/boot/axios';
import type { QImg } from 'quasar';

export default defineComponent({
	name: 'ComponentsPagesCreationImageUpload',
	props: {
		modelValue: {
			type: String as PropType<string | null>,
			required: false,
			default: ''
		},
		apiPath: {
			type: String,
			required: true
		},
		apiData: {
			type: Object as PropType<unknown>,
			required: false,
			default: () => ({})
		},
		putMethod: {
			type: Boolean,
			required: false,
			default: false
		},
		alt: {
			type: String,
			required: false,
			default: 'image'
		},
		rounded: {
			type: Boolean,
			required: false,
			default: false
		},
		disable: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	emits: ['forbidden', 'update:modelValue'],
	setup (props, { emit }) {
		const $q = useQuasar();
		const image = ref<QImg | null>(null);
		const file = ref<HTMLInputElement | null>(null);
		const inputUrl = ref<string | null>(props.modelValue ?? null);
		const isOverWithFile = ref<boolean>(false);
		const requestSend = ref<boolean>(false);

		const manageBorder = {
			add: () => {
				if (!isOverWithFile.value)
					isOverWithFile.value = true;
			},
			remove: () => {
				if (isOverWithFile.value)
					isOverWithFile.value = false;
			}
		};

		const uploadImage = (files: FileList) => {
			for (const file of (files as unknown as File[])) {
				if (file.type && !file.type.includes('image'))
					return;
			}
			requestSend.value = true;
			api[props.putMethod
				? 'putForm'
				: 'postForm'](
				props.apiPath,
				{
					...props.apiData,
					image: files[0]
				}
			)
				.then((d) => {
					inputUrl.value = d.data.path;
				})
				.catch((e) => $q.notify({ type: 'negative', message: e.response.data.info.message }))
				.finally(() => {
					requestSend.value = false;
				});
		};

		const onDrop = (e: DragEvent) => {
			e.preventDefault();
			e.stopImmediatePropagation();
			if (requestSend.value)
				return;
			if (props.disable)
				return emit('forbidden');
			if (!e.dataTransfer || !e.dataTransfer.files) {
				inputUrl.value = null;
				return;
			}
			uploadImage(e.dataTransfer.files);
		};

		const onChange = () => {
			if (requestSend.value)
				return;
			if (props.disable)
				return emit('forbidden');
			if (!file.value || !file.value.files) {
				inputUrl.value = null;
				return;
			}
			uploadImage(file.value.files);
		};

		onMounted(() => {
			watch(inputUrl, (i) => emit('update:modelValue', i));
		});

		return {
			baseURL,
			image,
			file,
			inputUrl,
			isOverWithFile,
			requestSend,
			manageBorder,
			onChange,
			onDrop
		};
	}
});
</script>

<style scoped>
.main {
	position: relative;
	width: 100%;
	max-width: 25em;
	height: 100%;
}
.rounded {
	border-radius: 50%;
}
.img {
	position: absolute;
	pointer-events: none;
	top: 0;
	left: 0;
	height: 100%;
	max-height: 25em;
}
.input {
	width: 100%;
	height: 100%;
	opacity: 0;
	cursor: pointer;
}
.input:disabled {
	opacity: 0 !important;
}

.over {
	position: absolute;
	pointer-events: none;
	z-index: 2;
	top: 0;
	height: 100%;
	width: 100%;
	background-color: rgba(0, 0, 0, .2);
	color: rgb(220, 220, 220);
	border: .5em dashed rgb(220, 220, 220);
}
.loader {
	position: absolute;
	pointer-events: none;
	z-index: 2;
	top: 0;
	height: 100%;
	width: 100%;
	background-color: rgba(0, 0, 0, .2);
}
.request-send {
	cursor: wait !important;
}
</style>
