import axios from "axios";
import { API_URL, connect } from "@/router";
import { accountService } from "@/services/account.service";

class GameService {
	async acceptDrawOffer(id: string) {
		return axios
			.post(API_URL + "games/" + id + "/accept-draw-offer", null, {
				headers: {
					Authorization: accountService.authenticationHeader(),
				},
			})
			.then(
				async (success) => {
					await this.drawOfferAccepted(id);
					return Promise.resolve(success);
				},
				(failure) => {
					console.error(failure.details);
					return Promise.resolve(failure);
				}
			);
	}
	async drawOfferAccepted(id: string) {
		await connect().then(
			async (success) => {
				await success.connection!.invoke("DrawOfferAcceptedAsync", id);
			},
			(failure) => {
				console.error(failure.error);
			}
		);
	}
	async drawOfferDeclined(id: string) {
		await connect().then(
			async (success) => {
				await success.connection!.invoke("DrawOfferDeclinedAsync", id);
			},
			(failure) => {
				console.error(failure.error);
			}
		);
	}
	async executeMove(id: string, execute: any) {
		return axios
			.post(API_URL + "games/" + id + "/execute-move", execute, {
				headers: {
					Authorization: accountService.authenticationHeader(),
				},
			})
			.then(
				async (success) => {
					await this.gameStateChanged(id);
					return Promise.resolve(success);
				},
				(failure) => {
					console.error(failure.details);
					return Promise.resolve(failure);
				}
			);
	}
	async get(id: string) {
		return axios
			.get(API_URL + "games/" + id, {
				headers: {
					Authorization: accountService.authenticationHeader(),
				},
			})
			.then(
				(success) => {
					return Promise.resolve(success);
				},
				(failure) => {
					console.error(failure.details);
					return Promise.resolve(failure);
				}
			);
	}
	async resign(id: string) {
		return axios
			.post(API_URL + "games/" + id + "/resign", null, {
				headers: {
					Authorization: accountService.authenticationHeader(),
				},
			})
			.then(
				async (success) => {
					await this.gameEnded(id);
					return Promise.resolve(success);
				},
				(failure) => {
					console.error(failure.details);
					return Promise.resolve(failure);
				}
			);
	}
	async search(criteria: any) {
		return axios
			.post(API_URL + "games/search", criteria, {
				headers: {
					Authorization: accountService.authenticationHeader(),
				},
			})
			.then(
				(success) => {
					return Promise.resolve(success);
				},
				(failure) => {
					console.error(failure.details);
					return Promise.resolve(failure);
				}
			);
	}
	async gameStateChanged(id: string) {
		connect().then(
			async (success) => {
				await success.connection!.invoke("GameStateChangedAsync", id);
			},
			(failure) => {
				console.error(failure.error);
			}
		);
	}
	async gameStarted(id: string, queueId: string) {
		connect().then(
			async (success) => {
				await success.connection!.invoke(
					"GameStartedAsync",
					id,
					queueId
				);
			},
			(failure) => {
				console.error(failure.error);
			}
		);
	}
	async gameEnded(id: string) {
		connect().then(
			async (success) => {
				await success.connection!.invoke("GameEndedAsync", id);
			},
			(failure) => {
				console.error(failure.error);
			}
		);
	}
}
export const gameService = new GameService();
