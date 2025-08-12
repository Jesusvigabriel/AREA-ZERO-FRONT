<template>
</template>

<script>

import ordenes from "@/store/ordenes"
import ordenesV3 from "@/store/ordenesV3"
import store from "@/store"
import {xlsx, read, utils, writeFile} from 'xlsx'

export default {
    name: "ImprimirUnaOrden",

    methods: { 
        getOrder(idOrden, formato) {
            if (typeof formato=="undefined") {
                formato="PDF"
            }
            formato=formato.toUpperCase()
            ordenes.actions.getById(idOrden)
                .then(async orden => {

                    if (formato==="PDF") {

                        const pdf=await ordenes.generarOrdenEnPDF(orden)
                        pdf.save("orden_"+orden.Numero+".pdf")

                        if (orden.Empresa.GeneracionAutomaticaEtiquetas) {
                            const pdfEtiqueta=await ordenes.generarOrdenEtiquetaEnPDF(orden)
                            pdfEtiqueta.save("etiqueta_"+orden.Numero+".pdf")
                            ordenesV3.informarEtiquetaImpresa(orden.Id)
                        }

                    } else if (formato==="StickerChico".toUpperCase()) {
                        const pdfEtiqueta=await ordenes.generarOrdenEtiquetaEnPDFChica(orden)
                        pdfEtiqueta.save("etiqueta_"+orden.Numero+".pdf")
                    } else if (formato==="Excel".toUpperCase()) {
                        const workbook = utils.book_new()
                        //workbook.Props = {Title: "Area 54", Subject: "Excel de productos", Author: "Leo Lob", CreatedDate: new Date()}

                        const nombreHoja="Orden "+orden.Numero
                        workbook.SheetNames.push(nombreHoja)

                        let cantidadUnidades=0
                        orden.Detalle.forEach(element => {
                            cantidadUnidades += parseInt(element.Cantidad)
                        });
                        
                        let tipo=""
                        if (orden.Tipo==1) {
                                tipo = "Remito"
                        } else if (orden.Tipo==2) {
                            tipo = "Asignación"
                        } else tipo = "Otro"
                        const datosPlanilla = [
                            ["Empresa:", orden.Empresa.Nombre, "Destino:", orden.Destino.Nombre],
                            ["Comprob.:", orden.Numero, "Domicilio:", orden.Destino.Domicilio],
                            ["Fecha:", orden.Fecha.substr(6, 2)+"-"+orden.Fecha.substr(4, 2)+"-"+orden.Fecha.substr(0, 4), "Localidad:", orden.Destino.Localidad],
                            ["Bultos:", cantidadUnidades, "Cód. Post.:", orden.Destino.CodigoPostal],
                            ["Tipo:", tipo],
                            []
                        ]

                        datosPlanilla.push(["Cantidad", "Producto", "Barcode", "Cod.Empresa"])

                        console.log(orden)

                        orden.Detalle.forEach(unItem => {
                            const unRenglon=[unItem.Cantidad, unItem.Producto.Descripcion, unItem.Producto.Barcode, unItem.Producto.CodeEmpresa]
                            datosPlanilla.push(unRenglon)
                        })

                        var worksheet = utils.aoa_to_sheet(datosPlanilla);
                        workbook.Sheets[nombreHoja] = worksheet;
                        writeFile(workbook, "Orden_"+orden.Numero+".xlsx");

                    }
                })
                .catch(puteada => {
                    store.dispatch("alertDialog/mostrar", {titulo: "Error", mensaje: "Orden inexistente"})
                })        
        }
    },

    created() {
        this.getOrder(this.$route.params.idOrden, this.$route.params.formato)
    },
}
</script>