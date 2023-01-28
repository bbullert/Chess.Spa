import axios from "axios";
import { API_URL } from "@/router";
import { accountService } from "@/services/account.service";

class GameEndingService {
	async search(criteria: any) {
		return axios
			.post(API_URL + "game-endings/search", criteria, {
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
}
export const gameEndingService = new GameEndingService();
