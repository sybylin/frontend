<template>
	<div
		v-if="usersList"
		class="row q-pa-sm"
	>
		<div class="row full-width items-center text-h6 orkney-light">
			<div class="col-1 text-center right-border">
				<span>{{ $capitalize($t('dashboard.users.table.avatar')) }}</span>
			</div>
			<div class="col-1 text-center right-border">
				<span>{{ $capitalize($t('dashboard.users.table.verify')) }}</span>
			</div>
			<div class="col-1 text-center right-border">
				<span>{{ $capitalize($t('dashboard.users.table.role')) }}</span>
			</div>
			<div class="col-2 text-center right-border">
				<span>{{ $capitalize($t('dashboard.users.table.name')) }}</span>
			</div>
			<div class="col-2 text-center right-border">
				<span>{{ $capitalize($t('dashboard.users.table.email')) }}</span>
			</div>
			<div class="col-2 text-center right-border">
				<span>{{ $capitalize($t('dashboard.users.table.creationDate')) }}</span>
			</div>
			<div class="col-3 text-center">
				<span>{{ $capitalize($t('dashboard.users.table.actions')) }}</span>
			</div>
		</div>
		<q-separator class="q-mt-xs q-mb-xs full-width" />
		<template
			v-for="(user, i) of usersList"
			:key="user.id"
		>
			<div class="row full-width items-center">
				<div class="col-1">
					<q-img
						loading="lazy"
						:ratio="1"
						:alt="user.name"
						fit="cover"
						class="col-1 rounded"
						:src="user.avatar ? `${baseURL}${user.avatar}` : '/imgs/background.jpg'"
					/>
				</div>

				<div class="col-1 row justify-center">
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
				<div class="col-1 text-center row justify-center">
					<q-badge :color="badgeRoleColor(user.role)">
						<q-icon size="2em" :name="badgeRoleIcon(user.role)" />
						<q-tooltip
							anchor="center end"
							self="center left"
							:class="`bg-${badgeRoleColor(user.role)} text-body2`"
						>
							<span>{{ $capitalize($t(`dashboard.users.role.${user.role.toLowerCase()}`)) }}</span>
						</q-tooltip>
					</q-badge>
				</div>
				<span
					class="col-2 text-center text-body1 overflow-text"
					:title="user.name"
				>
					{{ user.name }}
				</span>
				<span
					class="col-2 text-center text-body1 overflow-text"
					:title="user.email"
				>
					{{ user.email }}
				</span>
				<span class="col-2 text-center text-body1 overflow-text">
					<template v-if="user.creation_date">
						<span>{{ creationDate(user.creation_date) }}</span>
						<br />
						<span>{{ creationDateHours(user.creation_date) }}</span>
					</template>
					<span v-else>...</span>
				</span>
				<div class="col-3 row items-center justify-evenly">
					<q-btn
						unelevated
						round
						icon="security"
						color="light-green-9"
					>
						<q-popup-proxy>
							<q-option-group
								v-model="usersList[i].role"
								class="q-pa-sm"
								:options="[
									{
										label: $capitalize($t('dashboard.users.role.administrator')),
										value: 'ADMINISTRATOR',
										'keep-color': true,
										color: 'orange-7'
									},
									{
										label: $capitalize($t('dashboard.users.role.moderator')),
										value: 'MODERATOR',
										'keep-color': true,
										color: 'deep-purple-7'
									},
									{
										label: $capitalize($t('dashboard.users.role.user')),
										value: 'USER',
										'keep-color': true,
										color: 'light-blue-7'
									}
								]"
								@update:model-value="(e) => updateRole(i, e)"
							/>
						</q-popup-proxy>
					</q-btn>
					<q-btn
						unelevated
						round
						color="orange-9"
						:icon="(usersList[i].blocked) ? 'person_off' : 'person'"
						@click="genDefaultTime(i)"
					>
						<q-popup-proxy @hide="() => timeError = false">
							<div
								v-if="timeError !== false"
								class="bg-red-7 text-white text-center text-body1 q-pa-sm full-width"
							>
								{{ $capitalize($t('dashboard.users.block.beforeTime')) }}
							</div>
							<div
								:class="{
									row: true,
									'no-wrap': $q.screen.gt.sm,
									'justify-center': true,
									'items-center': true,
									'q-ma-sm': true
								}"
							>
								<q-date
									v-model="usersList[i].time"
									:mask="timeMask"
									class="q-mr-sm"
								/>
								<q-time
									v-model="usersList[i].time"
									:mask="timeMask"
								/>
							</div>
							<div class="row justify-end q-pa-sm">
								<q-btn
									:label="$t('dashboard.users.block.unblock')"
									color="green-7"
									class="q-mr-sm"
									:disable="!usersList[i].blocked"
									@click="unblockUser(i)"
								/>
								<q-btn
									:label="$t('dashboard.users.block.block')"
									color="red-7"
									@click="blockUser(i)"
								/>
							</div>
						</q-popup-proxy>
					</q-btn>
				</div>
			</div>
			<q-separator v-if="i < usersNumber" class="full-width q-mb-xs q-mt-xs" />
		</template>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import { api, baseURL } from 'src/boot/axios';
import { capitalize } from 'src/boot/custom';
import type { user, Role } from 'src/types';

interface tableUser extends user {
	time: string | null;
}

export default defineComponent({
	name: 'PagesDashboardUser',
	setup () {
		const $q = useQuasar();
		const { t } = useI18n();
		// const store = globalStore();
		const pages = ref<number>(1);
		const user = ref<user | null>(null);
		const usersList = ref<tableUser[] | null>(null);
		const usersNumber = ref<number>(0);
		const timeError = ref<boolean | 'lower'>(false);
		const timeMask = 'YYYY-MM-DD HH:mm';

		const genDefaultTime = (i: number) => {
			if (!usersList.value)
				return;
			const pad = (n: number) => n < 10
				? `0${n}`
				: n.toString();
			const dateObj = new Date();
			usersList.value[i].time = `${pad(dateObj.getUTCFullYear())}-${pad(dateObj.getUTCMonth() + 1)}-${pad(dateObj.getUTCDate())} ${pad(dateObj.getUTCHours())}:${pad(dateObj.getUTCMinutes())}`;
		};

		const badgeRoleColor = (role: Role) => {
			switch (role) {
			case 'ADMINISTRATOR':
				return 'orange-7';
			case 'MODERATOR':
				return 'deep-purple-7';
			case 'USER':
			default:
				return 'light-blue-7';
			}
		};
		const badgeRoleIcon = (role: Role) => {
			switch (role) {
			case 'ADMINISTRATOR':
				return 'local_police';
			case 'MODERATOR':
				return 'shield';
			case 'USER':
			default:
				return 'person';
			}
		};
		const creationDate = (date: Date) => {
			const _date = new Date(date);
			return `${_date.getUTCDate()}/${_date.getUTCMonth() + 1}/${_date.getUTCFullYear()}`;
		};
		const creationDateHours = (date: Date) => {
			const _date = new Date(date);
			return `${_date.getUTCHours()}:${_date.getUTCMinutes()}`;
		};

		const isYourself = (i: number) => {
			if (!usersList.value || !user.value)
				return true;
			if (usersList.value[i].id === user.value.id) {
				$q.notify({ type: 'negative', message: capitalize(t('dashboard.users.cantChange')) });
				return true;
			}
			return false;
		};
		const updateRole = (i: number, role: Role) => {
			if (!usersList.value || !user.value)
				return;
			if (isYourself(i)) {
				usersList.value[i].role = user.value.role as Role;
				return;
			}
			api.post('/user/role', {
				id: usersList.value[i].id,
				role
			})
				.then((d) => {
					if (usersList.value && d.data.roleIsUpdate)
						usersList.value[i].role = role;
				})
				.catch((e) => $q.notify(e.response.data.info.message));
		};
		const blockUser = (i: number) => {
			timeError.value = false;
			if (!usersList.value || !user.value || !usersList.value[i].time || isYourself(i))
				return;
			const newDate = new Date();
			const parseDate = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2}) (?<hours>\d{2}):(?<minutes>\d{2})/
				.exec(usersList.value[i].time as string);
			if (!parseDate || !parseDate.groups)
				return;
			newDate.setUTCFullYear(
				Number(parseDate.groups.year),
				Number(parseDate.groups.month) - 1,
				Number(parseDate.groups.day)
			);
			newDate.setHours(
				Number(parseDate.groups.hours),
				Number(parseDate.groups.minutes),
				0,
				0
			);
			if (newDate.getTime() > new Date().getTime()) {
				api.post('/user/block', {
					id: usersList.value[i].id,
					date: newDate
				})
					.then((d) => {
						if (usersList.value)
							usersList.value[i].blocked = d.data.userBlocked;
					})
					.catch((e) => $q.notify(e.response.data.info.message));
			} else
				timeError.value = 'lower';
		};
		const unblockUser = (i: number) => {
			if (!usersList.value || !user.value || isYourself(i) || !usersList.value[i].blocked)
				return;
			api.post('/user/block', {
				id: usersList.value[i].id
			})
				.then(() => {
					if (usersList.value)
						usersList.value[i].blocked = false;
				})
				.catch((e) => $q.notify(e.response.data.info.message));
		};

		onMounted(() => {
			api.get('/user')
				.then((d) => {
					user.value = d.data.user;
				})
				.catch((e) => $q.notify(e.response.data.info.message));

			api.get(`/user/list/${pages.value}`)
				.then((d) => {
					usersList.value = d.data.users.map((e: user) => Object.assign({ time: null }, e));
					usersNumber.value = d.data.users.length - 1;
				})
				.catch((e) => $q.notify(e.response.data.info.message));
		});

		return {
			baseURL,
			usersList,
			usersNumber,
			timeError,
			timeMask,

			genDefaultTime,
			badgeRoleColor,
			badgeRoleIcon,
			creationDate,
			creationDateHours,
			updateRole,
			blockUser,
			unblockUser
		};
	}
});
</script>

<style scoped lang="scss">
.rounded {
	border-radius: 50%;
}

.overflow-text {
	padding-left: .2em;
	padding-right: .2em;
	white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.right-border {
	border-right: 1px solid $grey-7;
	word-break: break-all;
}
</style>
