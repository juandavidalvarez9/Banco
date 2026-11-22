import { createRouter, createWebHistory } from 'vue-router'
import { session } from './session.js'
import Inicio from './views/Inicio.vue'
import Login from './views/Login.vue'
import Retiro from './views/Retiro.vue'
import Saldo from './views/Saldo.vue'

export function crearRouter(history = createWebHistory()) {
  const router = createRouter({
    history,
    routes: [
      { path: '/login', name: 'login', component: Login, meta: { publica: true } },
      { path: '/', name: 'inicio', component: Inicio },
      { path: '/saldo', name: 'saldo', component: Saldo },
      { path: '/retiro', name: 'retiro', component: Retiro },
      { path: '/:resto(.*)*', redirect: { name: 'inicio' } },
    ],
  })

  // Sin sesión solo se ve el ingreso; con sesión, el ingreso sobra.
  router.beforeEach((destino) => {
    if (!destino.meta.publica && !session.username) return { name: 'login' }
    if (destino.name === 'login' && session.username) return { name: 'inicio' }
  })

  return router
}
