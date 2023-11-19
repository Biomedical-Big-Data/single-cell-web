import { createApp } from "vue"
import Antd from "ant-design-vue"
import { createPinia } from "pinia"
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"
import vue3PhotoPreview from "vue3-photo-preview"
import "vue3-photo-preview/dist/index.css"

import App from "./App.vue"
import router from "./router"
import "@/assets/styles/main.scss"
import "ant-design-vue/dist/reset.css"

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)
app.use(Antd)
app.use(vue3PhotoPreview)
app.use(pinia)
app.use(router)

app.mount("#app")
