<template>
  <v-container>
    <v-row >
        <v-col align="end">
            <v-btn class="action-button" @click="crearPosicion()">Crear nueva posición</v-btn>
          </v-col>
            <v-col >
            <v-btn class="action-button" @click="imprimirListaEtiquetas()">Imprimir lista etiquetas</v-btn>
        </v-col>
    </v-row>
    <v-row justify="center" >
            <v-col cols="12" md="8" lg="6">
                <v-file-input
                label="Planilla a procesar"
                @change="fileOnChange"
                accept=".xlsx"
                filled
                >
                  <span>Planilla a procesar</span>
                </v-file-input>
            </v-col>
    </v-row>
    <v-row v-show="listaPosiciones.length>0" class="pb-0 mb-0" justify="center">
        <v-col cols="12" md="8" lg="6" class="py-0 my-0"  >
          <v-card-title class="py-1 my-0 justify-center">
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
    <v-row  justify="center">
      <v-col cols="12" md="8" lg="6" v-if="listaPosiciones.length>0">
        <v-data-table
            :headers="cabecerasPosiciones"
            :items="listaPosiciones"
            :footer-props="{itemsPerPageOptions:[15,30,-1]}"   
            :items-per-page="15" 
            :search="textoBusqueda"
            class="elevation-3" 
        >
        <template v-slot:item.Estado="{item}">
          <div class="acciones-flex">
            <v-chip dark :color="getColorIconoEstado(item)" @click="clickEnVerContenido(item)"><v-icon>{{getIconoEstado(item)}}</v-icon></v-chip>
            <v-chip dark color="error" @click="clickEnEliminarPosicion(item)" class="mx-1"><v-icon>mdi-delete-outline</v-icon></v-chip>
            <v-chip dark color="success" @click="imprimirSticker(item)" class="mx-1"><v-icon>mdi-sticker-text-outline</v-icon></v-chip>
          </div>
        </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-dialog v-model="mostrarVentanaEdicion" persistent max-width="800px">
      <v-card class="rounded-card">
          <v-card-title>
              <span class="text-h5">Creación de nueva posición</span>
          </v-card-title>
          <v-card-text>
              <v-form >
                  <v-container>
                      <v-row>
                          <v-col>
                              <v-text-field label="Nombre" v-model="nombreNuevaPosicion"></v-text-field>
                          </v-col>
                      </v-row>
                  </v-container>
              </v-form>
          </v-card-text>
          <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="cancelarEdicion()">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="confirmarEdicion()">Guardar</v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="mostrarDetallePosiciones" persistent max-width="1000px">
      <v-card class="rounded-card">
          <v-card-title>
              <span class="text-h5">Contenido de la posición {{detallePosicionesPosicion}}</span>
          </v-card-title>
          <v-col class="py-0" v-if="detallePosicionesPosicion=='Area54-Nave1' || detallePosicionesPosicion=='zonacero' || detallePosicionesPosicion=='Itsa' ">
            <v-btn @click="actualizaFechaPosicion(detallePosicionesContenido)"  block color="blue" dark>Actualizar Fecha</v-btn>
          </v-col>
          <v-spacer></v-spacer>
          <v-card-text>
            <v-data-table 
                :headers="cabecerasDetallePosiciones" 
                :items="detallePosicionesContenido"
                class="elevation-3" 
            >
              <template v-slot:item.Acciones="{item}">
                <v-chip dark color="error" @click="clickEnVaciarItemDePosicion(item)"><v-icon>mdi-delete-outline</v-icon></v-chip>
              </template>
            </v-data-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue" text @click="exportarContenidoAExcel()">Exportar a Excel</v-btn>
            <v-btn color="success" text @click="cerrarDetallePosiciones()">Cerrar</v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="mostrarResultadoCreacionMasiva" persistent max-width="1000px">
      <v-card class="rounded-card">
          <v-card-title>
              <span class="text-h5">Proceso finalizado</span>
          </v-card-title>
          <v-spacer></v-spacer>
          <v-card-text>
            <v-data-table 
                :headers="cabecerasPosicionesCreadas" 
                :items="listaPosicionesExcel"
                class="elevation-3" 
            >
            </v-data-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success" text @click="cerrarResultadoPosiciones()">Cerrar</v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>

import store from '@/store'
import posiciones from '@/store/posiciones'
import posicion from '@/store/posicionesV3'
import productos from '@/store/productosV3'
import {xlsx, read, utils} from 'xlsx'
import excel from "exceljs"
import {saveAs} from "file-saver"
import { ExcelIcon } from '@/components/icons'

export default {
  name: "VerPosiciones",

  data() {
    return {
      mostrarDetallePosiciones: false,
      mostrarResultadoCreacionMasiva: false,
      detallePosicionesPosicion: '',
      detallePosicionesContenido: [],
      listaPosicionesExcel: [],
      posicionSeleccionada: {},
      nombreNuevaPosicion: '',
      mostrarVentanaEdicion: false,
      listaPosiciones: [],
      cabecerasPosiciones: [
          {text: 'Posición', value: 'Nombre', sortable: true},
          {text: 'Fecha inventario', value: 'FechaInventario', sortable: true},
          {text: 'Usuario', value: 'UsuarioInventario', sortable: true},
          {text: '', value: 'Estado', sortable: true, width: '140px'},
      ],
      cabecerasDetallePosiciones: [
          {text: 'Id', value: 'IdProducto'},
          {text: 'Nombre', value: 'NombreProducto'},
          {text: 'Barcode', value: 'BarcodeProducto'},
          {text: 'Unidades', value: 'Unidades'},
          {text: 'Fecha', value: 'Fecha'},
          {text: '', value: 'Acciones'},
      ],
      cabecerasPosicionesCreadas: [
        {text: 'Posicion', value: 'posicion'},
        {text: 'Estado', value: 'estado'},
      ],      
      textoBusqueda: '',
      fechaMayor: null
    }
  },

  methods: {

    actualizaFechaPosicion(items){

      this.fechaMayor = '2030-01-01 16:11:11'
      this.editFechaPosicion(items[0].posicionId,this.fechaMayor)
      
    },

    clickEnVaciarItemDePosicion(item) {

      const textoPrimario="Si, desposicionar el item"
      const textoSecundario="Cancelar"
      const ad={
        titulo: 'Confirma el desposicionado del item seleccionado?',
        mensaje: 'Este proceso es <b>irreversible</b>;;Está <u>completamente seguro?</u>',
        botonPrimario: textoPrimario,
        botonSecundario: textoSecundario,
        callback: ((respuesta) => {
          if (respuesta===textoPrimario) {
            this.VaciarItemDePosicionConfirmado(this.posicionSeleccionada, item)
          }
        })
      }
      store.dispatch("alertDialog/mostrar", ad)
    },
    async VaciarItemDePosicionConfirmado(posicion, item) {
      try {
        const result=await productos.registrarDesposicionamiento(item.IdProducto, posicion.Id, item.Unidades)
      } catch (error) {
        console.log("Error", error)
      }
      this.mostrarDetallePosiciones=false
      await this.popularListaPosiciones()

    },    
    cerrarDetallePosiciones() {
      this.mostrarDetallePosiciones=false
      this.detallePosicionesContenido=[]
    },    
    cerrarResultadoPosiciones(){
      this.mostrarResultadoCreacionMasiva=false
      this.listaPosicionesExcel=[]
    },

    clickEnEliminarPosicion(item) {
      console.log('>> clickEnEliminarPosicion:', item.Id);
      const textoPrimario="Si, borrarla"
      const textoSecundario="No borrarla"
      const ad={
        titulo: 'Confirma la eliminación de la posición seleccionada?',
        mensaje: 'Este proceso es <b>irreversible</b>;;Está <u>completamente seguro?</u>',
        botonPrimario: textoPrimario,
        botonSecundario: textoSecundario,
        callback: ((respuesta) => {
          if (respuesta===textoPrimario) {
            this.eliminarPosicion(item)
          }
        })
      }
      console.log('>> dispatch alertDialog/mostrar con payload:', ad);
      store.dispatch("alertDialog/mostrar", ad)
    },
    async eliminarPosicion(item) {
      console.log("Item a eliminar", item.Id)

      try {

        const contenidoPosicion = await posiciones.getContent(item.Id)
        //console.log(contenidoPosicion)
        if(contenidoPosicion.length>0){
          this.mostrarMensaje("Ha ocurrido un error", "Debe vaciar la posicion antes de Eliminarla")
        }else{
          const result=await posiciones.eliminar(item.Id)
        }
        
        this.popularListaPosiciones()
      } catch (error) {
        console.log("Error", error)
      }
    },
    crearPosicion() {
      this.nombreNuevaPosicion=''
      this.mostrarVentanaEdicion=true
    },
    cancelarEdicion() {
      this.mostrarVentanaEdicion=false
    },
    async confirmarEdicion() {
      if (this.nombreNuevaPosicion!=='') {
        try {
          const result=await posiciones.nueva(this.nombreNuevaPosicion)
          // console.log(result)
          this.popularListaPosiciones()
        } catch (error) {
          console.log("Error", error)
          this.mostrarMensaje("Ha ocurrido un error", error)
        }
      } else {
        this.mostrarMensaje("Ha ocurrido un error", "El nombre de la nueva posición no puede estar vacío")
      }


      this.mostrarVentanaEdicion=false
    },

    async clickEnVerContenido(item) {
      try {
        const result=await posiciones.getContent(item.Id)
        let contenido
        if (result.length>0) {
          contenido='<table border="0" width="80%"><th>Id<th>Descripción<th>Barcode<th>Unidades'
          let totalUnidades=0
          this.detallePosicionesContenido=[]
          result.forEach(element => {
            contenido+="<tr>"
            contenido+="<td>"+element.IdProducto+"</td>"
            contenido+="<td>"+element.NombreProducto+"</td>"
            contenido+="<td>"+element.BarcodeProducto+"</td>"
            contenido+=`<td align="right">${element.Unidades}</td>`
            contenido+="</tr>"
            totalUnidades+=element.Unidades
            //
            this.detallePosicionesContenido.push(
              {
                posicionId: element.posicionId,
                IdProducto: element.IdProducto, 
                NombreProducto: element.NombreProducto,
                BarcodeProducto: element.BarcodeProducto,
                Unidades: element.Unidades,
                Fecha: element.Fecha!==null ? new Date(element.Fecha).toLocaleDateString() : ""
              }
            )            
          })
          contenido+=`<tr><td colspan=3 align="right">Total</td><td align="right"><b>${totalUnidades}</b></td></tr></table`
        } else {
          contenido="<img width='300' src='https://www.pngitem.com/pimgs/m/680-6805850_transparent-background-shelf-png-png-download-shelves-png.png'><h5>Nada por aquí...</h5>"
        }
        // store.dispatch("alertDialog/mostrar", {titulo: "Contenido de la posición "+item.Nombre, mensaje: contenido})

        this.detallePosicionesPosicion=item.Nombre
        this.posicionSeleccionada=item
        this.mostrarDetallePosiciones=true

        // const textoPrimario="Aceptar"
        // const textoSecundario="Imprimir el contenido"
        // const ad={
        //   titulo: "Contenido de la posición "+item.Nombre,
        //   mensaje: contenido,
        //   botonPrimario: textoPrimario,
        //   botonSecundario: textoSecundario,
        //   callback: ((respuesta) => {
        //     if (respuesta===textoSecundario) {
        //       this.exportarContenidoAExcel(item)
        //     }
        //   })
        // }
        // store.dispatch("alertDialog/mostrar", ad)

      } catch (error) {
        this.mostrarError(error)
      }
    },

    editFechaPosicion(id,fecha){
      posicion.editFechaPos_Prod(id,fecha)
                .then(respuesta => {
                    // console.log("Respuesta", respuesta);
                    //this.getAllUsuarios()
                })
                .catch(puteada => {
                    //console.log("Puteada", puteada)
                    this.mostrarError(puteada)
                })
    },

    // async exportarContenidoAExcel(item) {
    async exportarContenidoAExcel() {

        const item = this.posicionSeleccionada
        const result=await posiciones.getContent(item.Id)

        if (result.length>0) {
            const workbook=new excel.Workbook()
            const worksheet=workbook.addWorksheet(item.Nombre)

            worksheet.getRow(1).values=[`Detalle de la posición ${item.Nombre}`]
            
            worksheet.columns=[
                {width: 15}, 
                {width: 30},
                {width: 50},
                {width: 15},
            ]

            let renglon=3
            worksheet.getRow(renglon).values=['Artículo', 'Barcode', 'Nombre', 'Unidades']
            worksheet.views = [{state: 'frozen', ySplit: renglon}]
            worksheet.autoFilter = `A${renglon}:D${renglon}`


            result.forEach(e => {
                renglon++
                worksheet.getRow(renglon).values=[
                    e.IdProducto,
                    e.BarcodeProducto,
                    e.NombreProducto,
                    e.Unidades,
                ]
            })

            renglon++
            const columnasASumar=["D"]
            for (const unaColumna of columnasASumar) {
                const celdaSuma=worksheet.getCell(`${unaColumna}${renglon}`)
                celdaSuma.value={formula: `SUM(${unaColumna}1:${unaColumna}${renglon-1})`}
                celdaSuma.font={bold: true}
           }

          worksheet.eachRow ( (row, rowNumber) => {
              row.eachCell ( (cell, colNumber) => {
                  if (rowNumber===1 || rowNumber==renglon) {
                      cell.font={size: 16, bold: true}
                  } else {
                      cell.font={size: 14}
                  }
              })
          } )

          const buf=await workbook.xlsx.writeBuffer()
          saveAs(new Blob([buf]), `Detalle_Posicion_${item.Nombre}.xlsx`)




        } else {
        }



    },
    fileOnChange(archivoLeido) {
            if (archivoLeido!=null) {
                const lector=new FileReader()
                lector.onload = ev => {
                const datosCrudos = ev.target.result;
                const planillaCruda = read(datosCrudos, {type: "binary", cellDates: true, cellNF: true, cellText:true})
                const nombreHoja1=planillaCruda.SheetNames[0]
                const datosPlanilla=utils.sheet_to_json(planillaCruda.Sheets[nombreHoja1])
                this.verificarColumnasExcel(datosPlanilla)
                }

                lector.readAsBinaryString(archivoLeido)            
            }
    },
    verificarColumnasExcel(planilla) {
    let columnasObligatorias= (['Posicion'])
    let columnasFaltantes=[]
    let filaActual=1
    let tituloMostrado=false
    let mensaje=''
    planilla.forEach(unaFila => {
        filaActual++
        columnasObligatorias.forEach(unaColumnaObligatoria => {
        if (!Object.keys(unaFila).includes(unaColumnaObligatoria)) {
            if (!columnasFaltantes.includes(unaColumnaObligatoria)) {
                if (!tituloMostrado) {
                    mensaje = "Faltan las siguientes columnas:"
                    tituloMostrado=true
                }
                
                if(!filaActual){
                  mensaje += ";Fila: "+filaActual+" - Columna: "+unaColumnaObligatoria
                }
            }
        }
        })
      })
        if (tituloMostrado) {
            store.dispatch("alertDialog/mostrar", {titulo: "No se puede procesar", mensaje})
            //this.mostrarMensaje("No se puede procesar", mensaje)
        } else {
            this.procesarPlanilla(planilla)
        }
    },
    procesarPlanilla(planilla){
      const textoPrimario="Aceptar"
      const textoSecundario="Cancelar"
      const ordenDetalle={
          titulo: `Guardar ${parseInt(planilla.length)} posiciones`,
          mensaje: `continuar?`,
          botonSecundario: textoSecundario,
          botonPrimario: textoPrimario,
          callback: ((respuesta) => {
              if (respuesta===textoPrimario) {
                  for(const fila of planilla){
                    try {
                      posiciones.nueva(fila.Posicion.trim())
                      .then(result => {
                        this.listaPosicionesExcel.push({
                          posicion: result.Nombre,
                          estado: "Guardado"
                        })
                      })
                      .catch (error => {
                        let mensaje=""
                        if(error == undefined){
                          mensaje = "La posicion solo contiene espacios"
                        }else{
                          mensaje = "La posicion ya existe"
                        }
                        this.listaPosicionesExcel.push({
                          posicion: fila.Posicion,
                          estado: mensaje
                        })
                        console.log("Error", error)
                      })
                    } catch (error) {
                      console.log("Error", error)
                      this.mostrarMensaje("Ha ocurrido un error", error)
                    }
                  }
                  this.popularListaPosiciones()
                  this.mostrarResultadoCreacionMasiva = true
              }
          })
      }
      store.dispatch("alertDialog/mostrar",  ordenDetalle) 
    },

    imprimirListaEtiquetas(){
      //filtrar lista
        const listaImprimir = this.listaPosiciones.filter(e => {
        const searchText = this.textoBusqueda.toUpperCase();
        return e.Nombre.toUpperCase().includes(searchText);
      })
      
      if(listaImprimir.length != 0){
        const textoPrimario="Aceptar"
        const textoSecundario="Cancelar"
        const ordenDetalle={
            titulo: `Esta por imprimir ${parseInt(listaImprimir.length)} posiciones`,
            mensaje: `Esto puede tardar dependiendo de la cantidad, continuar?`,
            botonSecundario: textoSecundario,
            botonPrimario: textoPrimario,
            callback: ((respuesta) => {
                if (respuesta===textoPrimario) {
                  posicion.imprimirListaStickers(listaImprimir)
                  
                }
            })
        }
        store.dispatch("alertDialog/mostrar",  ordenDetalle) 
      }else{
        this.mostrarMensaje("ERROR", "Esta intentando imprimir 0 etiquetas")
      }
    },
    getColorIconoEstado(item) {
      if (item.FechaInventario!=null && item.FechaInventario!="") {
        return "success"
      } else {
        return 'warning'
      }
    },
    getIconoEstado(item) {
      return 'mdi-magnify'
    },
    async popularListaPosiciones() {
      try {
        const response=await posiciones.getAll()
        response.forEach(e => {
          e.FechaInventario = (e.FechaInventario!==null && e.FechaInventario!=="") ? new Date(e.FechaInventario).toLocaleDateString() : ""
        });
        this.listaPosiciones=response
      } catch (error) {
        this.mostrarError(error)
      }
    },
    mostrarMensaje(titulo, mensaje) {
        store.dispatch("alertDialog/mostrar", {titulo, mensaje})
    },
    mostrarError(mensaje) {
      store.dispatch("snackbar/mostrar", mensaje)
    },
    sonidoExito() {
      store.dispatch('sonidos/exito')
    },
    async imprimirSticker(item) {
      posicion.imprimirSticker(item)
    }
  },

  components: {
    ExcelIcon
  },

  created() {
    store.dispatch('actualizarTituloPrincipal', 'Ver posiciones')
    this.popularListaPosiciones()
  }

}
</script>

<style scoped>
.acciones-flex {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}
</style>