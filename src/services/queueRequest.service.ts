import axios from "axios";
import { API_URL, connect } from "@/router";
import { accountService } from "./account.service";

class QueueRequestService {
	async join(id: string) {
		return axios
			.post(API_URL + "queues/" + id + "/join", null, {
				headers: {
					Authorization: accountService.authenticationHeader(),
				},
			})
			.then(
				async (success) => {
					await this.queueStateChanged(id);
					return Promise.resolve(success);
				},
				(failure) => {
					console.error(failure.details);
					return Promise.resolve(failure);
				}
			);
	}
	async leave(id: string) {
		return axios
			.post(API_URL + "queues/" + id + "/leave", null, {
				headers: {
					Authorization: accountService.authenticationHeader(),
				},
			})
			.then(
				async (success) => {
					await this.queueStateChanged(id);
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
			.post(API_URL + "queues/requests/search", criteria, {
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
	async queueStateChanged(id: string) {
		connect().then(
			async (success) => {
				await success.connection!.invoke("QueueStateChangedAsync", id);
			},
			(failure) => {
				console.error(failure.error);
			}
		);
	}
}
export const queueRequestService = new QueueRequestService();
