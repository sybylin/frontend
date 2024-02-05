<template>
	<div
		v-if="!reports"
		class="full-width row justify-center items-center q-pt-xl q-pb-xl"
	>
		<q-spinner-cube color="deep-purple-6" size="6em" />
	</div>
	<div
		v-else
		class="column full-width no-wrap"
	>
		<div class="row text-center text-h6 q-pl-md q-pr-md">
			<span class="col-1">
				{{ $t('dashboard.report.table.id').toUpperCase() }}
			</span>
			<span class="col-2">
				{{ $capitalize($t('dashboard.report.table.tags')) }}
			</span>
			<span class="col-2">
				{{ $capitalize($t('dashboard.report.table.date')) }}
			</span>
			<span class="col-5">
				{{ $capitalize($t('dashboard.report.table.message')) }}
			</span>
			<span class="col-2">
				{{ $capitalize($t('dashboard.report.table.status')) }}
			</span>
		</div>
		<q-separator class="q-ma-md" />
		<template
			v-for="(report, index) of reports"
			:key="report.id"
		>
			<div class="row full-width items-center q-pl-md q-pr-md">
				<span class="col-1 text-h6 text-center orkney-regular">
					{{ report.id }}
				</span>
				<div class="row justify-between col-2">
					<q-chip
						class="fit-content"
						:ripple="false"
						:icon="typeIcon(report.type)"
						:color="typeColor(report.type)"
						:label="$capitalize($t(`dashboard.report.type.${report.type.toLowerCase()}`))"
						text-color="white"
					/>
					<q-chip
						class="fit-content"
						:ripple="false"
						:icon="statusIcon(report.status)"
						:color="statusColor(report.status)"
						:label="$capitalize($t(`dashboard.report.status.${report.status.toLowerCase()}`))"
						text-color="white"
					/>
				</div>
				<div class="col-2 text-center text-body1 overflow-text">
					<template v-if="report.creation_date">
						<span>{{ date(report.creation_date) }}</span>
						<br />
						<span>{{ date(report.creation_date, true) }}</span>
					</template>
				</div>
				<div class="col-5">
					<q-input
						v-model="report.message"
						autogrow
						outlined
						readonly
					/>
				</div>
				<div class="col-2 row">
					<q-select
						v-model="report.localStatus"
						class="full-width q-pl-md"
						:label="$capitalize($t('dashboard.report.status.title'))"
						:options="[
							{ label: $capitalize($t('dashboard.report.status.complete')), value: ReportStatus.COMPLETE },
							{ label: $capitalize($t('dashboard.report.status.open')), value: ReportStatus.OPEN },
							{ label: $capitalize($t('dashboard.report.status.progress')), value: ReportStatus.PROGRESS },
							{ label: $capitalize($t('dashboard.report.status.refused')), value: ReportStatus.REFUSED }
						]"
						@update:model-value="(e) => updateStatus(e, index)"
					/>
				</div>
			</div>
			<q-separator class="q-ma-md" />
		</template>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar, useMeta } from 'quasar';
import meta from 'src/meta';
import { api } from 'src/boot/axios';
import { capitalize } from 'src/boot/custom';
import { ReportType, ReportStatus } from 'src/types';

interface report {
	id: number;
	type: ReportType;
	message: string;
	status: ReportStatus;
	creation_date: Date;
	modification_date: Date;
	localStatus: { label: string, value: ReportStatus } | null;
}

export default defineComponent({
	name: 'DashboardReport',
	setup () {
		const $q = useQuasar();
		const { t } = useI18n();
		const reports = ref<report[] | null>(null);

		const date = (date: Date, hours = false) => {
			const _date = new Date(date);
			const pad = (n: number) => (n < 10)
				? `0${n}`
				: n;
			return (hours)
				? `${pad(_date.getUTCHours())}:${pad(_date.getUTCMinutes())}`
				: `${pad(_date.getUTCDate())}/${pad(_date.getUTCMonth() + 1)}/${_date.getUTCFullYear()}`;
		};

		const typeIcon = (type: ReportType) => {
			switch (type) {
			case ReportType.UI:
				return 'dataset';
			case ReportType.IMPROVEMENT:
				return 'construction';
			case ReportType.BUG:
			default:
				return 'bug_report';
			}
		};

		const typeColor = (type: ReportType) => {
			switch (type) {
			case ReportType.UI:
				return 'orange-7';
			case ReportType.IMPROVEMENT:
				return 'purple-8';
			case ReportType.BUG:
			default:
				return 'red-7';
			}
		};

		const statusIcon = (status: ReportStatus) => {
			switch (status) {
			case ReportStatus.COMPLETE:
				return 'check_circle';
			case ReportStatus.OPEN:
				return 'circle';
			case ReportStatus.REFUSED:
				return 'cancel';
			case ReportStatus.PROGRESS:
			default:
				return 'radio_button_checked';
			}
		};

		const statusColor = (status: ReportStatus) => {
			switch (status) {
			case ReportStatus.COMPLETE:
				return 'green-7';
			case ReportStatus.OPEN:
				return 'orange-7';
			case ReportStatus.REFUSED:
				return 'red-7';
			case ReportStatus.PROGRESS:
			default:
				return 'deep-purple-7';
			}
		};

		const updateStatus = (e: { label: string, value: ReportStatus }, index: number) => {
			if (!reports.value)
				return;
			const oldStatus = reports.value[index].status;
			reports.value[index].status = e.value;
			api.put('/report', {
				id: reports.value[index].id,
				type: reports.value[index].type,
				message: reports.value[index].message,
				status: e.value
			})
				.catch((e) => {
					if (reports.value)
						reports.value[index].status = oldStatus;
					$q.notify(e.response.data.info.message);
				});
		};

		useMeta(() => {
			return meta({
				meta: {
					title: capitalize(t('dashboard.report.title')),
					description: capitalize(t('dashboard.report.desc'))
				},
				og: {
					url: 'https://sybyl.in/dashboard/report',
					title: capitalize(t('dashboard.report.title')),
					description: capitalize(t('dashboard.report.desc')),
					image: 'https://sybyl.in/img/background.png'
				},
				twitter: {
					url: 'https://sybyl.in/dashboard/report',
					title: capitalize(t('dashboard.report.title')),
					description: capitalize(t('dashboard.report.desc')),
					image: 'https://sybyl.in/img/background.png'
				}
			});
		});

		onMounted(() => {
			api.get('/report')
				.then((d) => {
					const val = [
						{ label: capitalize(t('dashboard.report.status.complete')), value: ReportStatus.COMPLETE },
						{ label: capitalize(t('dashboard.report.status.open')), value: ReportStatus.OPEN },
						{ label: capitalize(t('dashboard.report.status.progress')), value: ReportStatus.PROGRESS },
						{ label: capitalize(t('dashboard.report.status.refused')), value: ReportStatus.REFUSED }
					];
					reports.value = d.data.list.map((e: report) => ({
						...e,
						localStatus: val.find((f) => f.value === e.status)
					} as report));
				})
				.catch((e) => $q.notify(e.response.data.info.message));
		});

		return {
			ReportStatus,
			reports,
			date,
			typeIcon,
			typeColor,
			statusIcon,
			statusColor,
			updateStatus
		};
	}
});
</script>

<style scoped>
.fit-content {
	width: fit-content;
}
.overflow-text {
	text-overflow: ellipsis;
}
</style>
