<template>
	<q-no-ssr>
		<q-btn
			v-if="store.isConnected"
			square flat color="white"
			:size="($props.inDrawer) ? undefined : 'lg'"
			:label="($props.inDrawer) ? 'Logout' : undefined"
			icon="logout"
			:style="($props.inDrawer) ? 'height: 48px' : 'height: 100%'"
			@click="onClick"
		/>
	</q-no-ssr>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { api, xsrfName } from 'src/boot/axios';
import { generatePath } from 'src/boot/route';
import { globalStore } from 'src/stores/global';

export default defineComponent({
	name: 'ComponentsMenuLogout',
	props: {
		inDrawer: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	setup () {
		const store = globalStore();
		const router = useRouter();

		const onClick = () => {
			api.get('/user/logout')
				.then(async () => {
					try {
						localStorage.removeItem(xsrfName);
						store.setIsConnected(false);
						store.setUser(null);
						store.setRole('user');
						await router.push(generatePath({ name: 'home' }, store.lang));
					} catch {
						// console.error('router push to home failed');
					}
				})
				.catch(() => {
					//
				});
		};

		return {
			store,
			onClick
		};
	}
});
</script>
