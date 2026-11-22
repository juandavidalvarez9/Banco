# Banco APP

> Proyecto de 2020.

Front-end de una aplicación de banco de ejemplo: consulta de saldo y autenticación de usuarios sobre una base de datos ficticia. Está construido con **Vue.js 2** y consume la API de [banco_api](https://github.com/juandavidalvarez9/banco_api).

## Scripts disponibles

Definidos en `package.json`:

```bash
npm install     # instala dependencias (no se versionan)
npm run dev     # servidor de desarrollo con webpack
npm run build   # genera la versión de producción en dist/
npm start       # sirve dist/ con Express (server.js)
```

## Nota sobre la API

`src/components/UserBalance.vue` apunta a una API que estuvo desplegada en Heroku y puede no estar disponible. Para usar una instancia local de `banco_api`, cambia esa URL por la de tu servidor.

## Licencia
CC0 1.0 Universal. Ver [LICENSE](LICENSE).
