<template>
	<main id="sign-up">
		<div class="my-card">
			<form @submit.prevent="signUp">
				<h4>Sign Up</h4>
				<div role="group" class="form-input-group">
					<b-form-input
						v-model="model.userName"
						placeholder="Username"
						:state="modelState.hasErrors('userName') ? null : false"
					></b-form-input>
					<b-form-invalid-feedback>
						{{ modelState.getError("userName") }}
					</b-form-invalid-feedback>
				</div>
				<div role="group" class="form-input-group">
					<b-form-input
						v-model="model.email"
						placeholder="Email"
						:state="modelState.hasErrors('email') ? null : false"
					></b-form-input>
					<b-form-invalid-feedback>
						{{ modelState.getError("email") }}
					</b-form-invalid-feedback>
				</div>
				<div role="group" class="form-input-group">
					<b-form-input
						type="password"
						v-model="model.password"
						placeholder="Password"
						:state="modelState.hasErrors('password') ? null : false"
					></b-form-input>
					<b-form-invalid-feedback>
						{{ modelState.getError("password") }}
					</b-form-invalid-feedback>
				</div>
				<div role="group" class="form-input-group">
					<b-form-input
						type="password"
						v-model="model.passwordConfirm"
						placeholder="Confirm password"
						:state="
							modelState.hasErrors('passwordConfirm')
								? null
								: false
						"
					></b-form-input>
					<b-form-invalid-feedback>
						{{ modelState.getError("passwordConfirm") }}
					</b-form-invalid-feedback>
				</div>
				<div>
					<b-button variant="light" @click="signIn">Sign in</b-button>
					<b-button variant="primary" type="submit">Sign up</b-button>
				</div>
			</form>
		</div>
	</main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { accountService } from "@/services/account.service";
import { ModelState } from "@/store/types/modelState";
import { ModalSetup } from "@/store/types/modalSetup";

export default defineComponent({
	components: {},
	data() {
		return {
			model: {
				userName: "",
				email: "",
				password: "",
				passwordConfirm: "",
			},
			modelState: {} as ModelState,
		};
	},
	methods: {
		signUp() {
			accountService.signUp(this.model).then(
				(success) => {
					this.$router.push("/sign-in");
				},
				(failure) => {
					const root = this.$root as any;
					const modal = root.$refs["modal"] as any;

					if (failure.response.data.status == 400) {
						if (failure.response.data.result?.succeeded === false) {
							this.modelState = new ModelState(
								failure.response.data.result.errors
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
					} else {
						modal.show(
							new ModalSetup({
								title: "Unknown Error",
								content: failure.response.data.details,
								confirmOnly: true,
								confirmContent: "Ok",
							})
						);
					}
				}
			);
		},
		signIn() {
			this.$router.push("/sign-in");
		},
	},
	created() {
		this.modelState = new ModelState();
	},
});
</script>
