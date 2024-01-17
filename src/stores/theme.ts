import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export type snake = 'withoutTongue' | 'withTongue';
export const themeStore = defineStore('theme', () => {
	const snakeAppearance = ref<snake>('withoutTongue');
	const linkToSnakeIcon = computed(() => (snakeAppearance.value === 'withoutTongue')
		? '/icons/'
		: '/iconsTongue/');

	function switchSnakeAppearance () {
		if (snakeAppearance.value === 'withTongue')
			snakeAppearance.value = 'withoutTongue';
		else
			snakeAppearance.value = 'withTongue';
		window.localStorage.setItem('themeSnake', String(snakeAppearance.value));
	}

	return {
		snakeAppearance,
		linkToSnakeIcon,
		switchSnakeAppearance
	};
});
