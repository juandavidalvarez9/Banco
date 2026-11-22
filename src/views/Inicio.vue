<script setup>
import { session } from '../session.js'
</script>

<template>
  <div class="tarjeta">
    <h2>Hola <span class="resaltado">{{ session.username }}</span>, ¡bienvenido!</h2>
  </div>
</template>
