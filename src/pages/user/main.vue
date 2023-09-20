<template>
	<components-pages-user-profil :user="user" />
	<q-tabs
		v-model="tab"
		class="full-width"
	>
		<q-tab name="series" label="Series" />
		<q-tab name="achievement" label="Achievement" />
	</q-tabs>
	<q-tab-panels
		v-model="tab"
		keep-alive
		animated
		swipeable
		transition-prev="fade"
		transition-next="fade"
	>
		<q-tab-panel name="series">
			<div class="text-h4 q-mb-md">
				series
			</div>
		</q-tab-panel>
		<q-tab-panel name="achievement">
			<div class="text-h4 q-mb-md">
				<components-achievement-list :user="true" />
			</div>
		</q-tab-panel>
	</q-tab-panels>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'quasar';
import meta from 'src/meta';
import { api } from 'src/boot/axios';

import ComponentsPagesUserProfil, { user } from 'src/components/pages/user/profil.vue';
import ComponentsAchievementList from 'components/achievement/list.vue';

export default defineComponent({
	name: 'PageUserMain',
	components: {
		ComponentsPagesUserProfil,
		ComponentsAchievementList
	},
	setup () {
		const { t } = useI18n();
		const user = ref<user>({} as user);
		const tab = ref<'series' | 'achievement'>('series');

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
			user,
			tab
		};
	}
});
</script>

<style scoped>
.height {
	height: calc(100vh - 5em);
}
</style>
