import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, getBalance } from '../src/api.js'
import { iniciar } from '../src/session.js'
import Saldo from '../src/views/Saldo.vue'
import { montarPantalla } from './ayudas.js'

vi.mock('../src/api.js', async (original) => ({
  ...(await original()),
  getBalance: vi.fn(),
}))

beforeEach(() => {
  iniciar('camilo24')
  vi.mocked(getBalance).mockReset()
})

describe('pantalla de saldo', () => {
  it('muestra el saldo del usuario con separador de miles', async () => {
    vi.mocked(getBalance).mockResolvedValue(120000)

    const { pantalla } = await montarPantalla(Saldo, '/saldo')

    expect(getBalance).toHaveBeenCalledWith('camilo24')
    expect(pantalla.get('[data-test=saldo]').text()).toBe('120.000 COP')
  })

  it('muestra el mensaje de la API cuando no puede consultar', async () => {
    vi.mocked(getBalance).mockRejectedValue(new ApiError('No se pudo conectar con el servidor.'))

    const { pantalla } = await montarPantalla(Saldo, '/saldo')

    expect(pantalla.get('[data-test=error]').text()).toBe('No se pudo conectar con el servidor.')
    expect(pantalla.find('[data-test=saldo]').exists()).toBe(false)
  })
})
