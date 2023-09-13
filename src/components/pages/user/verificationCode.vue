<template>
	<div class="input">
		<template v-for="(v, i) in codes" :key="i">
			<q-input
				:ref="setItemRef"
				v-model="codes[i]"
				square
				outlined
				mask="#"
				class="input-width"
				input-style="text-align: center"
				:autofocus="i === autofocusIndex"
				:disable="$props.disable"
				:error="$props.error"
				no-error-icon
				:maxlength="1"
				@update:model-value="(nw) => onValueChange(nw, i)"
				@keydown="(e: KeyboardEvent) => onKeydown(e, i)"
			/>
		</template>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, toRaw, watch } from 'vue';
import isNumeric from 'validator/lib/isNumeric';

export default defineComponent({
	name: 'ComponentsPagesUserVerificationCode',
	props: {
		fields: {
			type: Number,
			required: true
		},
		disable: {
			type: Boolean,
			required: true
		},
		error: {
			type: Boolean,
			required: true
		}
	},
	emits: ['change', 'complete'],
	setup (props, { emit }) {
		const refsInput = ref<HTMLInputElement[]>([]);
		const codes = ref<(string | null)[]>(new Array(props.fields).fill(null));
		const autofocusIndex = ref<number>(0);

		const setItemRef = (e: unknown | undefined) => {
			if (e)
				refsInput.value.push(e as HTMLInputElement);
		};

		const onValueChange = (newVal: string | number | null, index: number) => {
			if (!newVal || !isNumeric(`${newVal}`))
				codes.value[index] = null;
			else {
				autofocusIndex.value = (index + 1);
				if (props.fields > (index + 1))
					refsInput.value[index + 1].focus();
			}
		};

		const onKeydown = (e: KeyboardEvent, index: number) => {
			const prevIndex = (index > 0)
				? index - 1
				: 0;
			const nextIndex = (index < props.fields - 1)
				? index + 1
				: props.fields - 1;
			switch (e.key) {
			case 'ArrowLeft':
				refsInput.value[prevIndex].focus();
				break;
			case 'ArrowRight':
				refsInput.value[nextIndex].focus();
				break;
			case 'Backspace':
				e.preventDefault();
				codes.value[index] = null;
				refsInput.value[prevIndex].focus();
				break;
			case 'Home':
				refsInput.value[0].focus();
				break;
			case 'End':
				refsInput.value[props.fields - 1].focus();
				break;
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
				e.preventDefault();
				refsInput.value[index].value = e.key;
				codes.value[index] = e.key;
				refsInput.value[nextIndex].focus();
				break;
			case 'ArrowUp':
			case 'ArrowDown':
				e.preventDefault();
			}
		};

		onMounted(() => {
			watch(codes, () => {
				const arrTest = toRaw(codes.value);
				if (arrTest.every((e) => e && e.length === 1))
					emit('complete', Number(arrTest.reduce((prev, curr) => `${prev}${curr}`, '')));
				else
					emit('change');
			}, { deep: true });
		});

		return {
			refsInput,
			codes,
			autofocusIndex,

			setItemRef,
			onValueChange,
			onKeydown
		};
	}
});
</script>

<style scoped>
.input {
	display: flex;
	flex-direction: row;
	justify-content: center;
	gap: 10px;
}
.input-width {
	width: 3.2em
}
</style>
