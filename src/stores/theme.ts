import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export type snake = 'withoutTongue' | 'withTongue';
export const themeStore = defineStore('theme', () => {
	const snakeAppearance = ref<snake>('withoutTongue');
	const linkToSnakeIcon = computed(() => (snakeAppearance.value === 'withoutTongue')
		? '/icons/'
		: '/iconsTongue/');

	function setSnakeAppearance (v: snake) {
		snakeAppearance.value = v;
	}

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
		setSnakeAppearance,
		switchSnakeAppearance
	};
});

export const hydrate = () => {
	const snakeAppearance = window.localStorage.getItem('themeSnake') as snake;
	if (snakeAppearance)
		themeStore().setSnakeAppearance(snakeAppearance);
};
