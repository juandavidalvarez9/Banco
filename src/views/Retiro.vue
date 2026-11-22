<script setup>
import { ref } from 'vue'
import { ApiError, withdraw } from '../api.js'
import { pesos } from '../formato.js'
import { session } from '../session.js'

const valor = ref('')
const resultado = ref('')
const error = ref('')
const enviando = ref(false)

async function retirar() {
  resultado.value = ''
  error.value = ''

  const texto = String(valor.value).trim()
  if (!/^[1-9]\d*$/.test(texto)) {
    error.value = 'Escribe un valor entero mayor que cero.'
    return
  }
  const monto = Number(texto)

  enviando.value = true
  try {
    const { balance } = await withdraw(session.username, monto)
    resultado.value = `Retiro de ${pesos(monto)} registrado. Tu saldo ahora es ${pesos(balance)}.`
    valor.value = ''
  } catch (fallo) {
    error.value = fallo instanceof ApiError ? fallo.message : 'Ocurrió un error inesperado.'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <form class="tarjeta" novalidate @submit.prevent="retirar">
    <h2>Retirar</h2>
    <label>
      Valor en pesos
      <input v-model="valor" data-test="valor" inputmode="numeric" placeholder="Ej.: 1000">
    </label>
    <button data-test="retirar" :disabled="enviando">Retirar</button>
    <p v-if="resultado" data-test="resultado" class="exito" role="status">{{ resultado }}</p>
    <p v-if="error" data-test="error" class="error" role="alert">{{ error }}</p>
  </form>
</template>
