<template>
	<div ref="editor" class="builderEditor">
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
