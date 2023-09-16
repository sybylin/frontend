<template>
	<q-card
		flat
		bordered
		square
		class="q-ma-md q-pa-md profil row items-center"
	>
		<q-spinner-cube
			v-if="!Object.keys($props.user).length"
			color="primary" size="6em"
		/>
		<template v-else>
			<q-img
				alt="Profil"
				fit="cover"
				class="profil-image"
				:src="$props.user.avatar ?? '/imgs/background.jpg'"
			>
				<template v-slot:error>
					<span>Avatar not exist</span>
				</template>
			</q-img>
			<div class="full-height q-pl-xl column justify-around items-center profil-text">
				<div class="row items-center">
					<span class="text-h4 q-pr-md">{{ $props.user.name }}</span>
					<q-icon
						size="md"
						:name="($props.user.verify) ? 'verified_user' : 'gpp_bad'"
						:color="($props.user.verify) ? 'green-7' : 'red-7'"
					>
						<q-tooltip
							anchor="center right"
							self="center left"
							class="bg-secondary text-body2"
							:offset="[10, 10]"
						>
							<span>{{ ($props.user.verify) ? 'Ce compte est vérifier' : 'Ce compte n\'est pas vérifier' }}</span>
						</q-tooltip>
					</q-icon>
				</div>
				<components-pages-user-level :points="1000" />
			</div>
		</template>
	</q-card>
	<div class="full-width row">
		<h1>Last series</h1>
	</div>
	<div class="full-width row">
		<h1>Success</h1>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import ComponentsPagesUserLevel from './level.vue';

export interface user {
	name: string;
	creationDate: Date;
	avatar: string | null;
	verify?: boolean;
	id?: number;
	role?: 'USER' | 'MODERATOR' | 'ADMINISTRATOR';
	points?: number;
}

export default defineComponent({
	name: 'ComponentsPagesUserProfil',
	components: {
		ComponentsPagesUserLevel
	},
	props: {
		user: {
			type: Object as PropType<user>,
			required: true
		}
	},
	setup () {
		return {
			toto: 'tutu'
		};
	}
});
</script>

<style scoped>
.profil {
	height: 18em;
}
.profil-image {
	height: 15em;
	width: 15em;
	border-radius: 50% !important;
}
.profil-text {
	width: calc(100% - 15em);
}
</style>
