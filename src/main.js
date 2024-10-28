import './assets/main.css'

import { createApp } from 'vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

import ArcoVue from "@arco-design/web-vue";  // 引入库
import "@arco-design/web-vue/dist/arco.css"  // 引入css
import JsonExcel from "vue-json-excel3";
import "echarts"
import Echarts from "vue-echarts"





const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.component('json-excel', JsonExcel);
app.component("v-chart", Echarts)
app.use(pinia)
app.use(router)
app.use(ArcoVue)
app.use(ArcoVueIcon)





app.mount('#app')
