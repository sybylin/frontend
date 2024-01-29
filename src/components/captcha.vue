<template>
	<div class="column items-center">
		<div
			:class="{
				border: true,
				'border-success': !$props.error && payload,
				'border-error': unverified || $props.error === 'invalid'
			}"
		>
			<altcha-widget
				v-if="altcha !== null"
				ref="captcha"
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
			v-if="$props.error && $props.error === 'invalid'"
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

export type captchaError = 'invalid' | 'reset' | null;
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
		error: {
			type: String as PropType<captchaError>,
			required: false,
			default: null
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const { locale } = useI18n();

		const captcha = ref<HTMLDivElement | null>(null);
		const altcha = ref<any | null>(null);
		const payload = ref<string | null>(props.modelValue);
		const unverified = ref<boolean>(false);

		const verified = (e: any) => {
			payload.value = (e.detail as payload).payload;
		};

		const state = (e: any) => {
			if ((e.detail as payload).state === 'verified')
				unverified.value = true;
		};

		const lang: ComputedRef<string> = computed(() => {
			switch (locale.value) {
			case 'fr-FR':
				return JSON.stringify({
					error: 'La vérification a échoué. Réessayez plus tard',
					footer: 'Protégé par <a href="https://altcha.org/" target="_blank">ALTCHA</a>',
					label: 'Je ne suis pas un robot',
					verified: 'Vérifié',
					verifying: 'Vérification...',
					waitAlert: 'Vérification... veuillez patienter'
				} as captchaLang);
			case 'en-US':
			default:
				return JSON.stringify({
					error: 'Verification failed. Try again later',
					footer: 'Protected by <a href="https://altcha.org/" target="_blank">ALTCHA</a>',
					label: 'I\'m not a robot',
					verified: 'Verified',
					verifying: 'Verifying...',
					waitAlert: 'Verifying... please wait'
				} as captchaLang);
			}
		});

		onMounted(async () => {
			await import('altcha')
				.then((d) => {
					altcha.value = d;
				})
				.catch(() => {
					altcha.value = null;
				});

			captcha.value?.addEventListener('verified', verified);
			captcha.value?.addEventListener('statechange', state);

			watch(() => props.error, (newVal) => {
				if (newVal === 'reset') {
					payload.value = null;
					unverified.value = false;
				}
			});

			watch(payload, (v) => emit('update:modelValue', v));
		});

		onUnmounted(() => {
			captcha.value?.removeEventListener('verified', verified);
			captcha.value?.removeEventListener('statechange', state);
		});

		return {
			altcha,
			captcha,
			payload,
			unverified,
			lang
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
