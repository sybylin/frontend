<template>
	<div class="page dark">
		<img class="img gt-xs" src="/imgs/plug.svg" />

		<div ref="lamp" class="lamp">
			<div class="full-width inline row justify-center index-1 wire-container">
				<div class="wire"></div>
			</div>
			<div class="full-width inline row justify-center index-1">
				<div class="hat"></div>
			</div>
			<div class="full-width inline row justify-center index-1">
				<div class="bulb"></div>
			</div>
			<div class="light"></div>
		</div>

		<div class="column items-center q-pa-xs top text-white">
			<img class="q-pb-md" src="/imgs/icon.png" />
			<span class="text-h2 orkney-medium q-pb-sm">Error 500</span>
			<span class="text-body1">Well, someone must have unplugged the server again...</span>
			<span class="text-body1">Come back later for a visit</span>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { useMeta } from 'quasar';
import meta from '../meta';

export default defineComponent({
	name: 'Error500',
	setup () {
		const lamp = ref<HTMLDivElement | null>(null);
		let interval: NodeJS.Timer; // eslint-disable-line no-undef

		useMeta(() => {
			return meta({
				meta: {
					title: 'Error 500',
					description: 'Well, someone must have unplugged the server again...',
					keywords: ['minecraft', 'sibyllin', 'error', '500']
				}
			});
		});

		onMounted(() => {
			interval = setInterval(() => {
				if (lamp.value) {
					if (Number(Math.random().toPrecision(5)) >= 0.5)
						lamp.value.classList.add('on');
					else
						lamp.value.classList.remove('on');
				}
			}, 500);
		});

		onUnmounted(() => clearInterval(interval));

		return {
			lamp
		};
	}
});
</script>

<style scoped>
@keyframes plug {
	0% { transform: rotate(5deg); }
	50% { transform: rotate(-5deg); }
	100% { transform: rotate(5deg); }
}
.dark {
	background-color: var(--q-dark-page);
}
.img {
	z-index: 1;
	overflow: hidden;
	position: absolute;
	top: -10px;
	right: 8%;
	max-height: 40%;
	animation: plug 3.5s ease-in-out infinite;
	transform-origin: top center;
}
.page {
	z-index: 0;
	position: relative;
	overflow: hidden;
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.top {
	z-index: 2;
}
.index-1 {
	z-index: 1;
}

.lamp {
	position: absolute;
	display: flex;
	flex-direction: column;
	align-items: center;
	z-index: 0;
	width: 100vw;
	height: 100vh;
	top: 0;
	left: 0;
}
.wire-container {
	background-color: var(--q-dark-page);
}
.wire {
	width: 17px;
	border-bottom: 64px solid #9facbaff;
}
.hat {
	width: 224px;
	border-bottom: 128px solid #596c76ff;
  border-left: 56px solid transparent;
  border-right: 56px solid transparent;
}
.bulb {
	height: 18px;
	width: 32px;
	background-color: #a9a9a9;
	border-top-right-radius: 0;
  border-top-left-radius: 0;
  border-bottom-right-radius: 150px;
  border-bottom-left-radius: 150px;
	border-bottom: none;
}
.light {
	position: relative;
	display: none;
	top: -20px;
	width: 700px;
	border-bottom: 70vh solid rgba(250, 235, 131, 0.3);
  border-left: 250px solid transparent;
  border-right: 250px solid transparent;
	transition: 300ms;
}
.lamp.on .bulb {
	background:#FAEB83;
}
.lamp.on .light {
	display: block;
}
</style>
