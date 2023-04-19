import { createApp } from 'vue'

import ElementPlus from 'element-plus'
import pinia from './stores'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
import './assets/icon/iconfont/iconfont.js'

const app = createApp(App)

app.use(pinia)
app.use(ElementPlus)
app.use(router)

app.mount('#app')
