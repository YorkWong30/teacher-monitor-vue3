import { createApp } from "vue";
import App from "./App.vue";
const app = createApp(App);

import "vant/lib/index.css";

import router from "./router";

app.use(router);

import store from "./store";

app.use(store);
import "./permission"; // permission control
import { imageUrl } from "@/utils/ruoyi";
// 全局方法挂载
app.config.globalProperties.imageUrl = imageUrl;
app.mount("#app");
