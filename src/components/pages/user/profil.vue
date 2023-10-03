<template>
	<q-card
		flat bordered square
		class="q-ma-md q-pa-md profil row items-center"
	>
		<q-spinner-cube v-if="!Object.keys($props.user).length" color="primary" size="6em" />
		<template v-else>
			<div class="profil-image">
				<image-upload
					v-if="$q.screen.gt.xs"
					v-model="$props.user.avatar"
					alt="Profil"
					api-path="/user/image"
					:put-method="true"
					:rounded="true"
				/>
			</div>
			<div
				class="full-height column justify-around items-center"
				:style="$q.screen.lt.sm ? 'width: 100%' : 'width: calc(100% - 15em); padding-left: 48px'"
			>
				<div class="row items-center">
					<span class="text-h4 q-pr-md">{{ $props.user.name }}</span>
					<q-icon
						size="md" :name="($props.user.verify) ? 'verified_user' : 'gpp_bad'"
						:color="($props.user.verify) ? 'green-7' : 'red-7'"
					>
						<q-tooltip
							anchor="center right" self="center left" class="bg-secondary text-body2"
							:offset="[10, 10]"
						>
							<span>
								{{ $capitalize($t(`user.${($props.user.verify) ? 'verify' : 'unverify'}`)) }}
							</span>
						</q-tooltip>
					</q-icon>
				</div>
				<components-pages-user-level :points="points" />
			</div>
		</template>
	</q-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from 'vue';
import { api } from 'src/boot/axios';
import ComponentsPagesUserLevel from './level.vue';
import ImageUpload from 'components/pages/imageUpload.vue';

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
		ComponentsPagesUserLevel,
		ImageUpload
	},
	props: {
		user: {
			type: Object as PropType<user>,
			required: true
		}
	},
	setup () {
		const points = ref<number>(0);

		onMounted(() => {
			api.get('/user/points')
				.then((d) => d.data)
				.then((d) => {
					points.value = d.points;
				})
				.catch(() => {
					///
				});
		});

		return {
			points
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
}

.profil-text {
	width: calc(100% - 15em);
}
</style>
