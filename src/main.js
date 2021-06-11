import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import './assets/js/utils'
import Clipboard from 'v-clipboard3';

createApp(App)
    .use(Clipboard)
    .use(store)
    .use(ElementPlus)
    .use(router)
    .mount('#app')
