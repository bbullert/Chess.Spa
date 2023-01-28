<template>
	<router-view />
	<modal id="modal" ref="modal"></modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { accountService } from "@/services/account.service";
import Modal from "@/components/Modal.vue";

export default defineComponent({
	methods: {},
	components: { Modal },
	created() {
		accountService.recover();
		if (!accountService.isAuthenticated()) this.$router.push("/sign-in");
	},
});
</script>

<style lang="scss">
@import "@/assets/styles/main";
</style>
