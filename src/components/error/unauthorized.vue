<template>
	<div class="row no-wrap q-pa-xl">
		<div class="col-md-5 col-12 column justify-center items-start q-pl-sm q-pr-md">
			<div>
				<template v-if="$props.message && $props.message !== null">
					<h2 class="q-ma-none q-pb-md orkney-medium">
						{{ $capitalize($props.message) }}
					</h2>
					<span class="text-body1 text-weight-regular">
						{{ $capitalize($t('error.brotli.description')) }}
					</span>
				</template>
				<template v-else>
					<h2 class="q-ma-none q-pb-md orkney-medium">
						{{ $capitalize($t('error.unauthorized.title')) }}
					</h2>
					<span class="text-body1 text-weight-regular">
						{{ $capitalize($t('error.unauthorized.subtitle')) }}
					</span>
				</template>
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
				<error-svg :error-code="$props.code" />
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
	},
	props: {
		code: {
			type: Number,
			required: false,
			default: 401
		},
		message: {
			type: String,
			required: false,
			default: null
		}
	}
});
</script>
