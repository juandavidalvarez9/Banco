import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'

const Vacia = { template: '<p>pantalla de prueba</p>' }

// Monta una pantalla dentro de un router mínimo con las rutas que las pantallas nombran.
export async function montarPantalla(componente, ruta) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'inicio', component: ruta === '/' ? componente : Vacia },
      { path: '/login', name: 'login', component: ruta === '/login' ? componente : Vacia },
      { path: '/saldo', name: 'saldo', component: ruta === '/saldo' ? componente : Vacia },
      { path: '/retiro', name: 'retiro', component: ruta === '/retiro' ? componente : Vacia },
    ],
  })
  router.push(ruta)
  await router.isReady()
  const pantalla = mount(componente, { global: { plugins: [router] } })
  await flushPromises()
  return { pantalla, router }
}
