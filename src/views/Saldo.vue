<script setup>
import { onMounted, ref } from 'vue'
import { ApiError, getBalance } from '../api.js'
import { pesos } from '../formato.js'
import { session } from '../session.js'

const saldo = ref(null)
const error = ref('')

onMounted(async () => {
  try {
    saldo.value = await getBalance(session.username)
  } catch (fallo) {
    error.value = fallo instanceof ApiError ? fallo.message : 'Ocurrió un error inesperado.'
  }
})
</script>

<template>
  <div class="tarjeta">
    <h2>{{ session.username }}</h2>
    <p v-if="error" data-test="error" class="error" role="alert">{{ error }}</p>
    <p v-else-if="saldo === null">Consultando…</p>
    <p v-else class="cifra">
      Tu saldo es: <span class="resaltado" data-test="saldo">{{ pesos(saldo) }}</span>
    </p>
  </div>
</template>
