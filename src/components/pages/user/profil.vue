<template>
	<q-card
		flat bordered square
		class="q-ma-md q-pa-md profil row items-center"
	>
		<q-spinner-cube v-if="!Object.keys($props.user).length" color="primary" size="6em" />
		<template v-else>
			<div v-if="$q.screen.gt.xs" class="profil-image">
				<q-img
					v-if="$props.public"
					alt="Profil"
					:src="$props.user.avatar ? `${baseURL}${$props.user.avatar}` : '/imgs/background.jpg'"
					class="rounded"
				/>
				<image-upload
					v-else
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
					<template v-if="$props.displayRole">
						<q-icon name="remove" />
						<q-icon size="md" :name="badge(user.role)" :color="badge(user.role, true)">
							<q-tooltip
								anchor="center end"
								self="center left"
								:class="`bg-${badge(user.role, true)} text-body2`"
							>
								<span>{{ $capitalize($t(`dashboard.users.role.${user.role.toLowerCase()}`)) }}</span>
							</q-tooltip>
						</q-icon>
					</template>
				</div>
				<components-pages-user-level :points="points" />
			</div>
		</template>
	</q-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from 'vue';
import { api, baseURL } from 'src/boot/axios';
import ComponentsPagesUserLevel from './level.vue';
import ImageUpload from 'components/pages/imageUpload.vue';
import type { user, Role } from 'src/types';

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
		},
		public: {
			type: Boolean,
			required: false,
			default: false
		},
		displayRole: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	setup () {
		const points = ref<number>(0);

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
			baseURL,
			points,
			badge
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
.rounded {
	border-radius: 50%;
}
</style>
