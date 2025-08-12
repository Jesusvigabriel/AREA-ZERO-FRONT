
import axios from "axios";
import store from '../store'
import API from '../API/Acceso'

import   empresaV3 from '../store/empresasV3' 

const empresas= {
  namespaced: true,
  state: {
    listaEmpresas: []
  },
  
  mutations: {
      actualizarListaEmpresas(state, payload) {
        state.listaEmpresas=payload
      },
  },
  actions: {
      async cargarListaEmpresas(state, payload){
          this.dispatch('loading/mostrar', {titulo: "Leyendo empresas", color: 'blue'})      
          const EmpresasLeidas= [];
          const Autorizacion=store.state.usuarios.API.Credenciales

          if (typeof payload=="undefined") {
            payload=""
          }
        

          empresaV3.getAll(false,true )
          .then (data => {
            //console.log(data)

                  data.forEach(element => {
                     let agregar
                     if (payload=="SoloStockPosicionado") {
                          agregar=agregar=(element.StockPosicionado)
                      } else if (payload=="SoloActivas") {
                          agregar=(element.Activa)
                     } else {
                       agregar=true
                     }
                     if (agregar) {
                       if (store.state.usuarios.usuarioActual.IdEmpresa<=0 || element.Id===store.state.usuarios.usuarioActual.IdEmpresa) {
                         EmpresasLeidas.push({Id:element.Id, Nombre:element.Nombre});
                       }
                     }

                   })
                   this.commit('empresas/actualizarListaEmpresas', EmpresasLeidas.sort(function(a,b){ if (a.Nombre<b.Nombre) { return -1; } else if (a.Nombre>b.Nombre) { return 1; } else { return 0; } } ));
                
                 
              })
              .catch ( error => {
                  store.dispatch('snackbar/mostrar', error)
              })
              .finally ( () => {
                  store.dispatch('loading/ocultar')        
             })
          

          // await axios.get('Empresas/todas', {auth: Autorizacion} )
          //   .then(datos => {
          //     if (datos.data.Estado==="OK") {

          //       datos.data.Datos.Empresas.forEach(element => {
          //         let agregar
          //         if (payload=="SoloStockPosicionado") {
          //           agregar=(element.StockPosicionado)
          //         } else if (payload=="SoloActivas") {
          //           agregar=(element.Activa)
          //         } else {
          //           agregar=true
          //         }
          //         if (agregar) {
          //           if (store.state.usuarios.usuarioActual.IdEmpresa<=0 || element.Id===store.state.usuarios.usuarioActual.IdEmpresa) {
          //             EmpresasLeidas.push({Id:element.Id, Nombre:element.Nombre});
          //           }
          //         }

          //       })
          //       this.commit('empresas/actualizarListaEmpresas', EmpresasLeidas.sort(function(a,b){ if (a.Nombre<b.Nombre) { return -1; } else if (a.Nombre>b.Nombre) { return 1; } else { return 0; } } ));
          //     } else {
          //       this.dispatch('snackbar/mostrar', datos.data.Detalle)
          //     }
          //   })
          //   .catch(datos => {
          //     alert("Error en lectura")
          //   })
          //   .finally(() => {
          //     this.dispatch('loading/ocultar')
          //   })
      },

      async getEstadisticas(IdEmpresa, FechaDesde, FechaHasta) {
        return new Promise (
            function (resolve, reject) {
                API.actions.acceder({Ruta: 'Empresas/getEstadisticas', 
                                     Cabeceras: {IdEmpresa, FechaDesde, FechaHasta},
                                     Cartel: "Obteniendo estadisticas ..."})
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


      vaciarLista(state) {
        this.commit('empresas/actualizarListaEmpresas', [])
      },

    },

}

export default empresas