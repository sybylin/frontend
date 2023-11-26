<template>
	<div
		v-if="!usersList || !currentUser"
		class="full-width row justify-center items-center q-pt-xl q-pb-xl"
	>
		<q-spinner-cube color="deep-purple-6" size="6em" />
	</div>
	<div
		v-else-if="!usersList.length"
		class="full-width row justify-center"
	>
		<span class="text-h4 text-weight-light q-pt-xl">
			{{ $capitalize($t('dashboard.users.noUsers')) }}
		</span>
	</div>
	<q-infinite-scroll
		v-else
		class="full-width"
		:offset="400"
		:debounce="100"
		@load="onLoad"
	>
		<template
			v-for="(user, index) in usersList"
			:key="index"
		>
			<div class="row full-width items-center">
				<div class="gt-sm col-1">
					<q-img
						loading="lazy"
						:ratio="1"
						:alt="user.name"
						fit="cover"
						class="col-1 rounded"
						:src="user.avatar ? `${baseURL}${user.avatar}` : '/imgs/background.jpg'"
					/>
				</div>
				<div class="gt-sm col-1 row justify-center">
					<q-icon
						size="md" :name="(user.verify) ? 'verified_user' : 'gpp_bad'"
						:color="(user.verify) ? 'green-7' : 'red-7'"
					>
						<q-tooltip
							anchor="center right"
							self="center left"
							:class="{
								'text-body2': true,
								'bg-green-7': user.verify,
								'bg-red-7': !user.verify,
							}"
							:offset="[10, 10]"
						>
							<span>
								{{ $capitalize($t(`user.${(user.verify) ? 'verify' : 'unverify'}`)) }}
							</span>
						</q-tooltip>
					</q-icon>
				</div>
				<div class="gt-xs col-1 text-center row justify-center">
					<q-badge :color="badge(user.role, true)">
						<q-icon size="2em" :name="badge(user.role)" />
						<q-tooltip
							anchor="center end"
							self="center left"
							:class="`bg-${badge(user.role, true)} text-body2`"
						>
							<span>{{ $capitalize($t(`dashboard.users.role.${user.role.toLowerCase()}`)) }}</span>
						</q-tooltip>
					</q-badge>
				</div>
				<span
					class="col-xs-4 col-sm-2 text-center text-body1 overflow-text"
					:title="user.name"
				>
					{{ user.name }}
				</span>
				<span
					class="gt-xs col-sm-3 col-md-2 text-center text-body1 overflow-text"
					:title="user.email"
				>
					{{ user.email }}
				</span>
				<span class="col-xs-5 col-sm-3 col-md-2 text-center text-body1 overflow-text">
					<template v-if="user.creation_date">
						<span>{{ date(user.creation_date) }}</span>
						<br />
						<span>{{ date(user.creation_date, true) }}</span>
					</template>
					<span v-else>...</span>
				</span>
				<div class="col-3 row items-center justify-evenly">
					<role
						v-model="user.role"
						:current-user-id="currentUser.id"
						:selected-user-id="user.id"
					/>
					<blocked
						:current-user-id="currentUser.id"
						:selected-user="user"
						@blocked="(b: boolean) => {
							if (usersList)
								usersList[index].blocked = b;
						}"
					/>
				</div>
			</div>
			<q-separator v-if="index < usersNumber" class="full-width q-mb-xs q-mt-xs" />
		</template>
		<template v-slot:loading>
			<div class="row justify-center q-ma-md">
				<q-spinner-dots color="deep-purple-6" size="3.5em" />
			</div>
		</template>
	</q-infinite-scroll>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, PropType } from 'vue';
import { useQuasar } from 'quasar';
import { api, baseURL } from 'src/boot/axios';
import role from './editRole.vue';
import blocked from './editBlocked.vue';
import type { user, Role } from 'src/types';
import type { sort } from 'src/pages/dashboard/users.vue';

export default defineComponent({
	name: 'ComponentsPagesDashboardUsersList',
	components: {
		role,
		blocked
	},
	props: {
		modelValue: {
			type: Boolean,
			required: true
		},
		currentUser: {
			type: Object as PropType<user>,
			required: true
		},
		search: {
			type: [String, null] as PropType<string | null>,
			required: true
		},
		sortBy: {
			type: Object as PropType<sort>,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const $q = useQuasar();
		const size = 1;

		const apiGetUsers = ref<boolean>(props.modelValue);
		const usersList = ref<user[] | null>(null);
		const usersNumber = ref<number>(0);

		const onLoad = (_id: number, done: (stop: boolean) => void) => getUsers(props.sortBy, props.search, done);

		const badge = (role: Role, color = false) => {
			switch (role) {
			case 'ADMINISTRATOR':
				return (color)
					? 'orange-7'
					: 'local_police';
			case 'MODERATOR':
				return (color)
					? 'deep-purple-7'
					: 'shield';
			case 'USER':
			default:
				return (color)
					? 'light-blue-7'
					: 'person';
			}
		};

		const date = (date: Date, hours = false) => {
			const _date = new Date(date);
			return (hours)
				? `${_date.getUTCHours()}:${_date.getUTCMinutes()}`
				: `${_date.getUTCDate()}/${_date.getUTCMonth() + 1}/${_date.getUTCFullYear()}`;
		};

		/**
		 * Get users
		 * @param page Page
		 * @param sort Sort type (1: name asc, 2: name desc, 3: creation_date asc, 4: creation_date desc)
		 */
		const getLastElement = () => {
			if (!usersList.value || !usersList.value.length)
				return undefined;
			return usersList.value[usersList.value.length - 1][
				(props.sortBy.value <= 2)
					? 'name'
					: 'creation_date'
			];
		};

		const getUsers = (
			sortBy: { label: string, value: number },
			search: string | null,
			done?: (stop: boolean) => void
		) => {
			apiGetUsers.value = true;
			if (!done)
				usersList.value = null;
			api.post('/user/list', {
				sort: sortBy.value,
				last_element: getLastElement(),
				search: search ?? undefined
			})
				.then((d) => {
					if (!done)
						usersList.value = d.data.users;
					else
						usersList.value?.push(...d.data.users);
					usersNumber.value = (usersList.value as user[]).length - 1;
					if (done)
						done(d.data.users.length < size);
				})
				.catch((e) => $q.notify(e.response.data.info.message))
				.finally(() => {
					apiGetUsers.value = false;
				});
		};

		onMounted(() => {
			getUsers(props.sortBy, props.search);

			watch(apiGetUsers, (n) => emit('update:modelValue', n));
			watch(() => props.search, (n) => {
				getUsers(props.sortBy, n);
			});
			watch(() => props.sortBy, (n) => {
				getUsers(n, props.search);
			});
		});

		return {
			baseURL,
			apiGetUsers,
			usersList,
			usersNumber,
			onLoad,
			badge,
			date,
			getUsers
		};
	}
});
</script>

<style scoped>
.rounded {
	border-radius: 20%;
}
</style>
