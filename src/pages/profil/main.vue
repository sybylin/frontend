<template>
	<div
		v-if="user === null"
		class="full-width row justify-center q-pt-xl q-pb-xl"
	>
		<q-spinner-cube size="8em" color="deep-purple-6" />
	</div>
	<error v-else-if="user === false" />
	<template v-else>
		<components-pages-user-profil
			:user="(user as any)"
			public
			display-role
		/>
		<div class="full-width q-pl-md q-pr-md">
			<q-tabs
				v-model="tabs"
				class="full-width text-secondary" align="justify"
				dense
			>
				<q-tab name="started" icon="play_arrow" label="Series started" />
				<q-tab name="finished" icon="play_circle" label="Series finished" />
			</q-tabs>
			<q-tab-panels v-model="tabs" style="background-color: transparent;">
				<q-tab-panel name="started">
					<div v-if="!user.series_started.length" class="full-width column items-center q-pt-xl q-pb-xl">
						<q-icon name="comments_disabled" size="10em" color="red-7" />
						<span class="text-h5 orkney-regular">
							{{ $capitalize($t('profil.noStarted')) }}
						</span>
					</div>
					<components-profil-card
						:user="user"
						selected="started"
					/>
				</q-tab-panel>
				<q-tab-panel name="finished">
					<div v-if="!user.series_finished.length" class="full-width column items-center q-pt-xl q-pb-xl">
						<q-icon name="comments_disabled" size="10em" color="red-7" />
						<span class="text-h5 orkney-regular">
							{{ $capitalize($t('profil.noFinished')) }}
						</span>
					</div>
					<components-profil-card
						:user="user"
						selected="finished"
					/>
				</q-tab-panel>
			</q-tab-panels>
		</div>
	</template>
</template>

<script lang="ts">
import { computed, defineComponent, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useMeta } from 'quasar';
import { api, baseURL } from 'src/boot/axios';
import { capitalize } from 'src/boot/custom';
import Error from 'src/pages/error.vue';
import meta from 'src/meta';
import ComponentsPagesUserProfil from 'src/components/pages/user/profil.vue';
import ComponentsProfilCard from 'src/components/pages/profil/card.vue';
import type { profil } from 'src/types';

export default defineComponent({
	name: 'PagesProfilMain',
	components: {
		ComponentsPagesUserProfil,
		ComponentsProfilCard,
		Error
	},
	setup () {
		const { t } = useI18n();
		const route = useRoute();
		const user = ref<profil | false | null>(null);
		const tabs = ref<'started' | 'finished'>('started');
		const computedTitle = computed<string>(() => (user.value)
			? `${user.value.name} | ${capitalize(t('profil.meta.main.title'))}`
			: t('profil.meta.main.title'));
		const computedUrl = computed<string>(() => (user.value)
			? `https://sybyl.in/profil/${user.value.name}`
			: 'https://sybyl.in/profil');

		useMeta(() => {
			return meta({
				meta: {
					title: computedTitle.value,
					description: capitalize(t('profil.meta.main.description')),
					keywords: ['profil']
				},
				og: {
					url: computedUrl.value,
					title: computedTitle.value,
					description: capitalize(t('profil.meta.main.description')),
					image: 'https://sybyl.in/img/background.png'
				},
				twitter: {
					url: computedUrl.value,
					title: computedTitle.value,
					description: capitalize(t('profil.meta.main.description')),
					image: 'https://sybyl.in/img/background.png'
				}
			});
		});

		onMounted(() => {
			if (!route.params.username)
				user.value = false;
			else {
				api.get(`/user/${route.params.username}`)
					.then((d) => {
						user.value = d.data.user;
					})
					.catch(() => {
						user.value = false;
					});
			}
		});

		return {
			baseURL,
			user,
			tabs
		};
	}
});
</script>
