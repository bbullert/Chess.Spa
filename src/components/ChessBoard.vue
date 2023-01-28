<template>
	<div
		ref="chessboard"
		class="chessboard"
		:class="chessBoardStyleClass"
		:style="chessBoardStyle"
	>
		<div
			v-for="(square, index) of chessBoard.squares"
			:key="index"
			class="chessboard-square"
			:class="getSquareStyleClass(square)"
			@mouseup="move(square)"
		>
			<div class="chessboard-square-label chessboard-square-file-label">
				{{ square.fileName }}
			</div>
			<div class="chessboard-square-label chessboard-square-rank-label">
				{{ square.rankName }}
			</div>
			<chess-piece
				v-if="square.piece"
				:type="square.piece.typeName"
				:color="square.piece.colorName"
				:class="getChessPieceStyle(square.piece)"
				@mousedown="startDrag(square.piece, $event)"
			>
			</chess-piece>
		</div>
	</div>
	<promotion-modal ref="promotion-modal" @confirm="promote"></promotion-modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { DragHandler } from "@/store/types/dragHandler";
import ChessPiece from "./ChessPiece.vue";
import PromotionModal from "./PromotionModal.vue";

export default defineComponent({
	components: {
		ChessPiece,
		PromotionModal,
	},
	emits: ["onmove"],
	data() {
		return {
			dragHandler: {} as DragHandler,
			chessBoard: {} as any,
			player: {} as any,
			executeMove: null as any,
			chessBoardProps: "",
			draggedPieceProps: "",
			width: "",
			chessboardRef: null as any,
			promotionModalRef: null as any,
		};
	},
	computed: {
		isReversed() {
			return this.player?.colorName?.toLowerCase() == "black"
				? "reversed"
				: null;
		},
		chessBoardStyleClass() {
			return this.isReversed;
		},
		chessBoardStyle() {
			return (
				this.chessBoardProps +
				" " +
				this.draggedPieceProps +
				" " +
				this.width
			);
		},
	},
	methods: {
		update(chessBoard: any, player: any) {
			this.chessBoard = chessBoard;
			this.player = player;
			this.promotionModalRef.init(player.colorName.toLowerCase());
			this.updateChessboardStyle();
			this.updatePieceStyle();
		},
		updateChessboardStyle() {
			this.chessBoardProps = [
				`--chessboard-file-count: ${this.chessBoard.fileCount}`,
				`--chessboard-rank-count: ${this.chessBoard.rankCount}`,
			]
				.join(";")
				.concat(";");
		},
		updatePieceStyle() {
			this.draggedPieceProps = [
				`--chess-piece-translate-x: ${this.dragHandler.position.x}px`,
				`--chess-piece-translate-y: ${this.dragHandler.position.y}px`,
				`--chess-piece-cursor: ${
					this.dragHandler.isDrag() ? "grabbing" : "default"
				}`,
			]
				.join(";")
				.concat(";");
		},
		updateLayout() {
			this.width = "width: " + this.chessboardRef.clientHeight + "px; ";
		},
		getSquareStyleClass(square: any) {
			return (
				this.getSquareColor(square) +
				" " +
				this.getSquareIndicator(square) +
				" " +
				this.getFileLabel(square) +
				" " +
				this.getRankLabel(square)
			);
		},
		getChessPieceStyle(piece: any) {
			return this.dragHandler.isDrag() &&
				this.dragHandler.element == piece
				? "dragged"
				: null;
		},
		getSquareColor(square: any) {
			return `chessboard-square-${square.colorName.toLowerCase()}`;
		},
		getFileLabel(square: any) {
			return (
				this.player?.colorName?.toLowerCase() == "black"
					? square.rank == this.chessBoard.rankCount
					: square.rank == 1
			)
				? "show-file-label"
				: null;
		},
		getRankLabel(square: any) {
			return (
				this.player?.colorName?.toLowerCase() == "black"
					? square.file == this.chessBoard.fileCount
					: square.file == 1
			)
				? "show-rank-label"
				: null;
		},
		getSquareIndicator(square: any) {
			if (!this.dragHandler.isDrag()) return "";

			let move = this.dragHandler.element.moves.find(
				(x) => x.capture?.captureSquareName == square.name
			);
			if (move?.capture)
				return "chessboard-square-indicator chessboard-square-indicator-capture";

			move = this.dragHandler.element.moves.find(
				(x) => x.arrivalSquareName == square.name
			);
			if (move) return "chessboard-square-indicator";

			return null;
		},
		updateDragPiecePosition(event: MouseEvent) {
			if (!this.dragHandler.isDrag()) return;
			this.dragHandler.position = {
				x: event.x - this.dragHandler.offset.x,
				y: event.y - this.dragHandler.offset.y,
			};
			this.updatePieceStyle();
		},
		startDrag(piece: any, event: MouseEvent) {
			if (piece.color != this.player.color) return;
			const node = event.target as HTMLElement;
			const rect = node.getBoundingClientRect();

			this.dragHandler.element = piece;
			this.dragHandler.offset = {
				x: rect.x + rect.width / 2,
				y: rect.y + rect.height / 2,
			};

			this.updateDragPiecePosition(event);

			window.addEventListener("mousemove", this.drag);
			window.addEventListener("mouseup", this.drop);
		},
		drag(event: MouseEvent) {
			this.updateDragPiecePosition(event);
		},
		drop() {
			this.dragHandler.release();
			this.updatePieceStyle();

			window.removeEventListener("mousemove", this.drag);
			window.removeEventListener("mouseup", this.drop);
		},
		move(square: any) {
			if (!square || !this.dragHandler.isDrag()) return;

			const move = this.dragHandler.element.moves.find(
				(x) => x.arrivalSquareName == square.name
			);
			if (!move) {
				this.executeMove = null;
				return;
			}

			this.executeMove = {
				departureSquareName: move.departureSquareName,
				arrivalSquareName: move.arrivalSquareName,
			};

			if (move.promotion) {
				this.promotionModalRef.show();
			} else {
				this.$emit("onmove", this.executeMove);
			}
			this.drop();
		},
		promote(piece: any) {
			this.executeMove.promoteTo = piece.type;
			this.$emit("onmove", this.executeMove);
		},
	},
	unmounted() {
		window.removeEventListener("resize", this.updateLayout);
	},
	mounted() {
		this.chessboardRef = this.$refs["chessboard"] as any;
		this.promotionModalRef = this.$refs["promotion-modal"] as any;
		window.addEventListener("resize", this.updateLayout);
	},
	beforeUpdate() {
		this.updateLayout();
	},
	created() {
		this.dragHandler = new DragHandler();
	},
});
</script>

<style lang="scss">
@import "@/assets/styles/chessboard";
</style>
