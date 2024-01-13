<template>
	<q-list
		bordered
		:class="{
			transparent: true,
			partial: $q.screen.gt.sm,
			full: !$q.screen.gt.sm,
		}"
	>
		<q-expansion-item
			v-model="expanded"
			icon="person_remove"
			header-class="text-red-7"
			:label="$capitalize($t('user.delete.title'))"
		>
			<div class="column q-pa-sm">
				<div class="column full-width items-center justify-center">
					<span class="text-h5 orkney-medium q-pa-md">{{ $capitalize($t('user.delete.title')) }}</span>
					<p class="text-body1 text-center">
						{{ $capitalize($t('user.delete.description')) }}
					</p>
					<p class="text-body1 text-center">
						{{ $capitalize($t('user.delete.descriptionMore')) }}
					</p>
					<div class="bg-indigo-6 text-white full-width row items-center justify-center">
						<span class="text-h5 q-pa-sm">
							{{ $props.user.name }}
						</span>
					</div>
				</div>
				<q-form
					class="q-pt-md"
					@submit="onSubmitDelete"
					@reset="onResetDelete"
				>
					<q-input
						v-model="deleteName"
						bottom-slots
						outlined
						:label="$capitalize($t('user.delete.label'))"
						lazy-rules
						:rules="[ val => val && val.length > 0 && val.localeCompare($props.user.name) === 0 || $capitalize($t('user.delete.error'))]"
					/>
					<div class="row reverse">
						<q-btn
							:label="$capitalize($t('user.connection.step.1.submit'))"
							type="submit"
							color="red-7"
							:disable="!deleteName || deleteName.localeCompare($props.user.name) !== 0"
							class="q-ml-sm"
						/>
						<q-btn
							:label="$capitalize($t('user.connection.step.1.reset'))"
							type="reset"
							color="red-7"
							flat
						/>
					</div>
				</q-form>
			</div>
		</q-expansion-item>
	</q-list>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { api } from 'src/boot/axios';
import { capitalize } from 'src/boot/custom';
import { globalStore } from 'src/stores/global';
import type { user } from 'src/types';

export default defineComponent({
	name: 'ComponentsPagesUserDelete',
	props: {
		user: {
			type: Object as PropType<user>,
			required: true
		}
	},
	setup (props) {
		const $q = useQuasar();
		const router = useRouter();
		const { t } = useI18n();
		const storeInstance = globalStore();
		const expanded = ref<boolean>(false);
		const deleteName = ref<string | null>(null);

		const onSubmitDelete = () => {
			if (!deleteName.value || deleteName.value.localeCompare(props.user.name) !== 0)
				return;
			api.delete('/user')
				.then(() => {
					storeInstance.setIsConnected(false);
					storeInstance.setRole('user');
					storeInstance.setUser(null);
					$q.notify({ type: 'info', message: capitalize(t('user.delete.ok')) });
					router.push({ name: 'home' });
				})
				.catch((e) => $q.notify({ type: 'error', message: e.response.data.info.message }));
		};

		const onResetDelete = () => {
			deleteName.value = null;
		};

		return {
			expanded,
			deleteName,
			onSubmitDelete,
			onResetDelete
		};
	}
});
</script>

<style scoped lang="scss">
.transparent {
	background-color: transparent;
	border-color: $red-7;
}
.full {
	width: 100%;
}
.partial {
	width: 80%;
}
</style>
