<template>
	<svg
		style="width: 100%; height: auto;"
		width="141.87" height="226.83" version="1.1"
		viewBox="0 0 37.536 60.015" xmlns="http://www.w3.org/2000/svg"
	>
		<g transform="translate(-8.2728 -9.0975)" stroke-width=".26458">
			<rect
				x="8.2728" y="10.263" width="36.371"
				height="58.849" fill="#00aad4"
			/>
			<path d="m44.644 10.263 1.1652-1.1652v58.969l-1.1652 1.0457z" fill="#164450" />
			<path d="m45.809 9.0976h-36.161l-1.375 1.1652h36.371z" fill="#006680" />
		</g>
		<g
			transform="translate(-8.2728 -9.0975)" fill="none" stroke="#08a"
			stroke-width=".76418"
		>
			<rect
				x="12.18" y="14.17" width="12.134"
				height="51.035"
			/>
			<rect
				x="28.603" y="14.17" width="12.134"
				height="51.035"
			/>
		</g>
		<g transform="translate(-8.2728 -9.0975)">
			<circle
				cx="43.007" cy="39.86" r="1.1756"
				fill="#808080"
			/>
			<circle
				cx="42.881" cy="39.688" r="1.1756"
				fill="#e6e6e6"
			/>
		</g>
		<g transform="translate(-8.2728 -9.0975)">
			<rect
				x="24.916" y="19.539" width="3.0844"
				height="1.9062" ry=".15373" fill="#e6e6e6"
			/>
			<circle
				cx="25.154" cy="19.779" r=".11369"
				fill="#808080"
			/>
			<circle
				cx="25.154" cy="21.218" r=".11369"
				fill="#808080"
			/>
			<circle
				cx="27.772" cy="19.779" r=".11369"
				fill="#808080"
			/>
			<circle
				cx="27.772" cy="21.218" r=".11369"
				fill="#808080"
			/>
			<text
				x="26.552259" y="20.965382" fill="#808080"
				font-size="1.3229px" stroke-width=".79375" xml:space="preserve"
			>
				<tspan
					x="26.552259" y="20.965382" font-family="sans-serif"
					font-size="1.3229px" font-weight="bold" stroke-width=".79375" text-align="center" text-anchor="middle"
				>
					{{ $props.errorCode }}
				</tspan>
			</text>
		</g>
	</svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'PageError',
	props: {
		errorCode: {
			type: Number,
			required: false,
			default: 401
		}
	}
});
</script>
