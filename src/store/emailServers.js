import API from 'vue-lsi-util/APIAccesoV2'

const emailServers = {
    async getOne(idEmpresa) {
        return new Promise((resolve, reject) => {
            API.acceder({ Ruta: `/emailServer/${idEmpresa}` })
                .then(data => resolve(data))
                .catch(err => reject(err))
        })
    },

    async save(idEmpresa, payload) {
        return new Promise((resolve, reject) => {
            API.acceder({
                Ruta: `/emailServer/${idEmpresa}`,
                Metodo: 'POST',
                Body: payload,
            })
                .then(data => resolve(data))
                .catch(err => reject(err))
        })
    },

    async delete(idEmpresa) {
        return new Promise((resolve, reject) => {
            API.acceder({
                Ruta: `/emailServer/${idEmpresa}`,
                Metodo: 'DELETE',
            })
                .then(data => resolve(data))
                .catch(err => reject(err))
        })
    },

    async test(idEmpresa, body) {
        return new Promise((resolve, reject) => {
            API.acceder({
                Ruta: `/emailServer/test/${idEmpresa}`,
                Metodo: 'POST',
                Body: body,
            })
                .then(data => resolve(data))
                .catch(err => reject(err))
        })
    },
}

export default emailServers

