<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ApiError, login } from '../api.js'
import { iniciar } from '../session.js'

const router = useRouter()
const usuario = ref('')
const clave = ref('')
const error = ref('')
const enviando = ref(false)

async function entrar() {
  error.value = ''
  enviando.value = true
  const nombre = usuario.value.trim()
  try {
    if (await login(nombre, clave.value)) {
      iniciar(nombre)
      await router.push({ name: 'inicio' })
    } else {
      error.value = 'Usuario o contraseña incorrectos.'
    }
  } catch (fallo) {
    error.value = fallo instanceof ApiError ? fallo.message : 'Ocurrió un error inesperado.'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <form class="tarjeta" @submit.prevent="entrar">
    <h2>Ingresar</h2>
    <label>
      Usuario
      <input v-model="usuario" data-test="usuario" autocomplete="username" required>
    </label>
    <label>
      Contraseña
      <input v-model="clave" data-test="clave" type="password" autocomplete="current-password" required>
    </label>
    <button data-test="entrar" :disabled="enviando">Entrar</button>
    <p v-if="error" data-test="error" class="error" role="alert">{{ error }}</p>
  </form>
</template>
