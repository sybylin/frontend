<template>
	<span :class="cssList">{{ textRef }}</span>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch, PropType } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
	name: 'Typing',
	props: {
		text: {
			type: Array as PropType<string[]>,
			required: true
		},
		css: {
			type: String,
			required: false,
			default: 'text-h6'
		}
	},
	setup (props) {
		const isAnim = ref<boolean>(false);
		const textRef = ref<string | null>(null);
		const { locale } = useI18n({ useScope: 'global' });
		let index = 0, isAdding = true, textIndex = 0;

		const cssList = computed(() => {
			if (isAnim.value)
				return `${props.css} type-text show-anim`;
			return `${props.css} type-text`;
		});

		const animation = () => {
			setTimeout(() => {
				textRef.value = props.text[textIndex].slice(0, index);
				if (isAdding) {
					if (index > props.text[textIndex].length) {
						isAdding = false;
						isAnim.value = true;
						setTimeout(() => {
							isAnim.value = false;
							animation();
						}, 1200);
						return;
					} else
						index++;
				} else {
					if (index === 0) {
						isAdding = true;
						textIndex = (textIndex + 1) % props.text.length;
					} else
						--index;
				}
				animation();
			}, isAdding
				? 70
				: 50
			);
		};

		onMounted(() => {
			animation();
			watch(locale, () => {
				textRef.value = props.text[textIndex].slice(0, index);
			});
		});

		return {
			textRef,
			cssList
		};
	}
});
</script>

<style scoped>
.type-text::after {
  content: "|";
  animation:  none;
}
.show-anim.type-text::after {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% {opacity: 1;}
  50% {opacity: 0;}
}
</style>
