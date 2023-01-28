<template>
	<div class="game-layout-item move-history">
		<div
			v-for="(move, index) of moveHistory"
			:key="index"
			class="game-layout-item move-history-item"
		>
			<span>{{ move.turnClock }}.</span>
			<span>{{ move.white }}</span>
			<span>{{ move.black }}</span>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	components: {},
	data() {
		return {
			moveHistory: {} as any,
		};
	},
	computed: {},
	watch: {},
	methods: {
		update(turns: any) {
			this.moveHistory = [];
			for (let turn of turns) {
				let index = turn.turnClock - 1;
				if (!turn.move) break;
				if (!this.moveHistory[index])
					this.moveHistory[index] = { turnClock: turn.turnClock };
				if (turn.color == 0)
					this.moveHistory[index].white = turn.move?.description;
				if (turn.color == 1)
					this.moveHistory[index].black = turn.move?.description;
			}
		},
	},
});
</script>

<style lang="scss">
@import "@/assets/styles/move-history";
</style>
