<template>
	<div class="row justify-center full-width q-pa-sm">
		<q-btn
			:key="idGen()"
			:disable="$props.check"
			color="secondary"
			unelevated
			icon="add"
			label="Add keywords"
			@click="add('')"
		/>
	</div>
	<q-card
		flat
		bordered
		square
		class="q-pa-sm full-width min-height"
	>
		<draggable
			v-model="solution"
			group="solution"
			item-key="id"
			direction="horizontal"
			tag="transition-group"
			class="row wrap justify-start"
			style="min-height: inherit;"
			handle=".move-icon"
			:component-data="{
				tag: 'div',
				type: 'transition-group',
				name: 'fade'
			}"
		>
			<template #item="{ index }">
				<div>
					<div
						:class="{
							'row': true,
							'items-center': true,
							'q-pa-xs': true,
							'q-ma-xs': true,
							'bg-grey-8': !$q.dark.isActive,
							'bg-grey-1': $q.dark.isActive
						}"
						style="border-radius: 3px"
					>
						<q-input
							v-model="solution[index].keyword"
							:disable="$props.check"
							dense
							square
						/>
						<q-btn
							unelevated
							round
							:disable="$props.check"
							size="sm"
							class="q-ml-sm move-icon"
							color="orange-7"
							icon="open_with"
						/>
						<q-btn
							unelevated
							round
							:disable="$props.check"
							size="sm"
							class="q-ml-sm"
							color="red-7"
							icon="delete"
							@click="remove(index)"
						/>
					</div>
				</div>
			</template>
		</draggable>
	</q-card>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import draggable from 'zhyswan-vuedraggable';

export default defineComponent({
	name: 'ComponentsPagesSeriesArray',
	components: {
		draggable
	},
	props: {
		check: {
			type: Boolean,
			required: true
		}
	},
	emits: ['check'],
	setup (props, { emit }) {
		const solution = ref<{ id: string; keyword: string; }[]>([]);

		const idGen = () => Math.random().toString(16).substring(2, 8);

		const add = (keyword: string) => {
			solution.value.push({
				id: idGen(),
				keyword
			});
		};

		const remove = (index: number) => solution.value.splice(index, 1);

		onMounted(() => {
			watch(props, (newVal) => {
				if (newVal.check)
					emit('check', solution.value.map((e) => e.keyword));
			});
		});

		return {
			solution,
			idGen,
			add,
			remove
		};
	}
});
</script>

<style scoped>
.min-height {
	min-height: 48px;
}
</style>
