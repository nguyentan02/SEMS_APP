import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import PrimeVue from 'primevue/config';
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import ToastService from 'primevue/toastservice';
import StyleClass from "primevue/styleclass";

import './assets/main.css'
import './assets/index.css'

import 'vue-toast-notification/dist/theme-sugar.css';
import '../node_modules/flowbite-vue/dist/index.css'
import "@fortawesome/fontawesome-free/css/all.min.css"
import 'primevue/resources/themes/aura-light-green/theme.css';

import App from './App.vue'
dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)
dayjs.locale('vi')

const pinia = createPinia()


pinia.use(piniaPluginPersistedstate)
createApp(App).use(pinia).use(router).use(PrimeVue).use(ToastService).directive('styleclass', StyleClass).mount('#app')
