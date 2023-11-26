<template>
	<q-btn
		unelevated
		round
		color="orange-9"
		:icon="($props.selectedUser.blocked) ? 'person_off' : 'person'"
		:disable="isSame"
		@click="genDefaultTime()"
	>
		<q-popup-proxy
			v-if="!isSame"
			@hide="() => timeError = false"
		>
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
					v-model="time"
					:mask="timeMask"
					class="q-mr-sm"
				/>
				<q-time
					v-model="time"
					:mask="timeMask"
				/>
			</div>
			<div class="row justify-end q-pa-sm">
				<q-btn
					:label="$t('dashboard.users.block.unblock')"
					color="green-7"
					class="q-mr-sm"
					:disable="!$props.selectedUser.blocked"
					@click="unblock()"
				/>
				<q-btn
					:label="$t('dashboard.users.block.block')"
					color="red-7"
					@click="block()"
				/>
			</div>
		</q-popup-proxy>
	</q-btn>
</template>

<script lang="ts">
import { computed, defineComponent, ref, PropType } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import type { user } from 'src/types';

export default defineComponent({
	name: 'PagesDashboardUsersEditRole',
	props: {
		currentUserId: {
			type: Number,
			required: true
		},
		selectedUser: {
			type: Object as PropType<user>,
			required: true
		}
	},
	emits: ['blocked'],
	setup (props, { emit }) {
		const $q = useQuasar();
		const time = ref<string | null>(null);
		const timeError = ref<boolean | 'lower'>(false);
		const isSame = computed(() => props.currentUserId === props.selectedUser.id);
		const timeMask = 'YYYY-MM-DD HH:mm';

		const genDefaultTime = () => {
			const pad = (n: number) => n < 10
				? `0${n}`
				: n.toString();
			const dateObj = new Date();
			time.value = `${pad(dateObj.getUTCFullYear())}-${pad(dateObj.getUTCMonth() + 1)}-${pad(dateObj.getUTCDate())} ${pad(dateObj.getUTCHours())}:${pad(dateObj.getUTCMinutes())}`;
		};

		const block = () => {
			timeError.value = false;
			if (!time.value || isSame.value)
				return;
			const newDate = new Date();
			const parseDate = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2}) (?<hours>\d{2}):(?<minutes>\d{2})/
				.exec(time.value);
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
					id: props.selectedUser.id,
					date: newDate
				})
					.then((d) => {
						emit('blocked', d.data.userBlocked);
					})
					.catch((e) => $q.notify(e.response.data.info.message));
			} else
				timeError.value = 'lower';
		};

		const unblock = () => {
			if (isSame.value || !props.selectedUser.blocked)
				return;
			api.post('/user/block', {
				id: props.selectedUser.id
			})
				.then(() => {
					genDefaultTime();
					emit('blocked', false);
				})
				.catch((e) => $q.notify(e.response.data.info.message));
		};

		return {
			time,
			timeError,
			isSame,
			timeMask,
			genDefaultTime,
			block,
			unblock
		};
	}
});
</script>
