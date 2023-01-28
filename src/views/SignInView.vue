<template>
	<main id="sign-in">
		<div class="my-card">
			<form @submit.prevent="signIn">
				<h4>Sign In</h4>
				<div role="group" class="form-input-group">
					<b-form-input
						v-model="model.userName"
						placeholder="Username"
					></b-form-input>
				</div>
				<div role="group" class="form-input-group">
					<b-form-input
						type="password"
						v-model="model.password"
						placeholder="Password"
					></b-form-input>
				</div>
				<div role="group" class="form-input-group">
					<b-form-checkbox v-model="model.isPersistent"
						>Don't log me out</b-form-checkbox
					>
				</div>
				<div>
					<b-button variant="light" @click="signUp">Sign up</b-button>
					<b-button variant="primary" type="submit">Sign in</b-button>
				</div>
			</form>
		</div>
	</main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { accountService } from "@/services/account.service";
import { ModalSetup } from "@/store/types/modalSetup";

export default defineComponent({
	components: {},
	data() {
		return {
			model: {
				userName: "",
				password: "",
				isPersistent: false,
			},
		};
	},
	methods: {
		async signIn() {
			await accountService.signIn(this.model).then(
				(success) => {
					this.$router.push("/");
				},
				(failure) => {
					const root = this.$root as any;
					const modal = root.$refs["modal"] as any;

					if (failure.response.data.status == 400) {
						modal.show(
							new ModalSetup({
								title: "Authentication failed",
								content: failure.response.data.details,
								confirmOnly: true,
								confirmContent: "Ok",
							})
						);
					} else {
						modal.show(
							new ModalSetup({
								title: "Error",
								content: failure.response.data.details,
								confirmOnly: true,
								confirmContent: "Ok",
							})
						);
					}
				}
			);
		},
		signUp() {
			this.$router.push("/sign-up");
		},
	},
});
</script>
