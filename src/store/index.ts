import { createStore, StoreOptions } from "vuex";
import { IRootState, rootState } from "./types";
import { auth } from "./auth/auth.module";

const store: StoreOptions<IRootState> = {
	state: rootState,
	getters: {},
	mutations: {},
	actions: {},
	modules: {
		auth,
	},
};
export default createStore(store);
