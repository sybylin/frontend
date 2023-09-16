<template>
	<components-pages-user-profil :user="user" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'quasar';
import meta from 'src/meta';
import { api } from 'src/boot/axios';

import ComponentsPagesUserProfil, { user } from 'src/components/pages/user/profil.vue';

export default defineComponent({
	name: 'PageUserMain',
	components: {
		ComponentsPagesUserProfil
	},
	setup () {
		const { t } = useI18n();
		const user = ref<user>({} as user);

		useMeta(() => {
			return meta({
				meta: {
					title: t('user.meta.main.title'),
					description: t('user.meta.main.description'),
					keywords: ['Sibyllin', 'user', 'manage']
				},
				og: {
					url: 'https://sibyllin.app/user',
					title: t('user.meta.main.title'),
					description: t('user.meta.main.description'),
					image: 'https://sibyllin.app/img/background.png'
				},
				twitter: {
					url: 'https://sibyllin.app/user',
					title: t('user.meta.main.title'),
					description: t('user.meta.main.description'),
					image: 'https://sibyllin.app/img/background.png'
				}
			});
		});

		onMounted(() => {
			api.get('/user')
				.then((d) => {
					user.value = d.data.user;
				});
		});

		return {
			user
		};
	}
});
</script>

<style scoped>
.height {
	height: calc(100vh - 5em);
}
</style>
