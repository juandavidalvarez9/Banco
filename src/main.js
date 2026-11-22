import { createApp } from 'vue'
import App from './App.vue'
import { crearRouter } from './router.js'

createApp(App).use(crearRouter()).mount('#app')
