<template>
	<!--
		<template v-for="el in $props.list" :key="el.id">
		<template v-if="el.path && !(el.path as string).includes(':catchAll(.*)*')">
			<router-link v-if="!el.children" :to="$generatePath({ path: `/docs${el.path}` })">
				<span>{{ el.title }}</span>
			</router-link>
		</template>
	</template>
	-->
	<span>Hello world</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'LayoutsFooterMenu'
	/*
	props: {
		list: {
			type: Object as PropType<Record<string, element> | undefined>,
			required: true
		}
	}
	*/
});
</script>
