<template>
	<main id="game-search">
		<div v-if="isSearching" class="game-search searching">
			<form @submit.prevent="leaveQueue">
				<span>Searching for game...</span>
				<b-button type="submit">Cancel</b-button>
			</form>
		</div>
		<div v-else class="my-card game-search">
			<form @submit.prevent="joinQueue">
				<h5>Game Search</h5>
				<div>
					<b-button
						v-for="(queue, index) of queues"
						:key="index"
						:variant="
							selectedQueue?.id == queue.id
								? 'secondary'
								: 'light'
						"
						class="chessboard-square"
						@click="selectGame(queue)"
						>{{ getQueueName(queue) }}
					</b-button>
					<b-button
						type="submit"
						variant="primary"
						class="find-game-btn"
						:disabled="selectedQueue == null"
						>Find game</b-button
					>
				</div>
			</form>
		</div>
	</main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { connect } from "@/router";
import { ModalSetup } from "@/store/types/modalSetup";
import { accountService } from "@/services/account.service";
import { queueService } from "@/services/queue.service";
import { gameService } from "@/services/game.service";
import { queueRequestService } from "@/services/queueRequest.service";

export default defineComponent({
	components: {},
	data() {
		return {
			selectedQueue: null as any,
			queues: [] as any[],
			activeQueueRequest: null as any,
			activeGame: null as any,
			isSearching: false,
		};
	},
	methods: {
		async init() {
			this.activeGame = await this.getActiveGame();
			if (this.activeGame) await this.joinGame(this.activeGame.id);
			this.queues = await this.getQueues();
			this.activeQueueRequest = await this.getQueueRequest();
			if (this.activeQueueRequest) {
				this.isSearching = true;
				await connect().then(
					async (success) => {
						await success.connection!.invoke(
							"JoinGroupAsync",
							this.activeQueueRequest.queueId
						);
						await this.update();
					},
					(failure) => {
						this.raiseErrorModal(failure.response.data.details);
					}
				);
			}
		},
		async update() {
			this.activeGame = await this.getActiveGame();
			if (this.activeGame) await this.joinGame(this.activeGame.id);
			this.activeQueueRequest = await this.getQueueRequest();
			if (this.activeQueueRequest?.queueId) {
				await this.updateQueueRequestStatus(
					this.activeQueueRequest?.queueId
				);
			}
		},
		getQueueName(queue: any) {
			const gameMode = queue.gameSetup.gameModeName;
			const timeLimit = queue.gameSetup.timeLimit;
			const timeIncrement = queue.gameSetup.timeIncrement;
			if (!timeIncrement) return gameMode + " " + timeLimit + " min";
			return gameMode + " " + timeLimit + " | " + timeIncrement;
		},
		async joinQueue() {
			await connect().then(
				async (success) => {
					await success.connection!.invoke(
						"JoinGroupAsync",
						this.selectedQueue.id
					);
					await queueRequestService.join(this.selectedQueue.id);
					this.isSearching = true;
				},
				(failure) => {
					this.raiseErrorModal(failure.response.data.details);
				}
			);
		},
		async leaveQueue() {
			await connect().then(
				async (success) => {
					await success.connection!.invoke(
						"LeaveGroupAsync",
						this.selectedQueue.id
					);
					await queueRequestService.leave(this.selectedQueue.id);
					this.selectedQueue = null;
					this.isSearching = false;
				},
				(failure) => {
					this.raiseErrorModal(failure.response.data.details);
				}
			);
		},
		selectGame(queue: any) {
			this.selectedQueue = queue;
		},
		async joinGame(id: string) {
			this.$router.push("/play/" + id);
		},
		async getActiveGame() {
			return await gameService
				.search({
					userId: accountService.authenticationState()?.id,
					hasEnded: false,
				})
				.then(
					async (success) => {
						return success.data.result.rows[0];
					},
					(failure) => {
						this.raiseErrorModal(failure.response.data.details);
					}
				);
		},
		async getQueues() {
			return await queueService.getAll().then(
				(success) => {
					return success.data.result;
				},
				(failure) => {
					this.raiseErrorModal(failure.response.data.details);
				}
			);
		},
		async getQueueRequest() {
			return await queueRequestService
				.search({ userId: accountService.authenticationState()?.id })
				.then(
					(success) => {
						return success.data.result.rows[0];
					},
					(failure) => {
						this.raiseErrorModal(failure.response.data.details);
					}
				);
		},
		async updateQueueRequestStatus(queueId: string) {
			await queueService.getStatus(queueId).then(
				async (success) => {
					if (success.data.result.gameId)
						await gameService.gameStarted(
							success.data.result.gameId,
							queueId
						);
				},
				(failure) => {
					this.raiseErrorModal(failure.response.data.details);
				}
			);
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
		async connect() {
			await connect().then(
				async (success) => {
					await success.connection!.on(
						"QueueStateChanged",
						this.update
					);
					await success.connection!.on("GameStarted", (id) =>
						this.joinGame(id)
					);
				},
				(failure) => {
					this.raiseErrorModal(failure.error);
				}
			);
		},
		async disconnect() {
			await connect().then(
				async (success) => {
					await success.connection!.off(
						"QueueStateChanged",
						this.update
					);
					await success.connection!.off("GameStarted", (id) =>
						this.joinGame(id)
					);
				},
				(failure) => {
					this.raiseErrorModal(failure.error);
				}
			);
		},
	},
	async created() {
		await this.connect();
		await this.init();
	},
	async unmounted() {
		await this.disconnect();
	},
});
</script>

<style lang="scss">
@import "@/assets/styles/game-search";
</style>
