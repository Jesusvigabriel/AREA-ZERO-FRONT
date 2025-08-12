import API from 'vue-lsi-util/APIAccesoV2'
import jspdf from 'jspdf'
import "jspdf-barcode"

const ordenesV3= {

  async marcarRetiraCliente(id, fecha) {
    return new Promise (
      function (resolve, reject) {
        API.acceder({Metodo: "Put", Ruta: `/orden/marcarRetiraCliente/${id}/${fecha}`, Cartel: "Registrando RetiraCliente..."})
        .then(response => {resolve(response)})
        .catch(puteada => {reject(puteada)})
      }
    )            
  },
  async getProductosYPosicionesByOrden(idOrden) {
    return new Promise((resolve, reject) => {
        API.acceder({
            Metodo: "GET",
            Ruta: `/ordenes/productos-posiciones/${idOrden}`,
            Cartel: "Obteniendo productos y posiciones..."
        })
        .then(response => {
            console.log("DEBUG - respuesta productos-posiciones:", response);
            // Si la respuesta es un array, OK (soporta endpoint legacy)
            if (Array.isArray(response)) {
                resolve(response);
            }
            // Si la respuesta viene como objeto estándar con status/data
            else if (response && response.status === "OK") {
                resolve(response.data);
            }
            // Si viene mal armado
            else {
                const mensaje = response && response.mensaje
                    ? response.mensaje
                    : "Respuesta inesperada del endpoint productos-posiciones";
                reject(new Error(mensaje));
            }
        })
        .catch(error => {
            reject(error);
        });
    });
},

  
  
  async getLocalidadByCodigoPostal(codigoPostal){
    return new Promise (
      function (resolve, reject) {
        API.acceder({Metodo: "get", Ruta: `/localidades/getByCodigoPostal/${codigoPostal}`, Cartel: "Obeniendo localidad..."})
        .then(response => {resolve(response)})
        .catch(puteada => {reject(puteada)})
      }
    )     
},
  async getByPeriodoEmpresa(fechaDesde, fechaHasta, idEmpresa) {
    return new Promise (
      function (resolve, reject) {
        API.acceder({Ruta: `/ordenes/byPeriodoEmpresa/${fechaDesde}/${fechaHasta}/${idEmpresa}`, Cartel: "Obteniendo órdenes"})
        .then(response => {resolve(response)})
        .catch(puteada => {reject(puteada)})
      }
    )            
  },

  async getByPeriodoEmpresaSoloPreparadasYNoPreorden(fechaDesde, fechaHasta, idEmpresa) {
    return new Promise (
      function (resolve, reject) {
        API.acceder({Ruta: `/ordenes/byPeriodoEmpresaSoloPreparadasYNoPreorden/${fechaDesde}/${fechaHasta}/${idEmpresa}`, Cartel: "Obteniendo órdenes"})
        .then(response => {resolve(response)})
        .catch(puteada => {reject(puteada)})
      }
    )            
  },

  async setearPreOrden(idOrden, preOrden, fecha, usuario) {
    return new Promise (
      function (resolve, reject) {
        API.acceder({Metodo: "Put", Ruta: `/orden/setPreorden/${idOrden}/${preOrden}/${fecha}/${usuario}`, Cartel: "Registrando PreOrden..."})
        .then(response => {resolve(response)})
        .catch(puteada => {reject(puteada)})
      }
    )            
  },

  async contadorBultosDia(idEmpresa, fecha){
    return new Promise(
      function (resolve, reject) {
        API.acceder({
          Ruta: '/ordenes/contadorBultosDia/'+idEmpresa+'/'+fecha,
          Cartel: "Obeniendo cantidades..."
        })
        .then(response => {resolve(response)})
        .catch(puteada => {reject(puteada)})
      }
    )
  },

  async eliminar(id) {
    return new Promise (
      function (resolve, reject) {
        API.acceder({
          Ruta: '/orden/deleteOneById/'+id, 
          Cartel: "Eliminando orden...",
          Metodo: "Delete"
        })
        .then(response => {resolve(response)})
        .catch(puteada => {reject(puteada)})
      }
    )            
  },

  async anularOrdenById(idOrden,usuario,numeroOrden,idEmpresa){
    return new Promise (
      function (resolve, reject) {
        API.acceder({
          Ruta: '/orden/anularOrdenById/'+idOrden+'/'+usuario+'/'+numeroOrden+'/'+idEmpresa, 
          Cartel: "Anulando orden...",
          Metodo: "PATCH"
        })
        .then(response => {resolve(response)})
        .catch(puteada => {reject(puteada)})
      }
    ) 
  },

  async getById(id) {
    return new Promise (
      function (resolve, reject) {
        API.acceder({Ruta: `/ordenes/byId/${id}`, Cartel: "Obteniendo orden"})
        .then(response => {resolve(response)})
        .catch(puteada => {reject(puteada)})
      }
    )            
  },

  async editCantidadImpresion(orden, impresion) {
    return new Promise (
      function (resolve, reject) {
        API.acceder({Ruta: `/ordenes/editCantidadImpresion/${orden}/${impresion}`, Metodo: "Put"})
        .then(response => {resolve(response)})
        .catch(puteada => {reject(puteada)})
      }
    )            
  },

  async getDetalleOrdenById(id) {
    return new Promise (
      function (resolve, reject) {
        API.acceder({Ruta: `/ordenes/detalleOrdenById/${id}`, Cartel: "Obteniendo Detalle"})
        .then(response => {resolve(response)})
        .catch(puteada => {reject(puteada)})
      }
    )            
  },

  async getDetalleOrdenAndProductoById(id) {
    return new Promise (
      function (resolve, reject) {
        API.acceder({Ruta: `/ordenes/detalleOrdenAndProductoById/${id}`, Cartel: "Obteniendo Detalle"})
        .then(response => {resolve(response)})
        .catch(puteada => {reject(puteada)})
      }
    )            
  },
  
  async getDetalleOrdenAndProductoPartidaById(id) {
    return new Promise (
      function (resolve, reject) {
        API.acceder({Ruta: `/ordenes/detalleOrdenAndProductoAndPartidaById/${id}`, Cartel: "Obteniendo Detalle"})
        .then(response => {resolve(response)})
        .catch(puteada => {reject(puteada)})
      }
    )            
  },
  async getOrdenDetalleByIdProducto(idProducto) {
    return new Promise (
      function (resolve, reject) {
        API.acceder({Ruta: `/ordenes/getOrdenDetalleByIdProducto/${idProducto}`, Cartel: "Obteniendo Detalle"})
        .then(response => {resolve(response)})
        .catch(puteada => {reject(puteada)})
      }
    )            
  },

  async getDetallePosicionAndProductoByIdProducto(idProducto) {
    return new Promise (
      function (resolve, reject) {
        API.acceder({Ruta: `/ordenes/detallePosicionAndProductoByIdProducto/${idProducto}`, Cartel: "Obteniendo Detalle"})
        .then(response => {resolve(response)})
        .catch(puteada => {reject(puteada)})
      }
    )            
  },

  async getDetallePosicionesOrdenById(id,idEmpresa) {
    return new Promise (
      function (resolve, reject) {
        API.acceder({Ruta: `/ordenes/detallePosicionesOrdenById/${id}/${idEmpresa}`, Cartel: "Obteniendo Detalle de Posiciones"})
        .then(response => {resolve(response)})
        .catch(puteada => {reject(puteada)})
      }
    )
  },

  async getHistoricoEstados(idOrden) {
    return new Promise((resolve, reject) => {
      API.acceder({
        Ruta: `/ordenes/historico/${idOrden}`,
        Cartel: 'Obteniendo historial de estados...',
      })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          console.error('Error en getHistoricoEstados:', error)
          reject(error)
        })
    })
  },

  async getHistoricoEstadosMultiple(idsOrdenes) {
    return new Promise((resolve, reject) => {
      try {
        // Si no hay IDs, devolver array vacío
        if (!idsOrdenes || !Array.isArray(idsOrdenes) || idsOrdenes.length === 0) {
          return resolve([]);
        }

        // Si solo hay un ID, usamos el endpoint individual para mantener compatibilidad
        if (idsOrdenes.length === 1) {
          return this.getHistoricoEstados(idsOrdenes[0])
            .then(historico => resolve([{ ordenId: idsOrdenes[0], historicos: historico || [] }]))
            .catch(error => {
              console.error('Error al obtener historial individual:', error);
              resolve([{ ordenId: idsOrdenes[0], historicos: [] }]);
            });
        }

        const idsString = idsOrdenes.join(',');
        API.acceder({
          Ruta: `/ordenes/historico-multiple?ids=${idsString}`,
          Cartel: 'Obteniendo historiales de estados...',
        })
          .then((response) => {
            // Validar y formatear la respuesta
            if (!response) {
              console.warn('La respuesta de la API está vacía');
              return resolve(idsOrdenes.map(id => ({ ordenId: id, historicos: [] })));
            }

            // Asegurarse de que la respuesta sea un array
            const responseData = Array.isArray(response) ? response : [response];
            
            // Mapear la respuesta al formato esperado
            const result = responseData.map(item => ({
              ordenId: item.ordenId || item.IdOrden || 0,
              historicos: Array.isArray(item.historicos) ? 
                item.historicos : 
                (Array.isArray(item) ? item : [])
            }));
            
            // Asegurarse de que todas las órdenes solicitadas tengan una respuesta
            const ordenesConHistorial = new Set(result.map(item => item.ordenId));
            idsOrdenes.forEach(id => {
              if (!ordenesConHistorial.has(id)) {
                result.push({ ordenId: id, historicos: [] });
              }
            });
            
            resolve(result);
          })
          .catch(error => {
            console.error('Error al obtener historial múltiple, intentando con llamadas individuales...', error);
            // En caso de error, intentar con llamadas individuales como fallback
            Promise.all(
              idsOrdenes.map(id => 
                this.getHistoricoEstados(id)
                  .then(historico => ({ ordenId: id, historicos: historico || [] }))
                  .catch(() => ({ ordenId: id, historicos: [] })) // Continuar con otras órdenes si falla una
              )
            )
            .then(resolve)
            .catch(error => {
              console.error('Error en las llamadas individuales:', error);
              resolve(idsOrdenes.map(id => ({ ordenId: id, historicos: [] })));
            });
          });
      } catch (error) {
        console.error('Error inesperado en getHistoricoEstadosMultiple:', error);
        resolve(idsOrdenes ? idsOrdenes.map(id => ({ ordenId: id, historicos: [] })) : []);
      }
    });
  },

  async getByNumeroAndIdEmpresa(numero, idEmpresa) {
    return new Promise (
      function (resolve, reject) {
        API.acceder({Ruta: `/ordenes/byNumeroAndIdEmpresa/${numero}/${idEmpresa}`, Cartel: "Obteniendo orden"})
        .then(response => {resolve(response)})
        .catch(puteada => {reject(puteada)})
      }
    )            
  },

 

  async getByPeriodo(fechaDesde, fechaHasta) {
    return new Promise (
      function (resolve, reject) {
        API.acceder({Ruta: `/ordenes/byPeriodo/${fechaDesde}/${fechaHasta}`, Cartel: "Obteniendo órdenes"})
        .then(response => {resolve(response)})
        .catch(puteada => {reject(puteada)})
      }
    )            
  },

  async getCantByPeriodo(fechaDesde, fechaHasta) {
    return new Promise (
      function (resolve, reject) {
        API.acceder({Ruta: `/ordenes/getCantByPeriodo/${fechaDesde}/${fechaHasta}`, Cartel: "Obteniendo órdenes"})
        .then(response => {resolve(response)})
        .catch(puteada => {reject(puteada)})
      }
    )            
  },

  async getCantByPeriodoEmpresa(fechaDesde, fechaHasta, idEmpresa) {
    return new Promise (
      function (resolve, reject) {
        API.acceder({Ruta: `/ordenes/getCantByPeriodoEmpresa/${fechaDesde}/${fechaHasta}/${idEmpresa}`, Cartel: "Obteniendo órdenes"})
        .then(response => {resolve(response)})
        .catch(puteada => {reject(puteada)})
      }
    )            
  },

  async getPreparadasNoGuias() {
    return new Promise (
      function (resolve, reject) {
        API.acceder({Ruta: `/ordenes/get/preparadasNoGuias`, Cartel: "Obteniendo órdenes"})
        .then(response => {resolve(response)})
        .catch(puteada => {reject(puteada)})
      }
    )            
  },

  async getPreparadasNoGuiasByIdEmpresa(idEmpresa) {
    return new Promise (
      function (resolve, reject) {
        API.acceder({Ruta: `/ordenes/get/preparadasNoGuiasByIdEmpresa/`+idEmpresa, Cartel: "Obteniendo órdenes"})
        .then(response => {resolve(response)})
        .catch(puteada => {reject(puteada)})
      }
    )            
  },

  async getPendientes() {
    return new Promise (
      function (resolve, reject) {
        API.acceder({Ruta: `/ordenes/getPendientes`, Cartel: "Obteniendo órdenes pendientes"})
        .then(response => {resolve(response)})
        .catch(puteada => {reject(puteada)})
      }
    )            
  },

  async getOrdenes() {
    return new Promise (
      function (resolve, reject) {
        API.acceder({Ruta: `/ordenes/getOrdenes`, Cartel: "Obteniendo órdenes"})
        .then(response => {resolve(response)})
        .catch(puteada => {reject(puteada)})
      }
    )            
  },

  async getOrdenesByEmpresaPeriodoConDestinos(idEmpresa, fechaDesde, fechaHasta) {
    return new Promise((resolve, reject) => {
      API.acceder({
        Ruta: `/ordenes/byEmpresaPeriodoConDestinos/${idEmpresa}/${fechaDesde}/${fechaHasta}`,
        Cartel: "Obteniendo órdenes..."
      })
      .then(response => resolve(response))
      .catch(error => reject(error))
    })
  },

  async informarEtiquetaImpresa(id) {
    return new Promise (
      function (resolve, reject) {
        API.acceder({Ruta: `/orden/informarEtiquetaImpresa/${id}`, Metodo: "Put"})
        .then(response => {resolve(response)})
        .catch(puteada => {reject(puteada)})
      }
    )            
  },

  async setCantidadBultos(idOrden, idEmpresa, cantidad) {
    return new Promise (
      function (resolve, reject) {
        API.acceder({Ruta: `/orden/setCantidadBultos/${idOrden}/${idEmpresa}/${cantidad}`, Metodo: "Put"})
        .then(response => {resolve(response)})
        .catch(puteada => {reject(puteada)})
      }
    )            
  },

  async getCantidadBultos(idOrden) {
    return new Promise (
      function (resolve, reject) {
        API.acceder({Ruta: `/orden/getCantidadBultos/${idOrden}`, Metodo: "GET"})
        .then(response => {resolve(response)})
        .catch(puteada => {reject(puteada)})
      }
    )            
  },

  async registrarAltaMasiva(payload) {
    return new Promise (
      function (resolve, reject) {
        API.acceder(
          {
              Ruta: '/orden', 
              Metodo: "Post", 
              Body: payload,
              Cartel: "Procesando orden "+payload.comprobante+" ..."
          }
        )
        .then(response => {resolve(response)})
        .catch(puteada => {reject(puteada)})
      }
    )            
  },

  async saleOrder(idEmpresa, payload) {
    return new Promise (
        function (resolve, reject) {
            API.acceder(
                {
                    Cartel: "Registrando salida de la orden...", 
                    Metodo: "PATCH", 
                    Ruta: `/orden/saleOrder/${idEmpresa}`,
                    Body: payload, 
                   
                }
            )
            .then(data => {resolve(data)})
            .catch(puteada => {reject(puteada)})
        }
    )            
},

  async getAllDestino(idEmpresa) {
    return new Promise (
        function (resolve, reject) {
            API.acceder({
                Ruta: `/ordenes/Destinos/${idEmpresa}`,
                Metodo: "GET"
            })
            .then(data => {resolve(data)})
            .catch(puteada => { reject(puteada) })
        }
    )            
  },  

  async imprimirStickers(ordenes, bultos) {

    let nombreFont="Helvetica"
    let margenIzquierdo=4
    let margenSuperior=1
    
    let margenDerecho=80
    let margenCentral=35
    let margenFinal=125
    let margenInicioBultos=33
    let margenFinalBultos=48

    let anchoLineas=0.75

    let paddingLineas=3
    
    const pdf=new jspdf("l", "mm", "A5")
    
    let indice=0
    
    for (const unaOrden of ordenes) {

      indice++
      
      pdf.setFont(nombreFont, "")
      pdf.setLineWidth(anchoLineas)
      let renglon=margenSuperior

      pdf.setDrawColor(0, 0, 0)
      pdf.line(margenIzquierdo-paddingLineas, renglon, margenFinal+paddingLineas, renglon)
      const lineaSuperior=renglon

      renglon+=7
      pdf.setFontSize(12).text(pdf.splitTextToSize(process.env.VUE_APP_Nombre, 40)[0], margenIzquierdo, renglon)
      pdf.setFontSize(8).text('REMITO CLIENTE', margenDerecho, renglon)
      
      renglon+=5
      pdf.setFontSize(8).text(pdf.splitTextToSize("LAGOS GARCÍA 4470, CLESA, Esteban Echeverría", 90)[0], margenIzquierdo, renglon)
      pdf.setFontSize(14).text(unaOrden.Numero, margenDerecho, renglon)      
      
      renglon+=5
      pdf.line(margenIzquierdo-paddingLineas, renglon, margenFinal+paddingLineas, renglon)
      pdf.line(margenDerecho-paddingLineas, lineaSuperior, margenDerecho-paddingLineas, renglon)
      const lineaIntermedia=renglon

      renglon +=7
      
      pdf.setFontSize(12).text("BULTOS", margenIzquierdo, renglon)
      pdf.setFontSize(12).text("Orden: "+unaOrden.Id, margenFinalBultos+2, renglon)

      renglon += 5
      
      pdf.setFontSize(14).text(`${bultos}`, margenIzquierdo, renglon)

      pdf.setFontSize(10).setFont(nombreFont, "Bold").text(unaOrden.Empresa.Nombre +"", margenCentral+3, renglon).setFont(nombreFont, "")
      
      renglon +=5 

      //Linea horizontal debajo de contrareembolso
      pdf.line(margenIzquierdo-paddingLineas, renglon, margenFinal+paddingLineas, renglon)
      const lineaInferior=renglon

      //Linea vertical izquierda
      pdf.line(margenIzquierdo-paddingLineas, lineaSuperior, margenIzquierdo-paddingLineas, lineaInferior)

      //Linea vertical derecha
      pdf.line(margenFinal+paddingLineas, lineaSuperior, margenFinal+paddingLineas, lineaInferior)
      
      //Linea vertical antes de Bultos
      pdf.line(margenInicioBultos, lineaIntermedia, margenInicioBultos, lineaInferior) 
      
      renglon +=5

      pdf.setFontSize(10).text("OBSERVACIONES", margenCentral+5, renglon)

      renglon += 5
      
      pdf.setFontSize(8).text(pdf.splitTextToSize(`${unaOrden.Observaciones}`, 90)[0], margenCentral+5, renglon)
      let indiceObservaciones=1
      while (indiceObservaciones<=4) {
        renglon +=4
        if (typeof pdf.splitTextToSize(unaOrden.Observaciones, 90)[indiceObservaciones] != "undefined") {
          pdf.setFontSize(8).text(pdf.splitTextToSize(unaOrden.Observaciones, 90)[indiceObservaciones], margenCentral, renglon)
        }
        indiceObservaciones++
      }

      pdf.line(margenIzquierdo-paddingLineas, renglon, margenFinal+paddingLineas, renglon)

      pdf.barcode(unaOrden.Numero, {fontSize: 30, x: margenIzquierdo-3, y: renglon-4})
      pdf.setFont(nombreFont, "")

      if (indice<ordenes.length) {
        pdf.addPage()
      }    
    }


    //pdf.save("ordenes.pdf")
    return pdf
  },

  async getPendientesPorPosicion(idPosicion) {
    return new Promise(
      function (resolve, reject) {
        API.acceder({
          Ruta: `/ordenes/getPendientesPorPosicion/${idPosicion}`,
          Cartel: "Buscando órdenes pendientes en posición..."
        })
        .then(response => { resolve(response); })
        .catch(puteada => { reject(puteada); })
      }
    )
  },
  async getAllByEmpresa(idEmpresa) {
    return new Promise((resolve, reject) => {
        API.acceder({
            Ruta: `/productos/getAllByEmpresa/${idEmpresa}`,  // Ruta corregida
            Cartel: "Obteniendo posiciones..."
        })
        .then(data => resolve(data))
        .catch(err => reject(err))
    })
},



  async imprimirStickersBulto(orden, bultos) {

    let nombreFont="Helvetica"
    let margenIzquierdo=4
    let margenSuperior=1
    
    let margenDerecho=80
    let margenCentral=35
    let margenFinal=125
    let margenInicioBultos=33
    let margenFinalBultos=48

    let anchoLineas=0.75

    let paddingLineas=3
    
    const pdf=new jspdf("l", "mm", "A5")
    
    let indice=0
    for (let i=1;i<=bultos;i++) {
      indice++
      
      pdf.setFont(nombreFont, "")
      pdf.setLineWidth(anchoLineas)
      let renglon=margenSuperior

      pdf.setDrawColor(0, 0, 0)
      pdf.line(margenIzquierdo-paddingLineas, renglon, margenFinal+paddingLineas, renglon)
      const lineaSuperior=renglon

      renglon+=7
      pdf.setFontSize(12).text(pdf.splitTextToSize(process.env.VUE_APP_Nombre, 40)[0], margenIzquierdo, renglon)
      pdf.setFontSize(8).text('REMITO CLIENTE', margenDerecho, renglon)
      
      renglon+=5
      pdf.setFontSize(8).text(pdf.splitTextToSize("LAGOS GARCÍA 4470, CLESA, Esteban Echeverría", 90)[0], margenIzquierdo, renglon)
      pdf.setFontSize(14).text(orden.Numero, margenDerecho, renglon)      
      
      renglon+=5
      pdf.line(margenIzquierdo-paddingLineas, renglon, margenFinal+paddingLineas, renglon)
      pdf.line(margenDerecho-paddingLineas, lineaSuperior, margenDerecho-paddingLineas, renglon)
      const lineaIntermedia=renglon

      renglon +=7
      
      pdf.setFontSize(12).text("BULTO:", margenIzquierdo, renglon)
      pdf.setFontSize(12).text("Orden: "+orden.Id, margenCentral+3, renglon)

      renglon += 5
      
      pdf.setFontSize(14).text(`${indice}/${bultos}`, margenIzquierdo, renglon)

      pdf.setFontSize(10).setFont(nombreFont, "Bold").text(orden.Empresa.Nombre +"", margenCentral+3, renglon).setFont(nombreFont, "")
      
      renglon +=5 

      //Linea horizontal debajo de contrareembolso
      pdf.line(margenIzquierdo-paddingLineas, renglon, margenFinal+paddingLineas, renglon)
      const lineaInferior=renglon

      //Linea vertical izquierda
      pdf.line(margenIzquierdo-paddingLineas, lineaSuperior, margenIzquierdo-paddingLineas, lineaInferior)

      //Linea vertical derecha
      pdf.line(margenFinal+paddingLineas, lineaSuperior, margenFinal+paddingLineas, lineaInferior)
      
      //Linea vertical antes de Bultos
      pdf.line(margenInicioBultos, lineaIntermedia, margenInicioBultos, lineaInferior) 
      
      renglon +=5

      pdf.setFontSize(10).setFont(nombreFont, "Bold").text("ENTREGAR:", margenIzquierdo, renglon)
      

      renglon += 5
      
      pdf.setFontSize(8).text(pdf.splitTextToSize(`${orden.Destino.Nombre}`, 90)[0], margenIzquierdo, renglon)
      renglon += 5
      pdf.setFontSize(8).text(pdf.splitTextToSize(orden.Destino.Domicilio, 120)[0], margenIzquierdo, renglon)
       let indiceObservaciones=1
       while (indiceObservaciones<=4) {
         renglon +=4
         if (typeof pdf.splitTextToSize(orden.Observaciones, 90)[indiceObservaciones] != "undefined") {
           pdf.setFontSize(8).text(pdf.splitTextToSize(orden.Observaciones, 90)[indiceObservaciones], margenCentral, renglon)
         }
         indiceObservaciones++
       }
      
      pdf.line(margenIzquierdo-paddingLineas, renglon, margenFinal+paddingLineas, renglon)

      pdf.barcode(orden.Numero, {fontSize: 30, x: margenIzquierdo-3, y: renglon-4})
      pdf.setFont(nombreFont, "")

       if (indice<bultos) {
         pdf.addPage()
       }    
       
    }

    pdf.save("ordenes.pdf")
    return pdf
  },

}

export default ordenesV3
