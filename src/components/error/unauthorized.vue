<template>
	<div class="row no-wrap q-pa-xl">
		<div class="col-md-5 col-12 column justify-center items-start q-pl-sm q-pr-md">
			<div>
				<h2 class="q-ma-none q-pb-md orkney-medium">
					{{ $capitalize($t('error.unauthorized.title')) }}
				</h2>
				<span class="text-body1 text-weight-regular">
					{{ $capitalize($t('error.unauthorized.subtitle')) }}
				</span>
			</div>
			<div class="q-pt-xl">
				<q-btn
					flat color="primary"
					icon="home"
					:label="$capitalize($t('menu.home'))"
					:to="{ name: 'home', params: { lang: $route.params.lang } }"
				/>
			</div>
		</div>
		<div class="gt-sm col-md-7 row justify-center items-center">
			<div style="width: 20vw">
				<error-svg :error-code="401" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import errorSvg from './errorSvg.vue';

export default defineComponent({
	name: 'PageError',
	components: {
		errorSvg
	}
});
</script>
