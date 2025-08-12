# a54gestion

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Colores de chips de estado

Los componentes de seguimiento utilizan `v-chip` para mostrar el estado
actual de una orden o guía. A continuación se describen las clases
devueltas por `getStatusChipClassTextual` para colorear el fondo de cada
chip:

| Estado (Órdenes)      | Clases del chip |
|-----------------------|-----------------|
| Pendiente             | `chip-pendiente` |
| Preparado             | `chip-preparada` |
| A distribución        | `chip-despachada` |
| Anulado               | `error lighten-2 white--text` |
| Retira Cliente        | `chip-despachada` |

| Estado (Guías)        | Clases del chip |
|-----------------------|-----------------|
| Pedido en preparación, Pedido preparado, En CD, En Planchada, Ruteado, DESPACHADO, En distribución, Entregado, Pedido retirado | `success lighten-2 white--text` |
| No entregado, ANULADO | `error lighten-2 white--text` |
| Entrega parcial       | `warning lighten-2 white--text` |
| Otros                 | `secondary lighten-2 white--text` |

## Running against a local backend

To use the frontend with a backend running on your machine you can create
a `.env.development` file in the project root:

```bash
VUE_APP_API_URL="http://localhost:8128"
```

Then start the development server:

```bash
npm run serve
```

Vue CLI will load `.env.development` automatically and API requests will be
sent to `http://localhost:8128`.

## AWS S3 uploads

Some optional features upload files directly to Amazon S3. Provide your AWS
credentials through environment variables in any `.env` file loaded by Vue CLI:

```bash
VUE_APP_AWS_ACCESS_KEY="YOUR_ACCESS_KEY"
VUE_APP_AWS_SECRET="YOUR_SECRET_KEY"
```

The helper `src/helpers/uploadS3.js` reads these values via `process.env` when
uploading files.

