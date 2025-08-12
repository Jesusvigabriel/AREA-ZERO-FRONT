import API from 'vue-lsi-util/APIAccesoV2'

const remitos = {
  namespaced: true,
  actions: {
    async crearFromOrden(_, idOrden) {
      return new Promise((resolve, reject) => {
        API.acceder({
          Ruta: `/remitos/fromOrden/${idOrden}`,
          Metodo: 'POST',
          Cartel: 'Generando remito...'
        })
        .then(data => resolve(data))
        .catch(err => reject(err))
      })
    },

    async getFromOrden(_, idOrden) {
      return new Promise((resolve, reject) => {
        API.acceder({ Ruta: `/remitos/fromOrden/${idOrden}` })
          .then(data => resolve(data))
          .catch(err => reject(err))
      })
    },

    async getById(_, id) {
      return new Promise((resolve, reject) => {
        API.acceder({ Ruta: `/remitos/${id}` })
          .then(data => resolve(data))
          .catch(err => reject(err))
      })
    },

    async getByOrden(_, idOrden) {
      return new Promise((resolve, reject) => {
        API.acceder({ Ruta: `/remitos/byOrden/${idOrden}` })
          .then(data => resolve(data))
          .catch(err => reject(err))
      })
    },

    async getByEmpresa(_, { idEmpresa, desde = null, hasta = null }) {
      return new Promise((resolve, reject) => {
        let Ruta = `/remitos/byEmpresa/${idEmpresa}`
        if (desde) {
          Ruta += `/${desde}`
          if (hasta) {
            Ruta += `/${hasta}`
          }
        }
        API.acceder({ Ruta })
          .then(data => resolve(data))
          .catch(err => reject(err))
      })
    },

    async getHistorico(_, idRemito) {
      return new Promise((resolve, reject) => {
        API.acceder({ Ruta: `/remitos/historico/${idRemito}` })
          .then(data => resolve(data))
          .catch(err => reject(err))
      })
    }

    ,async enviarMail(_, payload) {
      return new Promise((resolve, reject) => {
        API.acceder({
          Ruta: `/remitos/enviarMail`,
          Metodo: 'POST',
          Body: payload,
          Cartel: 'Enviando remito...'
        })
          .then(data => resolve(data))
          .catch(err => reject(err))
      })
    }
  }
}

export default remitos
