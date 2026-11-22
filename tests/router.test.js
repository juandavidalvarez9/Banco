import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMemoryHistory } from 'vue-router'
import App from '../src/App.vue'
import { crearRouter } from '../src/router.js'
import { cerrar, iniciar, session } from '../src/session.js'

vi.mock('../src/api.js', async (original) => ({
  ...(await original()),
  getBalance: vi.fn().mockResolvedValue(120000),
}))

async function abrir(ruta) {
  const router = crearRouter(createMemoryHistory())
  router.push(ruta)
  await router.isReady()
  const app = mount(App, { global: { plugins: [router] } })
  await flushPromises()
  return { app, router }
}

beforeEach(() => {
  cerrar()
})

describe('navegación', () => {
  it('sin sesión, una pantalla privada lleva al ingreso', async () => {
    const { router } = await abrir('/saldo')

    expect(router.currentRoute.value.name).toBe('login')
  })

  it('sin sesión no se muestra el menú', async () => {
    const { app } = await abrir('/login')

    expect(app.find('nav').exists()).toBe(false)
  })

  it('con sesión, el ingreso lleva al inicio y saluda al usuario', async () => {
    iniciar('camilo24')

    const { app, router } = await abrir('/login')

    expect(router.currentRoute.value.name).toBe('inicio')
    expect(app.text()).toContain('Hola camilo24')
  })

  it('con sesión, una ruta desconocida lleva al inicio', async () => {
    iniciar('camilo24')

    const { router } = await abrir('/no-existe')

    expect(router.currentRoute.value.name).toBe('inicio')
  })

  it('el menú lleva a la pantalla de saldo', async () => {
    iniciar('camilo24')
    const { app, router } = await abrir('/')

    await app.get('[data-test=ir-saldo]').trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('saldo')
    expect(app.get('[data-test=saldo]').text()).toBe('120.000 COP')
  })

  it('cerrar sesión borra el usuario y vuelve al ingreso', async () => {
    iniciar('camilo24')
    const { app, router } = await abrir('/')

    await app.get('[data-test=salir]').trigger('click')
    await flushPromises()

    expect(session.username).toBeNull()
    expect(router.currentRoute.value.name).toBe('login')
  })
})
