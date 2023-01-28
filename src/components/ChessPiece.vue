<template>
	<div class="chess-piece">
		<img :src="src" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "ChessPiece",
	props: {
		color: { default: "" },
		type: { default: "" },
	},
	computed: {
		src() {
			const src = require(`@/assets/svg/pieces/${this.color.toLowerCase()}-${this.type.toLowerCase()}.svg`);
			return src;
		},
	},
});
</script>

<style lang="scss">
@import "@/assets/styles/chess-piece";
</style>
