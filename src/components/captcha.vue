<template>
	<div class="column items-center">
		<div
			:class="{
				border: true,
				'border-success': captchaIsValidate === true,
				'border-error': captchaIsValidate === false
			}"
		>
			<altcha-widget
				v-if="altcha !== null"
				ref="captchaDiv"
				:challengeurl="$props.challengeUrl"
				:strings="lang"
				auto
				hidefooter
			/>
		</div>
		<q-icon
			v-if="altcha === null"
			size="4em"
			color="red-7"
			name="link_off"
		/>
		<span
			v-if="payload === 'error'"
			class="q-pt-xs text-body2 text-red-7"
		>
			{{ $t('error.captcha') }}
		</span>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { baseURL } from 'src/boot/axios';
import enUS from 'src/i18n/en-US/captcha';
import frFR from 'src/i18n/fr-FR/captcha';
import type { ComputedRef, PropType } from 'vue';

interface captchaLang {
  error: string;
  footer: string;
  label: string;
  verified: string;
  verifying: string;
  waitAlert: string;
}

interface payload {
	payload: string;
	state: string;
}

export default defineComponent({
	name: 'Captcha',
	props: {
		modelValue: {
			type: String as PropType<string | null>,
			required: false,
			default: null
		},
		challengeUrl: {
			type: String,
			required: false,
			default: `${baseURL}/rights/captcha`
		},
		incorrect: {
			type: Boolean,
			required: false,
			default: false
		},
		reset: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	emits: ['update:modelValue', 'isReset'],
	setup (props, { emit }) {
		const { locale } = useI18n();
		const altcha = ref<unknown | null>(null);
		const captchaDiv = ref<HTMLDivElement | null>(null);
		const payload = ref<null | 'error' | 'pending' | string>(null);

		const lang: ComputedRef<string> = computed(() => {
			switch (locale.value) {
			case 'fr-FR':
				return JSON.stringify(frFR as captchaLang);
			case 'en-US':
			default:
				return JSON.stringify(enUS as captchaLang);
			}
		});

		const captchaIsValidate = computed(() => {
			if (!payload.value || payload.value.localeCompare('pending') === 0)
				return undefined;
			return payload.value.localeCompare('error') !== 0;
		});

		const state = (e: any) => {
			switch ((e.detail as payload).state) {
			case 'verifying':
				payload.value = 'pending';
				break;
			case 'verified':
				payload.value = (e.detail as payload).payload;
			}
		};

		onMounted(async () => {
			await import('altcha')
				.then((d) => {
					altcha.value = d;
				})
				.catch(() => {
					altcha.value = null;
				});
			captchaDiv.value?.addEventListener('statechange', state);

			watch(() => props.incorrect, (n) => {
				if (n)
					payload.value = 'error';
			});

			watch(() => props.reset, (n) => {
				if (n) {
					payload.value = null;
					emit('isReset');
				}
			});

			watch(payload, (n) => {
				if (
					n &&
					n.localeCompare('error') !== 0 &&
					n.localeCompare('pending') !== 0
				)
					emit('update:modelValue', n as string);
				else
					emit('update:modelValue', null);
			});
		});

		onUnmounted(() => {
			captchaDiv.value?.removeEventListener('statechange', state);
		});

		return {
			altcha,
			captchaDiv,
			payload,
			lang,
			captchaIsValidate
		};
	}
});
</script>

<style>
:root {
  --altcha-color-border: none;
}

.altcha-logo {
	display: none;
}
</style>

<style lang="scss" scoped>
.border {
	width: fit-content;
	border: 1px solid $grey-7;
	border-radius: .4em;
}

.border-error {
	border-color: $red-8;
}

.border-success {
	border-color: $green-7;
}
</style>
