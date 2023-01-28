<template>
	<div class="game-layout-item player-dashboard">
		<div class="game-layout-item name-display">{{ player.name }}</div>
		<div class="game-layout-item lost-pieces">
			<chess-piece
				v-for="(piece, index) of player.lostPieces"
				:key="index"
				:type="piece.typeName"
				:color="piece.colorName"
			>
			</chess-piece>
		</div>
		<div class="game-layout-item timer">{{ time }}</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import ChessPiece from "./ChessPiece.vue";

export default defineComponent({
	components: {
		ChessPiece,
	},
	data() {
		return {
			player: {} as any,
			time: "",
		};
	},
	methods: {
		update(player: any) {
			this.player = player;
			this.time = this.player.timer.toString();
			this.player.timer.onTick = () => {
				this.time = this.player.timer.toString();
			};
		},
	},
});
</script>

<style lang="scss">
@import "@/assets/styles/player-dashboard";
</style>
