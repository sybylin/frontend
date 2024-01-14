<template>
	<components-pages-user-profil :user="user" />
	<q-splitter
		v-model="splitter"
		:limits="[15,25]"
		style="height: auto;"
	>
		<template v-slot:before>
			<q-tabs
				v-model="tab"
				vertical
				class="text-teal"
				active-color="secondary"
				indicator-color="secondary"
			>
				<q-tab name="achievement" label="Achievement" />
				<q-tab name="series" label="Series" />
				<q-tab name="edition" label="Edition" />
			</q-tabs>
		</template>
		<template v-slot:after>
			<q-tab-panels
				v-model="tab"
				keep-alive
				animated
				class="transparent"
				transition-prev="fade"
				transition-next="fade"
			>
				<q-tab-panel name="achievement" style="font-size: 2rem;">
					<components-achievement-list :user="true" />
				</q-tab-panel>
				<q-tab-panel name="series">
					<components-pages-series :user="user" />
				</q-tab-panel>
				<q-tab-panel name="edition">
					<components-user-edit :user="user" @change="userChange" />
					<components-user-delete :user="user" />
				</q-tab-panel>
			</q-tab-panels>
		</template>
	</q-splitter>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'quasar';
import meta from 'src/meta';
import { api } from 'src/boot/axios';
import { globalStore } from 'src/stores/global';
import ComponentsPagesUserProfil from 'src/components/pages/user/profil.vue';
import ComponentsPagesSeries from 'src/components/pages/user/series.vue';
import ComponentsAchievementList from 'components/achievement/list.vue';
import ComponentsUserEdit from 'components/pages/user/edit.vue';
import ComponentsUserDelete from 'components/pages/user/delete.vue';
import type { user } from 'src/types';

export default defineComponent({
	name: 'PageUserMain',
	components: {
		ComponentsPagesUserProfil,
		ComponentsPagesSeries,
		ComponentsAchievementList,
		ComponentsUserEdit,
		ComponentsUserDelete
	},
	setup () {
		const { t } = useI18n();
		const store = globalStore();
		const splitter = ref<number>(20);
		const user = ref<user>({} as user);
		const tab = ref<'series' | 'achievement' | 'edition'>('achievement');

		useMeta(() => {
			return meta({
				meta: {
					title: t('user.meta.main.title'),
					description: t('user.meta.main.description'),
					keywords: ['Sybilin', 'user', 'manage']
				},
				og: {
					url: 'https://sybyl.in/user',
					title: t('user.meta.main.title'),
					description: t('user.meta.main.description'),
					image: 'https://sybyl.in/img/background.png'
				},
				twitter: {
					url: 'https://sybyl.in/user',
					title: t('user.meta.main.title'),
					description: t('user.meta.main.description'),
					image: 'https://sybyl.in/img/background.png'
				}
			});
		});

		const userChange = (v: { name: string, email: string, verify: boolean | null }) => {
			user.value.name = v.name;
			if (v.verify)
				user.value.verify = v.verify ?? undefined;
		};

		onMounted(() => {
			api.get('/user')
				.then((d) => {
					user.value = d.data.user;
					store.setUser(d.data.user);
				});
		});

		return {
			splitter,
			user,
			tab,
			userChange
		};
	}
});
</script>

<style scoped>
.height {
	height: calc(100vh - 5em);
}
.transparent {
	background-color: transparent;
}
</style>
