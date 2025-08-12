import API from 'vue-lsi-util/APIAccesoV2'

//const serverAPI=process.env.NODE_ENV=="development" ? "http://127.0.0.1:8080/apiv3" : "https://apiv3.area54sa.com.ar:8125/apiv3"
//const serverAPI="https://apiv3.area54sa.com.ar:8125/apiv3"
//const serverAPI="http://127.0.0.1:8080/apiv3"

const posiciones= {
    async vaciar(id) {
        return new Promise (
            function (resolve, reject) {
                API.acceder(
                    {Ruta: '/Posiciones/vaciar/'+id, 
                    Cartel: "Vaciando la posición",
                    Metodo: "PUT"
                })
                .then(data => {
                    resolve(data)
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        )            
    },
    async getContent(id) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: '/Posiciones/getContentById/'+id, Cartel: "Obteniendo contenido de la posición"})
                .then(data => {
                    resolve(data)
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        )            
    },
    async getContenidoVariasPosiciones(payload) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({
                    Ruta: '/Posiciones/getContenidoPosiciones/'+payload, 
                    Cartel: "Obteniendo contenido de las posiciones",
                    Body: payload,
                    // Metodo: "Patch"
                })
                .then(data => {
                    resolve(data)
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        )            
    },
    async modificar(id, payload) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({
                    Ruta: '/Posiciones/'+id, 
                    Cartel: "Registrando información de la posición",
                    Body: payload,
                    Metodo: "Put"
                })
                .then(data => {
                    resolve(data)
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        )            
    },
    async eliminar(id) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({
                    Ruta: '/Posicion/deleteOneById/'+id, 
                    Cartel: "Eliminando posición",
                    Metodo: "Delete"
                })
                .then(data => {
                    resolve(data)
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        )            
    },
    async nueva(nombre) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({
                    Ruta: '/Posiciones/newOne/'+nombre, 
                    Cartel: "Creando posición...",
                    Metodo: "Post"
                })
                .then(data => {
                    resolve(data)
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        )            
    },
    async desposicionar(idProducto, idPosicion, cantidadADesposicionar) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({
                    Ruta: `/producto/desposicionar/${idProducto}/${idPosicion}/${cantidadADesposicionar}`,
                    Cartel: "Registrando desposicionamiento...",
                    Metodo: "Post"
                })
                .then(data => {
                    resolve(data)
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        )            
    },
    async getByNombre(nombre) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: '/Posiciones/byNombre/'+nombre})
                .then(data => {
                    resolve(data)
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        )            
    },
    async getAllByEmpresaConProductos(idEmpresa) {
        return new Promise((resolve, reject) => {
            API.acceder({
                Ruta: `/posiciones/getAllByEmpresaConProductos/${idEmpresa}`,
                Cartel: "Obteniendo posiciones y productos..."
            })
            .then(data => resolve(data))
            .catch(err => reject(err))
        })
    },
        
    async getAll() {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: '/Posiciones', Cartel: "Obteniendo posiciones..."})
                .then(data => {
                    resolve(data)
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        )            
    },
}

export default posiciones