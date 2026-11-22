import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, withdraw } from '../src/api.js'
import { iniciar } from '../src/session.js'
import Retiro from '../src/views/Retiro.vue'
import { montarPantalla } from './ayudas.js'

vi.mock('../src/api.js', async (original) => ({
  ...(await original()),
  withdraw: vi.fn(),
}))

async function retirar(pantalla, valor) {
  await pantalla.get('[data-test=valor]').setValue(valor)
  await pantalla.get('form').trigger('submit')
  await flushPromises()
}

beforeEach(() => {
  iniciar('camilo24')
  vi.mocked(withdraw).mockReset()
})

describe('pantalla de retiro', () => {
  it('registra el retiro y muestra el saldo nuevo', async () => {
    vi.mocked(withdraw).mockResolvedValue({ id: 1, balance: 119000 })
    const { pantalla } = await montarPantalla(Retiro, '/retiro')

    await retirar(pantalla, '1000')

    expect(withdraw).toHaveBeenCalledWith('camilo24', 1000)
    expect(pantalla.get('[data-test=resultado]').text()).toBe(
      'Retiro de 1.000 COP registrado. Tu saldo ahora es 119.000 COP.',
    )
  })

  it('muestra el mensaje de la API cuando no hay fondos', async () => {
    vi.mocked(withdraw).mockRejectedValue(new ApiError('Sin fondos suficientes.'))
    const { pantalla } = await montarPantalla(Retiro, '/retiro')

    await retirar(pantalla, '999999999')

    expect(pantalla.get('[data-test=error]').text()).toBe('Sin fondos suficientes.')
    expect(pantalla.find('[data-test=resultado]').exists()).toBe(false)
  })

  it.each(['', '0', '-500', '10.5'])('no llama a la API con el valor "%s"', async (valor) => {
    const { pantalla } = await montarPantalla(Retiro, '/retiro')

    await retirar(pantalla, valor)

    expect(withdraw).not.toHaveBeenCalled()
    expect(pantalla.get('[data-test=error]').text()).toBe('Escribe un valor entero mayor que cero.')
  })
})
