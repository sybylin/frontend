<template>
	<q-card
		v-if="selectedOST && selectedMusic"
		flat
		bordered
		:class="{
			'audio': true,
			'audio--desktop': $q.screen.md,
			'audio--tablet': $q.screen.sm,
			'audio--mobile': $q.screen.xs
		}"
	>
		<div class="column items-center justify-evenly q-pl-sm q-pr-sm">
			<q-img
				width="7em" height="7em"
				class="image q-pt-sm"
				:src="coverPath(selectedOST.path, selectedOST.cover)"
			/>
			<span
				:class="{
					'full-width': true,
					'text-center': true,
					'text-body2': true,
					'orkney-regular': true,
					'q-pt-sm': true,
					'text': true,
					'text--dark': $q.dark.isActive
				}"
			>
				{{ selectedMusic.name }} - {{ selectedOST.name }}
			</span>
			<q-slider
				v-model="currentTime"
				class="q-pt-sm q-pb-sm"
				color="light-blue-6"
				:min="0"
				:max="audio?.duration ?? 0"
				@pan="(p) => userChangeTimeline = (p === 'start')"
			/>
			<div class="full-width row justify-between items-center q-pb-sm">
				<q-btn
					round
					size="1.3em"
					icon="navigate_before"
					color="light-blue-7"
					@click="navigateAudio(false)"
				/>
				<q-btn
					round
					size="1.3em"
					color="light-blue-6"
					:icon="(musicPlay) ? 'pause' : 'play_arrow'"
					@click="playAudio()"
				/>
				<q-btn
					round
					size="1.3em"
					icon="navigate_next"
					color="light-blue-7"
					@click="navigateAudio(true)"
				/>
				<q-btn
					round
					size="1.3em"
					icon="shuffle"
					color="light-blue-7"
					@click="selectRandomOST()"
				/>
			</div>
			<div class="row no-wrap full-width items-center justify-between">
				<q-btn
					flat round color="light-blue-6"
					size=".8em"
					icon="volume_off"
					@click="() => volumeMusic = 0"
				/>
				<q-slider
					v-model="volumeMusic"
					color="light-blue-6"
					class="q-pl-sm q-pr-sm"
					:min="0"
					:max="1"
					:step="0.01"
				/>
				<q-btn
					flat round color="light-blue-6"
					size=".8em"
					icon="volume_up"
					@click="() => volumeMusic = 1"
				/>
			</div>
		</div>
		<audio
			ref="audio"
			class="audioTag"
			controls
			loop
			:autoplay="store.autoStartMusic"
			preload="metadata"
			@timeupdate="manageTime"
			@play="() => musicPlay = true"
		>
			<source
				v-for="source of selectedMusic.sources"
				:key="source.file"
				:src="musicPath(selectedOST.path, source.file)"
				:type="source.type"
			/>
			Your browser doesn't support audio
		</audio>
	</q-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { frontBaseUrl } from 'src/boot/axios';
import { optionsStore } from 'src/stores/options';
import soundtrackList from 'src/soundtrack';
import type { soundtrack, songs } from 'src/soundtrack/types';

export default defineComponent({
	name: 'AudioPlayer',
	setup () {
		const store = optionsStore();
		const audio = ref<HTMLAudioElement | null>(null);
		const selectedOST = ref<soundtrack | null>(null);
		const selectedMusic = ref<songs | null>(null);
		const volumeMusic = ref<number>(0.75);
		const userChangeTimeline = ref<boolean>(false);

		const currentTime = ref<number>(0);
		const musicPlay = ref<boolean>(false);

		const selectRandomOST = () => {
			const oldIndexOST = (selectedOST.value)
				? soundtrackList.findIndex((e) => e.name.localeCompare(selectedOST.value?.name ?? '') === 0)
				: -1;
			let ostID = -1;
			if (oldIndexOST === -1 || soundtrackList.length >= 1)
				ostID = Math.floor(Math.random() * soundtrackList.length);
			else {
				while (ostID === -1 || ostID === oldIndexOST)
					ostID = Math.floor(Math.random() * soundtrackList.length);
			}
			selectedOST.value = soundtrackList[ostID];
			selectedMusic.value = selectedOST.value.songs[
				Math.floor(Math.random() * selectedOST.value.songs.length)
			];
			audio.value?.load();
			if (musicPlay.value)
				audio.value?.play();
		};

		const manageTime = () => {
			if (!audio.value)
				return;
			currentTime.value = audio.value?.currentTime;
		};

		const coverPath = (path: string, file: string) => `${frontBaseUrl}${path}/${file}`;

		const musicPath = (path: string, file: string) => `${frontBaseUrl}${path}/${file}`;

		const playAudio = () => {
			if (!audio.value)
				return;
			if (musicPlay.value) {
				audio.value.pause();
				musicPlay.value = false;
			} else {
				audio.value.play();
				musicPlay.value = true;
			}
		};

		const navigateAudio = (next = true) => {
			if (!selectedOST.value || !selectedMusic.value)
				return;
			const index = selectedOST.value.songs.findIndex(
				(e) => e.name === selectedMusic.value?.name
			);
			if (next) {
				selectedMusic.value = selectedOST.value.songs[
					(index + 1 > selectedOST.value.songs.length - 1)
						? 0
						: index + 1
				];
			} else {
				selectedMusic.value = selectedOST.value.songs[
					(index - 1 < 0)
						? selectedOST.value.songs.length - 1
						: index - 1
				];
			}
			audio.value?.load();
			if (musicPlay.value)
				audio.value?.play();
		};

		onMounted(() => {
			selectRandomOST();

			watch(currentTime, (nct) => {
				if (!audio.value || !userChangeTimeline.value)
					return;
				audio.value.currentTime = nct;
			});

			watch(volumeMusic, (nvm) => {
				if (!audio.value)
					return;
				audio.value.volume = nvm;
			});
		});

		return {
			store,
			audio,
			selectedOST,
			selectedMusic,
			volumeMusic,
			userChangeTimeline,
			currentTime,
			musicPlay,
			selectRandomOST,
			manageTime,
			coverPath,
			musicPath,
			playAudio,
			navigateAudio
		};
	}
});
</script>

<style scoped lang="scss">
.audioTag {
	display: none;
}
.audio {
	padding: .5em;
}
.audio--desktop {
	width: 35vw;
}
.audio--tablet {
	width: 45vw;
}
.audio--mobile {
	width: 80vw;
}
.image {
	border-radius: .7em;
}
.text {
	overflow: hidden;
	text-overflow: ellipsis;
	color: black;
}
.text--dark {
	color: white;
}
</style>
