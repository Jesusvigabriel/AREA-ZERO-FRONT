# Variables de color

Este proyecto centraliza los colores en `src/assets/theme.css` para simplificar la personalización del tema. A continuación se listan las variables disponibles y ejemplos de uso principal.

| Variable | Uso principal |
|----------|---------------|
| `--primary` | Color principal de la aplicación (menú y elementos destacados). |
| `--secondary` | Colores secundarios y detalles. |
| `--accent` | Acentos y resaltados. |
| `--error` | Mensajes o botones de error. |
| `--info` | Información secundaria. |
| `--success` | Indicadores de éxito. |
| `--warning` | Advertencias. |
| `--background` | Fondo general de la app. |
| `--surface` | Tarjetas y paneles. |
| `--menubar` | Barra superior/menú. |
| `--card-bg` | Fondo de tarjetas. |
| `--table-row-1-bg` | Colores alternados de filas en tablas. |
| `--table-row-2-bg` | Id. |
| `--table-row-3-bg` | Id. |
| `--table-border-color` | Bordes internos de tablas. |
| `--search-field-bg` | Campos de búsqueda. |
| `--action-button-bg` | Botones de acción. |
| `--action-button-text` | Texto de esos botones. |
| `--slider-track-bg` | Pista de controles deslizantes. |
| `--login-bg` | Fondos de pantallas de login y reset. |
| `--login-card-bg` | Tarjeta de login. |
| `--forgot-link-hover` | Hover del enlace "¿Olvidaste tu contraseña?". |
| `--forgot-link-shadow` | Sombra del mismo enlace. |
| `--switch-track` | Interruptor de tema claro/oscuro. |
| `--switch-focus-shadow` | Enfoque del interruptor. |
| `--switch-sun` | Icono de sol. |
| `--switch-moon` | Icono de luna. |
| `--home-border-pend` | Bordes de tarjetas pendientes. |
| `--home-border-crit` | Bordes de stock crítico. |
| `--home-border-rot` | Bordes de rotación. |
| `--home-border-dio` | Bordes de días inventario. |
| `--vaciar-azul` | Tarjeta "azul" en VaciarPosicion. |
| `--vaciar-verde` | Tarjeta "verde" en VaciarPosicion. |
| `--vaciar-rojo` | Tarjeta "rojo" en VaciarPosicion. |
| `--estado-pendiente` | Estados pendientes de guías/órdenes. |
| `--estado-preparada` | Estados preparados. |
| `--estado-despachada` | Estados despachados. |
| `--estado-entregado` | Estados entregados. |
| `--estado-neutral-bg` | Iconos neutrales de timeline. |
| `--estado-neutral-tx` | Texto neutral de timeline. |

Cada variable también cuenta con valores adaptados para el modo oscuro usando la clase `.theme--dark`. Al modificar `theme.css`, todos los componentes que emplean `var(--variable)` reflejarán automáticamente el nuevo color.
