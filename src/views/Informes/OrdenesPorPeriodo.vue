<template>
  <v-container>
    <v-row justify="center" v-show="empresaLoggeada()<=0">
      <v-col class="py-3" cols="2" align="start">
          <v-checkbox label="Una empresa" v-model="elegirEmpresa" class="py-0 my-0"></v-checkbox>
      </v-col>
      <v-col cols="4" v-show="elegirEmpresa && empresaLoggeada()<=0">
        <SelectorEmpresa @eligioEmpresa="eligioEmpresa($event)" :idEmpresaInicialmenteSeleccionada="idEmpresa" ></SelectorEmpresa>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="3">
        <v-text-field prepend-inner-icon="mdi-calendar" type="date" label="Desde" v-model="fechaDesde" dense></v-text-field>
      </v-col>
      <v-col  cols="3">
        <v-text-field prepend-inner-icon="mdi-calendar" type="date" label="Hasta" v-model="fechaHasta" dense></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col class="py-0" cols="3">
          <v-btn @click="obtenerInformacion()" color="success" block>Obtener información<v-icon>mdi-refresh</v-icon></v-btn>
      </v-col>
      <v-col class="py-0" cols="3" v-if="informacionAExportar.length>0">
          <v-btn @click="exportarAExcel()" color="success" block>Exportar a Excel<v-icon>mdi-microsoft-excel</v-icon></v-btn>
      </v-col>
    </v-row>
    <v-row v-show="informacionAExportar.length>0" class="pb-0 mb-0">
        <v-col class="py-0 my-0"  >
            <v-card-title class="py-1 my-0">
                <v-text-field class="search-field"
                    v-model="textoBusqueda"
                    append-icon="mdi-magnify"
                    label="Búsqueda"
                    single-line
                    dense
                    hide-details
                ></v-text-field>
                </v-card-title>
            </v-col>
    </v-row>
    <v-row>
      <v-col class="py-0" v-if="informacionAExportar.length>0">
        <v-data-table 
          :headers="cabeceras" 
          :search="textoBusqueda"
          item-key="Id"
          :items="informacionAExportar"  
          :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
          :items-per-page="30" 
          class="elevation-3" 
        >
        <template v-slot:item.Acciones="{ item }">
          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs"  v-on="on"  color="green"  @click="ver(item)">mdi-eye</v-icon>
                            </template>
                            <span>Ver</span>
                        </v-tooltip>
                                    
        </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import cadenas from 'vue-lsi-util/cadenas'
import store from "../../store"
import SelectorEmpresa from '@/components/SelectorEmpresa.vue'
import empresas from "@/store/empresasV3"
import ordenes from "@/store/ordenesV3"
import empresasV3 from '@/store/empresasV3'
import ordenesV2 from "@/store/ordenes"
import posiciones from '@/store/posicionesV3'
import {xlsx, read, utils, writeFile} from 'xlsx'
import fechas from 'vue-lsi-util/fechas'
import excel from "exceljs"
import {saveAs} from "file-saver"

export default {
  name: "Informes_OrdenesPorPeriodo",

  data() {
    return {
      fechaDesde: '2021-11-01',
      fechaHasta: '2021-11-01',
      idEmpresa: -1,
      empresaPorLote: false,
      elegirEmpresa: false,
      informacionAExportar: [],
      textoBusqueda: '',
      cabeceras: [
        {text: 'Id', value: 'Id', width: '10%'},
        {text: 'Remitos', value: 'Numero'},
        {text: 'Fecha original', value: 'FechaCreacion'},
        {text: 'Empresa', value: 'Empresa.Nombre'},
        {text: 'Cliente', value: 'Destino.Nombre'},
        {text: 'Destino', value: 'Destino.Domicilio'},
        {text: 'Fecha de preparación', value: 'FechaPreparado'},
        {text: 'Estado', value: 'NombreEstado', width: '20%'},
        {text: 'Tipo', value: 'PreOrden', width: '20%'},
        {text: '', value: 'Acciones'},
      ],
    }
  },

  methods: {
    empresaLoggeada() {
        if (!store.state.usuarios.usuarioActual.IdEmpresa) { 
            return -1
        } else {
            return store.state.usuarios.usuarioActual.IdEmpresa
        }
    },
    async obtenerInformacion() {
      if (this.elegirEmpresa) {
        if (this.idEmpresa==-1) {
          this.mostrarError("No se ha seleccionado Empresa")
          return
        }
      }

      let response
      if (!this.elegirEmpresa) {
        try {
          response = await ordenes.getByPeriodo(this.fechaDesde, this.fechaHasta)
          response.forEach(e => {
            e.Fecha=e.Fecha.substr(0,10)  
            e.FechaCreacion = new Date(e.FechaCreacion).toLocaleDateString()
            e.FechaPreparado= e.FechaPreparado!==null ? new Date(e.FechaPreparado).toLocaleDateString() : ""
            if ( e.PreOrden == true ) {
              e.PreOrden = "Pre-Orden"
            } else {
              e.PreOrden = "Orden"
            }
          });          
          this.informacionAExportar=response
        } catch (error) {
          console.log(error)          
        }
      } else {
        try {
          response =  await ordenes.getByPeriodoEmpresa(this.fechaDesde, this.fechaHasta, this.idEmpresa)
          response.forEach(e => {
            e.Fecha=e.Fecha.substr(0,10)
            e.FechaCreacion = new Date(e.FechaCreacion).toLocaleDateString()
            e.FechaPreparado = e.FechaPreparado!==null ? new Date(e.FechaPreparado).toLocaleDateString() : ""
            if ( e.PreOrden == true ) {
              e.PreOrden = "Pre-Orden"
            } else {
              e.PreOrden = "Orden"
            }  
          });          
          this.informacionAExportar=response
        } catch (error) {
          console.log(error)          
        }
      }
      // console.log(response)
      // this.generarInformeExcel(response)
    },

    async exportarAExcel() {

      const data=this.informacionAExportar
      console.log(data)
      const workbook=new excel.Workbook()
      const worksheet=workbook.addWorksheet("Ordenes")

      let renglon=1

      worksheet.views = [{state: 'frozen', ySplit: 1}]
      worksheet.autoFilter = 'C1:E1'
      if (!this.elegirEmpresa) {
        worksheet.autoFilter = 'Q1:Q1'
      }

      const cabeceras=[
        {header: 'Id', width: 15}, 
        {header: 'Remitos', width: 25},
        {header: 'Fecha original', width: 15},
        {header: 'Fecha preparacion', width: 15},
        {header: 'Fecha Liberacion pr-orden', width: 15},
        {header: 'Estado', width: 10},
        {header: 'Destino', width: 30},
        {header: 'Domicilio', width: 30},
        {header: 'Localidad', width: 30},
        {header: 'Cod.Post', width: 20},
        {header: 'Items', width: 10},
        {header: 'Bultos', width: 10},
        {header: 'Unidades', width: 10},
        //{header: 'Barcode', width: 20},
        //{header: 'Descripción', width: 40},
        {header: 'Kilos', width: 10},
        {header: 'M3', width: 10},
        {header: 'Valor declarado', width: 10},
        {header: 'CRR', width: 10},
        {header: 'Observaciones', width: 100}
      ]
      if (this.elegirEmpresa) {
        worksheet.columns=[...cabeceras]
      } else {
        worksheet.columns=[...cabeceras, {header: 'Empresa', width: 15}]        
      }

      let kilosTotal = 0
      let unidadesTotal = 0
      let totalItems =0

      data.forEach(unaOrden => {
          renglon++

          // console.log(unaOrden.detalle)

          // const unidades = unaOrden.Detalle.reduce( (acc, el) => acc+Number(el.Unidades), 0)
          // const kilos = unaOrden.Detalle.reduce( (acc, el) => acc + (el.Producto!=null && el.Producto.Peso!=null ? Number(el.Producto.Peso) : 0), 0)
          // const m3 = unaOrden.Detalle.reduce( (acc, el) => acc + (el.Producto!=null && el.Producto.Alto!=null ? Number(el.Producto.Alto) : 0) * (el.Producto!=null && el.Producto.Ancho!=null ? Number(el.Producto.Ancho) : 0) * (el.Producto!=null && el.Producto.Largo!=null ? Number(el.Producto.Largo) : 0), 0)

          let unidades = 0
          unaOrden.Detalle.forEach(e => {            
            unidades += e.Unidades
          })
          unidadesTotal += unidades

          let kilos = 0
          unaOrden.Detalle.forEach(e => {
            if (e.Producto!=null && e.Producto.Peso!=null) {
              const Peso=Number(e.Producto.Peso)
              kilos += Peso * e.Unidades
            }
          })
          kilosTotal += kilos

          let m3 = 0
          unaOrden.Detalle.forEach(e => {
            if (e.Producto!=null && e.Producto.Alto!=null && e.Producto.Ancho!=null && e.Producto.Largo!=null) {
              m3 += Number(e.Producto.Alto) * Number(e.Producto.Ancho) * Number(e.Producto.Largo) * e.Unidades
            }
          })

          let items = 0
          unaOrden.Detalle.forEach(e => {
            items += 1
          })
          totalItems = items

          const filaCompleta=[
            unaOrden.Id, 
            unaOrden.Numero, 
            unaOrden.FechaCreacion.substr(0,10), 
            unaOrden.FechaOrdenPreparada !== null ? unaOrden.FechaOrdenPreparada.substr(0,10) : unaOrden.FechaPreparado.substring(0,10) ,
            unaOrden.LiberarPreOrden !== null ? unaOrden.LiberarPreOrden.substr(0,10) : '',
            //unaOrden.FechaPreparado !== null ? unaOrden.FechaPreparado.substr(0,10) : '', 
            unaOrden.NombreEstado,
            unaOrden.Destino===null || (typeof unaOrden.Destino==="undefined") ? '' : unaOrden.Destino.Nombre,
            unaOrden.Destino===null || (typeof unaOrden.Destino==="undefined")  ? '' : unaOrden.Destino.Domicilio,
            unaOrden.Destino===null || (typeof unaOrden.Destino==="undefined")  ? '' : unaOrden.Destino.Localidad,
            unaOrden.Destino===null || (typeof unaOrden.Destino==="undefined")  ? '' : unaOrden.Destino.CodigoPostal,
            totalItems,
            unaOrden.Bultos!=null ? unaOrden.Bultos :  0,
            unidades,
            kilos,
            m3,
            unaOrden.ValorDeclarado,
            unaOrden.ValorContrareembolso,
            //unaOrden.FechaPreparado !== null ? unaOrden.FechaPreparado.substr(0,10) : '', 
            //unaOrden.Fecha.substr(0,10), 
            unaOrden.Observaciones!=null ? unaOrden.Observaciones : ''
          ]
          if (this.elegirEmpresa) {
            worksheet.getRow(renglon).values=[...filaCompleta]
          } else {
            worksheet.getRow(renglon).values=[...filaCompleta, unaOrden.Empresa.Nombre]
          }
          
          // for(const e of unaOrden.Detalle){
          //   renglon++
          //   let peso = 0
          //   let mts3 = 0
          //   if (e.Producto!=null && e.Producto.Peso!=null) {
          //     peso = e.Unidades * Number(e.Producto.Peso)
          //   }
          //   if (e.Producto!=null && e.Producto.Alto!=null && e.Producto.Ancho!=null && e.Producto.Largo!=null) {
          //     mts3 = Number(e.Producto.Alto) * Number(e.Producto.Ancho) * Number(e.Producto.Largo)
          //   }

          //   let filaDetalle = []

          //   if(e.Producto == null){
          //     filaDetalle=[
          //       , , , , , , , , , ,
          //       e.Unidades,
          //       "No existe el barcode",
          //       "No existe el producto",
          //       peso,
          //       mts3
          //     ]
          //   } else {
          //     filaDetalle=[
          //       , , , , , , , , , ,
          //       e.Unidades,
          //       e.Producto.Barcode,
          //       e.Producto.Nombre,
          //       peso,
          //       mts3
          //     ]
          //   }
          //   if (this.elegirEmpresa) {
          //     worksheet.getRow(renglon).values=[...filaDetalle]
          //   } else {
          //     worksheet.getRow(renglon).values=[...filaDetalle, unaOrden.Empresa.Nombre]
          //   }
          // }

      })

      renglon++
      const filaTotalPosicionado=renglon
      let celdaSuma=worksheet.getCell(`J${renglon}`)
      celdaSuma.value={formula: `SUM(J2:J${renglon-1})`}
      celdaSuma.font={bold: true}

      celdaSuma=worksheet.getCell(`K${renglon}`)
      //celdaSuma.value={formula: `SUM(K2:K${renglon-1})`}
      celdaSuma.value=unidadesTotal
      celdaSuma.font={bold: true}

      celdaSuma=worksheet.getCell(`N${renglon}`)
      //celdaSuma.value={formula: `SUM(N2:N${renglon-1})`}
      celdaSuma.value=kilosTotal
      celdaSuma.font={bold: true}

      worksheet.eachRow ( (row, rowNumber) => {
          row.eachCell ( (cell, colNumber) => {
              if (rowNumber==1) {
                  cell.font={size: 16, bold: true}
              } else {
                  if (rowNumber==renglon) {
                      cell.font={size: 16, bold: true}
                  } else {
                      cell.font={size: 14}
                  }
              }
          })
      } )

    const buf=await workbook.xlsx.writeBuffer()
    if (!this.elegirEmpresa) {
      saveAs(new Blob([buf]), `ordenes_${this.fechaDesde}_al_${this.fechaHasta}.xlsx`)
    } else {
      saveAs(new Blob([buf]), `${cadenas.stringToSlug(data[0].Empresa.Nombre)}_Ordenes_desde_${this.fechaDesde}_al_${this.fechaHasta}.xlsx`)
    }


    },
    async ver(item) {
      let lote=""
      let mensaje =""
      let producto=""
      await empresasV3.getOneById(item.IdEmpresa)
        .then(respuesta =>{
          lote = respuesta.LOTE
          this.empresaPorLote = respuesta.LOTE
          this.idEmpresa = item.IdEmpresa
        })
      await ordenes.getDetalleOrdenAndProductoById(item.Id)
        .then(response =>{
          if (response.length>0) {
            if(lote == true){
              let numeroLote = ""
              mensaje='<table border="0" width="80%"><tr><td><b>Unidades&nbsp</b></td><td><b>Producto</b></td><td align="right"><b>Box Number</b></td><td align="right"><b>Serial Number</b></td></tr>'
                response.forEach(e=>{
                  if(numeroLote != e.lote){
                    if(e.loteCompleto==1){
                      producto= "Lote Completo"
                    }else{
                      producto = e.Productos
                    }
                      mensaje += "<tr>"
                      mensaje += `<td>${e.Unidades}</td>`
                      mensaje += `<td>&nbsp${producto}</td>`
                      mensaje += `<td align="right">${e.lote}</td>`
                      mensaje += `<td align="right">${e.Barcode}</td>`
                      if(e.loteCompleto == 1)
                      {
                        numeroLote = e.lote
                      }
                    }
                  })
            }
            else{
              mensaje='<table border="0" width="80%"><tr><td><b>Unidades&nbsp</b></td><td><b>Producto</b></td><td align="right"><b>Codigo</b></td><td align="right"><b>Cod. Empresa</b></td></tr>'
                response.forEach(e=>{
                      mensaje += "<tr>"
                      mensaje += `<td>${e.Unidades}</td>`
                      mensaje += `<td>&nbsp${e.Productos}</td>`
                      mensaje += `<td align="right">${e.Barcode}</td>`
                      mensaje += `<td align="right">${e.CodeEmpresa}</td>`
                  
                  })
            } 
            mensaje += "</table>" 
              
                        
                        const textoPrimario="Aceptar"
                        const textoSecundario="Excel"
                        const textoTerciario="PDF"  
                        const ordenDetalle={
                           titulo: `Orden: ${item.Id} Numero ${item.Numero}`,
                           mensaje: `${mensaje}`,
                           botonSecundario: textoSecundario,
                           botonPrimario: textoPrimario,
                           botonTerciario: textoTerciario,
                           callback: ((respuesta) => {
                               if (respuesta===textoSecundario) {
                                this.getOrder(item,"Excel")
                               }else if(respuesta===textoTerciario){
                                this.getOrder(item,'PDF')
                               }

                           })
                       }
                       
                       store.dispatch("alertDialog/mostrar",  ordenDetalle)      

                   } else {
                       store.dispatch("alertDialog/mostrar", {titulo: `Orden: ${item.Id} Numero ${item.numero}`, mensaje: "La orden no contiene articulos"})
                   }
                    
                })
                .catch(error => {
                    console.log(error)
                })
                
    },

        async getOrder(item, formato) {
            if (typeof formato=="undefined") {
                formato="PDF"
            }
            formato=formato.toUpperCase()
            
            const datosOrden =  await ordenes.getById(item.Id)
            await ordenesV2.actions.getDatosOrden(datosOrden)
                .then(async orden => {
                  if (formato==="PDF") {
                        const nombrePdf = await this.reemplazarCaracteres(orden[0].Orden.Numero)
                        if(this.empresaPorLote){
                          const pdf=await ordenesV2.generarOrdenEnPDF(orden,true)
                          pdf.save("orden_"+nombrePdf+".pdf")
                        }else{
                          const pdf=await ordenesV2.generarOrdenEnPDF(orden,false)
                          pdf.save("orden_"+nombrePdf+".pdf")
                        }
                    } else if (formato==="Excel".toUpperCase()) {
                        const workbook = utils.book_new()
                        //workbook.Props = {Title: "Area 54", Subject: "Excel de productos", Author: "Leo Lob", CreatedDate: new Date()}
                        const numeroOrden = await this.reemplazarCaracteres(orden[0].Orden.Numero)
                        const nombreHoja=numeroOrden.substring(0,30)
                        workbook.SheetNames.push(nombreHoja)
                        let tipo=""
                        if (orden[0].Orden.Tipo==1) {
                                tipo = "Remito"
                        } else if (orden[0].Orden.Tipo==2) {
                            tipo = "Asignación"
                        } else tipo = "Otro"
                        const datosPlanilla = [
                            ["Empresa:", orden[2].Empresa.Nombre, "Destino:", orden[3].Destino.Nombre],
                            ["Comprob.:", orden[0].Orden.Numero, "Domicilio:", orden[3].Destino.Domicilio],
                            ["Fecha:", orden[0].Orden.FechaCreacion.substr(8, 2)+"-"+orden[0].Orden.FechaCreacion.substr(5, 2)+"-"+orden[0].Orden.FechaCreacion.substr(0, 4), "Localidad:", orden[3].Destino.Localidad],
                            ["Bultos:", orden[0].Orden.Bultos!=null ? orden[0].Orden.Bultos.toString() : "" , "Cód. Post.:", orden[3].Destino.CodigoPostal],
                            ["Tipo:", tipo],
                            []
                        ]
                        if(this.empresaPorLote){
                          let loteCompleto = "no"
                          datosPlanilla.push(["Cantidad", "Producto", "Lote", "Barcode", "Cod.Empresa", "Posicion", "Lote completo"])
                          for(const unItem of orden[1].Detalle){
                            if(unItem.loteCompleto == 1){
                              loteCompleto="si"
                            }else{
                              loteCompleto="no"
                            }
                            await posiciones.getDetallePosicionByIdAndEmpresa(unItem.IdOrdendetalle, this.idEmpresa)
                            .then(response=>{
                              response.forEach( detallePosicion =>{
                                if(detallePosicion.IdDetalle == unItem.IdOrdendetalle){
                                  const unRenglon=[unItem.Unidades, unItem.Productos, unItem.lote, unItem.Barcode, unItem.CodeEmpresa, detallePosicion.Posicion, loteCompleto]
                                  datosPlanilla.push(unRenglon)
                                }
                              })
                            })
                          }
                          var worksheet = utils.aoa_to_sheet(datosPlanilla);
                            workbook.Sheets[nombreHoja] = worksheet;
                            writeFile(workbook, "Orden_"+numeroOrden+".xlsx");
                        }else{
                          if(this.empresaPosicionado == true){
                            datosPlanilla.push(["Cantidad", "Producto", "Barcode", "Cod.Empresa", "Posicion"])

                            for(const unItem of orden[1].Detalle){
                              await posiciones.getDetallePosicionByIdAndEmpresa(unItem.IdOrdendetalle, this.idEmpresa)
                              .then(response=>{
                                response.forEach( detallePosicion =>{
                                  if(detallePosicion.IdDetalle == unItem.IdOrdendetalle){
                                    const unRenglon=[unItem.Unidades, unItem.Productos, unItem.Barcode, unItem.CodeEmpresa, detallePosicion.Posicion]
                                    datosPlanilla.push(unRenglon)
                                  }
                                })
                              })
                            
                            }
                            var worksheet = utils.aoa_to_sheet(datosPlanilla);
                            workbook.Sheets[nombreHoja] = worksheet;
                            writeFile(workbook, "Orden_"+numeroOrden+".xlsx");
                          }else{
                            datosPlanilla.push(["Cantidad", "Producto", "Barcode", "Cod.Empresa"])

                            for(const unItem of orden[1].Detalle){
                              const unRenglon=[unItem.Unidades, unItem.Productos, unItem.Barcode, unItem.CodeEmpresa]
                              datosPlanilla.push(unRenglon)
                            }
                            var worksheet = utils.aoa_to_sheet(datosPlanilla);
                            workbook.Sheets[nombreHoja] = worksheet;
                            writeFile(workbook, "Orden_"+numeroOrden+".xlsx");
                          }
                        }
                    }
                })
                .catch(puteada => {
                  console.log(puteada)
                    store.dispatch("alertDialog/mostrar", {titulo: "Error", mensaje: "Orden inexistente"})
                })        
        },
    reemplazarCaracteres(item){
      const itemFiltrado = item.replace(/[/!¿?,:*"<>|]/g, '-')
      return(itemFiltrado)
    },
    eligioEmpresa(idEmpresaElegida) {
      this.idEmpresa=idEmpresaElegida
    },
    mostrarMensaje(mensaje, titulo) {
      store.dispatch("alertDialog/mostrar", {titulo, mensaje, botonPrimario: "Entendido"})
    },
    mostrarError(mensaje) {
      store.dispatch("snackbar/mostrar", mensaje)
    },
    quitarMarcaPreOrden(unaOrden){
      ordenes.setearPreOrden(unaOrden.Id, "F")
      .then(response => {
        // console.log(response)
        this.obtenerInformacion()
      })
      .catch(error => {
        console.log(error)
      })
    }
  },

  components: {
      SelectorEmpresa
  },

  created() {
    store.dispatch('actualizarTituloPrincipal', 'Órdenes por período')
    store.dispatch('empresas/cargarListaEmpresas', 'SoloActivas')
    this.fechaDesde=fechas.dateToString(fechas.getSumarDiasFecha(-1))
    this.fechaHasta=fechas.dateToString(fechas.getSumarDiasFecha(0))

    if (store.state.usuarios.usuarioActual.IdEmpresa>0) {
        this.idEmpresa=store.state.usuarios.usuarioActual.IdEmpresa
        this.eligioEmpresa(store.state.usuarios.usuarioActual.IdEmpresa)
        this.elegirEmpresa=true
    }


    // if (process.env.NODE_ENV==="development") {
    //   this.fechaDesde="2022-02-08"
    //   this.fechaHasta="2022-02-08"
    //   this.elegirEmpresa=true
    //   this.idEmpresa=57
    // }
},
}
</script>