import axios from "axios";
import { API_URL, connect } from "@/router";
import { accountService } from "./account.service";

class QueueService {
	async getStatus(id: string) {
		return axios
			.get(API_URL + "queues/" + id + "/status", {
				headers: {
					Authorization: accountService.authenticationHeader(),
				},
			})
			.then(
				async (success) => {
					return Promise.resolve(success);
				},
				(failure) => {
					console.error(failure.details);
					return Promise.resolve(failure);
				}
			);
	}
	async getAll() {
		return axios
			.get(API_URL + "queues", {
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
	async get(id: string) {
		return axios
			.get(API_URL + "queues/" + id, {
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
export const queueService = new QueueService();
