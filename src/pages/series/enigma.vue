<!-- eslint-disable vue/no-v-html -->
<template>
	<div v-if="!enigma" class="row justify-center items-center q-pt-xl q-pb-xl">
		<q-spinner-cube color="deep-purple-6" size="6em" />
	</div>
	<template v-else>
		<q-img
			loading="lazy"
			fit="cover"
			style="height: 30em;"
			:src="(enigma.image) ? `${baseURL}${enigma.image}` : '/imgs/background.jpg' "
		>
			<div class="absolute-bottom">
				<span class="text-h5">{{ enigma.title }}</span>
			</div>
		</q-img>
		<div class="q-pa-sm" v-html="enigma.html"></div>
		<q-separator class="q-ma-sm" />
		<h5>SOLUTION</h5>
	</template>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { brotliDecompress } from 'src/boot/brotli';
import { api, baseURL } from 'src/boot/axios';

interface enigma {
	title: string;
	image: string | null;
	description: string;
	html: string;
}

export default defineComponent({
	name: 'EnigmaPages',
	setup () {
		const route = useRoute();
		const enigma = ref<enigma | null>(null);

		onMounted(() => {
			api.post('/enigma/page/get/prod', {
				enigma_id: Number(route.params.enigmaId)
			})
				.then(async (d) => {
					enigma.value = {
						title: d.data.info.title,
						image: d.data.info.image,
						description: d.data.info.description,
						html: await brotliDecompress(d.data.enigma) ?? ''
					};
				})
				.catch((e) => console.error(e));
		});

		return {
			baseURL,
			enigma
		};
	}
});
</script>
