<template>
	<div class="q-pa-xl row items-center justify-center q-gutter-md">
		<q-card
			v-for="(series, i) of getList" :key="i"
			flat bordered square
			class="card"
		>
			<q-img
				loading="lazy"
				style="max-height: 20em;"
				:src="(series.series.image) ? `${baseURL}${series.series.image}` : '/imgs/background.jpg' "
			>
				<div class="absolute-top transparent row reverse">
					<q-avatar @click="redirect(series.series.series_creator[0].user.name)">
						<q-img
							loading="lazy"
							class="border"
							:src="(series.series.series_creator[0].user.avatar) ? `${baseURL}${series.series.series_creator[0].user.avatar}` : '/imgs/background.jpg' "
						>
							<q-tooltip
								anchor="center left"
								self="center right"
								class="bg-secondary text-body2"
							>
								<span>{{ $capitalize(series.series.series_creator[0].user.name) }}</span>
							</q-tooltip>
						</q-img>
					</q-avatar>
				</div>
				<div class="absolute-bottom row items-center justify-between">
					<span class="text-h6 overflow-text">{{ series.series.title }}</span>
					<span class="orkney-regular q-pl-sm">{{ date(getDate(series)) }} - {{ date(getDate(series), true) }}</span>
				</div>
			</q-img>
		</q-card>
	</div>
</template>

<script lang="ts">
import { PropType, computed, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { baseURL } from 'src/boot/axios';
import { globalStore } from 'src/stores/global';
import type { profil } from 'src/types';

export default defineComponent({
	name: 'ComponentsPagesProfilCard',
	props: {
		user: {
			type: Object as PropType<profil>,
			required: true
		},
		selected: {
			type: String as PropType<'started' | 'finished'>,
			required: true
		}
	},
	setup (props) {
		const router = useRouter();
		const store = globalStore();

		const getList = computed(() => {
			if (props.selected === 'started')
				return props.user.series_started;
			return props.user.series_finished;
		});

		const getDate = (series: any) => {
			if (props.selected === 'started')
				return series.started_date;
			return series.completion_date;
		};

		const redirect = (username: string) => {
			if (store.user && store.user.name.localeCompare(username) !== 0)
				return router.push({ name: 'profil', params: { username: 'test' } });
		};

		const date = (date: Date, hours = false) => {
			const _date = new Date(date);
			const pad = (n: number) => (n < 10)
				? `0${n}`
				: n;
			return (hours)
				? `${pad(_date.getUTCHours())}:${pad(_date.getUTCMinutes())}`
				: `${pad(_date.getUTCDate())}/${pad(_date.getUTCMonth() + 1)}/${_date.getUTCFullYear()}`;
		};

		return {
			baseURL,
			store,
			getList,
			getDate,
			redirect,
			date
		};
	}
});
</script>

<style scoped lang="scss">
.card {
	width: 100%;
	max-width: 25em;
}
.overflow-text {
	text-overflow: ellipsis;
}
.border {
	border: 2px solid $grey-8;
	border-radius: 50%;
	width: 2em;
	height: 2em;
}
</style>
