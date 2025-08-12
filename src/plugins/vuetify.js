// vuetify.js
// (Configuración de Vuetify con soporte para tema claro y oscuro y paleta personalizada de AreaZero)
//
// NOTA: Los colores están basados en la imagen de referencia, y el degradado se usa para la barra azul en ambos modos.
// Si querés usar colores en CSS: var(--v-primary-base), etc.

import Vue from 'vue'
import Vuetify from 'vuetify/lib'

// Importar estilos de iconos
import '@mdi/font/css/materialdesignicons.min.css'

Vue.use(Vuetify, {
  iconfont: 'mdi' // Usar iconos de Material Design Icons
})

export default new Vuetify({
  icons: {
    iconfont: 'mdi', // Asegurar que se use MDI
    values: {}
  },
  theme: {
    dark: false, // Arranca en modo claro. Se puede cambiar por código o por UI
    themes: {
      light: {
        // -------- Tema claro (fondo blanco) --------
        primary:    '#191043',       // Azul claro principal
        secondary:  '#0557c1',       // Azul medio
        accent:     '#032284',       // Azul oscuro para resaltar
        error:      '#ff5252',       // Rojo de error
        info:       '#888888',       // Gris para iconos/estados
        success:    '#5beb51',       // Verde claro para "en uso"
        warning:    '#ffe082',       // Amarillo para advertencias
        background: '#f8f5f5',       // Fondo general blanco
        surface:    '#f4f6fa',       // Para tarjetas, tablas, paneles
        menubar:    '#191043', // Degradado barra azul (para ambas)
        card:       '#ffffff',       // Fondo blanco tarjetas (por defecto)
        // Colores adicionales a mano para usar en dark también:
        darkblue:   '#1e2b36',       // Para algún widget, footer o detalles
      },
      dark: {
       
        // -------- Tema oscuro (fondo oscuro) --------
        primary:    '#212124',    // Barra superior y acentos
        secondary:  '#2A2D2E',    // Bordes sutiles o detalles secundarios
        accent:     '#313437',    // Hover/focus en botones, feedback visual suave
        error:      '#FF6B6B',    // Error (sin cambios)
        info:       '#B0B3B8',    // Texto secundario, iconos muted
        success:    '#5beb51',    // (opcional, podés suavizarlo si te parece muy vivo)
        warning:    '#E6B800',    // Amarillo más cálido para warnings
        background: '#2f2f2f',    // Fondo general para modo oscuro
        surface:    '#232526',    // Cards, paneles, menús flotantes
        menubar:    '#212124',    // Misma barra superior (o quitá el degradé para minimal total)
        card:       '#232526',    // Cards y paneles secundarios
        darkblue:   '#232526' ,   // No usás azul, lo mantengo como gris oscuro 
      }
    },
    options: {
      customProperties: true // Permite usar colores como variables CSS (var(--v-primary-base))
    }
  },
  defaultAssets: {
    font: {
      family: 'DM Sans',
      display: 'swap' // Mejora la carga de fuentes
    },
    icons: 'mdi' // Asegura que se cargue el paquete de iconos MDI
  },
  iconfont: 'mdi',
  icons: {
    iconfont: 'mdi',
    values: {}
  },
})
