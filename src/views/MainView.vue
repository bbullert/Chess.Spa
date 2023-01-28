<template>
	<navbar></navbar>
	<game-search></game-search>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Navbar from "@/components/Navbar.vue";
import GameSearch from "@/components/GameSearch.vue";

export default defineComponent({
	components: {
		Navbar,
		GameSearch,
	},
});
</script>
