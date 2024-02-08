<template>
	<div class="text-weight-light header">
		<div class="row justify-around items-center no-wrap">
			<div
				:class="{
					'col-md-6': true,
					'col-sm-12': true,
					'column': true,
					'items-center': true,
					'q-pl-xl': $q.screen.gt.sm,
					'q-pr-md': $q.screen.gt.sm,
					'q-pa-sm': !$q.screen.gt.sm
				}"
			>
				<div class="row justify-center items-center no-wrap">
					<q-img
						no-spinner
						:src="`${themeInstance.linkToSnakeIcon}favicon-96x96.png`" width="7em" height="7em"
						class="header-snake"
						@load="titleLoad = true"
						@dblclick="themeInstance.switchSnakeAppearance()"
					/>
					<span class="text-h1 orkney-light text-center header-title">
						{{ (titleLoad) ? $t('title').slice(1) : $t('title') }}
					</span>
				</div>
				<h5 class="orkney-regular text-center">
					{{ $t('main.header.desc') }}
				</h5>
				<div class="row items-center justify-center">
					<q-btn
						class="q-pa-md q-ma-sm"
						color="green-7"
						:label="$t('main.header.play')"
						icon="videogame_asset"
						:to="(storeInstance.isConnected) ? $generatePath({ name: 'series' }) : $generatePath({ name: 'login' })"
					/>
					<q-btn
						class="q-pa-md q-ma-sm"
						color="teal-7"
						icon="expand_more"
						:label="$t('main.header.readMore')"
						@click="$emit('toAnchor')"
					/>
				</div>
			</div>
			<div
				v-if="$q.screen.gt.sm"
				:class="{
					'col-md-6': true,
					'row': true,
					'items-center': true,
					'justify-center': true,
					'q-pr-xl': true,
					'q-pl-md': true,
				}"
			>
				<div class="header-image">
					<q-img
						class="desktop"
						src="/imgs/main/desktop.min.webp"
						loading="eager"
						fetchpriority="high"
					/>
					<q-img
						class="tablet"
						src="/imgs/main/tablet.min.webp"
						loading="lazy"
						fetchpriority="low"
					/>
					<q-img
						class="mobile"
						src="/imgs/main/mobile.min.webp"
						loading="lazy"
						fetchpriority="low"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { globalStore } from 'src/stores/global';
import { themeStore } from 'src/stores/theme';

export default defineComponent({
	name: 'MainHeader',
	emits: ['toAnchor'],
	setup () {
		const storeInstance = globalStore();
		const themeInstance = themeStore();
		const titleLoad = ref<boolean>(false);

		return {
			storeInstance,
			themeInstance,
			titleLoad
		};
	}
});
</script>

<style scoped>
.header {
	z-index: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	position: relative;
	color: #fff;
	min-height: 35em;
	height: calc(100vh - 5em);
	background: rgb(106,27,154);
	background: linear-gradient(90deg, rgb(65, 16, 96) 0%, rgb(42, 25, 74) 51%, rgb(36, 25, 68) 100%);
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
.header-snake {
	margin-right: -.5em;
}
.header-image {
	display: inline-flex;
	flex-direction: row;
	align-items: center;
	position: relative;
	min-height: 40vh;
  min-width: 40vw;
  max-height: 40vh;
  max-width: 40vw;
  left: .8em;
}
.desktop {
	position: absolute;
	transform: skewY(15deg);
	width: 85%;
	left: .8em;
	box-shadow: rgba(123, 31, 162, 0.4) 5px -5px, rgba(123, 31, 162, 0.3) 10px -10px, rgba(123, 31, 162, 0.2) 15px -15px, rgba(123, 31, 162, 0.1) 20px -20px, rgba(123, 31, 162, 0.05) 25px -25px;
}
.tablet {
	position: absolute;
	transform: skewY(15deg);
	width: 55%;
	left: 0;
}
.mobile {
	position: absolute;
	transform: skewY(15deg);
	width: 19%;
	left: -.8em;
}
</style>
