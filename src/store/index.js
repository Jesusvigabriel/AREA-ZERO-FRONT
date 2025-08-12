import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";

import usuarios from './usuarios'
import empresas from './empresas'
import remitos from './remitos'

import snackbar from 'vue-lsi-util/snackbar'
import loading from 'vue-lsi-util/loading'
import alertDialog from 'vue-lsi-util/alertDialog'
import sonidos from 'vue-lsi-util/sonidos'
import emailProcesoConfig from './emailProcesoConfig'

Vue.use(Vuex)


// Configuración de la URL base de la API
const apiConfig = process.env.VUE_APP_API ? JSON.parse(process.env.VUE_APP_API) : {};

// Establecer la URL base de Axios
if (apiConfig.URLV2) {
  axios.defaults.baseURL = apiConfig.URLV2;
} else if (apiConfig.URL) {
  axios.defaults.baseURL = apiConfig.URL;
}

// Configurar autenticación si está disponible
if (apiConfig.CredencialesV2) {
  axios.defaults.auth = apiConfig.CredencialesV2;
} else if (apiConfig.Credenciales) {
  axios.defaults.auth = apiConfig.Credenciales;
}

export default new Vuex.Store({
  modules: {
    usuarios,
    empresas,
    remitos,
    snackbar,
    loading,
    alertDialog,
    sonidos,
    emailProcesoConfig
  },
  state: {
    TituloPrincipal: null,
  },
  mutations: {
    actualizarTituloPrincipal(state, payload) {
      state.TituloPrincipal=payload
    },
  },
  actions: {
    actualizarTituloPrincipal(state, payload) {
      this.commit('actualizarTituloPrincipal', payload)
    }
  },
})
