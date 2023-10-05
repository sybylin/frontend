<template>
	<h4>editEnigma</h4>
	{{ enigma }}
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute } from 'vue-router';
import { api } from 'src/boot/axios';
import type { enigma } from 'src/components/pages/creation/serieEnigmasList.vue';

export default defineComponent({
	name: 'PagesCreateEditEnigma',
	setup () {
		const $q = useQuasar();
		const route = useRoute();
		const enigma = ref<enigma | null>(null);

		onBeforeMount(() => {
			api.get('/enigma/isCreator')
				.then((d) => console.log(d))
				.catch((e) => console.error(e.response.data));

			api.post('/enigma/one', { id: route.params.enigmaId })
				.then((d) => {
					console.log(d.data);
					enigma.value = d.data.enigma;
				})
				.catch((e) => $q.notify(e.response.info.message));
		});

		return {
			enigma
		};
	}
});
</script>
