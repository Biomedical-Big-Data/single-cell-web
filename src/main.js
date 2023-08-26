import { createApp } from 'vue'
// import '@/assets/styles/preflight.css'
import '@/assets/styles/main.scss'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)
createApp(App).use(Antd).use(pinia).use(router).mount('#app')
