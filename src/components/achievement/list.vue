<template>
	<q-input
		v-model="search"
		:loading="isSearch"
		debounce="500"
		filled type="search"
		class="q-pb-md"
	>
		<template v-slot:append>
			<q-icon name="search" />
		</template>
	</q-input>
	<div
		v-if="error"
		class="row justify-center text-center"
	>
		<span class="text-body2">
			{{ $t('error.api.fail') }}
		</span>
	</div>
	<div
		v-else
		class="fit row wrap justify-evenly items-center content-end q-gutter-md"
	>
		<q-card
			v-for="el in achievementsSearch"
			:key="el.achievement.name"
			flat
			bordered
			:class="{
				'card': true,
				'background--dark': $q.dark.isActive,
				'background': !$q.dark.isActive
			}"
		>
			<div class="full-width full-height inline row justify-between">
				<q-img
					v-if="$q.screen.gt.xs"
					loading="lazy"
					radio="1"
					fit="contain"
					width="5em"
					height="5em"
					class="q-ma-sm"
					:alt="`Image of ${el.achievement.name} achievement`"
					:src="`/imgs/achievement/${el.achievement.name}.png`"
				/>
				<div
					:class="{
						'card-text-full': $q.screen.lt.sm,
						'card-text': !$q.screen.lt.sm,
						'column': true,
						'justify-between': true,
						'text-center': true,
						'q-pa-sm': true
					}"
				>
					<div class="column justify-evenly card-text-top">
						<span class="text-h4 text-weight-light orkney-medium">
							{{ $capitalize($t(`achievement.list.${el.achievement.name}.title`)) }}
						</span>
						<span class="text-body1">
							{{ $capitalize($t(`achievement.list.${el.achievement.name}.description`)) }}
						</span>
					</div>
					<div class="row justify-between items-center q-pl-sm q-pr-sm card-text-bottom">
						<q-chip
							dense
							color="deep-orange" text-color="white"
							icon="paid"
							:clickable="false"
							:ripple="false"
							:label="el.achievement.points"
						/>
						<span class="text-caption">{{ calcDate(el.unlocking_date) }}</span>
					</div>
				</div>
			</div>
		</q-card>
	</div>
</template>

<script lang=ts>
import { defineComponent, onMounted, ref, watch } from 'vue';
import { api } from 'src/boot/axios';
import { useI18n } from 'vue-i18n';

interface achievementRet {
	unlocking_date: Date;
  achievement: {
		tradName: string;
		name: string;
		points: number;
	};
}

export default defineComponent({
	name: 'ComponentsAchievementList',
	props: {
		user: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	setup (props) {
		const { t, locale } = useI18n();

		const error = ref<boolean>(false);
		const search = ref<string | null>(null);
		const isSearch = ref<boolean>(false);
		const achievements = ref<achievementRet[] | null>(null);
		const achievementsSearch = ref<achievementRet[] | null>(null);

		const calcDate = (d: Date) => {
			const date = new Date(Date.parse(d as any));
			return `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`;
		};

		onMounted(() => {
			api.get((props.user)
				? '/achievement/user/all'
				: '/achievement/all'
			)
				.then((d) => {
					achievements.value = d.data.list.map((e: any) => ({
						unlocking_date: e.unlocking_date,
						achievement: {
							tradName: t(`achievement.list.${e.achievement.name}.title`),
							name: e.achievement.name,
							points: e.achievement.points
						}
					}));
					achievementsSearch.value = achievements.value;
				})
				.catch(() => {
					error.value = true;
				});

			watch(search, (v) => {
				isSearch.value = true;
				if (!v)
					achievementsSearch.value = achievements.value;
				else
					achievementsSearch.value = achievements.value?.filter((e) => (e.achievement.tradName as string).toLowerCase().includes(v.toLowerCase())) ?? null;
				isSearch.value = false;
			});

			watch(locale, () => {
				achievements.value?.forEach((e) => {
					e.achievement.tradName = t(`achievement.list.${e.achievement.name}.title`);
				});
			});
		});

		return {
			error,
			search,
			isSearch,
			achievements,
			achievementsSearch,
			calcDate
		};
	}
});
</script>

<style scoped>
.card {
	width: 17em;
	height: 5.5em;
}
.card-text-full {
	width: 100%;
}
.card-text {
	width: calc(100% - 5.5em);
}
.card-text-top {
	height: 75%;
}
.card-text-bottom {
	height: 25%;
}

.background {
	background-color: #f2f2f2;
}
.background--dark {
	background-color: #2d2d2d;
}
</style>
