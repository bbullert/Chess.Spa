import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";

import MainView from "@/views/MainView.vue";
import SignInView from "@/views/SignInView.vue";
import SignUpView from "@/views/SignUpView.vue";
import GameView from "@/views/GameView.vue";

export const API_URL = "https://localhost:5001/api/";

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "home",
		component: MainView,
	},
	{
		path: "/sign-in",
		name: "sign-in",
		component: SignInView,
	},
	{
		path: "/sign-up",
		name: "sign-up",
		component: SignUpView,
	},
	{
		path: "/play/:id",
		name: "game",
		component: GameView,
	},
];

export const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

const connection = new HubConnectionBuilder().withUrl(API_URL + "hub").build();

export class HubConnectionResponse {
	connection: HubConnection | null = null;
	isSuccess: boolean;
	error: unknown = null;

	constructor(init?: Partial<HubConnectionResponse>) {
		Object.assign(this, init);
	}
}

export function connect(counter: number = 0): Promise<HubConnectionResponse> {
	return new Promise((resolve, reject) => {
		try {
			if (connection.state == "Connected") {
				let response = new HubConnectionResponse({
					connection: connection,
					isSuccess: true,
				});
				resolve(response);
			} else if (connection.state == "Connecting" && counter <= 5) {
				new Promise<HubConnectionResponse>((resolve) =>
					setTimeout(() => {
						resolve(connect(++counter));
					}, 500)
				).then(
					(success) => {
						resolve(success);
					},
					(failure) => {
						reject(failure);
					}
				);
			} else {
				connection.start().then(() => {
					let response = new HubConnectionResponse({
						connection: connection,
						isSuccess: true,
					});
					resolve(response);
				});
			}
		} catch (error) {
			let response = new HubConnectionResponse({
				error: error,
				isSuccess: false,
			});
			reject(response);
		}
	});
}
