<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { cerrar, session } from './session.js'

const router = useRouter()

async function salir() {
  cerrar()
  await router.push({ name: 'login' })
}
</script>

<template>
  <div class="pagina">
    <header class="header">
      <h1>Banco BWT</h1>
      <nav v-if="session.username">
        <RouterLink class="boton" data-test="ir-inicio" :to="{ name: 'inicio' }">Inicio</RouterLink>
        <RouterLink class="boton" data-test="ir-saldo" :to="{ name: 'saldo' }">Saldo</RouterLink>
        <RouterLink class="boton" data-test="ir-retiro" :to="{ name: 'retiro' }">Retiro</RouterLink>
        <button class="boton" data-test="salir" type="button" @click="salir">Cerrar sesión</button>
      </nav>
    </header>

    <main class="main-component">
      <RouterView />
    </main>

    <footer class="footer">
      <h2>ParqueSoft 2020</h2>
    </footer>
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  color: #283747;
}

.pagina {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header,
.footer {
  background-color: #283747;
  color: #e5e7e9;
}

.header {
  min-height: 100px;
  padding: 0 32px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.header nav {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.boton {
  color: #e5e7e9;
  background: #283747;
  border: 1px solid #e5e7e9;
  border-radius: 5px;
  padding: 10px 20px;
  font: inherit;
  font-size: 18px;
  text-decoration: none;
  cursor: pointer;
}

.boton:hover,
.boton.router-link-exact-active {
  color: #283747;
  background: #e5e7e9;
}

.main-component {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px 16px;
  background: #fdfefe;
}

.footer {
  min-height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer h2 {
  margin: 0;
  font-size: 20px;
}

.tarjeta {
  width: 100%;
  max-width: 460px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: center;
}

.tarjeta h2 {
  margin: 0;
  font-size: 34px;
}

.tarjeta label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
  font-weight: 600;
}

.tarjeta input {
  padding: 12px;
  border: 1px solid #aab7b8;
  border-radius: 5px;
  font: inherit;
  font-size: 18px;
}

.tarjeta button {
  padding: 12px 20px;
  border: 0;
  border-radius: 5px;
  background: #283747;
  color: #e5e7e9;
  font: inherit;
  font-size: 18px;
  cursor: pointer;
}

.tarjeta button:disabled {
  opacity: 0.6;
  cursor: wait;
}

.cifra {
  margin: 0;
  font-size: 28px;
}

.resaltado {
  color: crimson;
  font-weight: bold;
}

.error {
  margin: 0;
  color: #b03a2e;
  font-weight: 600;
}

.exito {
  margin: 0;
  color: #1e8449;
  font-weight: 600;
}
</style>
