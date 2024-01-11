<template>
	<div class="text-weight-light header">
		<div class="row justify-around items-center no-wrap">
			<div class="col-md-6 col-sm-12 column items-center q-pl-xl q-pr-md">
				<div class="row justify-center items-center no-wrap">
					<q-img
						no-spinner
						src="/icons/favicon-96x96.png" width="7em" height="7em"
						class="header-snake"
						@load="titleLoad = true"
					/>
					<span class="text-h1 orkney-light text-center header-title">
						{{ (titleLoad) ? $t('title').slice(1) : $t('title') }}
					</span>
				</div>
				<h5 class="orkney-regular text-center">
					{{ $t('main.header.desc') }}
				</h5>
				<div>
					<q-btn
						class="q-pa-md q-ma-sm"
						color="green-7"
						:label="$t('main.header.play')"
						icon="videogame_asset"
						:to="(storeInstance.isConnected) ? $generatePath({ name: 'series' }) : $generatePath({ name: 'user' })"
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
				:class="{
					'col-md-6': $q.screen.gt.sm,
					'hidden': !$q.screen.gt.sm,
					'row': true,
					'items-center': true,
					'justify-center': true,
					'q-pr-xl': true,
					'q-pl-md': true
				}"
			>
				<q-img src="/imgs/background.jpg" style="max-width: 40vw" :ration="1" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { globalStore } from 'src/stores/global';

export default defineComponent({
	name: 'MainHeader',
	emits: ['toAnchor'],
	setup () {
		const storeInstance = globalStore();
		const titleLoad = ref<boolean>(false);

		return {
			storeInstance,
			titleLoad
		};
	}
});
</script>

<style scoped>
.header {
	z-index: 1;
	height: calc(100vh - 5em);
	display: flex;
	flex-direction: column;
	justify-content: center;
	position: relative;
	color: #fff;
	background: rgb(106,27,154);
	background: linear-gradient(90deg, rgb(53, 14, 78) 0%, rgb(40, 22, 75) 51%, rgb(41, 28, 81) 100%);
}
.header-old {
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
.header-snake {
	margin-right: -.5em;
}
</style>
