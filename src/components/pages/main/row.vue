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
		<div class="col-md-7 col-12 q-pa-sm column justify-center items-center">
			<img :src="image" :alt="title" :class="(small) ? 'img-small' : 'img-large'" />
		</div>
		<div class="col-md-5 col-12 q-pa-sm">
			<h2 class="text-h4 orkney-medium text-weight-bold">
				{{ title }}
			</h2>
			<p class="text-body1">
				{{ description }}
			</p>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref, watch } from 'vue';
import { globalStore } from 'src/stores/global';

export default defineComponent({
	name: 'MainRow',
	props: {
		inverse: {
			type: Boolean,
			required: false,
			default: false
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
</style>
