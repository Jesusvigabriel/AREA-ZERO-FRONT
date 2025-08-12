import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

// Configuración de SweetAlert2
Vue.use(VueSweetalert2, {
  confirmButtonColor: '#1976D2', // Color del botón de confirmar
  cancelButtonColor: '#ff4444',  // Color del botón de cancelar
  allowOutsideClick: false,       // No permitir cerrar haciendo clic fuera
  allowEscapeKey: false           // No permitir cerrar con la tecla ESC
})

// Importar estilos globales
import './assets/global.css'
import './assets/theme.css'
// import VueConfirmDialog from 'vue-confirm-dialog'

// Vue.use(VueConfirmDialog)
// Vue.component('vue-confirm-dialog', VueConfirmDialog.default)

// Importa e instala vue-lsi-util para LSIMensajes y LSIDialog
import LSIUtil from 'vue-lsi-util'
Vue.use(LSIUtil)

// Configuración global de Vuetify
Vue.config.productionTip = false
Vue.config.devtools = process.env.NODE_ENV === 'development'

// La configuración de Axios se maneja en el store para mantener consistencia
// Ver store/index.js para la configuración de la URL base
console.log('Configuración de la API:', process.env.VUE_APP_API ? JSON.parse(process.env.VUE_APP_API) : 'No configurada');

// Interceptor para registrar peticiones
axios.interceptors.request.use(
  config => {
    // No registrar peticiones de autenticación para no exponer credenciales
    if (!config.url.includes('auth') && !config.url.includes('login')) {
      console.group('📤 Petición HTTP')
      console.log('URL:', config.url)
      console.log('Método:', config.method.toUpperCase())
      if (config.params) console.log('Parámetros:', config.params)
      if (config.data) console.log('Datos enviados:', config.data)
      console.groupEnd()
    }
    return config
  },
  error => {
    console.error('❌ Error en la petición:', error)
    return Promise.reject(error)
  }
)

// Interceptor para registrar respuestas
axios.interceptors.response.use(
  response => {
    // No registrar respuestas de autenticación para no exponer tokens
    if (!response.config.url.includes('auth') && !response.config.url.includes('login')) {
      console.group('📥 Respuesta HTTP')
      console.log('URL:', response.config.url)
      console.log('Estado:', response.status, response.statusText)
      console.log('Datos recibidos:', response.data)
      console.groupEnd()
    }
    return response
  },
  error => {
    if (error.response) {
      // La petición fue hecha y el servidor respondió con un código de estado
      // que está fuera del rango 2xx
      console.group('❌ Error en la respuesta')
      console.log('URL:', error.config.url)
      console.log('Método:', error.config.method.toUpperCase())
      console.log('Estado:', error.response.status, error.response.statusText)
      console.log('Datos de error:', error.response.data)
      console.log('Headers:', error.response.headers)
      console.groupEnd()
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error('❌ No se recibió respuesta del servidor:', error.request)
    } else {
      // Algo ocurrió en la configuración de la petición que generó el error
      console.error('❌ Error al configurar la petición:', error.message)
    }
    return Promise.reject(error)
  }
)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
