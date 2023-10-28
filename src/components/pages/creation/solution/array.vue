<template>
	<div class="row justify-center q-pb-sm">
		<q-btn
			color="secondary"
			unelevated
			icon="add"
			label="Add keywords"
			@click="add('')"
		/>
	</div>
	<template v-if="arraySolution && arraySolution.list.length">
		<q-card
			flat
			bordered
			square
			class="q-pa-sm"
		>
			<draggable
				v-model="arraySolution.list"
				group="arraySolution"
				item-key="id"
				direction="horizontal"
				tag="transition-group"
				class="row wrap justify-start"
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
								v-model="arraySolution.list[index].keyword"
								dense
								square
							/>
							<q-btn
								unelevated
								round
								size="sm"
								class="q-ml-sm move-icon"
								color="orange-7"
								icon="open_with"
							/>
							<q-btn
								unelevated
								round
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
		<div class="row no-wrap justify-end items-center q-pa-sm">
			<span class="text-body2">
				{{ $capitalize($t('create.main.solution.toggleKeywords')) }}
				<q-icon name="help" size="sm" color="light-blue-8">
					<q-tooltip
						anchor="bottom middle" self="bottom middle" class="bg-light-blue-8 text-body2 text-center"
						:offset="[0,40]"
					>
						{{ $capitalize($t('create.main.solution.toggleHelpKeywords')) }}
					</q-tooltip>
				</q-icon>
			</span>
			<q-toggle v-model="arraySolution.keepOrder" />
		</div>
	</template>
</template>

<script lang="ts">
import { PropType, defineComponent, onMounted, ref, watch } from 'vue';
import draggable from 'zhyswan-vuedraggable';
import type { prodArraySolution, devArraySolution } from 'src/types';

export default defineComponent({
	name: 'ComponentsPagesCreationSolutionArray',
	components: {
		draggable
	},
	props: {
		modelValue: {
			type: Object as PropType<prodArraySolution>,
			required: true
		}
	},
	emits: ['update:model-value'],
	setup (props, { emit }) {
		const arraySolution = ref<devArraySolution | null>(null);

		const idGen = () => Math.random().toString(16).substring(2, 8);

		const load = (data: prodArraySolution) => {
			arraySolution.value = {
				keepOrder: data.keepOrder,
				list: data.list.map((keyword) => ({
					id: idGen(),
					keyword
				}))
			};
		};

		const add = (keyword: string) => {
			arraySolution.value?.list.push({
				id: idGen(),
				keyword
			});
		};

		const remove = (index: number) => arraySolution.value?.list.splice(index, 1);

		onMounted(() => {
			load(props.modelValue);

			watch(arraySolution, (newVal) => {
				if (!newVal)
					return;
				emit('update:model-value', {
					keepOrder: newVal.keepOrder,
					list: newVal.list.reduce((prev, curr) => (curr.keyword && curr.keyword.length)
						? (prev.push(curr.keyword as never), prev)
						: prev, [])
				} as prodArraySolution);
			}, { deep: true });
		});

		return {
			arraySolution,
			load,
			add,
			remove
		};
	}
});
</script>
