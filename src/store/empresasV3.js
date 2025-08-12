import API from 'vue-lsi-util/APIAccesoV2'

//const serverAPI=process.env.NODE_ENV=="development" ? "http://127.0.0.1:8080/apiv3" : "https://apiv3.area54sa.com.ar:8125/apiv3"

const empresasV3= {
    async getMovimientosPorEmpresaYOrden(idEmpresa, orden) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: `/almacenaje/getMovimientosByEmpresaAndOrden/${idEmpresa}/${orden}`, Cartel: "Obteniendo detalle..."})
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) })
            }
        )            
    },

    async getInPeriodo(fechaDesde, fechaHasta, Cartel) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: `/almacenaje/getInPorPeriodo/${fechaDesde}/${fechaHasta}`, Cartel})
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) })
            }
        )            
    },

    async getInPeriodoEmpresa(idEmpresa,fechaDesde, fechaHasta, Cartel) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: `/almacenaje/getInPorPeriodoEmpresa/${fechaDesde}/${fechaHasta}/${idEmpresa}`, Cartel})
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) })
            }
        )            
    },

    async getIn(idEmpresa, fechaDesde, fechaHasta, Cartel) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: `/almacenaje/getIn/${idEmpresa}/${fechaDesde}/${fechaHasta}`, Cartel})
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) })
            }
        )            
    },

    async getOut(idEmpresa, fechaDesde, fechaHasta, Cartel) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: `/almacenaje/getOut/${idEmpresa}/${fechaDesde}/${fechaHasta}`, Cartel})
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) })
            }
        )            
    },

    async getAlmacenaje(idEmpresa, fechaDesde, fechaHasta, Cartel) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: `/almacenaje/getMovimientosPorPeriodoTotalizadosPorEmpresa/${fechaDesde}/${fechaHasta}/${idEmpresa}`, Cartel})
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) })
            }
        )            
    },

    async getAlmacenajePrevio(idEmpresa, fechaDesde, fechaHasta, Cartel) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: `/almacenaje/getMovimientosPorPeriodoTotalizadosPorEmpresaPrevio/${fechaDesde}/${fechaHasta}/${idEmpresa}`, Cartel})
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) })
            }
        )            
    },


    async getOne(id) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: `/Empresa/${id}`, Cartel: "Leyendo empresa"})
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) })
            }
        )            
    },

    async getConfiguracion(id, Cartel="Leyendo configuración...") {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: `/Empresa/Configuracion/${id}`, Cartel})
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) })
            }
        )            
    },

    async saveConfiguracion(id, payload) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({
                    Ruta: `/Empresa/Configuracion/${id}`,
                    Metodo: "PUT",
                    Body: payload,
                    Cartel: "Registrando configuración"
                })
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) })
            }
        )            
    },
    
    async getConfiguracionesEmpresa(id,fechaDesde,fechaHasta, Cartel="Leyendo configuraciones...") {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: `/empresa/configuracionesEmpresa/${id}/${fechaDesde}/${fechaHasta}`, Cartel})
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) 
                console.log(puteada)})
            }
        )            
    },
    async saveEmpresa(id, payload) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({
                    Ruta: `/empresa/saveEmpresa/${id}`,
                    Metodo: "PATCH",
                    Body: payload,
                    Cartel: "Registrando configuración"
                })
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) })
            }
        )            
    },
    
   async saveConfiguracionHistorico(id, payload) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({
                    Ruta: `/Empresa/ConfiguracionHistorico/${id}`,
                    Metodo: "PUT",
                    Body: payload,
                    Cartel: "Registrando configuración"
                })
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) })
            }
        )            
    },

    async updateConfiguracionHistorico(id, payload) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({
                    Ruta: `/empresas/editOneConfiguracionHistorico/${id}`,
                    Metodo: "PATCH",
                    Body: payload,
                })
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) })
            }
        )            
    },

    async updateConfiguracion(id, payload) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({
                    Ruta: `/empresas/editOneConfiguracion/${id}`,
                    Metodo: "PATCH",
                    Body: payload,
                })
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) })
            }
        )            
    },

    async saveActiva(id, activa) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({
                    Ruta: `/Empresa/Activar/${id}/${activa}`,
                    Metodo: "PUT"
                })
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) })
            }
        )            
    },

    async saveActivaAutogestion(id, activa) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({
                    Ruta: `/Empresa/ActivarAutogestion/${id}/${activa}`,
                    Metodo: "PUT"
                })
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) })
            }
        )            
    },

    async saveMostrarTyC(id, activa) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({
                    Ruta: `/Empresa/ActivarMostrarTyC/${id}/${activa}`,
                    Metodo: "PUT"
                })
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) })
            }
        )            
    },

    async saveAutogestionOpciones(id, opciones) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({
                    Ruta: `/Empresa/registrarAutogestionOpciones/${id}/${opciones}`,
                    Metodo: "PUT"
                })
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) })
            }
        )            
    },

    async createEmpresa(payload) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({
                    Ruta: `/empresa/newOne`,
                    Metodo: "PUT",
                    Body: payload,
                    Cartel: "Creando Empresa"
                })
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) })
            }
        )            
    },

    async getOneById(id) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: `/empresa/${id}`})
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) })
            }
        )            
    },

    async getAll(soloStockPosicionado, soloActivas) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: '/Empresas', Cartel: "Obteniendo empresas"})
                .then(data => {
                    if (soloStockPosicionado==null) {
                        soloStockPosicionado=false
                    }                    
                    if (soloStockPosicionado) {
                        data=data.filter(element => element.StockPosicionado)
                    }

                    // console.log(soloActivas);
                    if (soloActivas==null) {
                        soloActivas=true
                    }                    
                    if (soloActivas) {
                        data=data.filter(element => element.Activa)
                    }

                    data.sort(
                        function(a,b){ 
                            if (a.Nombre<b.Nombre) { 
                                return -1
                            } else if (a.Nombre>b.Nombre) { 
                                return 1
                            } else { 
                                return 0
                            } 
                        } 
                    )
                    resolve(data)
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        )            
    },
}

export default empresasV3