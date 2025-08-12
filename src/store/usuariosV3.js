import API from 'vue-lsi-util/APIAccesoV2'

const usuariosV3 = {
    // Métodos existentes...
    async getById(id) {
        return new Promise((resolve, reject) => {
            API.acceder({ Ruta: `/usuarios/getById/${id}` })
                .then(data => resolve(data))
                .catch(error => reject(error))
        })
    },

    async getUserById(id) {
        return new Promise((resolve, reject) => {
            API.acceder({ Ruta: `/usuarios/getUserById/${id}` })
                .then(data => resolve(data))
                .catch(error => reject(error))
        })
    },

    async getByUsernameAndPassword(username, password) {
        return new Promise((resolve, reject) => {
            API.acceder({ 
                Ruta: `/usuarios/getByUsernameAndPassword/${username}/${password}`
            })
            .then(data => resolve(data))
            .catch(error => reject(error))
        })
    },

    // Nuevo método para Google Sign-In
    async loginWithGoogle(token) {
        return new Promise((resolve, reject) => {
            API.acceder({
                Ruta: '/usuarios/loginWithGoogle',
                Metodo: 'POST',
                Body: { token },
                Cartel: 'Autenticando con Google'
            })
            .then(response => resolve(response))
            .catch(error => reject(error))
        })
    },

    async getAll() {
        return new Promise((resolve, reject) => {
            API.acceder({
                Ruta: '/usuarios/getAll',
                Cartel: 'Obteniendo Usuarios'
            })
            .then(response => resolve(response))
            .catch(error => reject(error))
        })
    },
    
    async saveUsuario(payload) {
        return new Promise((resolve, reject) => {
            API.acceder({
                Ruta: '/usuarios/newOne',
                Metodo: 'PUT',
                Body: payload,
                Cartel: 'Creando Usuario'
            })
            .then(data => resolve(data))
            .catch(error => reject(error))
        })
    },
    
    async editUsuario(id, payload) {
        return new Promise((resolve, reject) => {
            API.acceder({
                Ruta: `/usuarios/editOneById/${id}`,
                Metodo: 'PATCH',
                Body: payload,
                Cartel: 'Editando Usuario'
            })
            .then(data => resolve(data))
            .catch(error => reject(error))
        })
    }
}

export default usuariosV3