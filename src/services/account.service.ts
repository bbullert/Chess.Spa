import axios from "axios";
import { API_URL } from "@/router";
import store from "@/store";

class AccountService {
	async signIn(request: any) {
		return await axios
			.post(API_URL + "accounts/sign-in", {
				userName: request.userName,
				password: request.password,
				isPersistent: request.isPersistent,
			})
			.then(
				async (success) => {
					const result = success.data.result;

					if (result.isPersistent) {
						localStorage.setItem(
							"authState",
							JSON.stringify(result)
						);
					} else {
						sessionStorage.setItem(
							"authState",
							JSON.stringify(result)
						);
					}
					store.commit("auth/setState", result);

					return Promise.resolve(success);
				},
				(failure) => {
					console.error(failure.details);
					return Promise.reject(failure);
				}
			);
	}
	async signUp(request) {
		return await axios
			.post(API_URL + "accounts/sign-up", {
				userName: request.userName,
				email: request.email,
				password: request.password,
				passwordConfirm: request.passwordConfirm,
			})
			.then(
				async (success) => {
					return Promise.resolve(success);
				},
				(failure) => {
					console.error(failure.details);
					return Promise.reject(failure);
				}
			);
	}
	signOut() {
		sessionStorage.removeItem("authState");
		localStorage.removeItem("authState");

		store.commit("auth/clearState");
	}
	authenticationState() {
		return store.state["auth"];
	}
	isAuthenticated() {
		return store.state["auth"].isAuthenticated;
	}
	authenticationHeader() {
		const token = store.state["auth"].authToken;
		return token ? "Bearer " + token : "";
	}
	recover() {
		const authState =
			sessionStorage.getItem("authState") ??
			localStorage.getItem("authState");

		if (authState) {
			store.commit("auth/setState", JSON.parse(authState));
		}
	}
}
export const accountService = new AccountService();
