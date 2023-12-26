<template>
	<div class="row no-wrap q-pa-xl">
		<div class="col-md-5 col-12 column justify-center items-center q-pl-sm q-pr-md">
			<div>
				<h2 class="q-ma-none q-pb-md orkney-medium">
					{{ $capitalize($t('error.unauthorized.title')) }}
				</h2>
				<span class="text-body1 text-weight-regular">
					{{ $capitalize($t('error.unauthorized.subtitle')) }}
				</span>
			</div>
		</div>
		<div class="gt-sm col-md-7 row justify-center items-center">
			<q-img
				src="/imgs/svg/door.svg"
				alt="Screen with application"
				fit="contain"
				class="img"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'PageUnauthorized'
});
</script>

<style scoped>
.img {
	width: 20vw;
}
</style>
