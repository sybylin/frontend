<template>
	<div class="main">
		<q-img
			ref="image"
			loading="lazy"
			:ratio="1"
			:alt="$props.alt"
			fit="cover"
			:class="{ rounded: $props.rounded }"
			:src="inputUrl ? `${baseURL}${inputUrl}` : '/imgs/background.jpg'"
		/>
		<div
			:class="{
				select: true,
				row: true,
				'justify-center': true,
				'items-center': true,
				rounded: $props.rounded,
				disable: $props.disable
			}"
			@click="click"
		>
			<q-icon class="icon" name="add_photo_alternate" size="4em" />
		</div>
	</div>
	<input
		ref="file"
		type="file"
		class="hidden"
		name="file"
		accept="image/png, image/jpeg"
		@change="onChange"
	/>
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

		const click = () => {
			if (props.disable)
				return emit('forbidden');
			if (!file.value)
				return;
			file.value.click();
		};

		const onChange = () => {
			if (!file.value || !file.value.files) {
				inputUrl.value = null;
				return;
			}

			api[props.putMethod
				? 'putForm'
				: 'postForm'](
				props.apiPath,
				{ ...props.apiData, image: file.value.files[0] }
			)
				.then((d) => {
					inputUrl.value = d.data.path;
				})
				.catch((e) => $q.notify({ type: 'negative', message: e.response.data.info.message }));
		};

		onMounted(() => {
			watch(inputUrl, (i) => emit('update:modelValue', i));
		});

		return {
			baseURL,
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

.disable {
	cursor: not-allowed !important;
}
</style>
