<template>
	<q-btn
		v-if="store.isConnected"
		square flat color="white"
		:size="($props.inDrawer) ? undefined : 'lg'"
		:label="($props.inDrawer) ? 'Logout' : undefined"
		icon="logout"
		:style="($props.inDrawer) ? 'height: 48px' : undefined"
		@click="onClick"
	/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
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
		const { locale } = useI18n();

		const onClick = () => {
			api.get('/user/logout')
				.then(async () => {
					try {
						localStorage.removeItem(xsrfName);
						store.setIsConnected(false);
						await router.push({ path: generatePath({ name: 'home' }, locale) });
					} catch (e) {
						console.error('router push to home failed');
					}
				})
				.catch(() => {
					console.error('/user/logout failed');
				});
		};

		return {
			store,
			onClick
		};
	}
});
</script>
