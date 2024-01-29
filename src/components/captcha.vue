<template>
	<div
		:class="{
			border: true,
			'border-success': $props.error !== true && payload,
			'border-error': isUnverified || $props.error === true
		}"
	>
		<altcha-widget
			ref="captcha"
			:challengeurl="captchaUrl"
			:strings="lang"
			auto
			hidefooter
		/>
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

export default defineComponent({
	name: 'Captcha',
	props: {
		modelValue: {
			type: String as PropType<string | null>,
			required: false,
			default: null
		},
		error: {
			type: Boolean as PropType<boolean | null>,
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
		const isUnverified = ref<boolean>(false);
		const captchaUrl = `${baseURL}/rights/captcha`;

		const verified = (e: any) => {
			payload.value = (e.detail as payload).payload;
		};

		const state = (e: any) => {
			if ((e.detail as payload).state === 'verified')
				isUnverified.value = true;
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
				.catch((e) => console.error(e));

			captcha.value?.addEventListener('verified', verified);
			captcha.value?.addEventListener('statechange', state);

			watch(payload, (v) => emit('update:modelValue', v));
		});

		onUnmounted(() => {
			captcha.value?.removeEventListener('verified', verified);
			captcha.value?.removeEventListener('statechange', state);
		});

		return {
			captcha,
			payload,
			isUnverified,
			captchaUrl,
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
