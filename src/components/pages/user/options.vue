<template>
	<div class="column full-width q-gutter-md">
		<q-list bordered>
			<q-expansion-item
				expand-separator
				icon="music_note"
				:label="$capitalize($t('user.options.music.title'))"
			>
				<div class="q-pa-sm">
					<div class="row no-wrap full-width justify-between items-center">
						<span class="text-body2 q-pr-md">
							{{ $capitalize($t('user.options.music.ost')) }}
						</span>
						<q-toggle
							v-model="store.autoStartMusic"
							size="3.5em"
							left-label
							color="green"
							checked-icon="check"
							unchecked-icon="clear"
						/>
					</div>
				</div>
			</q-expansion-item>
		</q-list>
	</div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { optionsStore } from 'src/stores/options';
import type { user } from 'src/types';

export default defineComponent({
	name: 'ComponentsPagesUser',
	props: {
		user: {
			type: Object as PropType<user>,
			required: true
		}
	},
	setup () {
		const store = optionsStore();

		return {
			store
		};
	}
});
</script>
