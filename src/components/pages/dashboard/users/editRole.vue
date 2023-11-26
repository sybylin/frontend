<template>
	<q-btn
		unelevated
		round
		icon="security"
		color="light-green-9"
		:disable="isSame"
	>
		<q-popup-proxy v-if="!isSame">
			<q-option-group
				v-model="role"
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
			/>
		</q-popup-proxy>
	</q-btn>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch, PropType } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { api } from 'src/boot/axios';
import { capitalize } from 'src/boot/custom';
import type { Role } from 'src/types';

export default defineComponent({
	name: 'PagesDashboardUsersEditRole',
	props: {
		modelValue: {
			type: String as PropType<Role>,
			required: true
		},
		currentUserId: {
			type: Number,
			required: true
		},
		selectedUserId: {
			type: Number,
			required: true
		}
	},
	emits: ['update:modelValue'],
	setup (props, { emit }) {
		const $q = useQuasar();
		const { t } = useI18n();
		const role = ref<Role>(props.modelValue);
		const isSame = computed(() => props.currentUserId === props.selectedUserId);

		onMounted(() => {
			watch(role, (newRole, oldRole) => {
				if (oldRole === newRole)
					return;
				if (isSame.value) {
					$q.notify({ type: 'negative', message: capitalize(t('dashboard.users.cantChange')) });
					return;
				}
				api.post('/user/role', {
					id: props.selectedUserId,
					role: newRole
				})
					.then((d) => {
						if (d.data.roleIsUpdate)
							emit('update:modelValue', newRole);
					})
					.catch((e) => $q.notify(e.response.data.info.message));
			});
		});

		return {
			role,
			isSame
		};
	}
});
</script>
