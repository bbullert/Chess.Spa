import { Module } from "vuex";
import { IRootState } from "../types";
import { authState, IAuthState } from "./auth.types";

export const auth: Module<IAuthState, IRootState> = {
	namespaced: true,
	state: authState,
	actions: {},
	mutations: {
		setState(state, authResponse) {
			if (!authResponse) return;
			state.id = authResponse.id;
			state.userName = authResponse.userName;
			state.email = authResponse.email;
			state.role = authResponse.role;
			state.authToken = authResponse.authToken;
			state.isPersistent = authResponse.isPersistent;
			state.isAuthenticated = true;
		},
		clearState(state) {
			state.id = "";
			state.userName = "";
			state.email = "";
			state.role = "";
			state.authToken = "";
			state.isPersistent = false;
			state.isAuthenticated = false;
		},
	},
};
