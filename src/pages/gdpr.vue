<template>
	<div class="q-pa-md">
		<frFR v-if="locale === 'fr-FR'" />
		<enUS v-else />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import enUS from 'src/components/pages/gdpr/enUS.vue';
import frFR from 'src/components/pages/gdpr/frFR.vue';

export default defineComponent({
	name: 'PageGDPR',
	components: {
		enUS,
		frFR
	},
	setup () {
		const { locale } = useI18n();

		return {
			locale
		};
	}
});
</script>
