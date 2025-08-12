import API from 'vue-lsi-util/APIAccesoV2'
import jspdf from 'jspdf'
import "jspdf-barcode"
import store from '@/store'
//const serverAPI=process.env.NODE_ENV=='development' ? "http://127.0.0.1:8080/apiv3" :"https://apiv3.area54sa.com.ar:8125/apiv3"
//const serverAPI="https://apiv3.area54sa.com.ar:8125/apiv3"

const posicionesV3= {

    async getAllPosicionesByIdEmpresa(idEmpresa) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({
                        Ruta: '/posiciones/getAllPosicionesByIdEmpresa/'+idEmpresa,
                        Cartel: "buscando posiciones..."
                    }
                )
                .then(data => {resolve(data)})
                .catch(puteada => {reject(puteada)})
            }
        )            
    },

    async buscarPorNombre(idEmpresa, nombre) {
        return new Promise((resolve, reject) => {
            API.acceder({
                Ruta: `/posiciones/buscar?empresa=${idEmpresa}&nombre=${encodeURIComponent(nombre)}`,
                Cartel: "Buscando posiciones..."
            })
            .then(data => resolve(data))
            .catch(err => reject(err))
        })
    },

    async getPosicionByIdAndEmpresa(id, idEmpresa) {
        return new Promise (
            function (resolve, reject) {
                API.acceder(
                    {
                        Ruta: '/posiciones/byidYEmpresa/'+id+"/"+idEmpresa,
                        Cartel: "Leyendo posición..."
                    }
                )
                .then(data => {resolve(data)})
                .catch(puteada => {reject(puteada)})
            }
        )            
    },

    async getPosicionesByIdAndEmpresa(id, idEmpresa) {
        return new Promise (
            function (resolve, reject) {
                API.acceder(
                    {
                        Ruta: '/posiciones/getPosicionesByIdYEmpresa/'+id+"/"+idEmpresa,
                        Cartel: "Leyendo posición..."
                    }
                )
                .then(data => {resolve(data)})
                .catch(puteada => {reject(puteada)})
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
    async getProductosYPosicionesByOrden(idOrden) {
        const resp = await API.get(`/ordenes/productos-posiciones/${idOrden}`);
        return resp.data.datos; // O adaptá si tu backend devuelve distinto
    },
    

    async getPosicionesByIdAndEmpresaAndLote(id, idEmpresa, lote) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({
                        Ruta: '/posiciones/getPosicionesByIdYEmpresaAndLote/'+id+"/"+idEmpresa+"/"+lote,
                        Cartel: "Leyendo posición..."
                    }
                )
                .then(data => {resolve(data)})
                .catch(puteada => {reject(puteada)})
            }
        )            
    },

    async getPosicionesByLote(idEmpresa, lote) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({
                        Ruta: '/posiciones/getPosicionesByLote/'+idEmpresa+"/"+lote,
                        Cartel: "Leyendo posición..."
                    }
                )
                .then(data => {resolve(data)})
                .catch(puteada => {reject(puteada)})
            }
        )            
    },

    async getPosicionesByLoteDetalle(idEmpresa) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({
                        Ruta: '/posiciones/getPosicionesByLoteDetalle/'+idEmpresa,
                        Cartel: "Leyendo posición..."
                    }
                )
                .then(data => {resolve(data)})
                .catch(puteada => {reject(puteada)})
            }
        )            
    },
    async getAllByEmpresaConDetalle(idEmpresa) {
        return new Promise((resolve, reject) => {
          API.acceder({
            Ruta: `/posiciones/getAllByEmpresaConDetalle/${idEmpresa}`,
            Cartel: "Obteniendo detalle completo de posiciones..."
          })
          .then(data => resolve(data))
          .catch(err => reject(err))
        })
      },

      async getAllByEmpresa(idEmpresa) {
        return new Promise((resolve, reject) => {
            API.acceder({
                Ruta: `/posiciones/getAll/`,  // Ruta corregida
                Cartel: "Obteniendo posiciones..."
            })
            .then(data => resolve(data))
            .catch(err => reject(err))
        })
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
    
    async getDetallePosicionByIdAndEmpresa(id, idEmpresa) {
        return new Promise (
            function (resolve, reject) {
                API.acceder(
                    {
                        Ruta: '/posiciones/getDetallePosicionByIdYEmpresa/'+id+"/"+idEmpresa,
                        Cartel: "Leyendo posición..."
                    }
                )
                .then(data => {resolve(data)})
                .catch(puteada => {reject(puteada)})
            }
        )            
    },

    async getPosicionAnterioresByIdAndEmpresa(id, idEmpresa) {
        return new Promise (
            function (resolve, reject) {
                API.acceder(
                    {
                        Ruta: '/posicionesAnteriores/byidYEmpresa/'+id+"/"+idEmpresa,
                        Cartel: "Leyendo posiciones..."
                    }
                )
                .then(data => {resolve(data)})
                .catch(puteada => {reject(puteada)})
            }
        )            
    },

    async editFechaPos_Prod(id, fecha) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({
                    Ruta: `/posiciones/editPosProd/${id}/${fecha}`,
                    Metodo: "PATCH",
                    Cartel: "Editando Fecha"
                })
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) })
            }
        )            
      },
    
      async imprimirSticker(item) {

        const imagen=new Image()
        const nombreFont="Helvetica"
        const margenIzquierdo=4
        const margenSuperior=1
        const margenDerecho=76
        const margenFinal=70
        const anchoLineas=0.75
        const paddingLineas=3
        const pdf=new jspdf("l", "mm", [80, 40])
      
        pdf.setFont(nombreFont, "")
        pdf.setLineWidth(anchoLineas)
        let renglon=margenSuperior
        pdf.setDrawColor(0, 0, 0)

        imagen.src=require('../assets/Logo_Area_Completo_negro.png')
        pdf.addImage(imagen, "PNG", 20, renglon, 34, 10)
        renglon+=10
        pdf.line(margenIzquierdo-paddingLineas, renglon, 79, renglon)
        let txtWidth= pdf.getStringUnitWidth(item.Nombre)
        let barcodeWidth = pdf.getStringUnitWidth(item.Nombre)
        if(Math.round(barcodeWidth)>barcodeWidth){
            barcodeWidth= Math.round(barcodeWidth) 
            barcodeWidth = barcodeWidth - 1
        }else{
            barcodeWidth= Math.round(barcodeWidth)
        }
        if(Math.round(txtWidth)>txtWidth){
            txtWidth= Math.round(txtWidth) 
            txtWidth = txtWidth - 1
        }else{
            txtWidth= Math.round(txtWidth)
        }
        barcodeWidth = barcodeWidth * 10
        barcodeWidth = barcodeWidth / 2
        txtWidth = txtWidth * 10
        txtWidth = txtWidth / 2
        
        let fontSize=40
        if(barcodeWidth >= 40){
            fontSize=37
            barcodeWidth = barcodeWidth - 3
        }else{
            fontSize=40
        }
        renglon+=7
        pdf.barcode(item.Nombre, {fontSize: fontSize, x: 40-barcodeWidth, y: renglon+9})
        pdf.setFont(nombreFont, "")
        renglon += 16
        pdf.setFontSize(15).setFont(nombreFont, "Bold").text(pdf.splitTextToSize(item.Nombre, 90)[0], 50-txtWidth, renglon+1)
        renglon+=5
        pdf.line(margenIzquierdo-paddingLineas, renglon, 79, renglon)
        //pdf.line(margenDerecho-paddingLineas, lineaSuperior, margenDerecho-paddingLineas, renglon)
        const lineaIntermedia=renglon
        //Linea horizontal debajo
        pdf.line(margenIzquierdo-paddingLineas, renglon, 79, renglon)
        //Linea vertical izquierda
        //pdf.line(margenIzquierdo-paddingLineas, lineaSuperior, margenIzquierdo-paddingLineas, lineaIntermedia)
        //Linea vertical derecha
        //pdf.line(margenFinal+paddingLineas, lineaSuperior, margenFinal+paddingLineas, lineaIntermedia)
        pdf.save("EtiquetaPosicion.pdf")
        return pdf
      },

      async imprimirListaStickers(lista) {
        
        
        const imagen=new Image()
        const nombreFont="Helvetica"
        const margenIzquierdo=4
        const margenSuperior=1
        const anchoLineas=0.75
        const paddingLineas=3
        const pdf=new jspdf("l", "mm", [80, 40])
        let pagina = 1
        pdf.setFont(nombreFont, "")
        pdf.setLineWidth(anchoLineas)
        
        pdf.setDrawColor(0, 0, 0)
        for(const posicion of lista){
            if(pagina == 1){
                pagina++
            }else{
                pdf.addPage()
            }
            let renglon=margenSuperior
            imagen.src=require('../assets/Logo_Area_Completo_negro.png')
            pdf.addImage(imagen, "PNG", 20, renglon, 34, 10)
            renglon+=10
            pdf.line(margenIzquierdo-paddingLineas, renglon, 79, renglon)
            let txtWidth= pdf.getStringUnitWidth(posicion.Nombre)
            let barcodeWidth = pdf.getStringUnitWidth(posicion.Nombre)
            if(Math.round(barcodeWidth)>barcodeWidth){
                barcodeWidth= Math.round(barcodeWidth) 
                barcodeWidth = barcodeWidth - 1
            }
            else{
                barcodeWidth= Math.round(barcodeWidth)
            }
            if(Math.round(txtWidth)>txtWidth){
                txtWidth= Math.round(txtWidth) 
                txtWidth = txtWidth - 1
            }
            else{
                txtWidth= Math.round(txtWidth)
            }
            barcodeWidth = barcodeWidth * 10
            barcodeWidth = barcodeWidth / 2
            txtWidth = txtWidth * 10
            txtWidth = txtWidth / 2
            let fontSize=40
            if(barcodeWidth >= 40){
                fontSize=37
                barcodeWidth = barcodeWidth - 3
            }else{
                fontSize=40
            }
            renglon+=7
            pdf.barcode(posicion.Nombre, {fontSize: fontSize, x: 40-barcodeWidth, y: renglon+9})
            pdf.setFont(nombreFont, "")
            renglon += 16
            pdf.setFontSize(15).setFont(nombreFont, "Bold").text(pdf.splitTextToSize(posicion.Nombre, 90)[0], 50-txtWidth, renglon+1)
            renglon+=5
            //Linea horizontal debajo
            pdf.line(margenIzquierdo-paddingLineas, renglon, 79, renglon)
        }
        pdf.save("EtiquetaPosicion.pdf")
        return pdf
      }

}

export default posicionesV3