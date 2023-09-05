<template>
	<q-select
		v-model="locale"
		:options="localeOptions"
		square
		emit-value
		map-options
		:class="computeClass"
	>
		<template v-slot:append>
			<q-icon name="translate" />
		</template>
	</q-select>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { computed, defineComponent, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import localeOptions from 'src/i18n/options';

export default defineComponent({
	name: 'SelectLang',
	props: {
		isLarge: {
			type: Boolean,
			required: false,
			default: false
		},
		isDark: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	setup (props) {
		const $q = useQuasar();
		const router = useRouter();
		const { locale } = useI18n({ useScope: 'global' });

		const computeClass = computed(() => {
			const ret = [];
			if (props.isDark)
				ret.push('q-field--dark');
			if (!props.isLarge)
				ret.push('lang-input');
			return ret.join(' ');
		});

		onMounted(() => {
			watch(locale, (newLang) => {
				const partOfPath = router.currentRoute.value.fullPath.split('/').filter((e) => e.length);
				const localeLang = localeOptions.find((e) => e.value === newLang);

				partOfPath.shift();
				if (!localeLang)
					locale.value = localeOptions[0].value;
				window.localStorage.setItem('lang', localeLang?.value ?? localeOptions[0].value);
				$q.lang.set(localeLang?.quasar ?? localeOptions[0].quasar);
				if (!partOfPath.length)
					router.push(`/${localeLang?.value}/`);
				else
					router.push(`/${localeLang?.value}/${partOfPath.join('/')}`);
			});
		});

		return {
			locale,
			localeOptions,
			computeClass
		};
	}
});
</script>

<style scoped>
.lang-input {
  width: 180px;
}
</style>
