import { beforeEach, describe, expect, it, vi } from 'vitest'

async function cargarSesion() {
  vi.resetModules()
  return import('../src/session.js')
}

beforeEach(() => {
  localStorage.clear()
})

describe('sesión', () => {
  it('empieza vacía cuando nadie ha ingresado', async () => {
    const { session } = await cargarSesion()

    expect(session.username).toBeNull()
  })

  it('iniciar expone el usuario y lo guarda en el navegador', async () => {
    const { session, iniciar } = await cargarSesion()

    iniciar('camilo24')

    expect(session.username).toBe('camilo24')
    expect(localStorage.getItem('current_username')).toBe('camilo24')
  })

  it('cerrar borra el usuario de la sesión y del navegador', async () => {
    const { session, iniciar, cerrar } = await cargarSesion()
    iniciar('camilo24')

    cerrar()

    expect(session.username).toBeNull()
    expect(localStorage.getItem('current_username')).toBeNull()
  })

  it('recupera al usuario guardado al volver a cargar la página', async () => {
    localStorage.setItem('current_username', 'andres18')

    const { session } = await cargarSesion()

    expect(session.username).toBe('andres18')
  })
})
