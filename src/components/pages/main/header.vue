<template>
	<div class="text-weight-light header">
		<div class="header-filter"></div>
		<div class="header-content text-center">
			<h1 class="orkney-light header-title">
				{{ $t('title') }}
			</h1>
			<div class="q-mb-xl">
				<div>
					<q-btn
						class="q-pa-md q-ma-sm"
						square color="teal-7"
						:label="$t('main.header.readMore')"
						@click="$emit('toAnchor')"
					/>
					<q-btn
						class="q-pa-md q-ma-sm"
						square color="green-7"
						:label="$t('menu.series')"
						:to="{ path: $generatePath({ name: 'series' }) }"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'MainHeader',
	emits: ['toAnchor']
});
</script>

<style scoped>
.header {
	z-index: 1;
	height: calc(100vh - 5em);
	background-image: url('/imgs/background.jpg');
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	color: #fff !important;
	position: relative;
}
.header-filter {
	z-index: 2;
	position: absolute;
	top: 0;
	left: 0;
	height: inherit;
	width: 100%;
	background-color: rgba(0, 0, 0, .6);
}
.header-content {
	z-index: 3;
}
.header-title {
	word-break: break-all;
}
</style>
