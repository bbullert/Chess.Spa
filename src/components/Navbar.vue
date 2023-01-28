<template>
	<nav>
		<span>
			You're logged as&nbsp;<b>{{ userName }}</b>
		</span>
		<span>
			<router-link @click="signOut" to="/sign-in">Sign Out</router-link>
		</span>
	</nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { accountService } from "@/services/account.service";

export default defineComponent({
	data() {
		return {
			userName: accountService.authenticationState()?.userName,
		};
	},
	methods: {
		signOut() {
			accountService.signOut();
		},
	},
	mounted() {
		if (!accountService.isAuthenticated()) this.$router.push("/sign-in");
	},
});
</script>

<style lang="scss">
@import "@/assets/styles/nav";
</style>
