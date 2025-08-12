
import API from '../API/Acceso'

const productos= {
    namespaced: true,
    actions: {
        async igualarStockAPosicionado(IdArticulo) {
            return new Promise (
                function (resolve, reject) {
                    API.actions.acceder({Ruta: 'IngresosStock/igualarStockAPosicionado', 
                                        Cabeceras: {IdArticulo},
                                        Metodo: "Put",
                                        Cartel: "Reparando artículo ..."})
                    .then(datosLeidos => {
                        if (datosLeidos.Estado=="OK") {
                            resolve(datosLeidos.Datos.ProductoReparado)
                        } else {
                            reject(datosLeidos.Detalle)
                        }
                    })
                    .catch(puteada => { 
                        console.log("Listo, puteada")
                        reject(puteada.Detalle) 
                    })
                }
            )            
        },
        async getById(Id) {
            return new Promise (
                function (resolve, reject) {
                    API.actions.acceder({Ruta: 'IngresosStock/getArticuloById', 
                                        Cabeceras: {Id},
                                        Cartel: "Obteniendo articulo ..."})
                    .then(datosLeidos => {
                        if (datosLeidos.Estado=="OK") {
                            resolve(datosLeidos.Datos.ProductoBuscado)
                        } else {
                            reject(datosLeidos.Detalle)
                        }
                    })
                    .catch(puteada => { 
                        reject(puteada) 
                    })
                }
            )            
        },
        async getAllByIdEmpresa(IdEmpresa) {
            return new Promise (
                function (resolve, reject) {
                    API.actions.acceder({Ruta: 'IngresosStock/getArticulosByIdEmpresa', 
                                        Cabeceras: {IdEmpresa},
                                        Cartel: "Obteniendo articulos ..."})
                    .then(datosLeidos => {
                        if (datosLeidos.Estado=="OK") {
                            resolve(datosLeidos.Datos.Productos)
                        } else {
                            reject(datosLeidos.Detalle)
                        }
                    })
                    .catch(puteada => { 
                        reject(puteada) 
                    })
                }
            )            
        },
    },
}

export default productos
