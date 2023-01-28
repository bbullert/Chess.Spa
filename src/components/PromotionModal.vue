<template>
	<modal ref="modal">
		<slot>
			<div class="promotion-modal-content">
				<chess-piece
					v-for="piece of pieces"
					:key="piece"
					:type="piece.typeName"
					:color="piece.colorName"
					@mousedown="confirm(piece)"
				>
				</chess-piece>
			</div>
		</slot>
	</modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Modal from "@/components/Modal.vue";
import ChessPiece from "./ChessPiece.vue";

export default defineComponent({
	components: {
		Modal,
		ChessPiece,
	},
	props: {},
	data() {
		return {
			pieces: [] as any[],
			modalRef: null as any,
		};
	},
	methods: {
		init(color: string) {
			this.pieces = [
				{
					type: 1,
					typeName: "knight",
					colorName: color,
				},
				{
					type: 2,
					typeName: "bishop",
					colorName: color,
				},
				{
					type: 3,
					typeName: "rook",
					colorName: color,
				},
				{
					type: 4,
					typeName: "queen",
					colorName: color,
				},
			];
		},
		show() {
			this.modalRef.show();
		},
		close() {
			this.modalRef.close();
		},
		confirm(piece: any) {
			this.close();
			this.$emit("confirm", piece);
		},
	},
	mounted() {
		this.modalRef = this.$refs["modal"] as any;
	},
});
</script>

<style lang="scss">
@import "@/assets/styles/promotion-modal";
</style>
