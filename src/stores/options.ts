import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

interface options {
	autoStartMusic: boolean;
}

export const optionsStore = defineStore('options', () => {
	const autoStartMusic = ref<boolean>(true);

	function setAutoStartMusic (value: boolean) {
		autoStartMusic.value = value;
	}

	watch(optionsStore, (d) => {
		window.localStorage.setItem('options', JSON.stringify({
			autoStartMusic: d.autoStartMusic
		} as options));
	}, { deep: true });

	return {
		autoStartMusic,
		setAutoStartMusic
	};
});

export const hydrate = () => {
	const options = window.localStorage.getItem('options');
	if (!options)
		return;
	const obj = JSON.parse(options) as options;
	optionsStore().setAutoStartMusic(obj.autoStartMusic);
};
