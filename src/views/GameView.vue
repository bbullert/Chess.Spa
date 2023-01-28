<template>
	<main id="game-view" class="game-view">
		<div class="game-layout">
			<div class="game-layout-main">
				<player-dashboard ref="top-player-dashboard"></player-dashboard>
				<chess-board ref="chessboard" @onmove="onMove"></chess-board>
				<player-dashboard
					ref="bottom-player-dashboard"
				></player-dashboard>
			</div>
			<div class="game-layout-side">
				<move-history ref="move-history"></move-history>
				<div class="game-layout-side-menu">
					<b-button @click="raiseResignModal">Resign</b-button>
					<b-button @click="raiseDrawOfferModal"
						>Offer a draw</b-button
					>
				</div>
			</div>
		</div>
	</main>
	<modal ref="game-resign-confirm-modal" @confirm="resignConfirm"></modal>
	<modal
		ref="draw-offer-modal"
		@confirm="acceptDrawOffer"
		@cancel="declineDrawOffer"
	></modal>
	<modal ref="draw-offer-confirm-modal" @confirm="sendDrawOffer"></modal>
	<modal ref="draw-offer-reject-modal"></modal>
	<modal ref="game-ending-modal" @cancel="exitGame"></modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { connect } from "@/router";

import { accountService } from "@/services/account.service";
import { gameService } from "@/services/game.service";
import { gameEndingService } from "@/services/gameEnding.service";
import ChessBoard from "@/components/ChessBoard.vue";
import PlayerDashboard from "@/components/PlayerDashboard.vue";
import MoveHistory from "@/components/MoveHistory.vue";
import Modal from "@/components/Modal.vue";
import { Timer } from "@/store/game/game.types/timer";
import { ModalSetup } from "@/store/types/modalSetup";

export default defineComponent({
	components: {
		PlayerDashboard,
		ChessBoard,
		MoveHistory,
		Modal,
	},
	props: {},
	data() {
		return {
			id: "",
			chessboardRef: {} as any,
			playerDashboardRef: {} as any,
			opponentDashboardRef: {} as any,
			moveHistoryRef: {} as any,
			gameResignConfirmModalRef: {} as any,
			drawOfferModalRef: {} as any,
			drawOfferConfirmModalRef: {} as any,
			drawOfferRejectModalRef: {} as any,
			gameEndingModalRef: {} as any,
		};
	},
	computed: {},
	methods: {
		async updateGameState() {
			gameService.get(this.id).then(async (success) => {
				let result = success.data.result;

				for (let player of result.players) {
					player.timer = new Timer(player.timer);
				}

				const player = result.players.find(
					(x) =>
						x.name == accountService.authenticationState()?.userName
				);
				const opponent = result.players.find(
					(x) =>
						x.name != accountService.authenticationState()?.userName
				);

				this.playerDashboardRef.update(player);
				this.opponentDashboardRef.update(opponent);
				this.chessboardRef.update(result.chessBoard, player);
				this.moveHistoryRef.update(result.turns);

				this.solveGameEnding(result);
			});
		},
		async solveGameEnding(game: any) {
			if (game.gameEnding) {
				this.onGameEnded(game);
			} else {
				const result = await gameEndingService.search({
					gameId: game.id,
				});
				if (result.data.result?.rows.length != 0) {
					gameService.gameEnded(game.id);
				} else if (game.gameSetup.timeLimit) {
					const lastTurn = game.turns.slice(-1)[0];
					const activePlayer = game.players.find(
						(x) => x.color == lastTurn.color
					);
					activePlayer.timer.onTimeout = () => {
						gameService.gameEnded(game.id);
					};
				}
			}
		},
		async onMove(executeMove: any) {
			await gameService.executeMove(this.id, executeMove);
		},
		raiseDrawOfferModal() {
			this.drawOfferConfirmModalRef.show();
		},
		async sendDrawOffer() {
			await connect().then(
				async (success) => {
					await success.connection!.invoke(
						"DrawOfferedAsync",
						this.id
					);
				},
				(failure) => {
					this.raiseErrorModal(failure.response.data.details);
				}
			);
		},
		onDrawOffered() {
			this.drawOfferModalRef.show();
		},
		async acceptDrawOffer() {
			await gameService.acceptDrawOffer(this.id);
		},
		onDrawOfferAccepted() {
			gameService.gameEnded(this.id);
		},
		async declineDrawOffer() {
			await gameService.drawOfferDeclined(this.id);
		},
		onDrawOfferDeclined() {
			this.drawOfferRejectModalRef.show();
		},
		raiseResignModal() {
			this.gameResignConfirmModalRef.show();
		},
		async resignConfirm() {
			await gameService.resign(this.id);
		},
		onGameEnded(game: any) {
			this.gameEndingModalRef.show(
				new ModalSetup({
					title: "Game has ended",
					content: game.gameEnding.details,
					confirmContent: "Ok",
					cancelContent: "Exit",
				})
			);
		},
		exitGame() {
			this.$router.push("/");
		},
		raiseErrorModal(details: string) {
			const root = this.$root as any;
			const modal = root.$refs["modal"] as any;
			modal.show(
				new ModalSetup({
					title: "Error",
					content: details,
					confirmOnly: true,
					confirmContent: "Ok",
				})
			);
		},
	},
	async mounted() {
		this.id = this.$route.params.id as string;

		this.chessboardRef = this.$refs.chessboard as any;
		this.playerDashboardRef = this.$refs["bottom-player-dashboard"] as any;
		this.opponentDashboardRef = this.$refs["top-player-dashboard"] as any;
		this.moveHistoryRef = this.$refs["move-history"] as any;

		this.gameResignConfirmModalRef = this.$refs[
			"game-resign-confirm-modal"
		] as any;
		this.drawOfferModalRef = this.$refs["draw-offer-modal"] as any;
		this.drawOfferConfirmModalRef = this.$refs[
			"draw-offer-confirm-modal"
		] as any;
		this.drawOfferRejectModalRef = this.$refs[
			"draw-offer-reject-modal"
		] as any;
		this.gameEndingModalRef = this.$refs["game-ending-modal"] as any;

		this.gameResignConfirmModalRef.init(
			new ModalSetup({
				title: "Resignation",
				content: "Do you really want to resign?",
			})
		);

		this.drawOfferModalRef.init(
			new ModalSetup({
				title: "Draw offer",
				content:
					"An opponent has offered you a draw. What's your answer?",
				confirmContent: "Accept",
				cancelContent: "Deny",
			})
		);

		this.drawOfferConfirmModalRef.init(
			new ModalSetup({
				title: "Draw offer",
				content: "Do you really want to offer a draw?",
			})
		);

		this.drawOfferRejectModalRef.init(
			new ModalSetup({
				title: "Draw offer rejected",
				content: "An opponent has rejected your draw offer.",
				confirmOnly: true,
				confirmContent: "Ok",
			})
		);

		await connect().then(
			async (success) => {
				await success.connection!.invoke("JoinGroupAsync", this.id);
				await success.connection!.on(
					"GameStateChanged",
					this.updateGameState
				);
				await success.connection!.on("GameEnded", this.updateGameState);
				await success.connection!.on("DrawOffered", this.onDrawOffered);
				await success.connection!.on(
					"DrawOfferAccepted",
					this.onDrawOfferAccepted
				);
				await success.connection!.on(
					"DrawOfferDeclined",
					this.onDrawOfferDeclined
				);
			},
			(failure) => {
				this.raiseErrorModal(failure.response.data.details);
			}
		);

		await this.updateGameState();
	},
	async unmounted() {
		await connect().then(
			async (success) => {
				await success.connection!.off(
					"GameStateChanged",
					this.updateGameState
				);
				await success.connection!.off(
					"GameEnded",
					this.updateGameState
				);
				await success.connection!.off(
					"DrawOffered",
					this.onDrawOffered
				);
				await success.connection!.off(
					"DrawOfferAccepted",
					this.onDrawOfferAccepted
				);
				await success.connection!.off(
					"DrawOfferDeclined",
					this.onDrawOfferDeclined
				);
			},
			(failure) => {
				this.raiseErrorModal(failure.response.data.details);
			}
		);
	},
});
</script>

<style lang="scss">
@import "@/assets/styles/game-view";
</style>
