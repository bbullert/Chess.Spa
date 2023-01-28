<template>
	<div class="my-modal" :id="id" :class="[className, status]">
		<div class="my-modal-layer">
			<div
				class="my-card"
				:class="setup.confirmOnly ? 'my-modal-confirm-only' : null"
			>
				<slot>
					<h5 class="my-modal-header">{{ setup.title }}</h5>
					<div class="my-modal-body">{{ setup.content }}</div>
					<div class="my-modal-footer">
						<b-button
							variant="danger"
							class="my-btn my-modal-cancel"
							@click="cancel"
							>{{ setup.cancelContent }}</b-button
						>
						<b-button
							class="my-btn my-modal-confirm"
							@click="confirm"
							>{{ setup.confirmContent }}</b-button
						>
					</div>
				</slot>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { ModalSetup } from "@/store/types/modalSetup";
import { defineComponent } from "vue";

export default defineComponent({
	props: {
		id: {
			default: "",
		},
		className: {
			default: "",
		},
	},
	data() {
		return {
			status: "hidden",
			setup: {} as ModalSetup,
		};
	},
	methods: {
		init(setup: ModalSetup) {
			this.setup = setup;
		},
		show(setup?: ModalSetup) {
			if (setup) this.init(setup);
			this.status = "showing";
			setTimeout(() => {
				this.status = "showed";
			}, 400);
		},
		close() {
			this.status = "hidding";
			setTimeout(() => {
				this.status = "hidden";
			}, 400);
		},
		confirm() {
			this.close();
			this.$emit("confirm");
		},
		cancel() {
			this.close();
			this.$emit("cancel");
		},
	},
	created() {
		this.setup = new ModalSetup();
	},
});
</script>
