<template>
	<altcha-widget
		ref="captcha"
		challengeurl="{YOUR_SERVER_HERE}"
		auto
		hidelogo
		:debug="$props.debug"
	/>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';

export default defineComponent({
	name: 'Captcha',
	props: {
		debug: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	setup () {
		const captcha = ref<HTMLDivElement | null>(null);
		const altcha = ref<any | null>(null);

		const stateChange = (e: Event) => {
			console.log('state change', e.detail);
		};

		const verified = (e: Event) => {
			console.log('verified', e.detail);
		};

		onMounted(async () => {
			await import('altcha')
				.then((d) => {
					altcha.value = d;
				})
				.catch((e) => console.error(e));

			if (captcha.value) {
				captcha.value.addEventListener('statechange', stateChange);
				captcha.value.addEventListener('verified', verified);
			}

			console.log(altcha.value);
		});

		onUnmounted(() => {
			if (captcha.value) {
				captcha.value.removeEventListener('statechange', stateChange);
				captcha.value.removeEventListener('verified', verified);
			}
		});

		return {
			captcha
		};
	}
});
</script>
