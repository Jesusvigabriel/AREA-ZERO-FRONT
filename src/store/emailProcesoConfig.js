import API from 'vue-lsi-util/APIAccesoV2'

const state = {
  reglas: [],
  cargando: false,
  error: null
}

const getters = {
  reglas: state => state.reglas,
  cargando: state => state.cargando,
  error: state => state.error
}

const actions = {
  async cargarReglas({ commit }, idEmpresa) {
    commit('setCargando', true)
    try {
      const resp = await API.acceder({ Ruta: `/emailProcesoConfig/${idEmpresa}`, Metodo: 'GET' })
      // El API puede devolver data directo o dentro de resp.data
      commit('setReglas', Array.isArray(resp) ? resp : resp?.data || [])
    } catch (e) {
      commit('setError', e)
    } finally {
      commit('setCargando', false)
    }
  },
  async crearRegla({ dispatch }, regla) {
    await API.acceder({ Ruta: '/emailProcesoConfig', Metodo: 'POST', Body: regla })
    await dispatch('cargarReglas', regla.IdEmpresa)
  },
  async actualizarRegla({ dispatch }, regla) {
    await API.acceder({ Ruta: `/emailProcesoConfig/${regla.Id}`, Metodo: 'PATCH', Body: regla })
    await dispatch('cargarReglas', regla.IdEmpresa)
  },
  async eliminarRegla({ dispatch }, { id, idEmpresa }) {
    await API.acceder({ Ruta: `/emailProcesoConfig/${id}`, Metodo: 'DELETE' })
    await dispatch('cargarReglas', idEmpresa)
  }
}

const mutations = {
  setReglas(state, reglas) {
    state.reglas = reglas
  },
  setCargando(state, val) {
    state.cargando = val
  },
  setError(state, err) {
    state.error = err
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
