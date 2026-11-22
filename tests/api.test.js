import { describe, expect, it, vi } from 'vitest'
import { ApiError, getBalance, login, withdraw } from '../src/api.js'

const API = 'http://127.0.0.1:8000'

function responder(status, cuerpo) {
  const fetchFalso = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => cuerpo,
  })
  vi.stubGlobal('fetch', fetchFalso)
  return fetchFalso
}

describe('login', () => {
  it('devuelve true cuando la API autentica', async () => {
    const fetchFalso = responder(200, { Autenticado: true })

    expect(await login('camilo24', 'root')).toBe(true)
    expect(fetchFalso).toHaveBeenCalledWith(
      `${API}/user/auth/`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ username: 'camilo24', password: 'root' }),
      }),
    )
  })

  it('devuelve false cuando la clave es incorrecta', async () => {
    responder(200, { Autenticado: false })

    expect(await login('camilo24', 'otra')).toBe(false)
  })

  it('devuelve false cuando el usuario no existe', async () => {
    responder(404, { detail: 'El usuario no existe.' })

    expect(await login('nadie', 'x')).toBe(false)
  })
})

describe('getBalance', () => {
  it('devuelve el saldo como número', async () => {
    const fetchFalso = responder(200, { username: 'camilo24', balance: 120000 })

    expect(await getBalance('camilo24')).toBe(120000)
    expect(fetchFalso.mock.calls[0][0]).toBe(`${API}/user/balance/camilo24`)
  })

  it('lanza ApiError con el detalle que envía la API', async () => {
    responder(404, { detail: 'El usuario no existe.' })

    await expect(getBalance('nadie')).rejects.toThrow(
      new ApiError('El usuario no existe.'),
    )
  })
})

describe('withdraw', () => {
  it('devuelve el id de la transacción y el saldo nuevo', async () => {
    const fetchFalso = responder(200, {
      id_transaction: 7,
      username: 'camilo24',
      value: 1000,
      actual_balance: 119000,
    })

    expect(await withdraw('camilo24', 1000)).toEqual({ id: 7, balance: 119000 })
    expect(fetchFalso).toHaveBeenCalledWith(
      `${API}/user/transaction/`,
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ username: 'camilo24', value: 1000 }),
      }),
    )
  })

  it('lanza ApiError con el detalle cuando no hay fondos', async () => {
    responder(400, { detail: 'Sin fondos suficientes.' })

    await expect(withdraw('camilo24', 10 ** 9)).rejects.toThrow(
      new ApiError('Sin fondos suficientes.'),
    )
  })

  it('usa un mensaje propio cuando el detalle no es texto', async () => {
    responder(422, { detail: [{ msg: 'Input should be greater than 0' }] })

    await expect(withdraw('camilo24', -1)).rejects.toThrow(
      new ApiError('La solicitud no es válida.'),
    )
  })
})

describe('fallos del servidor', () => {
  it('avisa cuando no se puede conectar', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('fetch failed')))

    await expect(getBalance('camilo24')).rejects.toThrow(
      new ApiError('No se pudo conectar con el servidor.'),
    )
  })

  it('avisa cuando el servidor responde con error interno', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => {
          throw new SyntaxError('no es JSON')
        },
      }),
    )

    await expect(getBalance('camilo24')).rejects.toThrow(
      new ApiError('El servidor respondió con un error.'),
    )
  })
})
