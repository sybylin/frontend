<template>
	<div class="full-width text-center">
		<h3 class="orkney-regular">
			{{ $capitalize($t('error.report.title')) }}
		</h3>
	</div>
	<div class="full-width text-center">
		<p class="text-body1">
			{{ $capitalize($t('error.report.description')) }}
		</p>
	</div>

	<q-form
		class="q-pa-md"
		@submit="onSubmit"
		@reset="onReset"
	>
		<q-card flat bordered>
			<q-card-section v-if="isSend">
				<q-banner class="text-white bg-green text-center">
					<span>
						{{ $capitalize($t('error.report.success')) }}
					</span>
					<span class="q-pl-xs">❤️</span>
				</q-banner>
			</q-card-section>
			<q-card-section>
				<q-select
					v-model="type"
					outlined
					:options="typeTrad"
					:label="$t('error.report.type')"
					class="q-pb-md"
				/>
				<q-input
					v-model="message"
					class="q-pb-md"
					type="textarea"
					outlined
					autogrow
					:label="$t('error.report.message')"
				/>
				<div class="row justify-center">
					<captcha
						v-model="captcha"
						:error="captchaError"
					/>
				</div>
			</q-card-section>
			<q-card-section>
				<div class="row justify-end">
					<q-btn
						:label="$capitalize($t('user.connection.step.1.submit'))" type="submit"
						color="primary" size="md"
						:disable="!message || !type || !captcha"
					/>
					<q-btn
						:label="$capitalize($t('user.connection.step.1.reset'))" type="reset"
						color="primary" flat class="q-ml-sm"
					/>
				</div>
			</q-card-section>
		</q-card>
	</q-form>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { ReportType } from 'src/types';
import Captcha from 'src/components/captcha.vue';
import type { captchaError } from 'src/components/captcha.vue';

export default defineComponent({
	name: 'Report',
	components: {
		Captcha
	},
	setup () {
		const { locale } = useI18n();
		const $q = useQuasar();
		const typeTrad = computed(() => {
			switch (locale.value) {
			case 'fr-FR':
				return [
					{ label: 'Bug', value: ReportType.BUG },
					{ label: 'Idée d\'amélioration', value: ReportType.IMPROVEMENT },
					{ label: 'Interface utilisateur', value: ReportType.UI }
				];
			case 'en-US':
			default:
				return [
					{ label: 'Bug', value: ReportType.BUG },
					{ label: 'Improvement idea', value: ReportType.IMPROVEMENT },
					{ label: 'User interface', value: ReportType.UI }
				];
			}
		});
		const type = ref<{ label: string, value: ReportType }>(typeTrad.value[0]);
		const message = ref<string | null>(null);
		const captcha = ref<string | null>(null);
		const captchaError = ref<captchaError>(null);
		const isSend = ref<boolean>(false);

		const onSubmit = () => {
			if (!message.value || !message.value.length || captchaError.value === 'invalid')
				return;
			api.post('/report', {
				captcha: captcha.value,
				type: type.value.value,
				message: message.value
			})
				.then(() => {
					isSend.value = true;
				})
				.catch((e) => {
					$q.notify(e.response.data.info.message);
				});
		};

		const onReset = () => {
			message.value = null;
			type.value = typeTrad.value[0];
			isSend.value = false;
		};

		onMounted(() => {
			watch(locale, () => {
				type.value = typeTrad.value[0];
			});
		});

		return {
			typeTrad,
			type,
			message,
			captcha,
			captchaError,
			isSend,

			onSubmit,
			onReset
		};
	}
});
</script>
