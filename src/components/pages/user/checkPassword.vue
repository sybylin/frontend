<template>
	<div class="row justify-around items-center">
		<q-chip
			:color="backgroundColor(length)"
			text-color="white"
			icon="straighten"
			:clickable="false"
			:ripple="false"
		>
			{{ $capitalize($t('user.checkPassword.size')) }}
			<span class="q-ml-xs">| 8</span>
			<q-icon name="settings_ethernet" class="q-ml-xs" />
			<span class="q-ml-xs">255</span>
		</q-chip>
		<q-chip
			:color="backgroundColor(lowercase)"
			text-color="white"
			icon="title"
			:clickable="false"
			:ripple="false"
		>
			{{ $capitalize($t('user.checkPassword.lower')) }}
		</q-chip>
		<q-chip
			:color="backgroundColor(uppercase)"
			text-color="white"
			icon="title"
			:clickable="false"
			:ripple="false"
		>
			{{ $capitalize($t('user.checkPassword.upper')) }}
		</q-chip>
		<q-chip
			:color="backgroundColor(number)"
			text-color="white"
			icon="123"
			:clickable="false"
			:ripple="false"
		>
			{{ $capitalize($t('user.checkPassword.number')) }}
		</q-chip>
		<q-chip
			:color="backgroundColor(special)"
			text-color="white"
			icon="tag"
			:clickable="false"
			:ripple="false"
		>
			{{ $capitalize($t('user.checkPassword.special')) }}
			<q-tooltip class="bg-indigo text-body2" anchor="bottom middle" self="top middle">
				<span>
					{{ $capitalize($t('user.checkPassword.accepted')) }}
					:
					{{ characterList }}
				</span>
			</q-tooltip>
		</q-chip>
	</div>
</template>

<script lang="ts">
import { PropType, computed, defineComponent, onMounted, watch } from 'vue';

export default defineComponent({
	name: 'ComponentsPagesUserCheckPassword',
	props: {
		modelValue: {
			type: [Boolean, null] as PropType<boolean | null>,
			required: false,
			default: null
		},
		password: {
			type: [String, null] as PropType<string | null>,
			required: true
		}
	},
	emits: ['update:model-value'],
	setup (props, { emit }) {
		const characterList = '!"#$%&\'|()*+,-.\\/:;<=>?@[]^_`{}~';
		const length = computed(() => (
			props.password &&
			props.password.length >= 8 &&
			props.password.length <= 255
		) as boolean);
		const lowercase = computed(() => (props.password && /[a-z]/.test(props.password)) as boolean);
		const uppercase = computed(() => (props.password && /[A-Z]/.test(props.password)) as boolean);
		const number = computed(() => (props.password && /[0-9]/.test(props.password)) as boolean);
		const special = computed(() => (props.password && /[!"#$%&'()*+,-./:;<=>?@[\\\\\\\]^_` {|}~]/.test(props.password)) as boolean);
		const isValid = computed(() => length.value && lowercase.value && uppercase.value && number.value && special.value);

		const backgroundColor = (val: boolean) => (val)
			? 'green'
			: 'red';

		onMounted(() => {
			watch(isValid, (isOk) => emit('update:model-value', isOk));
		});

		return {
			characterList,
			length,
			lowercase,
			uppercase,
			number,
			special,
			backgroundColor
		};
	}
});
</script>
