<template>
	<div ref="editor" class="builderEditor">
		<blockquote>Hello</blockquote>
		<div class="q-pa-md row items-start q-gutter-md">
			<q-icon name="warning" color="warning" size="4rem" />
		</div>
		<q-card style="width: 250px">
			<img src="https://cdn.quasar.dev/img/mountains.jpg">

			<q-card-section>
				<div class="text-h6">
					Our Changing Planet
				</div>
				<div class="text-subtitle2">
					by John Do
				</div>
			</q-card-section>

			<q-card-section class="q-pt-none">
				text
			</q-card-section>
		</q-card>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import initGrapeJs from 'src/builder';
import 'grapesjs/dist/css/grapes.min.css';
import type { Editor } from 'grapesjs';

export default defineComponent({
	name: 'ComponentsBuilderMain',
	setup () {
		const grapesjsInstance = ref<Editor | null>(null);
		const editor = ref<HTMLElement | null>(null);

		onMounted(() => {
			initGrapeJs(editor.value as HTMLElement);
		});

		return {
			grapesjsInstance,
			editor
		};
	}
});
</script>
