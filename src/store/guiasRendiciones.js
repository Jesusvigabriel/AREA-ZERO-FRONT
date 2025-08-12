import API from 'vue-lsi-util/APIAccesoV2'
import jspdf from 'jspdf'

let paginaActual, renglon

const margenSuperior=8
const margenIzquierdo=8
const margenCentral=margenIzquierdo+90

const margenFecha=margenIzquierdo
const margenComprobante=margenFecha+25
const margenDomicilio=margenComprobante+20
const margenRemitos=margenDomicilio+50
const margenEstado=margenRemitos+25 
const margenBultos=margenEstado+35

const interlineadoCabecera=7
const renglonPieDePagina=280
const renglonesMaximoPantalla=230
const nombreFont="Helvetica"

const guias= {
  async generarRendicionEnPDF(rendicion) {

    const pdf=new jspdf("p", "mm", "A4")

    paginaActual=1
    this.generarCabeceraDePDF(pdf, rendicion)

    for (const unaGuia of rendicion.Guias) {
      if (renglon>renglonesMaximoPantalla) {
          this.generarPieDePDF(pdf)
          paginaActual++

          pdf.addPage()
          this.generarCabeceraDePDF(pdf, rendicion)
        }
        renglon += 5
        pdf.setFontSize(10)
      pdf.text(unaGuia.Fecha+"", margenFecha, renglon)
      pdf.text(unaGuia.Comprobante+"", margenComprobante, renglon)
      pdf.text(pdf.splitTextToSize(unaGuia.Domicilio, 40)[0], margenDomicilio, renglon)
      pdf.text(unaGuia.Remitos+"", margenRemitos, renglon)
      pdf.text(unaGuia.Estado+"", margenEstado, renglon)
      
      if (unaGuia.Devolucion>0) {
        pdf.text(unaGuia.Devolucion+"", margenBultos, renglon)
      }else{
        pdf.text("0", margenBultos, renglon)
      }

    }
    
    this.generarFinalDePDF(pdf, rendicion)    


    this.generarPieDePDF(pdf)
   
    return pdf

  },

  generarCabeceraDePDF(pdf, rendicion) {
    const imagen=new Image()

    renglon=margenSuperior

    imagen.src=require('../assets/Logo_Area_Completo.png')
    pdf.addImage(imagen, "PNG", margenIzquierdo, renglon, 60, 15)

    pdf.setFont(nombreFont)
    pdf.setFontSize(14)
    pdf.setDrawColor(0,0,255)
    pdf.line(margenIzquierdo, renglon, margenCentral+100, renglon)
    renglon += interlineadoCabecera
    pdf.setFontSize(16)
    pdf.setFont(nombreFont, "Bold")
    var pjson = require('../../package.json')
    if(rendicion.Guias[0].ContraReembolso>0){
      pdf.text(`Rendición de CTR - v${pjson.version}`, margenCentral, renglon)
    }else{
      pdf.text(`Rendición de Guias - v${pjson.version}`, margenCentral, renglon)
    }
    renglon += 8
    pdf.line(margenIzquierdo, renglon, margenCentral+100, renglon)
    pdf.setFontSize(14)

    renglon += interlineadoCabecera
    pdf.setFont(nombreFont, "")
    pdf.text("Empresa:", margenIzquierdo, renglon)
    pdf.setFont(nombreFont, "Bold")
    pdf.text(rendicion.Empresa.Nombre, margenIzquierdo+25, renglon)

    pdf.setFont(nombreFont, "")
    pdf.text("Rendición nro.:", margenCentral+50, renglon)
    pdf.setFont(nombreFont, "Bold")
    pdf.text(rendicion.Id, margenCentral+85, renglon)

    renglon += interlineadoCabecera
    
    pdf.setFontSize(12)
    pdf.setFont(nombreFont, "Bold")
    pdf.text("Fecha", margenFecha, renglon)
    pdf.text("Núm.", margenComprobante, renglon)
    pdf.text("Domicilio", margenDomicilio, renglon)
    pdf.text("Remitos", margenRemitos, renglon)
    pdf.text("Estado", margenEstado, renglon)
    pdf.text("cant. Bultos", margenBultos, renglon)
    renglon += 2
    pdf.line(margenIzquierdo, renglon, margenCentral+100, renglon)

    pdf.setFont(nombreFont, "")

  },

  generarFinalDePDF(pdf, rendicion) {

    let totalBultos = 0
    rendicion.Guias.forEach(e => {
      if(e.Devolucion>0){
        totalBultos += e.Devolucion
      }else{
        totalBultos=0
      }
    
    })


    renglon += interlineadoCabecera
    pdf.line(margenIzquierdo, renglon, margenCentral+100, renglon)
    renglon += 5
    pdf.text("Cantidad de guías: ", margenIzquierdo, renglon)
    pdf.text(rendicion.Guias.length+"", margenIzquierdo+30, renglon)
    renglon += 7
    pdf.text("Cantidad de devoluciones: ", margenIzquierdo, renglon)
    pdf.text(totalBultos+"", margenIzquierdo+42, renglon)
    renglon += 3
    pdf.line(margenIzquierdo, renglon, margenCentral+100, renglon)
  
  
      

    renglon += interlineadoCabecera
  //  pdf.line(margenIzquierdo, renglon, margenCentral+100, renglon)
    
   // pdf.line(margenIzquierdo, renglon, margenCentral+100, renglon)
    
  },

  generarPieDePDF(pdf) {
    let renglon=renglonPieDePagina
    pdf.line(margenIzquierdo, renglon, margenCentral+100, renglon)
    renglon += 5
    pdf.text("Página: "+paginaActual, margenIzquierdo, renglon)
    renglon += 3
    pdf.line(margenIzquierdo, renglon, margenCentral+100, renglon)
  },


  async getOneByIdRendicion(idRendicion) {
    return new Promise (
      function (resolve, reject) {
        const Ruta=`/rendiciones/getOneById/${idRendicion}`
        API.acceder({Ruta, Cartel: `Obteniendo rendición`})
        .then(data => { resolve(data) })
        .catch(puteada => { reject(puteada) })
      }
    )            
  },
}

export default guias