<template>
	<q-layout view="hhh LpR fff">
		<header-layout />
		<q-page-container>
			<q-page>
				<div>
					<router-view />
				</div>
			</q-page>
		</q-page-container>
		<footer-layout />
	</q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HeaderLayout from '../components/layouts/header.vue';
import FooterLayout from '../components/layouts/footer.vue';

export default defineComponent({
	name: 'MainLayouts',
	components: {
		HeaderLayout,
		FooterLayout
	}
});
</script>
