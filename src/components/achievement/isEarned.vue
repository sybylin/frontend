<template>
	<q-dialog
		ref="dialogRef"
		no-route-dismiss
		@hide="onDialogHide"
	>
		<q-card
			bordered
			flat
			class="q-pa-sm"
			style="width: 40em"
		>
			<q-card-section class="text-center">
				<span class="text-h4 text-weight-light">{{ $capitalize($t('achievement.earn')) }}</span>
			</q-card-section>
			<q-separator class="q-mt-sm" />
			<q-card-section class="row inline full-width justify-around">
				<q-img
					alt="Profil"
					fit="cover"
					class="image"
					:src="`/imgs/achievement/${$props.name}.png`"
				/>
				<div class="text column justify-center items-center">
					<span class="text-h4 q-pb-lg">{{ $capitalize($t(`achievement.list.${$props.name}.title`)) }}</span>
					<span class="text-body1">{{ $capitalize($t(`achievement.list.${$props.name}.description`)) }}</span>
				</div>
			</q-card-section>
			<q-separator class="q-mt-sm" />
			<q-card-section class="row justify-end">
				<q-btn v-close-popup color="secondary" label="close" />
			</q-card-section>
		</q-card>
	</q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useDialogPluginComponent } from 'quasar';

export default defineComponent({
	name: 'ComponentsAchievementIsEarned',
	props: {
		name: {
			type: String,
			required: true
		},
		timestamp: {
			type: Date,
			required: true
		}
	},
	emits: [...useDialogPluginComponent.emits],
	setup () {
		const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

		const onClose = () => onDialogOK();
		const onCancel = () => onDialogCancel();

		return {
			dialogRef,
			onDialogHide,
			onClose,
			onCancel
		};
	}
});
</script>

<style scoped>
.image {
	width: 10em;
}
.text {
	width: calc(100% - 10em);
}
</style>
