<template>
	<div class="row q-pa-sm">
		<div class="row justify-around full-width q-pb-md">
			<q-input
				v-model="search"
				label="Search user"
				style="width: 40%"
				debounce="500"
				:loading="apiGetUsers"
				:readonly="apiGetUsers"
			>
				<template v-slot:append>
					<q-icon name="search" />
				</template>
			</q-input>
			<q-select
				v-model="sortBy"
				style="width: 25%"
				:disable="apiGetUsers"
				:options="[
					{ label: $capitalize($t('dashboard.users.sort.nameAsc')), value: 1 },
					{ label: $capitalize($t('dashboard.users.sort.nameDesc')), value: 2 },
					{ label: $capitalize($t('dashboard.users.sort.creationDateAsc')), value: 3 },
					{ label: $capitalize($t('dashboard.users.sort.creationDateDesc')), value: 4 }
				]"
			/>
		</div>
		<div class="row full-width items-center text-h6 orkney-light">
			<div class="gt-sm col-1 text-center right-border">
				<span>{{ $capitalize($t('dashboard.users.table.avatar')) }}</span>
			</div>
			<div class="gt-sm col-1 text-center right-border">
				<span>{{ $capitalize($t('dashboard.users.table.verify')) }}</span>
			</div>
			<div class="gt-xs col-1 text-center right-border">
				<span>{{ $capitalize($t('dashboard.users.table.role')) }}</span>
			</div>
			<div class="col-xs-4 col-sm-2 text-center right-border">
				<span>{{ $capitalize($t('dashboard.users.table.name')) }}</span>
			</div>
			<div class="gt-xs col-sm-3 col-md-2 text-center right-border">
				<span>{{ $capitalize($t('dashboard.users.table.email')) }}</span>
			</div>
			<div class="col-xs-5 col-sm-3 col-md-2 text-center right-border">
				<span>{{ $capitalize($t('dashboard.users.table.creationDate')) }}</span>
			</div>
			<div class="col-3 text-center">
				<span>{{ $capitalize($t('dashboard.users.table.actions')) }}</span>
			</div>
		</div>
		<q-separator class="q-mt-xs q-mb-xs full-width" />
		<list
			v-if="currentUser"
			v-model="apiGetUsers"
			:current-user="currentUser"
			:search="search"
			:sort-by="sortBy"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useQuasar, useMeta } from 'quasar';
import { useI18n } from 'vue-i18n';
import { api } from 'src/boot/axios';
import { capitalize } from 'src/boot/custom';
import list from 'src/components/pages/dashboard/users/list.vue';
import meta from 'src/meta';
import type { user } from 'src/types';
export interface sort { label: string, value: number }

export default defineComponent({
	name: 'PagesDashboardUsersIndex',
	components: {
		list
	},
	setup () {
		const $q = useQuasar();
		const { t } = useI18n();

		const currentUser = ref<user | null>(null);
		const apiGetUsers = ref<boolean>(false);
		const search = ref<string | null>(null);
		const sortBy = ref<sort>({ label: capitalize(t('dashboard.users.sort.nameAsc')), value: 1 });

		useMeta(() => {
			return meta({
				meta: {
					title: capitalize(t('dashboard.users.title')),
					description: capitalize(t('dashboard.users.desc'))
				},
				og: {
					url: 'https://sybyl.in/dashboard/users',
					title: capitalize(t('dashboard.users.title')),
					description: capitalize(t('dashboard.users.desc')),
					image: 'https://sybyl.in/img/background.png'
				},
				twitter: {
					url: 'https://sybyl.in/dashboard/users',
					title: capitalize(t('dashboard.users.title')),
					description: capitalize(t('dashboard.users.desc')),
					image: 'https://sybyl.in/img/background.png'
				}
			});
		});

		onMounted(() => {
			api.get('/user')
				.then((d) => {
					currentUser.value = d.data.user;
				})
				.catch((e) => $q.notify(e.response.data.info.message));
		});

		return {
			currentUser,
			apiGetUsers,
			search,
			sortBy
		};
	}
});
</script>

<style scoped lang="scss">
.right-border {
	border-right: 1px solid $grey-7;
	word-break: break-all;
}
</style>
