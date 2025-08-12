import API from '../API/Acceso'
import {servicecAWS} from "../helpers/uploadS3"
import API2 from 'vue-lsi-util/APIAccesoV2'


const choferes= {
    async getAll() {
        return new Promise (
          function (resolve, reject) {
            API2.acceder({Ruta: `/chofer/getAll`, Cartel: "Obteniendo Choferes"})
            .then(response => {resolve(response)})
            .catch(puteada => {reject(puteada)})
          }
        )            
    },
    async saveChofer(payload) {
        return new Promise (
            function (resolve, reject) {
                API2.acceder({
                    Ruta: `/chofer/newOne`,
                    Metodo: "PUT",
                    Body: payload,
                    Cartel: "Creando Chofer"
                })
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) })
            }
        )            
    },
    async editChofer(id, payload) {
        return new Promise (
            function (resolve, reject) {
                API2.acceder({
                    Ruta: `/chofer/editOneById/${id}`,
                    Metodo: "PATCH",
                    Body: payload,
                    Cartel: "Editando Chofer"
                })
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) })
            }
        )            
      },
  actions: {

    async registrarEntregasItineradas(NumeroChofer, Fecha, Detalle) {
        return new Promise (
            function (resolve, reject) {
                const Cabeceras={NumeroChofer, Fecha, Detalle}
                console.log(Cabeceras)
                API.actions.acceder({Ruta: 'choferes/setEntregasItineradas', 
                                    Cabeceras,
                                    Metodo: "Put",
                                    Cartel: "Registrando itinerancias ..."})
                .then(datosLeidos => {
                    if (datosLeidos.Estado=="OK") {
                        resolve(datosLeidos.Datos)
                    } else {
                        reject(datosLeidos)
                    }
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        )            
    },

    async getEntregasPendientes(NumeroChofer, Fecha) {
        return new Promise (
            function (resolve, reject) {
                API.actions.acceder({Ruta: 'Choferes/getEntregasPendientes', 
                                     Cabeceras: {NumeroChofer, Fecha},
                                     Cartel: "Obteniendo entregas ..."})
                .then(datosLeidos => {
                    if (datosLeidos.Estado=="OK") {
                        resolve(datosLeidos.Datos)
                    } else {
                        reject(datosLeidos.Detalle)
                    }
                })
                .catch(puteada => { reject(puteada) })
            }
        )            
      },

      async getByNumero(Numero) {
        return new Promise (
            function (resolve, reject) {
                API.actions.acceder({Ruta: 'Choferes/getByNumero', 
                                     Cabeceras: {Numero},
                                     Cartel: "Obteniendo chofer ..."})
                .then(datosLeidos => {
                    if (datosLeidos.Estado=="OK") {
                        resolve(datosLeidos.Datos)
                    } else {
                        reject(datosLeidos.Detalle)
                    }
                })
                .catch(puteada => { reject(puteada) })
            }
        )            
      },
    


      uploadFileToAws(fileUpload,nameFile){
        return new Promise (async (resolve, reject) => {
          try {
            const resultAWS = await servicecAWS.uploadToS3(fileUpload, nameFile)
            console.log(state.nameFile)
            
            if (resultAWS) resolve(resultAWS)
          }catch (e) {
            reject(e)
          }
        })
      }


    
    },
}

export default choferes