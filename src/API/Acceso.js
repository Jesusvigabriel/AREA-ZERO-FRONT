import axios from 'axios'
import store from '../store'

const AccesosAAPI = {
    namespaced: true,
    actions: {
        async acceder (payload) {
                return new Promise( 
                function (resolve, reject) {
                    if (typeof(payload.Cartel)!=='undefined') {
                        store.dispatch('loading/mostrar', payload.Cartel)
                    }
                    if (typeof(payload.Metodo)=="undefined") {
                        payload.Metodo="GET"
                    }

                    axios({method: payload.Metodo, url: payload.Ruta, headers: payload.Cabeceras})
                        .then(datos => {
                            const data = datos.data
                            const estadoOk = data && (data.Estado === "OK" || data.status === "OK")
                            if (estadoOk) {
                                resolve(data)
                            } else {
                                reject(data)
                            }
                        })
                        .catch(error => {
                            reject(error)
                        })
                        .finally( () => {
                            if (typeof(payload.Cartel)!=='undefined') {
                                store.dispatch('loading/ocultar')
                            }        
                        })
                }
            )
        }
    }
}

export default AccesosAAPI