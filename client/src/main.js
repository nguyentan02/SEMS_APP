import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import PrimeVue from 'primevue/config';
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import ToastService from 'primevue/toastservice';
import Lara from "@/presets/lara";
import Ripple from 'primevue/ripple';

import BadgeDirective from 'primevue/badgedirective';


import './assets/main.css'
import './assets/index.css'

import 'vue-toast-notification/dist/theme-sugar.css';
import '../node_modules/flowbite-vue/dist/index.css'
import "@fortawesome/fontawesome-free/css/all.min.css"
import 'primevue/resources/themes/lara-light-green/theme.css'
// import 'primevue/resources/primevue.min.css'; // Core CSS

import App from './App.vue'
dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)
dayjs.locale('vi')

const pinia = createPinia()


pinia.use(piniaPluginPersistedstate)
createApp(App).use(pinia).use(router).use(PrimeVue, {  ripple: true }).use(ToastService).directive('ripple', Ripple).directive('badge', BadgeDirective).mount('#app')
