<template>
	<div
		v-intersection.once="(rowIsInViewport as any)"
		:class="{
			'full-width': true,
			'row': true,
			'q-pl-xl': true,
			'q-pr-xl': true,
			'q-pt-md': true,
			'q-pb-md': true,
			'keyframe': true,
			'reverse': $props.inverse,
			'background-light': $props.inverse && !isDarkMode,
			'background-night': $props.inverse && isDarkMode,
			'visible': visible,
			'animated': visible,
			'fadeInUp': visible,
			'invisible': !visible
		}"
	>
		<template v-if="!$props.bottom">
			<div
				:class="{
					'col-md-7': true,
					'col-12': true,
					'q-pa-sm': true,
					'column': true,
					'justify-center': true,
					'items-center': true,
					'video-padding': $props.video
				}"
			>
				<video
					v-if="$props.video"
					:class="{
						'video-small': small,
						'video-large': !small,
						'video': true,
						'skew': !$props.inverse,
						'skew-inverse': $props.inverse
					}"
					fetchpriority="low"
					autoplay
					muted
					loop
				>
					<source :src="$props.video" type="video/mp4" />
					Your browser does not support the video tag
				</video>
				<img
					v-else
					:src="image"
					:alt="title"
					:class="{
						'img-small': small,
						'img-large': !small
					}"
				/>
			</div>
			<div class="col-md-5 col-12 q-pa-sm column justify-center">
				<h2 class="text-h4 orkney-medium text-weight-bold">
					{{ title }}
				</h2>
				<p class="text-body1">
					{{ description }}
				</p>
			</div>
		</template>
		<template v-else>
			<h2 class="orkney-medium text-weight-bold full-width text-center">
				{{ title }}
			</h2>
			<p class="orkney-regular text-h6 full-width text-center">
				{{ description }}
			</p>
			<div class="column items-center justify-center full-width q-pt-lg q-pb-xl">
				<img class="img-start" src="/imgs/star.svg" :alt="title" />
				<q-btn
					class="q-pa-md q-ma-sm"
					color="green-7"
					:label="$t('main.header.play')"
					icon="videogame_asset"
					size="xl"
					:to="(store.isConnected) ? $generatePath({ name: 'series' }) : $generatePath({ name: 'login' })"
				/>
			</div>
		</template>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref, watch } from 'vue';
import { globalStore } from 'src/stores/global';

export default defineComponent({
	name: 'MainRow',
	props: {
		bottom: {
			type: Boolean,
			required: false,
			default: false
		},
		inverse: {
			type: Boolean,
			required: false,
			default: false
		},
		video: {
			type: String,
			required: false,
			default: undefined
		},
		image: {
			type: String,
			default: '/imgs/background.jpg'
		},
		small: {
			type: Boolean,
			required: false,
			default: false
		},
		title: {
			type: String,
			default: ''
		},
		description: {
			type: String,
			default: ''
		}
	},
	setup (props) {
		const store = globalStore();
		const visible = ref<boolean>(false);
		const isDarkMode = ref<boolean>(store.darkMode ?? false);

		const rowIsInViewport = (entry: IntersectionObserverEntry) => {
			visible.value = entry.isIntersecting;
		};

		const setClass = computed(() => {
			const ret = ['full-width', 'row', 'q-pl-xl', 'q-pr-xl', 'q-pt-md', 'q-pb-md', 'keyframe'];
			if (props.inverse) {
				ret.push('reverse');
				if (isDarkMode.value)
					ret.push('background-night');
				else
					ret.push('background-light');
			}
			if (visible.value)
				ret.push('visible', 'animated', 'fadeInUp');
			else
				ret.push('invisible');
			return ret.join(' ');
		});

		const setDarkBackground = computed(() => {
			if (isDarkMode.value)
				return 'background-night';
			return 'background-light';
		});

		onBeforeMount(() => {
			watch(store, (val) => { isDarkMode.value = val.darkMode; }, { deep: true });
		});

		return {
			store,
			visible,
			isDarkMode,
			rowIsInViewport,
			setClass,
			setDarkBackground
		};
	}
});
</script>

<style scoped>
.background-light {
	background-color: rgba(0, 0, 0, .05);
}
.background-night {
	background-color: rgba(255, 255, 255, .05);
}
.visible {
	visibility: visible;
}
.invisible {
	visibility: hidden;
}
.keyframe {
	animation-duration: 1.5s;
}
.img-large {
	width: 100%;
	max-width: 500px;
}
.img-small {
	width: 100%;
	max-width: 250px;
}
.img-start {
	width: 100%;
	max-width: 600px;
}
.video-padding {
	padding-top: 2.1em;
}
.video {
	height: calc(100% - 7em);
	background-color: #fff;
}
.video-small {
	max-width: 250px;
}
.video-large {
	max-width: 500px;
}
.skew {
	transform: skewY(-15deg);
	box-shadow: rgba(123, 31, 162, 0.4) -5px -5px, rgba(123, 31, 162, 0.3) -10px -10px, rgba(123, 31, 162, 0.2) -15px -15px, rgba(123, 31, 162, 0.1) -20px -20px, rgba(123, 31, 162, 0.05) -25px -25px;
}
.skew-inverse {
	transform: skewY(15deg);
	box-shadow: rgba(123, 31, 162, 0.4) 5px -5px, rgba(123, 31, 162, 0.3) 10px -10px, rgba(123, 31, 162, 0.2) 15px -15px, rgba(123, 31, 162, 0.1) 20px -20px, rgba(123, 31, 162, 0.05) 25px -25px;
}
</style>
