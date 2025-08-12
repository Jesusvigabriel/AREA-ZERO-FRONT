
import API from '../API/Acceso'
import posiciones from '@/store/posicionesV3'
import ordenesv3 from '@/store/ordenesV3'
import destinos from '@/store/destinos'
import jspdf from 'jspdf'
import axios from "axios"
import empresasV3 from './empresasV3'
// import NotoSansCJK from "../store/NotoSansSC-SemiBold-normal"


const margenSuperior=8
const margenSuperiorEtiqueta=3

const margenIzquierdo=8
const margenIzquierdoEtiqueta=8
let margenCentral=margenIzquierdo+90
const margenCentralEtiqueta=margenIzquierdoEtiqueta+45
const interlineadoCabecera=7
const nombreFont="Helvetica"
let margenCantidad=margenIzquierdo+5
let margenProducto=margenCantidad+8
let margenBarcode=margenProducto+102
let margenCodeEmpresa=margenBarcode+60
let margenPosicion=margenBarcode+37
let margenCentroHorizontal = margenCentral
let inicioRenglones= 65
let lineasPiePagina = 275
let inicioObservaciones=240
let renglonesMaximoPantalla=250
let maxProductCellWidth=0
let maximoTamañoPixeles=0
let margenBoxnumber = 0
let margenSerialNumber = 0
let margenPathNumber = 0
let margenPosicionLote = 0
//estas variables van a marcar donde cortar los datos que no entren en una celda
let inicioSubString =0
let finSubString=0  
const renglonPieDePagina=280

const cuadranteALaDerecha=100
const cuadranteHaciaAbajo=100

let renglon
let paginaActual

const ordenes= {
    async generarOrdenEtiquetaEnPDFChicaUnaPorHoja(orden) {

         let cantidadUnidades=orden[0].Orden.Bultos
        // orden[1].Detalle.forEach(element => {
        //     cantidadUnidades += parseInt(element.Unidades)    
        // })
        //hoja vertical
        const pdf=new jspdf("p", "ex", "A4")

        let cuadranteActual=1
        let corrimientoHorizontal
        let corrimientoVertical

        for (let punteroBulto=1; punteroBulto<=orden[0].Orden.Bultos; punteroBulto++) {
            if (punteroBulto>1) {
                pdf.addPage()
            }

            corrimientoHorizontal=0
            corrimientoVertical=0
                
            this.generarCabeceraEtiquetaDePDFBulto(pdf, orden, punteroBulto, cantidadUnidades, corrimientoHorizontal, corrimientoVertical)
    
        }

        return pdf

    },

    async generarOrdenEtiquetaEnPDFChica(orden) {

        let cantidadUnidades=0
        orden.Detalle.forEach(element => {
            cantidadUnidades += parseInt(element.Cantidad)    
        })

        const pdf=new jspdf("p", "mm", "A4")

        let cuadranteActual=1
        let corrimientoHorizontal
        let corrimientoVertical

        for (let punteroBulto=1; punteroBulto<=cantidadUnidades; punteroBulto++) {
            if (punteroBulto>1) {
                if (cuadranteActual<4) {
                    cuadranteActual++
                } else {
                    pdf.addPage()
                    cuadranteActual=1
                }
            }

            if (cuadranteActual==1) {
                corrimientoHorizontal=0
                corrimientoVertical=0+50
            } else if (cuadranteActual==2) {
                corrimientoHorizontal = cuadranteALaDerecha
                corrimientoVertical=0+50
            } else if (cuadranteActual==3) {
                corrimientoHorizontal = 0
                corrimientoVertical= cuadranteHaciaAbajo+50
            } else {
                corrimientoHorizontal = cuadranteALaDerecha
                corrimientoVertical= cuadranteHaciaAbajo+50            
            }
                
            this.generarCabeceraEtiquetaDePDF(pdf, orden, punteroBulto, cantidadUnidades, corrimientoHorizontal, corrimientoVertical)
    
        }

        return pdf

    },

    async generarOrdenEtiquetaEnPDF(orden) {

        let cantidadUnidades=0
        orden[1].Detalle.forEach(element => {
            cantidadUnidades += parseInt(element.Unidades)    
        })

        const pdf=new jspdf("p", "mm", "A4")

        let cuadranteActual=1
        let corrimientoHorizontal
        let corrimientoVertical

        for (let punteroBulto=1; punteroBulto<=cantidadUnidades; punteroBulto++) {
            if (punteroBulto>1) {
                if (cuadranteActual<4) {
                    cuadranteActual++
                } else {
                    pdf.addPage()
                    cuadranteActual=1
                }
            }

            if (cuadranteActual==1) {
                corrimientoHorizontal=0
                corrimientoVertical=0+50
            } else if (cuadranteActual==2) {
                corrimientoHorizontal = cuadranteALaDerecha
                corrimientoVertical=0+50
            } else if (cuadranteActual==3) {
                corrimientoHorizontal = 0
                corrimientoVertical= cuadranteHaciaAbajo+50
            } else {
                corrimientoHorizontal = cuadranteALaDerecha
                corrimientoVertical= cuadranteHaciaAbajo+50            
            }
                
            this.generarCabeceraEtiquetaDePDF(pdf, orden, punteroBulto, cantidadUnidades, corrimientoHorizontal, corrimientoVertical)

            pdf.setFont(nombreFont, "")
            orden[1].Detalle.forEach(unArticulo => {
                renglon += 5
                pdf.setFontSize(10)
                pdf.text(unArticulo.Unidades+" x "+unArticulo.Productos, margenCantidad+corrimientoHorizontal, renglon+corrimientoVertical)
            })
    
            renglon += 3
            pdf.line(margenIzquierdo+corrimientoHorizontal, renglon+corrimientoVertical, margenCentralEtiqueta+50+corrimientoHorizontal, renglon+corrimientoVertical)
    
        }

        return pdf

    },

    async generarOrdenEnPDF(orden,orientacion) {
        let pdf=""
        let numeroLote =""
        let producto =""
        if (orden[2].Empresa.LOTE == true ){
            orientacion = true
        }
        //si es horizontal
        if(orientacion == true){
            pdf = new jspdf("l","mm","A4")
            margenCentral = margenIzquierdo+170
            margenCantidad=12
            margenProducto=20
            margenBarcode=140
            margenCodeEmpresa=230
            margenPosicion=190
            lineasPiePagina = 196
            inicioObservaciones = 180
            inicioRenglones = 52
            renglonesMaximoPantalla=170
            maxProductCellWidth=214
            inicioSubString=0
            finSubString += 73
            maximoTamañoPixeles=130
            margenSerialNumber = 140
            margenPathNumber = 190
            margenBoxnumber = 230
            margenPosicionLote = 267
        }else{
            //si es vertical
            pdf=new jspdf("p", "mm", "A4")
            margenCentral = 85
            margenCantidad=margenIzquierdo+5
            margenProducto=margenCantidad+8
            margenBarcode=margenProducto+102
            margenCodeEmpresa=margenBarcode+60
            margenPosicion=176
            lineasPiePagina = 285
            inicioObservaciones=265
            inicioRenglones = 65
            renglonesMaximoPantalla = 250
            maxProductCellWidth=214
            inicioSubString=0
            finSubString += 62
            maximoTamañoPixeles=123
            margenSerialNumber = margenBarcode
            margenPathNumber = margenSerialNumber+40
            margenBoxnumber = margenPathNumber+40
            margenPosicionLote = margenBoxnumber+40
        }
        paginaActual=1
        let detallePosiciones = []
        let lineHeight = 6
        let cont = 0
        //marca si el produto es muy largo
        let productolargo =0
        // revisa si la empresa si tiene stock posicionado
        if (orden[2].Empresa.StockPosicionado == true) {
            // Obtengo el detalle de posiciones de los articulos
            for(const detalleOrden of orden[1].Detalle){
                const detalle =  await  posiciones.getDetallePosicionByIdAndEmpresa(detalleOrden.IdOrdendetalle, orden[2].Empresa.Id)
                if(detalle.length!=0){
                        
                    detalle.forEach( detalle => {
                        //carga la variable con todas las posiciones que van a ser usadas, dentro de las mismas estan los productos
                        detallePosiciones.push(detalle)
                    })
                }
            }
        }
        //ordena de forma alfabetica el detalle en base a las pocisiones
        detallePosiciones = detallePosiciones.sort(function(a, b){
            if(a.Posicion.toUpperCase() < b.Posicion.toUpperCase()) { return -1; }
            if(a.Posicion.toUpperCase() > b.Posicion.toUpperCase()) { return 1; }
            return 0;
        })
        
        //crea la cabecera del pdf
        this.generarCabeceraDePDF(pdf, orden,orientacion)
        //marca donde van a iniciar los renglones del detalle de la orden
        renglon = inicioRenglones
        // revisa si la empresa no tiene stock unitario y si esta posicionado
        if (orden[2].Empresa.StockPosicionado && !orden[2].Empresa.StockUnitario) {
            //Recorre todos los registros que estaran en el pdf
            detallePosiciones.forEach( detalle => {
                let cantidad = 0
                if(orientacion == false){
                    finSubString=55
                }else{
                    finSubString=63
                }
                //revisa si la cantidad de renglones supero el maximo permitido
                if (renglon>renglonesMaximoPantalla) {
                    //si lo supero genera el pie de pagina y una nueva pagina
                    this.generarPieDePDF(pdf)
                    paginaActual++
                    pdf.addPage()
                    this.generarCabeceraDePDF(pdf, orden,orientacion)
                    if(orientacion == true){
                        renglon = renglon-12
                    }else{
                        renglon = renglon-6
                    }
                }
                //setea la fuente para ZTE
                // if(orden.Empresa.Nombre == "zte" || orden.Empresa.Nombre == "zte telefonica")
                // {
                //     pdf.setFont("NotoSansSC-SemiBold",'normal')
                // }else{
                //     pdf.setFont(nombreFont,'normal')
                // }
                //Recorre la orden original para usar los datos faltantes
                orden[1].Detalle.forEach( unArticulo => {
                    if(orden[2].Empresa.LOTE == true ){
                        
                        if(numeroLote != unArticulo.lote)
                        {
                            if(detalle.IdDetalle==unArticulo.IdOrdendetalle){
                                if(unArticulo.loteCompleto==1){
                                    producto= "Lote Completo"
                                    cantidad = 1
                                  }else{
                                    producto = unArticulo.Productos
                                    cantidad = Number(detalle.Cantidad)
                                  }
                                const tamañoProducto = "("+cantidad+")"+producto+""
                                const codeEmp = unArticulo.CodeEmpresa+""
                                renglon += 6
                                pdf.setFontSize(8)
                                pdf.text(detalle.Cantidad+"", margenCantidad, renglon)
                                const codigo = unArticulo.Barcode || unArticulo.SerialNumber || unArticulo.barcode || ""
                                pdf.text(codigo+"", margenSerialNumber, renglon)
                                pdf.text(detalle.Posicion+"", margenPosicionLote, renglon)
                                pdf.text(unArticulo.lote+"", margenBoxnumber, renglon)
                                //compara para saber si el tamaño que va a ocupar el texto esta dentro del maximo permitido
                                if (pdf.getStringUnitWidth(tamañoProducto) * 6 > maxProductCellWidth){
                                    cont = 0
                                    // El texto es demasiado ancho para la celda, divídelo en fragmentos
                                    const chunks = pdf.splitTextToSize(tamañoProducto, maximoTamañoPixeles-17);
                                    chunks.forEach(chunk => {
                                        //el contador verifica que no sea la primera vez que ingresa
                                        if(cont > 0){
                                            productolargo +=1
                                            //suma un renglon mas
                                            renglon += lineHeight
                                            //modifica donde va a cortar el texto para escribir el restante
                                            inicioSubString += finSubString
                                            finSubString += finSubString
                                            pdf.text(producto.substring(inicioSubString,finSubString), margenProducto, renglon);
                                        }else{
                                            pdf.text("("+cantidad+")"+producto.substring(inicioSubString,finSubString), margenProducto, renglon);
                                        }
                                        cont ++
                                    });
                                }else{
                                    productolargo = 0
                                    pdf.text("("+cantidad+")"+producto+"", margenProducto, renglon)
                                }
                                //si la pagina esta en horizontal
                                if(orientacion == true){
                                    if (pdf.getStringUnitWidth(codeEmp)* 6 > 152){
                                        cont = 0
                                        inicioSubString = 0
                                        finSubString = 30
                                        const chunks = pdf.splitTextToSize(codeEmp, 50);
                                        if(productolargo>0){
                                            renglon-=lineHeight
                                        }
                                        chunks.forEach(chunk => {
                                            if(cont > 0){
                                                renglon += lineHeight
                                                inicioSubString += 30
                                                finSubString += 30
                                            }
                                            pdf.text(unArticulo.CodeEmpresa.substring(inicioSubString,finSubString)+"", margenPathNumber, renglon)
                                            cont ++
                                        })
                                    }else{
                                        if(productolargo>0){
                                            pdf.text(unArticulo.CodeEmpresa+"", margenPathNumber, renglon-lineHeight)
                                        }else{
                                            pdf.text(unArticulo.CodeEmpresa+"", margenPathNumber, renglon)
                                        }
                                    }
                                }
                                inicioSubString = 0
                                finSubString = 62
                                pdf.setDrawColor(128,128,128)
                                pdf.line(margenIzquierdo, renglon+2, margenCentral+115, renglon+2)
                                pdf.setDrawColor(0,0,0)
                                if(unArticulo.loteCompleto == 1)
                                {
                                    numeroLote = unArticulo.lote
                                }
                            }
                        }
                    }else if(orden[2].Empresa.PART == true){
                        if(detalle.IdDetalle==unArticulo.IdOrdendetalle){
                            cantidad = Number(detalle.Cantidad)
                            const tamañoProducto = "("+cantidad+")"+unArticulo.Productos+""
                            renglon += 6
                            pdf.setFontSize(8)
                            pdf.text(detalle.Cantidad+"", margenCantidad, renglon)
                            pdf.text(unArticulo.Partida+"", margenBarcode - 20, renglon)
                            const codigo = unArticulo.Barcode || unArticulo.SerialNumber || unArticulo.barcode || ""
                            pdf.text(codigo+"", margenBarcode, renglon)
                            pdf.text(detalle.Posicion+"", margenPosicion, renglon)
                            //compara para saber si el tamaño que va a ocupar el texto esta dentro del maximo permitido
                            if (pdf.getStringUnitWidth(tamañoProducto) * 6 > maxProductCellWidth){
                                cont = 0
                                // El texto es demasiado ancho para la celda, divídelo en fragmentos
                                const chunks = pdf.splitTextToSize(tamañoProducto, maximoTamañoPixeles-17);
                                chunks.forEach(chunk => {
                                    //el contador verifica que no sea la primera vez que ingresa
                                    if(cont > 0){
                                        productolargo +=1
                                        //suma un renglon mas
                                        renglon += lineHeight
                                        //modifica donde va a cortar el texto para escribir el restante
                                        inicioSubString += finSubString
                                        finSubString += finSubString
                                        pdf.text(unArticulo.Productos.substring(inicioSubString,finSubString), margenProducto, renglon);
                                    }else{
                                        pdf.text("("+cantidad+")"+unArticulo.Productos.substring(inicioSubString,finSubString), margenProducto, renglon);
                                    }
                                    cont ++
                                });
                            }else{
                                productolargo = 0
                                pdf.text("("+cantidad+")"+unArticulo.Productos+"", margenProducto, renglon)
                            }
                            //si la pagina esta en horizontal
                            if(orientacion == true){
                                if (pdf.getStringUnitWidth(codeEmp)* 6 > 152){
                                    cont = 0
                                    inicioSubString = 0
                                    finSubString = 30
                                    const chunks = pdf.splitTextToSize(codeEmp, 50);
                                    if(productolargo>0){
                                        renglon-=lineHeight
                                    }
                                    chunks.forEach(chunk => {
                                        if(cont > 0){
                                            renglon += lineHeight
                                            inicioSubString += 30
                                            finSubString += 30
                                        }
                                        pdf.text(unArticulo.CodeEmpresa.substring(inicioSubString,finSubString)+"", margenCodeEmpresa, renglon)
                                        cont ++
                                    })
                                }else{
                                    if(productolargo>0){
                                        pdf.text(unArticulo.CodeEmpresa+"", margenCodeEmpresa, renglon-lineHeight)
                                    }else{
                                        pdf.text(unArticulo.CodeEmpresa+"", margenCodeEmpresa, renglon)
                                    }
                                }
                            }
                            inicioSubString = 0
                            finSubString = 62
                            pdf.setDrawColor(128,128,128)
                            pdf.line(margenIzquierdo, renglon+2, margenCentral+115, renglon+2)
                            pdf.setDrawColor(0,0,0)
                        }
                    }else{
                    //compara el id que hay en detalle con el que esta en un articulo para usar el producto correspondiente
                        if(detalle.IdDetalle==unArticulo.IdOrdendetalle){
                            cantidad = Number(detalle.Cantidad)
                            const tamañoProducto = "("+cantidad+")"+unArticulo.Productos+""
                            const codeEmp = unArticulo.CodeEmpresa+""
                            renglon += 6
                            pdf.setFontSize(8)
                            
                            pdf.text(detalle.Cantidad+"", margenCantidad, renglon)
                            const codigo = unArticulo.Barcode || unArticulo.SerialNumber || unArticulo.barcode || ""
                            pdf.text(codigo+"", margenBarcode, renglon)
                            pdf.text(detalle.Posicion+"", margenPosicion, renglon)
                            //compara para saber si el tamaño que va a ocupar el texto esta dentro del maximo permitido
                            if (pdf.getStringUnitWidth(tamañoProducto) * 6 > maxProductCellWidth){
                                cont = 0
                                // El texto es demasiado ancho para la celda, divídelo en fragmentos
                                const chunks = pdf.splitTextToSize(tamañoProducto, maximoTamañoPixeles-17);
                                chunks.forEach(chunk => {
                                    //el contador verifica que no sea la primera vez que ingresa
                                    if(cont > 0){
                                        productolargo +=1
                                        //suma un renglon mas
                                        renglon += lineHeight
                                        //modifica donde va a cortar el texto para escribir el restante
                                        inicioSubString += finSubString
                                        finSubString += finSubString
                                        pdf.text(unArticulo.Productos.substring(inicioSubString,finSubString), margenProducto, renglon);
                                    }else{
                                        pdf.text("("+cantidad+")"+unArticulo.Productos.substring(inicioSubString,finSubString), margenProducto, renglon);
                                    }
                                    cont ++
                                });
                            }else{
                                productolargo = 0
                                pdf.text("("+cantidad+")"+unArticulo.Productos+"", margenProducto, renglon)
                            }
                            //si la pagina esta en horizontal
                            if(orientacion == true){
                                if (pdf.getStringUnitWidth(codeEmp)* 6 > 152){
                                    cont = 0
                                    inicioSubString = 0
                                    finSubString = 30
                                    const chunks = pdf.splitTextToSize(codeEmp, 50);
                                    if(productolargo>0){
                                        renglon-=lineHeight
                                    }
                                    chunks.forEach(chunk => {
                                        if(cont > 0){
                                            renglon += lineHeight
                                            inicioSubString += 30
                                            finSubString += 30
                                        }
                                        pdf.text(unArticulo.CodeEmpresa.substring(inicioSubString,finSubString)+"", margenCodeEmpresa, renglon)
                                        cont ++
                                    })
                                }else{
                                    if(productolargo>0){
                                        pdf.text(unArticulo.CodeEmpresa+"", margenCodeEmpresa, renglon-lineHeight)
                                    }else{
                                        pdf.text(unArticulo.CodeEmpresa+"", margenCodeEmpresa, renglon)
                                    }
                                }
                            }
                            inicioSubString = 0
                            finSubString = 62
                            pdf.setDrawColor(128,128,128)
                            pdf.line(margenIzquierdo, renglon+2, margenCentral+115, renglon+2)
                            pdf.setDrawColor(0,0,0)
                        }
                    }
                })  
            })
            //si la empresa tiene stock posicionado y es stock unitario
        }else if(orden[2].Empresa.StockPosicionado){
            
            //recorre todos los regiestro que se van a mostrar en el pdf
            detallePosiciones.forEach(detalle => {
                
                    if(orientacion == false){
                        finSubString=55
                    }else{
                        finSubString=63
                    }
                    //revisa si la cantidad de renglones supero el maximo permitido
                    if (renglon>renglonesMaximoPantalla) {
                        this.generarPieDePDF(pdf)
                        paginaActual++
        
                        pdf.addPage()
                        this.generarCabeceraDePDF(pdf, orden,orientacion)
                        if(orientacion == true){
                            renglon = renglon-12
                        }else{
                            renglon = renglon-6
                        }
                    }
                    //recorre todos los articulos de la orden original
                    orden[1].Detalle.forEach( unArticulo => {

                        if(orden[2].Empresa.LOTE == true ){
                            if(numeroLote != unArticulo.lote)
                            {
                                if(unArticulo.loteCompleto==1){
                                    producto= "Lote Completo"
                                }else{
                                    producto = unArticulo.Productos
                                }
                                //compara el id del detalle con el id del articulo para usar los datos que correspondan
                                if(detalle.IdDetalle==unArticulo.IdOrdendetalle){
                                const tamañoProducto = producto+""
                                const codeEmp = unArticulo.CodeEmpresa+""
                                renglon += 6
                                pdf.setFontSize(8)    
                                pdf.text(detalle.Cantidad+"", margenCantidad, renglon)
                                pdf.text(unArticulo.lote+"", margenBarcode, renglon)
                                pdf.text(detalle.Posicion+"", margenPosicion, renglon)
                                //Revisa si el text es mas grande que el tamaño de celda
                                if (pdf.getStringUnitWidth(tamañoProducto) * 6 > maxProductCellWidth){
                                    cont = 0
                                    // Divíde el texto en fragmentos
                                    const chunks = pdf.splitTextToSize(tamañoProducto, maximoTamañoPixeles-17);
                                    chunks.forEach(chunk => {
                                        if(cont > 0){
                                            productolargo +=1
                                            renglon += lineHeight
                                            inicioSubString += finSubString
                                            finSubString += finSubString
                                        }
                                        pdf.text(unArticulo.Productos.substring(inicioSubString,finSubString), margenProducto, renglon);
                                        cont ++
                                    });
                                }else{
                                    productolargo = 0
                                    pdf.text(producto+"", margenProducto, renglon)
                                }
                                //si la hoja esta en horizontal agrega el codeempresa
                                if(orientacion == true){
                                    if (pdf.getStringUnitWidth(codeEmp)* 6 > 152){
                                        cont = 0
                                        inicioSubString = 0
                                        finSubString = 30
                                        const chunks = pdf.splitTextToSize(codeEmp, 50);
                                        if(productolargo>0){
                                            renglon-=lineHeight
                                        }
                                        chunks.forEach(chunk => {
                                            if(cont > 0){
                                                    renglon += lineHeight
                                                    inicioSubString += 30
                                                    finSubString += 30
                                                }
                                                pdf.text(unArticulo.CodeEmpresa.substring(inicioSubString,finSubString)+"", margenCodeEmpresa, renglon)
                                                cont ++
                                            })
                                        }else{
                                            if(productolargo>0){
                                                pdf.text(unArticulo.CodeEmpresa+"", margenCodeEmpresa, renglon-lineHeight)
                                            }else{
                                                pdf.text(unArticulo.CodeEmpresa+"", margenCodeEmpresa, renglon)
                                            }
                                        }
                                }
                                
                                inicioSubString = 0
                                finSubString = 62
                                //dibuja las lineas de la tabla
                                pdf.setDrawColor(128,128,128)
                                pdf.line(margenIzquierdo, renglon+2, margenCentral+115, renglon+2)
                                pdf.setDrawColor(0,0,0)
                                if(unArticulo.loteCompleto == 1)
                                {
                                    numeroLote = unArticulo.lote
                                }
                                }
                            }
                        }
                        else{
                        //compara el id del detalle con el id del articulo para usar los datos que correspondan
                        if(detalle.IdDetalle==unArticulo.IdOrdendetalle){
                            const tamañoProducto = unArticulo.Productos+""
                            const codeEmp = unArticulo.CodeEmpresa+""
                            renglon += 6
                            pdf.setFontSize(8)    
                            pdf.text(detalle.Cantidad+"", margenCantidad, renglon)
                            const codigo = unArticulo.Barcode || unArticulo.SerialNumber || unArticulo.barcode || ""
                            pdf.text(codigo+"", margenBarcode, renglon)
                            pdf.text(detalle.Posicion+"", margenPosicion, renglon)
                            //Revisa si el text es mas grande que el tamaño de celda
                            if (pdf.getStringUnitWidth(tamañoProducto) * 6 > maxProductCellWidth){
                                cont = 0
                                // Divíde el texto en fragmentos
                                const chunks = pdf.splitTextToSize(tamañoProducto, maximoTamañoPixeles-17);
                                chunks.forEach(chunk => {
                                    if(cont > 0){
                                        productolargo +=1
                                        renglon += lineHeight
                                        inicioSubString += finSubString
                                        finSubString += finSubString
                                    }
                                    pdf.text(unArticulo.Productos.substring(inicioSubString,finSubString), margenProducto, renglon);
                                    cont ++
                                });
                            }else{
                                productolargo = 0
                                pdf.text(unArticulo.Productos+"", margenProducto, renglon)
                            }
                            //si la hoja esta en horizontal agrega el codeempresa
                            if(orientacion == true){
                                if (pdf.getStringUnitWidth(codeEmp)* 6 > 152){
                                    cont = 0
                                    inicioSubString = 0
                                    finSubString = 30
                                    const chunks = pdf.splitTextToSize(codeEmp, 50);
                                    if(productolargo>0){
                                        renglon-=lineHeight
                                    }
                                    chunks.forEach(chunk => {
                                        if(cont > 0){
                                                renglon += lineHeight
                                                inicioSubString += 30
                                                finSubString += 30
                                            }
                                            pdf.text(unArticulo.CodeEmpresa.substring(inicioSubString,finSubString)+"", margenCodeEmpresa, renglon)
                                            cont ++
                                        })
                                    }else{
                                        if(productolargo>0){
                                            pdf.text(unArticulo.CodeEmpresa+"", margenCodeEmpresa, renglon-lineHeight)
                                        }else{
                                            pdf.text(unArticulo.CodeEmpresa+"", margenCodeEmpresa, renglon)
                                        }
                                    }
                            }
                            
                            inicioSubString = 0
                            finSubString = 62
                            //dibuja las lineas de la tabla
                            pdf.setDrawColor(128,128,128)
                            pdf.line(margenIzquierdo, renglon+2, margenCentral+115, renglon+2)
                            pdf.setDrawColor(0,0,0)
                        }
                    }
                })
            })
        }else {
            //orden de productos sin posicion
            finSubString+=6
            orden[1].Detalle.forEach(unArticulo => {
                if (renglon>renglonesMaximoPantalla) {
                    this.generarPieDePDF(pdf)
                    paginaActual++
    
                    pdf.addPage()
                    this.generarCabeceraDePDF(pdf, orden,orientacion)
                    if(orientacion == true){
                        renglon = renglon-12
                    }else{
                        renglon = renglon-6
                    }
                }
                const tamañoProducto = unArticulo.Productos+""
                const codeEmp = unArticulo.CodeEmpresa+""
                renglon += 6
                
                pdf.setFontSize(8)    
                pdf.text(unArticulo.Unidades+"", margenCantidad, renglon)
                const codigo = unArticulo.Barcode || unArticulo.SerialNumber || unArticulo.barcode || ""
                pdf.text(codigo+"", margenBarcode+10, renglon)
                //si el texto es mas grande que el tamaño de la celda
                if (pdf.getStringUnitWidth(tamañoProducto) * 6 > maxProductCellWidth){
                    cont = 0
                    // El texto es demasiado ancho para la celda, divídelo en fragmentos
                    const chunks = pdf.splitTextToSize(tamañoProducto,maximoTamañoPixeles);
                    chunks.forEach(chunk => {
                        if(cont > 0){
                            productolargo +=1
                            renglon += lineHeight
                            inicioSubString += finSubString 
                            finSubString += finSubString
                        }
                        pdf.text(unArticulo.Productos.substring(inicioSubString,finSubString), margenProducto, renglon);
                        cont ++
                    });
                }else{
                    productolargo = 0
                    pdf.text(unArticulo.Productos+"", margenProducto, renglon,0,margenProducto+10)
                }
                //si la hoja es horizontal agraga el codeempresa
                if(orientacion == true){
                    //si el texto es mas grande que el tamaño de la celda
                    if (pdf.getStringUnitWidth(codeEmp)* 6 > 152){
                        cont = 0
                        inicioSubString = 0
                        finSubString = 52
                        const chunks = pdf.splitTextToSize(codeEmp, 50);
                        if(productolargo>0){
                            renglon-=lineHeight
                        }
                        chunks.forEach(chunk => {
                            if(cont > 0){
                                renglon += lineHeight
                                inicioSubString += 52
                                finSubString += 52
                            }
                            pdf.text(unArticulo.CodeEmpresa.substring(inicioSubString,finSubString)+"", margenCodeEmpresa-10, renglon)
                            cont ++
                        })
                    }else{
                        //si el producto ya agrego otro renglon usa los mismos
                        if(productolargo>0){
                            pdf.text(unArticulo.CodeEmpresa+"", margenCodeEmpresa-10, renglon-lineHeight)
                        }else{
                            pdf.text(unArticulo.CodeEmpresa+"", margenCodeEmpresa-10, renglon)
                        }
                    }
                }
                inicioSubString = 0
                finSubString = 62
                //Cambia el color de escritura a gris
                pdf.setDrawColor(128,128,128)
                //Dibuja una linea divisoria en cada renglon
                pdf.line(margenIzquierdo, renglon+2, margenCentral+115, renglon+2)
                //Cambia el color de escritura a negro
                pdf.setDrawColor(0,0,0)
            })
        }
        this.generarPieDePDF(pdf)
        this.generarFinalDePDF(pdf, orden)
        
        return pdf
    },
    generarCabeceraEtiquetaDePDFBulto(pdf, orden, punteroBulto, cantidadBultos, corrimientoHorizontal, corrimientoVertical) {
        const imagen=new Image()

        renglon=margenSuperiorEtiqueta

        // imagen.src=require('../assets/Logo_Area_Completo.png')
        // pdf.addImage(imagen, "PNG", margenIzquierdoEtiqueta+corrimientoHorizontal, renglon+corrimientoVertical, 34, 10)

        // pdf.setFont(nombreFont)
        // pdf.setDrawColor(0,0,255)
        // pdf.line(corrimientoHorizontal, renglon+corrimientoVertical, margenCentralEtiqueta+50+corrimientoHorizontal, renglon+corrimientoVertical)

        // pdf.setFontSize(12)
        // pdf.setFont(nombreFont, "")
        // pdf.setFont(nombreFont, "Bold")
        // pdf.text(`Bulto ${punteroBulto} de ${cantidadBultos}`, margenCentralEtiqueta+20+corrimientoHorizontal, renglon+interlineadoCabecera+corrimientoVertical)
        
        renglon += 1
        pdf.line(corrimientoHorizontal, renglon+corrimientoVertical, margenCentralEtiqueta+50+corrimientoHorizontal, renglon+corrimientoVertical)
        imagen.src=require('../assets/Logo_Area_Completo.png')
        pdf.addImage(imagen, "PNG", margenIzquierdoEtiqueta+30+corrimientoHorizontal, renglon+corrimientoVertical, 34, 10)

        pdf.setFont(nombreFont)
        pdf.setDrawColor(0,0,255)
        pdf.line(corrimientoHorizontal, renglon+corrimientoVertical, margenCentralEtiqueta+50+corrimientoHorizontal, renglon+corrimientoVertical)
        
                
        renglon -= 1
        pdf.setFontSize(19)
        pdf.setFont(nombreFont, "")
        pdf.setFont(nombreFont, "Bold")
        renglon += interlineadoCabecera
        pdf.text(orden[2].Empresa.Nombre, 2+corrimientoHorizontal, renglon+corrimientoVertical)
        
        renglon += 3
        pdf.line(corrimientoHorizontal, renglon+corrimientoVertical, margenCentralEtiqueta+50+corrimientoHorizontal, renglon+corrimientoVertical)

                
        renglon += 4
        pdf.setFont(nombreFont, "Bold")
        pdf.setFontSize(19)
        pdf.text("Comprobante:", 2+corrimientoHorizontal, renglon+corrimientoVertical)
        pdf.setFont(nombreFont, "Bold")
        pdf.setFontSize(19)
        pdf.text(orden[0].Orden.Numero, margenIzquierdoEtiqueta+20+corrimientoHorizontal, renglon+corrimientoVertical)
        
        renglon += 4
        pdf.setFont(nombreFont, "Bold")
        pdf.setFontSize(19)
        pdf.text("Entregar a:", 2+corrimientoHorizontal, renglon+corrimientoVertical)
        
        
        pdf.setFont(nombreFont, "Bold")
        pdf.setFontSize(19)
        pdf.text(orden[3].Destino!=null ? orden[3].Destino.Nombre : "", margenIzquierdoEtiqueta+11+corrimientoHorizontal, renglon+corrimientoVertical)
        
        renglon += 4
        pdf.setFont(nombreFont, "Bold")
        pdf.setFontSize(19)
        pdf.text("Domicilio:", 2+corrimientoHorizontal, renglon+corrimientoVertical)
        pdf.setFont(nombreFont, "Bold")
        pdf.setFontSize(19)
       
        pdf.text(orden[3].Destino!=null ? orden[3].Destino.Domicilio: "", margenIzquierdoEtiqueta+10+corrimientoHorizontal, renglon+corrimientoVertical)
       
        pdf.text(orden[3].Destino!=null ? orden[3].Destino.Localidad: "", margenIzquierdoEtiqueta+30+corrimientoHorizontal, renglon+corrimientoVertical)
        renglon += 4
        //pdf.text(orden.Destino!=null ? orden.Destino.CodigoPostal: "", margenIzquierdoEtiqueta+corrimientoHorizontal, renglon+corrimientoVertical)
        if(orden[3].Destino!=null){
            pdf.text(`CP: ${orden[3].Destino.CodigoPostal}`, 2+corrimientoHorizontal, renglon+corrimientoVertical)
        }
        

        renglon += 4
        pdf.setFontSize(19)
        pdf.setFont(nombreFont, "")
        pdf.setFont(nombreFont, "Bold")
        pdf.text(`Bulto: ${punteroBulto}/${cantidadBultos}`, 2+corrimientoHorizontal, renglon+corrimientoVertical)


        pdf.setFontSize(8)
        pdf.setFont(nombreFont, "Bold")
        var pjson = require('../../package.json')
        pdf.text("v "+pjson.version, margenCentralEtiqueta+37+corrimientoHorizontal, renglon+corrimientoVertical)

        renglon += 3
        pdf.line(corrimientoHorizontal, renglon+corrimientoVertical, margenCentralEtiqueta+50+corrimientoHorizontal, renglon+corrimientoVertical)
        
        pdf.setFontSize(12)
        pdf.setFont(nombreFont, "")

    },
    generarCabeceraEtiquetaDePDF(pdf, orden, punteroBulto, cantidadBultos, corrimientoHorizontal, corrimientoVertical) {
        const imagen=new Image()

        renglon=margenSuperiorEtiqueta

        imagen.src=require('../assets/Logo_Area_Completo.png')
        pdf.addImage(imagen, "PNG", margenIzquierdoEtiqueta+corrimientoHorizontal, corrimientoVertical, 40, 10)

        pdf.setFont(nombreFont)
        pdf.setDrawColor(0,0,255)
        pdf.line(margenIzquierdo+corrimientoHorizontal, renglon+corrimientoVertical, margenCentralEtiqueta+50+corrimientoHorizontal, renglon+corrimientoVertical)

        // pdf.setFontSize(12)
        // pdf.setFont(nombreFont, "")
        // pdf.setFont(nombreFont, "Bold")
        // pdf.text(`Bulto ${punteroBulto} de ${cantidadBultos}`, margenCentralEtiqueta+20+corrimientoHorizontal, renglon+interlineadoCabecera+corrimientoVertical)
        
        renglon += interlineadoCabecera+3
        pdf.line(margenIzquierdo+corrimientoHorizontal, renglon+corrimientoVertical, margenCentralEtiqueta+50+corrimientoHorizontal, renglon+corrimientoVertical)
        pdf.setFontSize(14)
                
        renglon -= 1
        pdf.setFontSize(12)
        pdf.setFont(nombreFont, "")
        pdf.setFont(nombreFont, "Bold")
        renglon += interlineadoCabecera
        pdf.text(orden[2].Empresa.Nombre, margenIzquierdoEtiqueta+corrimientoHorizontal, renglon+corrimientoVertical)
        
        renglon += 3
        pdf.line(margenIzquierdo+corrimientoHorizontal, renglon+corrimientoVertical, margenCentralEtiqueta+50+corrimientoHorizontal, renglon+corrimientoVertical)
        pdf.setFontSize(14)
                
        renglon += 5
        pdf.setFont(nombreFont, "")
        pdf.text("Comprobante:", margenIzquierdoEtiqueta+corrimientoHorizontal, renglon+corrimientoVertical)
        pdf.setFont(nombreFont, "Bold")
        pdf.setFontSize(12)
        pdf.text(orden[0].Orden.Numero, margenCentralEtiqueta+corrimientoHorizontal, renglon+corrimientoVertical)
        
        renglon += 7
        pdf.setFont(nombreFont, "")
        pdf.text("Entregar a:", margenIzquierdoEtiqueta+corrimientoHorizontal, renglon+corrimientoVertical)
        
        renglon += 5
        pdf.setFont(nombreFont, "Bold")
        pdf.setFontSize(12)
        pdf.text(orden[3].Destino!=null ? orden[3].Destino.Nombre : "", margenIzquierdoEtiqueta+corrimientoHorizontal, renglon+corrimientoVertical)
        
        renglon += 7
        pdf.setFont(nombreFont, "")
        pdf.text("Domicilio:", margenIzquierdoEtiqueta+corrimientoHorizontal, renglon+corrimientoVertical)
        pdf.setFont(nombreFont, "Bold")
        pdf.setFontSize(10)
        renglon += 5
        pdf.text(orden[3].Destino!=null ? orden[3].Destino.Domicilio: "", margenIzquierdoEtiqueta+corrimientoHorizontal, renglon+corrimientoVertical)
        renglon += 5
        pdf.text(orden[3].Destino!=null ? orden[3].Destino.Localidad: "", margenIzquierdoEtiqueta+corrimientoHorizontal, renglon+corrimientoVertical)
        renglon += 1
        //pdf.text(orden.Destino!=null ? orden.Destino.CodigoPostal: "", margenIzquierdoEtiqueta+corrimientoHorizontal, renglon+corrimientoVertical)
        if(orden.Destino!=null){
            pdf.text(`CP: ${orden[3].Destino.CodigoPostal}`, margenIzquierdoEtiqueta+corrimientoHorizontal, renglon+corrimientoVertical)
        }
        

        renglon += 7
        pdf.setFontSize(12)
        pdf.setFont(nombreFont, "")
        pdf.setFont(nombreFont, "Bold")
        pdf.text(`Bulto: ${punteroBulto}/${cantidadBultos}`, margenIzquierdoEtiqueta+corrimientoHorizontal, renglon+corrimientoVertical)


        pdf.setFontSize(8)
        pdf.setFont(nombreFont, "Bold")
        var pjson = require('../../package.json')
        pdf.text("v "+pjson.version, margenCentralEtiqueta+37+corrimientoHorizontal, renglon+corrimientoVertical)

        renglon += 3
        pdf.line(margenIzquierdo+corrimientoHorizontal, renglon+corrimientoVertical, margenCentralEtiqueta+50+corrimientoHorizontal, renglon+corrimientoVertical)
        
        pdf.setFontSize(12)
        pdf.setFont(nombreFont, "")

    },
    generarCabeceraDePDF(pdf, orden,orientacionCabe) {
        const imagen=new Image()
        let margenBulto = margenIzquierdo
        let renglonBulto=51
        let renglonDomicilio = 37
        let margenCabeceras = 96
        let margenDestino = margenCentroHorizontal
        renglon=margenSuperior
        if(orientacionCabe == false){
            margenBulto = margenIzquierdo 
            margenDestino = margenCentroHorizontal-2
        }else{
            margenBulto=margenCentroHorizontal
            margenDestino = margenCentroHorizontal
        }
        imagen.src=require('../assets/Logo_Area_Completo.png')
        pdf.addImage(imagen, "PNG", margenIzquierdo, renglon, 60, 15)
        pdf.setFont(nombreFont)
        pdf.setFontSize(14)
        pdf.setDrawColor(0,0,255)
        pdf.line(margenIzquierdo, renglon, margenCentral+115, renglon)
        renglon += interlineadoCabecera
        pdf.setFontSize(16)
        pdf.setFont(nombreFont, "Bold")
        var pjson = require('../../package.json')
        pdf.text(`Orden de picking - v${pjson.version}`, margenCentral, renglon)
        renglon += 8
        pdf.line(margenIzquierdo, renglon, margenCentral+115, renglon)
        pdf.setFontSize(11)
        renglon += interlineadoCabecera
        pdf.setFont(nombreFont, "")
        pdf.text("Empresa:", margenIzquierdo, 30)
        pdf.setFont(nombreFont, "Bold")
        pdf.text(orden[2].Empresa.Nombre, margenIzquierdo+18, 30)
        pdf.setFont(nombreFont, "")
        pdf.text("Destino:", margenDestino, 30)
        pdf.setFont(nombreFont, "Bold")
        pdf.setFontSize(11)
        pdf.text(orden[3].Destino!=null ? orden[3].Destino.Nombre : "", margenDestino+16, 30)
        pdf.setFontSize(11)
        renglon += interlineadoCabecera
        pdf.setFont(nombreFont, "")
        pdf.text("Comprob.:", margenIzquierdo, 37)
        pdf.setFont(nombreFont, "Bold")
        pdf.text(orden[0].Orden.Numero, margenIzquierdo+20, 37)
        if(orientacionCabe != false){
            renglon += interlineadoCabecera
            renglonBulto = 37
            renglonDomicilio = 30
            margenCabeceras = 178
        }
        pdf.setFont(nombreFont, "")
        pdf.text("Domicilio:", margenCabeceras, renglonDomicilio)
        pdf.setFont(nombreFont, "Bold")
        pdf.setFontSize(11)
        pdf.text(orden[3].Destino!=null ? orden[3].Destino.Domicilio : "", margenCabeceras+18, renglonDomicilio)
        pdf.setFontSize(11)
        renglon += interlineadoCabecera
        pdf.setFont(nombreFont, "")
        pdf.text("Fecha:", margenIzquierdo, 44)
        pdf.setFont(nombreFont, "Bold")
        pdf.text(orden[0].Orden.FechaCreacion.substr(8, 2)+"-"+orden[0].Orden.FechaCreacion.substr(5, 2)+"-"+orden[0].Orden.FechaCreacion.substr(0, 4), margenIzquierdo+16, 44)
        if(orientacionCabe != false){
            renglon -= interlineadoCabecera
        }
        pdf.setFont(nombreFont, "")
        pdf.text("Localidad:", margenCabeceras, renglonDomicilio+7)
        pdf.setFont(nombreFont, "Bold")
        pdf.setFontSize(11)
        pdf.text(orden[4].Localidad!=null ? orden[4].Localidad.Nombre : "", margenCabeceras+18, renglonDomicilio+7)
        pdf.setFontSize(11)
        if(orientacionCabe == false){
            renglon += interlineadoCabecera
        }
        pdf.setFont(nombreFont, "")
        pdf.text("Bultos:", margenBulto, renglonBulto)
        pdf.setFont(nombreFont, "Bold")
        let cantidadUnidades=0
        orden[1].Detalle.forEach(element => {
            cantidadUnidades += parseInt(element.Unidades)
        });
        pdf.text(cantidadUnidades!=null ? cantidadUnidades.toString() : "", margenBulto+16, renglonBulto)
        if(orientacionCabe != false){
            renglon += interlineadoCabecera
        }
        pdf.setFont(nombreFont, "")
        pdf.text("Cód. Post.:", margenCabeceras, renglonDomicilio+14)
        pdf.setFont(nombreFont, "Bold")
        pdf.setFontSize(11)
        pdf.text(orden[3].Destino.CodigoPostal!=null ? orden[3].Destino.CodigoPostal : "", margenCabeceras+21, renglonDomicilio+14)
        pdf.setFontSize(11)
        if(orientacionCabe == false){
            renglon += interlineadoCabecera
        }
        pdf.setFont(nombreFont, "")
        pdf.text("Tipo:", margenBulto, renglonBulto+7)
        pdf.setFont(nombreFont, "Bold")
        if (orden[0].Orden.Tipo==1) {
            pdf.text("Remito", margenBulto+14, renglonBulto+7)
        } else if (orden[0].Orden.Tipo==2) {
            pdf.text("Asignación", margenBulto+14, renglonBulto+7)
        } else {
            pdf.text("Otro", margenBulto+14, renglonBulto+7)
        }
        renglon += interlineadoCabecera
        pdf.line(margenIzquierdo, inicioRenglones-5, margenCentral+115, inicioRenglones-5)

        renglon += interlineadoCabecera
        pdf.setFontSize(8)
        pdf.setFont(nombreFont, "Bold")
        if(orden[2].Empresa.LOTE == true)
        {
            pdf.text("Un.", margenCantidad, inicioRenglones)
            pdf.text("Producto", margenProducto, inicioRenglones)
            if (orden[2].Empresa.StockPosicionado) {
                pdf.text("Serial Number", margenSerialNumber, inicioRenglones)
                pdf.text("Posición", margenPosicionLote, inicioRenglones)
                if(orientacionCabe == true){
                    pdf.text("Path Number", margenPathNumber, inicioRenglones)
                }
                pdf.text("Box Number", margenBoxnumber, inicioRenglones)
            } else {
                pdf.text("Serial Number", margenSerialNumber+10, inicioRenglones)
                if(orientacionCabe == true){
                    pdf.text("Path Number", margenPathNumber-10, inicioRenglones)
                }
            }
        }else if(orden[2].Empresa.PART == true){
            pdf.text("Un.", margenCantidad, inicioRenglones)
            pdf.text("Producto", margenProducto, inicioRenglones)
            if (orden[2].Empresa.StockPosicionado) {
                pdf.text("Partida", margenBarcode-20, inicioRenglones)
                pdf.text("Barcode", margenBarcode, inicioRenglones)
                pdf.text("Posición", margenPosicion, inicioRenglones)
                if(orientacionCabe == true){
                    pdf.text("Cod. Empresa", margenCodeEmpresa, inicioRenglones)
                }
            } else {
                pdf.text("Partida", margenBarcode-20, inicioRenglones)
                pdf.text("Barcode", margenBarcode+10, inicioRenglones)
                if(orientacionCabe == true){
                    pdf.text("Cod. Empresa", margenCodeEmpresa-10, inicioRenglones)
                }
            }
        }else{ 
            pdf.text("Un.", margenCantidad, inicioRenglones)
            pdf.text("Producto", margenProducto, inicioRenglones)
            if (orden[2].Empresa.StockPosicionado) {
                pdf.text("Barcode", margenBarcode, inicioRenglones)
                pdf.text("Posición", margenPosicion, inicioRenglones)
                if(orientacionCabe == true){
                    pdf.text("Cod. Empresa", margenCodeEmpresa, inicioRenglones)
                }
            } else {
                pdf.text("Barcode", margenBarcode+10, inicioRenglones)
                if(orientacionCabe == true){
                    pdf.text("Cod. Empresa", margenCodeEmpresa-10, inicioRenglones)
                }
            }
        }
        pdf.setFontSize(12)
        pdf.setFont(nombreFont, "")
    },
    generarPieDePDF(pdf) {
        let renglon=renglonPieDePagina
        pdf.line(margenIzquierdo, lineasPiePagina, margenCentral+115, lineasPiePagina)
        renglon += 5
        pdf.text("Página: "+paginaActual, margenCantidad, lineasPiePagina-2)
        renglon += 3
        pdf.line(margenIzquierdo, lineasPiePagina+8, margenCentral+115, lineasPiePagina+8)
    },
    generarFinalDePDF(pdf, orden) {
        renglon=renglonesMaximoPantalla+10
        pdf.setFontSize(16)

        pdf.text("Observaciones", 15, inicioObservaciones)

        renglon += 5
        pdf.setFontSize(10)
        pdf.text(orden[0].Orden.Observaciones, 30, inicioObservaciones+5)
        
        renglon += 20
        pdf.text("Preparó _______________", margenProducto+6, lineasPiePagina-2)
        pdf.text("Controló _______________", margenBarcode, lineasPiePagina-2)
        
        renglon += 10
        pdf.text("Valor CTR: $ "+orden[0].Orden.ValorContrareembolso+"-", margenProducto+4, lineasPiePagina+6)
        pdf.text("Valor declarado: $ "+orden[0].Orden.ValorDeclarado+"-", margenBarcode, lineasPiePagina+6)
    },

    namespaced: true,
    actions: {
        async getAll(IdEmpresa, Estado, IdOrden) {
            return new Promise (
                function (resolve, reject) {                    
                    const Cabeceras= {IdEmpresa, Estado, IdOrden, FechaDesde: '2021-08-29', FechaHasta: ''}
                    API.actions.acceder({Ruta: 'ordenes/getAll', 
                                        Cabeceras,
                                        Cartel: "Obteniendo órdenes ..."})
                    .then(datosLeidos => {
                        if (datosLeidos.Estado=="OK") {
                            resolve(datosLeidos.Datos.Ordenes)
                        } else {
                            reject(datosLeidos.Detalle)
                        }
                    })
                    .catch(puteada => { 
                        reject(puteada.Detalle) 
                    })
                }
            )            
        },

        async getById(IdOrden) {
            return new Promise (
                function (resolve, reject) {
                    API.actions.acceder({Ruta: 'ordenes/getbyId', 
                                        Cabeceras: {IdOrden},
                                        Cartel: "Obteniendo orden ..."})
                    .then(datosLeidos => {
                        //console.log("Datos leidos", datosLeidos.Datos.Orden)
                        if (datosLeidos.Estado=="OK") {
                            resolve(datosLeidos.Datos.Orden)
                        } else {
                            reject(datosLeidos.Detalle)
                        }
                    })
                    .catch(puteada => { 
                        reject(puteada.Detalle) 
                    })
                }
            )            
        },
        async getDatosOrden(orden)
        {
            const data=[]
            let empresa = []
            let ordenDetalleProducto = []
            let destino = []
            let localidad=""
            let cp = ""
            await destinos.getOneById(orden.Eventual)
            .then(response =>{
                destino=response
            })

            if(destino.CodigoPostal > 1000 && destino.CodigoPostal < 1600){
                cp = "1000"
            }else{
                cp = destino.CodigoPostal
            }
            await ordenesv3.getLocalidadByCodigoPostal(cp)
            .then(response=>{
                localidad = response
            })
            .catch(error =>{
                localidad={Nombre: " "}
            })
            
            await empresasV3.getOneById(orden.IdEmpresa)
            .then(response =>{
                empresa=response
            })
            if(empresa.PART){
                await ordenesv3.getDetalleOrdenAndProductoPartidaById(orden.Id)
                .then(response =>{
                    ordenDetalleProducto=response
                })
            }else{
                await ordenesv3.getDetalleOrdenAndProductoById(orden.Id)
                .then(response =>{
                    ordenDetalleProducto=response
                })
            }
            data.push({Orden: orden})
            data.push({Detalle: ordenDetalleProducto})
            data.push({Empresa: empresa})
            data.push({Destino: destino})
            data.push({Localidad: localidad})
            return data
        },

        

        async getByIdArticulo(IdEmpresa, IdArticulo) {
            return new Promise (
                function (resolve, reject) {
                    API.actions.acceder({Ruta: 'ordenes/getbyIdArticulo', 
                                        Cabeceras: {IdEmpresa, IdArticulo},
                                        Cartel: "Obteniendo órdenes ..."})
                    .then(datosLeidos => {
                        if (datosLeidos.Estado=="OK") {
                            resolve(datosLeidos.Datos)
                        } else {
                            reject(datosLeidos.Detalle)
                        }
                    })
                    .catch(puteada => { 
                        reject(puteada.Detalle) 
                    })
                }
            )            
        },

        async registrarAltaMasiva(IdEmpresa, Detalle, Comprobante, Fecha, Cliente, CodigoPostal, Domicilio, Observaciones) {
            return new Promise (
                function (resolve, reject) {
                    const Cabeceras={IdEmpresa, Detalle, Comprobante, Fecha, Cliente, CodigoPostal, Domicilio, Observaciones}
                    API.actions.acceder({Ruta: 'ordenes/registrarAltaMasiva', 
                                        Cabeceras,
                                        Metodo: "Post",
                                        Cartel: "Procesando orden "+Comprobante+" ..."})


                    .then(datosLeidos => {
                        if (datosLeidos.Estado=="OK") {
                            resolve({IdNuevaOrden: datosLeidos.Datos.IdNuevaOrden, Comprobante})
                        } else {
                            reject(datosLeidos.Detalle)
                        }
                    })
                    .catch(puteada => { 
                        reject("Comprobante: "+Comprobante+" - Error: "+puteada.Detalle) 
                    })
                }
            )            
        },
    },
}

export default ordenes