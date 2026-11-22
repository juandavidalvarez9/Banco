import { reactive } from 'vue'

const CLAVE = 'current_username'

// Quién ha ingresado. Se guarda en el navegador para sobrevivir a una recarga.
export const session = reactive({ username: localStorage.getItem(CLAVE) })

export function iniciar(username) {
  session.username = username
  localStorage.setItem(CLAVE, username)
}

export function cerrar() {
  session.username = null
  localStorage.removeItem(CLAVE)
}
