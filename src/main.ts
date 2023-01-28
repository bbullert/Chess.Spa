import { createApp } from "vue";
import { router } from "./router";
import store from "./store";
import App from "./App.vue";
import BootstrapVue3 from "bootstrap-vue-3";
import mitt from "mitt";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";

const emitter = mitt();
const app = createApp(App);
app.config.globalProperties.emitter = emitter;
app.use(router).use(store).use(BootstrapVue3).mount("#app");
