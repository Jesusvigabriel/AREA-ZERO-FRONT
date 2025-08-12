import API from 'vue-lsi-util/APIAccesoV2'
import jspdf from 'jspdf'
import "jspdf-barcode"



const guias= {

  async editOne(id, payload) {
    return new Promise (
      function (resolve, reject) {
        const Ruta=`/guias/editOne/${id}`
        // console.log("Payload", payload)
        API.acceder({Ruta, Cartel: `Registrando guía`, Metodo: "PATCH", Body: payload})
        .then(data => { resolve(data) })
        .catch(puteada => { reject(puteada) })
      }
    )            
  },


  async imprimirStickers(guias) {

    const nombreFont="Helvetica"
    const margenIzquierdo=4
    const margenSuperior=1
    
    const margenDerecho=80
    const margenCentral=35
    const margenFinal=125
    const margenInicioBultos=33
    const margenFinalBultos=48

    const anchoLineas=0.75

    const paddingLineas=3
    
    const pdf=new jspdf("l", "mm", "A5")
    
    let indice=0
    for (const unaGuia of guias) {
      indice++
      
      pdf.setFont(nombreFont, "")
      pdf.setLineWidth(anchoLineas)
      let renglon=margenSuperior

      pdf.setDrawColor(0, 0, 0)
      pdf.line(margenIzquierdo-paddingLineas, renglon, margenFinal+paddingLineas, renglon)
      const lineaSuperior=renglon

      renglon+=7
      pdf.setFontSize(12).text(pdf.splitTextToSize(unaGuia.NombreDestino, 40)[0], margenIzquierdo, renglon-3)
      pdf.setFontSize(10).text("OBSERVACIONES", margenDerecho-9, renglon-3)
      
      renglon+=5
      if (unaGuia.Observaciones) {
        pdf.setFontSize(8).text(pdf.splitTextToSize(unaGuia.Observaciones, 45)[0], margenDerecho-10, renglon-4)
        let indiceObservaciones=1
        let renglonTemporal=renglon
        while (indiceObservaciones<=4) {
          renglonTemporal +=4
          if (typeof pdf.splitTextToSize(unaGuia.Observaciones, 45)[indiceObservaciones] != "undefined") {
            pdf.setFontSize(8).text(pdf.splitTextToSize(unaGuia.Observaciones, 45)[indiceObservaciones], margenDerecho-10, renglonTemporal-4)
          }
          indiceObservaciones++
        }
      }
      
      if (unaGuia.Domicilio && unaGuia.Localidad) {
        pdf.setFontSize(8).text(pdf.splitTextToSize(`${unaGuia.Domicilio} - ${unaGuia.Localidad}`, 60)[0], margenIzquierdo, renglon-4)
        let indiceDom=1
        let renglonTempDom=renglon
        while (indiceDom<=4) {
          renglonTempDom +=4
          if (typeof pdf.splitTextToSize(`${unaGuia.Domicilio} - ${unaGuia.Localidad}`, 60)[indiceDom] != "undefined") {
            pdf.setFontSize(8).text(pdf.splitTextToSize(`${unaGuia.Domicilio} - ${unaGuia.Localidad}`, 60)[indiceDom], margenIzquierdo, renglonTempDom-4)
          }
          indiceDom++
        }
      }
      
      renglon+=5
      pdf.line(margenIzquierdo-paddingLineas, renglon, margenFinal+paddingLineas, renglon)
      pdf.line(margenDerecho-paddingLineas-10, lineaSuperior, margenDerecho-paddingLineas-10, renglon)
      const lineaIntermedia=renglon

      renglon +=7
      pdf.setFontSize(7).text("CONTRAREEMBOLSO", margenIzquierdo, renglon)
      pdf.setFontSize(7).text("BULTOS", margenCentral, renglon)
      pdf.setFontSize(19).setFont(nombreFont, "Bold").text("Guía: "+unaGuia.Comprobante, margenFinalBultos+1, renglon)

      renglon += 5
      pdf.setFontSize(12).text("$ "+unaGuia.ContraReembolso.toFixed(2), margenIzquierdo, renglon)
      pdf.setFontSize(14).setFont(nombreFont, "Bold").text(unaGuia.Bultos+"", margenCentral+2, renglon).setFont(nombreFont, "")
      pdf.setFontSize(10).text(pdf.splitTextToSize(unaGuia.NombreCliente || '', 60)[0], margenFinalBultos+1, renglon+2)
      
      renglon +=5 //1
      //Linea horizontal debajo de contrareembolso
      pdf.line(margenIzquierdo-paddingLineas, renglon, margenFinal+paddingLineas, renglon)
      const lineaInferior=renglon

      //Linea vertical izquierda
      pdf.line(margenIzquierdo-paddingLineas, lineaSuperior, margenIzquierdo-paddingLineas, lineaInferior)

      //Linea vertical derecha
      pdf.line(margenFinal+paddingLineas, lineaSuperior, margenFinal+paddingLineas, lineaInferior)
      
      //Linea vertical antes de Bultos
      pdf.line(margenInicioBultos, lineaIntermedia, margenInicioBultos, lineaInferior)

      //Linea vertical después de Bultos
      pdf.line(margenFinalBultos, lineaIntermedia, margenFinalBultos, lineaInferior)
      
      renglon +=5
            
      // Mostrar información de remitos si existe, de lo contrario mostrar observaciones
      if (unaGuia.Remitos) {
        // Versión con remitos
        pdf.setFontSize(10).text('REMITO CLIENTE', margenCentral+3, renglon-1)
        renglon += 3
        
        pdf.setFontSize(10).text(pdf.splitTextToSize(unaGuia.Remitos, 88)[0], margenCentral+3, renglon)  
        let indiceRemitos=1
        let renglonTemporal2=renglon
        while (indiceRemitos<=4) {
          renglonTemporal2 +=4
          if (typeof pdf.splitTextToSize(unaGuia.Remitos, 88)[indiceRemitos] != "undefined") {
            pdf.setFontSize(10).text(pdf.splitTextToSize(unaGuia.Remitos, 88)[indiceRemitos], margenCentral+3, renglonTemporal2)
          }
          indiceRemitos++
        }
        
        pdf.line(margenIzquierdo-paddingLineas, renglon+9, margenFinal+paddingLineas, renglon+9)
        pdf.barcode(unaGuia.Comprobante, {fontSize: 40, x: margenIzquierdo-5, y: renglon+6})
      } else {
        // Versión con observaciones
        pdf.setFontSize(10).text("OBSERVACIONES", margenCentral, renglon)
        renglon += 5
        
        if (unaGuia.Observaciones) {
          pdf.setFontSize(8).text(pdf.splitTextToSize(unaGuia.Observaciones, 90)[0], margenCentral, renglon)
          let indiceObservaciones=1
          while (indiceObservaciones<=4) {
            renglon +=4
            if (typeof pdf.splitTextToSize(unaGuia.Observaciones, 90)[indiceObservaciones] != "undefined") {
              pdf.setFontSize(8).text(pdf.splitTextToSize(unaGuia.Observaciones, 90)[indiceObservaciones], margenCentral, renglon)
            }
            indiceObservaciones++
          }
        }
        
        pdf.line(margenIzquierdo-paddingLineas, renglon, margenFinal+paddingLineas, renglon)
        pdf.barcode(unaGuia.Comprobante, {fontSize: 40, x: margenIzquierdo-5, y: renglon-6})
      }
      pdf.setFont(nombreFont, "")

      if (indice<guias.length) {
        pdf.addPage()
      }    
    }

    pdf.save("guias.pdf")
    return pdf
  },

  async getById(id) {
    return new Promise (
      function (resolve, reject) {
        API.acceder({Ruta: `/guia/${id}`, Cartel: `Obteniendo guía ${id}`})
        .then(data => { resolve(data) })
        .catch(puteada => { reject(puteada) })
      }
    )            
  },


  async getByPeriodoEmpresa(fechaDesde, fechaHasta, idEmpresa) {
    return new Promise (
      function (resolve, reject) {
        let Ruta=`/guias/byPeriodoEmpresa/${fechaDesde}/${fechaHasta}`
        if (typeof idEmpresa!="undefined") {
          Ruta += `/${idEmpresa}`          
        } 
        API.acceder({Ruta, Cartel: "Obteniendo guías"})
        .then(response => {resolve(response)})
        .catch(puteada => {reject(puteada)})
      }
    )            
  },

  async getByPeriodoIdEmpresa(fechaDesde, fechaHasta, idEmpresa) {
    return new Promise (
      function (resolve, reject) {
        let Ruta=`/guias/byPeriodoIdEmpresa/${fechaDesde}/${fechaHasta}`
        if (typeof idEmpresa!="undefined") {
          Ruta += `/${idEmpresa}`          
        } 
        API.acceder({Ruta, Cartel: "Obteniendo guías"})
        .then(response => {resolve(response)})
        .catch(puteada => {reject(puteada)})
      }
    )            
  },

  async getByPeriodoEmpresaFecha(fechaDesde, fechaHasta, idEmpresa) {
    return new Promise (
      function (resolve, reject) {
        let Ruta=`/guias/getByPeriodoEmpresaFecha/${fechaDesde}/${fechaHasta}`
        if (typeof idEmpresa!="undefined") {
          Ruta += `/${idEmpresa}`          
        } 
        API.acceder({Ruta, Cartel: "Obteniendo guías"})
        .then(response => {resolve(response)})
        .catch(puteada => {reject(puteada)})
      }
    )            
  },

  async actualizarFecha(fecha, idsGuias) {
    return new Promise (
      function (resolve, reject) {
        const Ruta=`/guias/setAllActualizarFecha/${fecha}/${idsGuias}`
        API.acceder({Ruta, Cartel: 'Actualizando fechas', Metodo: 'PUT'})
        .then(data => { resolve(data) })
        .catch(puteada => { reject(puteada) })
      }
    )            
  },

  async registrarRendicion(idEmpresa, idsGuiasRendidas,usuario) {
    return new Promise (
      function (resolve, reject) {
        const Ruta=`/guias/registrarRendicion/${idEmpresa}/${idsGuiasRendidas}/${usuario}`
        API.acceder({Ruta, Cartel: 'Generando rendición', Metodo: 'POST'})
        .then(data => { resolve(data) })
        .catch(puteada => { reject(puteada) })
      }
    )            
  },

  async getEnPlanchada() {
    return new Promise (
      function (resolve, reject) {
        const Ruta=`/guias/getAllEnPlanchada`
        API.acceder({Ruta, Cartel: 'Obteniendo guías en planchada/No entregadas'})
        .then(data => { resolve(data) })
        .catch(puteada => { reject(puteada) })
      }
    )            
  },

  async getPlanchadaByComprobanteAndToken(comprobante, token) {
    return new Promise (
      function (resolve, reject) {
        const Ruta=`/guias/getPlanchadaByComprobanteAndToken/${comprobante}/${token}`
        API.acceder({Ruta, Cartel: 'Obteniendo envío'})
        .then(data => { resolve(data) })
        .catch(puteada => { reject(puteada) })
      }
    )            
  },

  async getGuiasEntregadas() {
    return new Promise (
      function (resolve, reject) {
        const Ruta=`/guias/getAllEntregadas`
        API.acceder({Ruta, Cartel: 'Obteniendo guías Entregadas'})
        .then(data => { resolve(data) })
        .catch(puteada => { reject(puteada) })
      }
    )            
  },



  async getSinRendirByIdEmpresa(idEmpresa) {
    return new Promise (
      function (resolve, reject) {
        const Ruta=`/guias/sinRendirPorEmpresa/${idEmpresa}`
        API.acceder({Ruta, Cartel: 'Obteniendo guías pendientes'})
        .then(data => { resolve(data) })
        .catch(puteada => { reject(puteada) })
      }
    )            
  },

  async crearDesdeOrden(idOrden, detalleCalculo, EsCRR) {
    return new Promise (
      function (resolve, reject) {
        const Ruta=`/guias/newFromOrden/${idOrden}`
        console.log(detalleCalculo)
        API.acceder({Ruta, Cartel: `Creando guía de orden ${idOrden}`, Metodo: "POST", Body: {Calculo: detalleCalculo, EsCRR}})
        .then(data => { resolve(data) })
        .catch(puteada => { reject(puteada) })
      }
    )            
  },

  async crearDesdeExcel(payload) {
    return new Promise (
      function (resolve, reject) {
        const Ruta=`/guias/newFromExcel`
        API.acceder({Ruta, Cartel: `Creando guía de orden ${payload.Remitos}`, Metodo: "POST", Body: payload})
        .then(data => { resolve(data) })
        .catch(puteada => { reject(puteada) })
      }
    )            
  },

  async actualizarCalculoGuias(calculo, guiaId) {
    return new Promise (
      function (resolve, reject) {
        const Ruta=`/guia/actualizarCalculoGuias/${guiaId}`
        API.acceder({Ruta, Cartel: "Actualizando guías", Metodo: "PATCH", Body: {Calculo: calculo}})
        .then(data => { resolve(data) })
        .catch(puteada => { reject(puteada) })
      }
    )  
  },

  async calcularValorizacion(id, tipo) {
    return new Promise (
      function (resolve, reject) {
        const Ruta=`/guia/calcularValor/${id}/${tipo}`
        API.acceder({Ruta, Cartel: "Calculando valorización"})
        .then(data => { resolve(data) })
        .catch(puteada => { reject(puteada) })
      }
    )            
  },

  async getFotosDocumentacionEntrega(id) {
    return new Promise (
      function (resolve, reject) {
        API.acceder({Ruta: `/guia/fotosDocumentacionEntrega/${id}`, Cartel: "Obteniendo documentación de la guía..."})
        .then(data => { resolve(data) })
        .catch(puteada => { reject(puteada) })
      }
    )            
  },


  async registrarhashDocumentacionEntrega(guia, hashGenerate) {
    return new Promise (
      function (resolve, reject) {
        API.acceder(
          {
            Ruta: `/guia/fotoDocumentacionEntrega/${guia}/${hashGenerate}`,
            Metodo: "PUT",
            Cartel: "Creando la Novedad"
          }
        )
          .then(data => {resolve(data)})
          .catch(puteada => {reject(puteada)})
      }
    )
  },

  
  async getNumeroGuia(file) {
    return new Promise (
      function (resolve, reject) {
        const Ruta=`/visionGoogle/getNumeroGuiaFoto`
       console.log(file)
        API.acceder({Ruta, Cartel: `Obteniendo Numero de Guia`, Metodo: "POST", Body: file})
        .then(data => { resolve(data) 
        
      })
        .catch(puteada => { reject(puteada)
        console.log(puteada) })
      }
    )            
  },


  async getRemitos(idEmpresa, idRemito) {
    return new Promise (
      function (resolve, reject) {
        const Ruta=`/guias/getRemitos/${idEmpresa}/${idRemito}`
        API.acceder({Ruta, Metodo: 'GET'})
        .then(data => { resolve(data) })
        .catch(puteada => { reject(puteada) })
      }
    )            
  },
 

}

export default guias