// Única puerta de salida hacia banco_api. Las pantallas no llaman a fetch directamente.

const BASE = (import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000').replace(/\/+$/, '')

export class ApiError extends Error {}

async function pedir(ruta, opciones) {
  let respuesta
  try {
    respuesta = await fetch(BASE + ruta, opciones)
  } catch {
    throw new ApiError('No se pudo conectar con el servidor.')
  }

  let cuerpo = null
  try {
    cuerpo = await respuesta.json()
  } catch {
    // Respuesta sin cuerpo JSON (por ejemplo, un error interno del servidor).
  }
  return { respuesta, cuerpo }
}

function fallo(respuesta, cuerpo) {
  if (typeof cuerpo?.detail === 'string') return new ApiError(cuerpo.detail)
  if (respuesta.status >= 500) return new ApiError('El servidor respondió con un error.')
  return new ApiError('La solicitud no es válida.')
}

function conJson(metodo, datos) {
  return {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  }
}

export async function login(username, password) {
  const { respuesta, cuerpo } = await pedir('/user/auth/', conJson('POST', { username, password }))
  if (respuesta.status === 404) return false
  if (!respuesta.ok) throw fallo(respuesta, cuerpo)
  return cuerpo?.Autenticado === true
}

export async function getBalance(username) {
  const { respuesta, cuerpo } = await pedir(`/user/balance/${encodeURIComponent(username)}`)
  if (!respuesta.ok) throw fallo(respuesta, cuerpo)
  return cuerpo.balance
}

export async function withdraw(username, value) {
  const { respuesta, cuerpo } = await pedir('/user/transaction/', conJson('PUT', { username, value }))
  if (!respuesta.ok) throw fallo(respuesta, cuerpo)
  return { id: cuerpo.id_transaction, balance: cuerpo.actual_balance }
}
