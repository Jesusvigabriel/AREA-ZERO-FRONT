import API from 'vue-lsi-util/APIAccesoV2'
import jspdf from 'jspdf'
import "jspdf-barcode"

//const serverAPI=process.env.NODE_ENV=='development' ? "http://127.0.0.1:8080/apiv3" :"https://apiv3.area54sa.com.ar:8125/apiv3"
//const serverAPI="https://apiv3.area54sa.com.ar:8125/apiv3"

const productosV3= {
    async registrarDesposicionamiento(idProducto, idPosicion, cantidadADesposicionar) {
        return new Promise (
            function (resolve, reject) {
                API.acceder(
                    {
                        Ruta: `/producto/desposicionar/${idProducto}/${idPosicion}/${cantidadADesposicionar}`,
                        Metodo: "POST",
                        Cartel: "Registrando desposicionamiento..."
                    }
                )
                .then(data => {resolve(data)})
                .catch(puteada => {reject(puteada)})
            }
        )            
    },
    async registrarPosicionamiento(idEmpresa,idProducto, idPosicion, cantidadAPosicionar) {
        return new Promise (
            function (resolve, reject) {
                const Ruta=`/producto/posicionar/${idEmpresa}/${idProducto}/${idPosicion}/${cantidadAPosicionar}`
                API.acceder(
                    {
                        Ruta,
                        Metodo: "POST"
                    }
                )
                .then(data => {resolve(data)})
                .catch(puteada => {reject(puteada)})
            }
        )            
    },

    async registraReposicionamientoExcel(idEmpresa,idProducto, idPosicion, cantidadAPosicionar,usuario) {
        return new Promise (
            function (resolve, reject) {
                const Ruta=`/producto/registraReposicionamientoExcel/${idEmpresa}/${idProducto}/${idPosicion}/${cantidadAPosicionar}/${usuario}`
                API.acceder(
                    {
                        Ruta,
                        Metodo: "POST",
                        Cartel: "Registrando reposicionamiento..."
                    }
                )
                .then(data => {resolve(data)})
                .catch(puteada => {reject(puteada)})
            }
        )            
    },

    async registraReposicionamientoExcelCantidad(idEmpresa,idProducto, posicionOrigen, posicionDestino, cantidadAPosicionar,barcodeProducto, usuario) {
        return new Promise (
            function (resolve, reject) {
                const Ruta=`/producto/registraReposicionamientoExcelCantidad/${idEmpresa}/${idProducto}/${posicionOrigen}/${posicionDestino}/${cantidadAPosicionar}/${barcodeProducto}/${usuario}`
                API.acceder(
                    {
                        Ruta,
                        Metodo: "POST",
                        Cartel: "Registrando reposicionamiento..."
                    }
                )
                .then(data => {resolve(data)})
                .catch(puteada => {reject(puteada)})
            }
        )            
    },

    async updatePosicionByLoteAndIdPosicion(boxNumber, idPosicion, userName) {
        return new Promise (
            function (resolve, reject) {
                const Ruta=`/productos/update_posicionByLoteAndIdPosicion/${boxNumber}/${idPosicion}/${userName}`
                API.acceder(
                    {
                        Ruta,
                        Metodo: "GET",
                        Cartel: "Registrando reposicionamiento..."
                    }
                )
                .then(data => {resolve(data)})
                .catch(puteada => {reject(puteada)})
            }
        )            
    },

    async registrar(idProducto, idPosicion, cantidadAPosicionar) {
        return new Promise (
            function (resolve, reject) {
                const Ruta=`/producto/posicionar/${idProducto}/${idPosicion}/${cantidadAPosicionar}`
                API.acceder(
                    {
                        Ruta,
                        Metodo: "POST"
                    }
                )
                .then(data => {resolve(data)})
                .catch(puteada => {reject(puteada)})
            }
        )            
    },

    async deleteProducto(id) {
        return new Promise (
            function (resolve, reject) {
                const Ruta=`/productos/eliminar/${id}`
                API.acceder({Ruta, Metodo: "DELETE"})
                .then(data => {resolve(data)})
                .catch(puteada => {reject(puteada)})
            }
        )            
    },
    async registrarReposicionamiento(payload) {
        return new Promise (
            function (resolve, reject) {
                API.acceder(
                    {
                        Cartel: "Registrando reposicionamiento...", 
                        Metodo: "POST", 
                        Ruta: '/productos/reposicionamiento', 
                        Body: payload
                    }
                )
                .then(data => {resolve(data)})
                .catch(puteada => {reject(puteada)})
            }
        )            
    },
    async getByBarcodeAndEmpresa(barcode, idEmpresa) {
        return new Promise (
            function (resolve, reject) {
                API.acceder(
                    {
                        Ruta: '/productos/byBarcodeYEmpresa/'+barcode+"/"+idEmpresa,
                        Cartel: "Leyendo artículo..."
                    }
                )
                .then(data => {resolve(data)})
                .catch(puteada => {reject(puteada)})
            }
        )            
    },

    async getByCodeEmpresaAndEmpresa(barcode, idEmpresa) {
        return new Promise (
            function (resolve, reject) {
                API.acceder(
                    {
                        Ruta: '/productos/byCodeEmpresaYEmpresa/'+barcode+"/"+idEmpresa,
                        Cartel: "Leyendo artículo..."
                    }
                )
                .then(data => {resolve(data)})
                .catch(puteada => {reject(puteada)})
            }
        )            
    },

    async getPosicionesPorProductoAndLote(idProducto,idPosicion,lote){
        return new Promise (
            function (resolve, reject) {
                API.acceder(
                    {
                        Ruta: '/productos/PosicionesPorProductoAndLote/'+idProducto+"/"+idPosicion+"/"+lote,
                        Cartel: "Leyendo artículo..."
                    }
                )
                .then(data => {resolve(data)})
                .catch(puteada => {reject(puteada)})
            }
        ) 
    },

    async updatePosicionLote(payload){
        return new Promise (
            function (resolve, reject) {
                API.acceder(
                    {
                        Ruta: '/productos/updatePosicionLote',
                        Metodo: "POST", 
                        Body: payload,
                        Cartel: "Actualizando lote..."
                    }
                )
                .then(data => {resolve(data)})
                .catch(puteada => {reject(puteada)})
            }
        ) 
    },

    async getLoteByBarcodeAndEmpresa(barcode, idEmpresa) {
        return new Promise (
            function (resolve, reject) {
                API.acceder(
                    {
                        Ruta: '/productos/loteByBarcodeYEmpresa/'+barcode+"/"+idEmpresa,
                        Cartel: "Leyendo artículo..."
                    }
                )
                .then(data => {resolve(data)})
                .catch(puteada => {reject(puteada)})
            }
        )            
    },

    async putLoteByBarcodeAndEmpresa(barcode, idEmpresa, lote, userName, comprobante, fecha) {
        return new Promise (
            function (resolve, reject) {
                API.acceder(
                    {
                        Ruta: '/productos/putLoteByBarcodeYEmpresa/'+barcode+"/"+idEmpresa+"/"+lote+"/"+userName+"/"+comprobante+"/"+fecha,
                        Cartel: "Guardando datos...",
                        Metodo: "PATCH"
                    }
                )
                .then(data => {resolve(data)})
                .catch(puteada => {reject(puteada)})
            }
        )            
    },
    async getByIdAndEmpresa(idArticulo, idEmpresa) {
        return new Promise (
            function (resolve, reject) {
                const Ruta=`/productos/ById/${idArticulo}/${idEmpresa}`
                // console.log(Ruta);
                API.acceder({Ruta , Cartel: "Actualizando artículo ..."})
                .then(data => {
                    resolve(data)
                    
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        )            
    },
    async getAllByEmpresa(idEmpresa) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: '/productos/allByEmpresa/'+idEmpresa, Cartel: "Obteniendo datos ..."})
                .then(data => {
                    resolve(data)
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        )            
    },

    async getAllLotes(idEmpresa) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: '/productos/allLotes/'+idEmpresa, Cartel: "Obteniendo datos ..."})
                .then(data => {
                    resolve(data)
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        )            
    },

    async getAllLotesV2(idEmpresa) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: '/productos/allLotesV2/'+idEmpresa, Cartel: "Obteniendo datos ..."})
                .then(data => {
                    resolve(data)
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        )            
    },
    async getAllLotesStock(idEmpresa) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: '/productos/getAllLotesStock/'+idEmpresa, Cartel: "Obteniendo datos ..."})
                .then(data => {
                    resolve(data)
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        )            
    },
    async getAllLotesSoloDetalle(idEmpresa) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: '/productos/getAllLotesSoloDetalle/'+idEmpresa, Cartel: "Obteniendo datos ..."})
                .then(data => {
                    resolve(data)
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        )            
    },

    async getComprometidoLote(lote, idEmpresa) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({
                    Cartel: "Obteniendo datos ...",
                    Metodo: "POST",
                    Ruta: '/productos/getComprometidoLote/'+idEmpresa+'/'+lote, 
                    
                })
                .then(data => {
                    resolve(data)
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        )            
    },

    async getLote(idEmpresa, lote) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: '/productos/getLote/'+idEmpresa+'/'+lote, Cartel: "Obteniendo datos ..."})
                .then(data => {
                    resolve(data)
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        )            
    },

    async getAllLotesDetalle(idEmpresa) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: '/productos/allLotesDetalle/'+idEmpresa, Cartel: "Obteniendo datos ..."})
                .then(data => {
                    resolve(data)
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        )            
    },
    
    async getLotesDetalle(idEmpresa, lote) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: '/productos/lotesDetalle/'+idEmpresa+'/'+lote, Cartel: "Obteniendo datos ..."})
                .then(data => {
                    resolve(data)
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        )            
    },

    async getLotesDetalleV2(idEmpresa, lote) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: '/productos/lotesDetalleV2/'+idEmpresa+'/'+lote, Cartel: "Obteniendo datos ..."})
                .then(data => {
                    resolve(data)
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        )            
    },

    async getOnlyLoteDetalle(idEmpresa, lote) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: '/productos/onlyLoteDetalle/'+idEmpresa+'/'+lote, Cartel: "Obteniendo datos ..."})
                .then(data => {
                    resolve(data)
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        )            
    },

    async getOnlyLote(idEmpresa, lote) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: '/productos/onlyLote/'+idEmpresa+'/'+lote, Cartel: "Obteniendo datos ..."})
                .then(data => {
                    resolve(data)
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        )            
    },

    async getLoteDetalleProducto(idEmpresa, lote, idProducto) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: '/productos/loteDetalleProducto/'+idEmpresa+'/'+lote+'/'+idProducto, Cartel: "Obteniendo datos ..."})
                .then(data => {
                    resolve(data)
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        )            
    },

    async getAllProductosByEmpresa(idEmpresa) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: '/productos/allProductosByEmpresa/'+idEmpresa, Cartel: "Obteniendo datos ..."})
                .then(data => {
                    resolve(data)
                })
                .catch(puteada => {
                    reject(puteada)
                })
            }
        )
    },

    // Obtiene todos los productos con stock utilizando la ruta existente de
    // `getAllProductosByEmpresa` y filtrando los resultados en el frontend.
    // Ya no es necesario contar con una ruta `/productos/allConStock` en el
    // backend.
    async getAllConStock(idEmpresa) {
        return productosV3.getAllProductosByEmpresa(idEmpresa)
            .then(productos => productos.filter(p => p.Stock > 0));
    },

    // La carga de tarjetas se realiza localmente con los productos obtenidos
    // por `popularListaProductos`. Se deja comentada esta función que antes
    // consultaba un resumen al backend por si vuelve a ser necesaria.
    /*
    async getResumenStock(idEmpresa) {
        return new Promise(
            function(resolve, reject) {
                API.acceder({
                    Ruta: `/productos/resumenStock/${idEmpresa}`,
                    Cartel: "Obteniendo resumen..."
                })
                .then(data => { resolve(data) })
                .catch(err => { reject(err) })
            }
        )
    },
    */

    async getMovimientosByPeriodoAndEmpresaAndArticulo(idEmpresa, fechaDesde, fechaHasta, idArticulo) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: `/almacenaje/getMovimientosPorPeriodo/${fechaDesde}/${fechaHasta}/${idEmpresa}/${idArticulo}`, Cartel: "Obteniendo datos ..."})
                .then(data => {
                    resolve(data)
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        )            
    },

    async getMovimientosByPeriodoAndEmpresaAndArticuloAndLote(idEmpresa, fechaDesde, fechaHasta, idArticulo,lote) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: `/almacenaje/getMovimientosPorPeriodoAndLote/${fechaDesde}/${fechaHasta}/${idEmpresa}/${idArticulo}/${lote}`, Cartel: "Obteniendo datos ..."})
                .then(data => {
                    resolve(data)
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        )            
    },

    async getMovimientosByPeriodoAndEmpresaAndArticuloAndPartida(idEmpresa, fechaDesde, fechaHasta, idArticulo, part) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: `/almacenaje/getMovimientosPorPeriodoAndPartida/${fechaDesde}/${fechaHasta}/${idEmpresa}/${idArticulo}/${part}`, Cartel: "Obteniendo datos ..."})
                .then(data => {
                    resolve(data)
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        )            
    },

    async getProductoByPartidaAndEmpresaAndProducto(idEmpresa, partida, barcode){
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: `/productos/getProductoByPartidaAndEmpresaAndProducto/${idEmpresa}/${partida}/${barcode}`, Cartel: "Obteniendo datos ..."})
                .then(data => {
                    resolve(data)
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        ) 
    },
    
    async getProductoByPartidaAndEmpresaAndBarcode(idEmpresa, partida, barcode){
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: `/productos/getProductoByPartidaAndEmpresaAndBarcode/${idEmpresa}/${partida}/${barcode}`, Cartel: "Obteniendo datos ..."})
                .then(data => {
                    resolve(data)
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        ) 
    },
    async getProductoByPartidaAndEmpresaAndProductov2(idEmpresa, partida, idProducto){
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: `/productos/getProductoByPartidaAndEmpresaAndProductov2/${idEmpresa}/${partida}/${idProducto}`, Cartel: "Obteniendo datos ..."})
                .then(data => {
                    resolve(data)
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        ) 
    },
    

    async updateStockProdByIdEmpresaAndPart(partida, barcode, idEmpresa, payload) {
        return new Promise (
            function (resolve, reject) {
                API.acceder(
                    {
                        Cartel: "Actualizando Stock Articulo...", 
                        Metodo: "PATCH", 
                        Ruta: `/productos/editStockProdByIdEmpresaAndPart/${partida}/${barcode}/${idEmpresa}`,
                        Body: payload,                       
                    }
                )
                .then(data => {resolve(data)})
                .catch(puteada => {reject(puteada)})
            }
        )            
    },

    async getAllPartidasByIdEmpresa(idEmpresa){
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: `/productos/getAllPartidasByIdEmpresa/${idEmpresa}`, Cartel: "Obteniendo datos ..."})
                .then(data => {
                    resolve(data)
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        )   
    },

    async getAllPartidas(idEmpresa){
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: `/productos/getAllPartidas/${idEmpresa}`, Cartel: "Obteniendo datos ..."})
                .then(data => {
                    resolve(data)
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        )   
    },

    async registrarPosicionamientoPartida(idEmpresa,Partida, barcode, idPosicion, cantidadAPosicionar) {
        return new Promise (
            function (resolve, reject) {
                const Ruta=`/producto/posicionarPartidaExcel/${idEmpresa}/${Partida}/${barcode}/${idPosicion}/${cantidadAPosicionar}`
                API.acceder(
                    {
                        Ruta,
                        Metodo: "POST"
                    }
                )
                .then(data => {resolve(data)})
                .catch(puteada => {reject(puteada)})
            }
        )            
    },

    async updateStockArt(idArticulo, payload) {
        return new Promise (
            function (resolve, reject) {
                API.acceder(
                    {
                        Cartel: "Actualizando Stock Articulo...", 
                        Metodo: "PATCH", 
                        Ruta: '/producto/editStockArticulo/'+idArticulo,
                        Body: payload, 
                       
                    }
                )
                .then(data => {resolve(data)})
                .catch(puteada => {reject(puteada)})
            }
        )            
    },


    async updateStockProdByIdEmpresa(barcode, idEmpresa, payload) {
        return new Promise (
            function (resolve, reject) {
                API.acceder(
                    {
                        Cartel: "Actualizando Stock Articulo...", 
                        Metodo: "PATCH", 
                        Ruta: `/producto/editStockProdByEmpresa/${barcode}/${idEmpresa}`,
                        Body: payload,                       
                    }
                )
                .then(data => {resolve(data)})
                .catch(puteada => {reject(puteada)})
            }
        )            
    },


    async editOne(payload) {
        return new Promise (
            function (resolve, reject) {
                API.acceder(
                    {
                        Cartel: "Actualizando producto...", 
                        Metodo: "PATCH", 
                        Ruta: '/producto/editById/'+payload.Id,
                        Body: payload, 
                       
                    }
                )
                .then(data => {resolve(data)})
                .catch(puteada => {reject(puteada)})
            }
        )            
    },

    async newOne(payload) {
        return new Promise (
            function (resolve, reject) {
                API.acceder(
                    {
                        Cartel: "Creando producto...", 
                        Metodo: "POST", 
                        Ruta: '/productos/newOne',
                        Body: payload, 
                       
                    }
                )
                .then(data => {resolve(data)})
                .catch(puteada => {reject(puteada)})
            }
        )            
    },
    async registraReposicionamientoExcelCantidad(idEmpresa,idProducto, posicionOrigen, posicionDestino, cantidadAPosicionar,barcodeProducto, usuario) {
                return new Promise (
                    function (resolve, reject) {
                        const Ruta=`/producto/registraReposicionamientoExcelCantidad/${idEmpresa}/${idProducto}/${posicionOrigen}/${posicionDestino}/${cantidadAPosicionar}/${barcodeProducto}/${usuario}`
                        API.acceder(
                            {
                                Ruta,
                                Metodo: "POST",
                                Cartel: "Registrando reposicionamiento..."
                            }
                        )
                        .then(data => {resolve(data)})
                        .catch(puteada => {reject(puteada)})
                    }
                )            
            },

    async imprimirSticker(item) {
        const imagen=new Image()
        const nombreFont="Helvetica"
        const margenIzquierdo=2
        const margenSuperior=1
        const anchoLineas=0.75
        const maxCellWidth = 75
        const pdf=new jspdf("l", "mm", [80, 40])
        pdf.setFontSize(10)

        let nombreWidth = pdf.getStringUnitWidth(item.Nombre)
        
        let barcodeText = item.Barcode.length
        let barcodeImage = 4 * item.Barcode.length
        let indiceObservaciones=0
        let indiceBarcode=0
        //si el ancho es mayor que el tamaño de la hoja lo setea a cero
        if(barcodeImage>=80){
            barcodeImage=0
        }else{
            barcodeImage = (80-barcodeImage)/2
        }
        if(barcodeText >=40){
            barcodeText=1
        }else{
            barcodeText = (40 - barcodeText)
        }
        
        //reducir el tamaño del codigo de barras si este tiene mas de 26 caracteres
        pdf.setFont(nombreFont, "")
        pdf.setLineWidth(anchoLineas)
        let renglon=margenSuperior
        pdf.setDrawColor(0, 0, 0)
        renglon +=15
        //dibuja el codigo de barras
        if(item.Barcode.length >= 38){
            pdf.barcode(item.Barcode, {fontSize: 40, x: barcodeImage, y: renglon})
        }else{
            pdf.barcode(item.Barcode, {fontSize: 46, x: barcodeImage, y: renglon})
        }
        renglon+=6
        pdf.setFontSize(10)
        pdf.setFont(nombreFont, "")

        if(item.Barcode.length >=40){
            pdf.setFontSize(10).text(item.Barcode.substring(0,40), barcodeText, renglon)
            indiceBarcode = 1
        }else{
            pdf.setFontSize(10).text(item.Barcode, barcodeText, renglon)
            indiceBarcode = 0
        }
        if(indiceBarcode == 1){
            while (indiceBarcode<2) {
                renglon +=5
                pdf.setFontSize(10).text(item.Barcode.substring(40,item.Barcode.length), barcodeText, renglon)
                indiceBarcode++
            }
        }
        renglon += 5
        //escribe el nombre del producto
        if(nombreWidth * 3 > maxCellWidth){
            pdf.setFontSize(8).text(item.Nombre.substring(0,40), margenIzquierdo+5, renglon)
            indiceObservaciones=1
        }else{
            pdf.setFontSize(8).text(item.Nombre, margenIzquierdo+5, renglon)
            indiceObservaciones=0
        }
        if(indiceObservaciones == 1){
            while (indiceObservaciones<2) {
                renglon +=5
                pdf.setFontSize(8).text(item.Nombre.substring(40,66), margenIzquierdo+5, renglon)
                indiceObservaciones++
            }
        }
        
        imagen.src=require('../assets/Logo_Area_Completo_negro.png')
        pdf.addImage(imagen, "PNG", 60, 34, 18, 6)
        pdf.save("EtiquetaProducto "+item.Barcode+".pdf")
        return pdf
    }

}

export default productosV3