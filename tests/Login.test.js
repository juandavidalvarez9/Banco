import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, login } from '../src/api.js'
import { cerrar, session } from '../src/session.js'
import Login from '../src/views/Login.vue'
import { montarPantalla } from './ayudas.js'

vi.mock('../src/api.js', async (original) => ({
  ...(await original()),
  login: vi.fn(),
}))

async function ingresar(pantalla, usuario, clave) {
  await pantalla.get('[data-test=usuario]').setValue(usuario)
  await pantalla.get('[data-test=clave]').setValue(clave)
  await pantalla.get('form').trigger('submit')
  await flushPromises()
}

beforeEach(() => {
  cerrar()
  vi.mocked(login).mockReset()
})

describe('pantalla de ingreso', () => {
  it('con credenciales correctas inicia la sesión y lleva al inicio', async () => {
    vi.mocked(login).mockResolvedValue(true)
    const { pantalla, router } = await montarPantalla(Login, '/login')

    await ingresar(pantalla, 'camilo24', 'root')

    expect(login).toHaveBeenCalledWith('camilo24', 'root')
    expect(session.username).toBe('camilo24')
    expect(router.currentRoute.value.name).toBe('inicio')
  })

  it('con credenciales incorrectas avisa y no inicia sesión', async () => {
    vi.mocked(login).mockResolvedValue(false)
    const { pantalla, router } = await montarPantalla(Login, '/login')

    await ingresar(pantalla, 'camilo24', 'mala')

    expect(pantalla.get('[data-test=error]').text()).toBe('Usuario o contraseña incorrectos.')
    expect(session.username).toBeNull()
    expect(router.currentRoute.value.name).toBe('login')
  })

  it('muestra el mensaje de la API cuando falla la conexión', async () => {
    vi.mocked(login).mockRejectedValue(new ApiError('No se pudo conectar con el servidor.'))
    const { pantalla } = await montarPantalla(Login, '/login')

    await ingresar(pantalla, 'camilo24', 'root')

    expect(pantalla.get('[data-test=error]').text()).toBe('No se pudo conectar con el servidor.')
  })
})
