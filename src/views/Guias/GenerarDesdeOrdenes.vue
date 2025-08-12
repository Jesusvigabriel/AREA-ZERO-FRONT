<template>
  <v-container>
    <v-row justify="center">
      <v-col class="py-3" cols="2" align="start">
          <v-checkbox @click="clickEnElegirEmpresa()" label="Una empresa" v-model="elegirEmpresa" class="py-0 my-0"></v-checkbox>
      </v-col>
      <v-col cols="4" v-show="elegirEmpresa">
        <SelectorEmpresa @eligioEmpresa="eligioEmpresa($event)"  ></SelectorEmpresa>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="3">
        <v-text-field @change="popularListaDeOrdenes()" prepend-inner-icon="mdi-calendar" type="date" label="Desde" v-model="fechaDesde" dense></v-text-field>
      </v-col>
      <v-col  cols="3">
        <v-text-field @change="popularListaDeOrdenes()" prepend-inner-icon="mdi-calendar" type="date" label="Hasta" v-model="fechaHasta" dense></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="ordenesSeleccionadas.length>0 && ordenesAProcesar.length==0">
        <v-btn @click="preprocesarOrdenesSeleccionadas" color="blue" block dark>Pre-procesar órdenes seleccionadas</v-btn>
      </v-col>
      <v-col v-if="ordenesSeleccionadas.length>0 && ordenesAProcesar.length==0">
        <v-btn @click="excelHojaDeRuta" color="green" block dark>Generar Hoja de ruta</v-btn>
      </v-col>
    </v-row>
    <v-row v-if="ordenesFiltradas.length>0 && ordenesAProcesar.length==0" class="pb-0 mb-0">
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
    <v-row v-else>
      <v-col>
        <v-alert color="orange" class="py-3 my-1" dark>No hay órdenes disponibles</v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="py-0" v-if="ordenesFiltradas.length>0 && ordenesAProcesar.length==0">
        <v-data-table 
          v-model="ordenesSeleccionadas"
          :headers="cabeceras" 
          :singleSelect=false
          item-key="Id"
          :search="textoBusqueda"
          show-select
          :items="ordenesFiltradas"  
          :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
          :items-per-page="30" 
          class="elevation-3" 
        >
        </v-data-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="ordenesSeleccionadas.length>0 && ordenesAProcesar.length==0">
        <v-btn @click="preprocesarOrdenesSeleccionadas" color="blue" block dark>Pre-procesar órdenes seleccionadas</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="ordenesSeleccionadas.length>0 && ordenesAProcesar.length==0">
        <v-btn @click="marcarComoRetiraCliente" color="orange" block dark>Marcar como 'RetiraCliente' órdenes seleccionadas</v-btn>
      </v-col>
      <v-col cols="3" v-if="ordenesSeleccionadas.length>0 && ordenesAProcesar.length==0">
        <v-text-field prepend-inner-icon="mdi-calendar" type="date" label="Fecha" v-model="fechaMarcarComoRetiraCliente" dense></v-text-field>
      </v-col>
    </v-row>
    <v-row class="py-2">
      <v-col class="py-0" v-if="ordenesAProcesar.length>0">
        <v-data-table 
          v-model="ordenesAProcesarSeleccionadas"
          :headers="cabecerasAProcesar" 
          :items="ordenesAProcesar"  
          :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
          :items-per-page="30" 
          item-key="Id"
          show-select
          class="elevation-3" 
          ref="ordenesAProcesar"
        >
          <template v-slot:item.Registracion="{item}">
            <v-icon @click="clickEnEstadoRegistracion(item)" :color="getColorIconoRegistracion(item)">{{getIconoRegistracion(item)}}</v-icon>
          </template>
          <template v-slot:item.EsCRR="{item}">
            <v-icon @click="clickEnEsCRR(item)" color="green">{{getIconoEsCRR(item)}}</v-icon>
          </template>
          <template v-slot:item.AccionesTipo="{item}">
            <v-row>
              <v-col>
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn :color="item.TipoEntrega=='Seleccione' ? 'orange' : 'green'" dark v-bind="attrs" v-on="on">{{item.TipoEntrega}}</v-btn>
                  </template>
                  <v-list>
                    <v-list-item v-for="(unTipoEntrega, index) in tiposEntregaActivos"  :key="index">
                      <v-list-item-title @click="clickSeleccionTipoEntrega(item, unTipoEntrega)">{{ unTipoEntrega }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>
            <v-row v-if="item.TipoEntrega=='EntregaRegularEspecial'">
              <v-col>
                <v-text-field label="Importe manual" type="number" v-model="item.ImporteManual" ></v-text-field>
              </v-col>
            </v-row>
          </template>
          <template v-slot:item.AccionesFecha="{item}">
            <v-row>
              <v-col>
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn :color="item.FechaEntrega=='Seleccione' ? 'orange' : 'green'" dark v-bind="attrs" v-on="on">{{item.FechaEntrega}}</v-btn>
                  </template>
                  <v-list>
                    <v-list-item v-for="(unaFechaEntrega, index) in fechasEntrega"  :key="index">
                      <v-list-item-title @click="clickSeleccionFechaEntrega(item, unaFechaEntrega)">{{ unaFechaEntrega }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>
            <v-row v-if="item.FechaEntrega=='Específica'">
              <v-col>
                <v-text-field label="Fecha" type="date" v-model="item.FechaEntrega" ></v-text-field>
              </v-col>
            </v-row>
          </template>
          <template v-slot:item.AccionesValorizacion="{item}">
            <v-row>
              <v-col>
                <v-btn color="blue" dark @click="calcularValorizacion(item, true)"><v-icon>mdi-calculator</v-icon></v-btn>
              </v-col>
            </v-row>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="mostrarBotonProcesamiento && ordenesAProcesarSeleccionadas.length>0">
        <v-btn @click="procesarOrdenesSeleccionadas" color="blue" block dark>Procesar órdenes seleccionadas</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="ordenesAProcesar.length>0 && ordenesAProcesarSeleccionadas.length>0">
        <v-btn @click="descartarOrdenesSeleccionadas" color="red" block dark>Descartar procesamiento de las órdenes seleccionadas</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="ordenesAProcesar.length>0">
        <v-btn @click="reiniciarProceso" color="orange" block dark>Reiniciar proceso</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import guias from "../../store/guias"
import store from "../../store"
import ordenes from "@/store/ordenesV3"
import empresas from "@/store/empresasV3"
import destinos from "@/store/destinos"
import {xlsx, read, utils} from 'xlsx'
import SelectorEmpresa from '@/components/SelectorEmpresa.vue'
import fechas from 'vue-lsi-util/fechas'
import excel from "exceljs"
import {saveAs} from "file-saver"
import emailTemplates from '@/store/emailTemplates'


export default {
  name: "GuiasGenerar",

  components: {
      SelectorEmpresa
  },

  data() {
    return {
      ordenes: [],
      ordenesFiltradas: [],
      ordenesSeleccionadas: [],
      ordenesAProcesar: [],
      ordenesAProcesarSeleccionadas: [],
      configuracionEmpresaSeleccionada: {},
      tiposEntregaActivos: [],
      textoBusqueda: '',
      elegirEmpresa: true,
      idEmpresa: -1,
      fechaDesde: '2021-11-01',
      fechaHasta: '2021-11-01',
      fechaMarcarComoRetiraCliente: '2021-12-01',
      tiposEntrega: ["EntregaRegularHD", "EntregaRegularB2B", "EntregaRegularSupermercado", "EntregaRegularCND", "EntregaRegularRendiciones", "EntregaEspecial"],
      fechasEntrega: ["48 hs", "Específica"],
      cabeceras: [
        {text: 'Empresa', value: 'Empresa.Nombre'},
        {text: 'Número', value: 'Numero'},
        {text: 'Fecha', value: 'Fecha'},
        {text: 'Observaciones', value: 'Observaciones'},
      ],
      cabecerasAProcesar: [
        {text: 'Empresa', value: 'Empresa.Nombre'},
        {text: 'Número', value: 'Numero'},
        {text: 'Observaciones', value: 'Observaciones'},
        {text: 'Tipo', value: 'AccionesTipo'},
        {text: 'Fecha', value: 'AccionesFecha'},
        {text: 'Valorización', value: 'AccionesValorizacion'},
        {text: 'Es CRR', value: 'EsCRR'},
        {text: 'Guia', value: 'Guia'},
        {text: 'Total', value: 'Total'},
        {text: 'Reg.', value: 'Registracion'},
      ],
      mostrarBotonProcesamiento: false,
      mostrarBotonDescartamiento: false,
      emailPrompt: ''
    }
  },

  methods: {
    async excelHojaDeRuta() {

      const workbook=new excel.Workbook()
      const worksheet=workbook.addWorksheet("HojaDeRuta")

      // worksheet.getRow(1).values=[`Detalle de la posición ${item.Nombre}`]
      
      worksheet.columns=[
          {width: 30}, 
          {width: 60},
          {width: 50},
          {width: 50},
          {width: 15},
          {width: 15},
          {width: 15},
      ]

      worksheet.mergeCells("A1:G1")
      worksheet.getCell('A1').value='Hoja de ruta de retiro de mercadería de Nave 2'
      worksheet.getCell('A1').alignment = { horizontal:'center'} ;

      worksheet.getCell('A2').value='Retira Chofer: ______________________________________'
      worksheet.getCell('D2').value='Fecha de retiro: __/__/____'
      worksheet.getCell('F2').value='Horario: __________'

      worksheet.getCell('A3').value='Persona que controla y carga el vehículo en nave 2: ______________________________________'
      worksheet.getCell('D3').value='Persona que descarga y controla el vehículo en nave 1: ______________________________________'

      let renglon=5
      worksheet.getRow(renglon).values=['Remitos', 'Cliente', 'Destino', 'Localidad', 'CP', 'Bultos', 'Observaciones en instancia de carga o descarga']
      worksheet.views = [{state: 'frozen', ySplit: renglon}]
      // worksheet.autoFilter = `A${renglon}:H${renglon}`

      for (const unaOrden of this.ordenesSeleccionadas) {
        let destino
        try {
          destino=await destinos.getOneById(unaOrden.Eventual)
        } catch (error) {
          destino={}
        }
        renglon++
        worksheet.getRow(renglon).values=[
            unaOrden.Numero,
            unaOrden.Empresa.Nombre,
            destino.Nombre,
            destino.Localidad,
            destino.CodigoPostal,
            unaOrden.Bultos
        ]
      }

      renglon++
      const columnasASumar=["F"]
      for (const unaColumna of columnasASumar) {
          const celdaSuma=worksheet.getCell(`${unaColumna}${renglon}`)
          celdaSuma.value={formula: `SUM(${unaColumna}1:${unaColumna}${renglon-1})`}
          celdaSuma.font={bold: true}
      }

      worksheet.eachRow ( (row, rowNumber) => {
          row.eachCell ( (cell, colNumber) => {
              if (rowNumber===5 || rowNumber==renglon) {
                  cell.font={size: 16, bold: true}
              } else {
                  cell.font={size: 14}
              }
          })
      } )

      worksheet.getCell('A1').font={size: 26, bold: true}
      for (const unaColuma of ['A', 'B', 'C', 'D', 'E', 'F']){
        for (const unaFila of [2, 3]) {
          worksheet.getCell(`${unaColuma}${unaFila}`).font={size: 20, bold: true}
        }
      }

      const buf=await workbook.xlsx.writeBuffer()
      saveAs(new Blob([buf]), `HojaDeRuta.xlsx`)


    },
    clickEnElegirEmpresa() {
      if (!this.elegirEmpresa) {
        this.idEmpresa=-1
      }
      this.popularListaDeOrdenes()
      this.filtrarOrdenes()
    },
    eligioEmpresa(idEmpresa) {
      this.idEmpresa=idEmpresa;
      //revisa la configuracion para cargar la lista de tipos de guia
      empresas.getConfiguracion(this.idEmpresa)
        .then(response => {
          this.configuracionEmpresaSeleccionada=response
          const tiposEntregaActivos=[]
          //Verifico para cada tipo de entrega si tiene al menos uno de sus conceptos activo.
          for (const unTipoEntrega of this.tiposEntrega) {
            let algoActivo=false
            for (const unaConfiguracion of Object.entries(this.configuracionEmpresaSeleccionada)) {
              if (unaConfiguracion[0].includes(unTipoEntrega)) {
                const estaActiva=unaConfiguracion[1].split("|")[3]
                if (estaActiva=="true") {
                  algoActivo=true
                }
              }
            }
            if (algoActivo) {
              tiposEntregaActivos.push(unTipoEntrega)
            }
          }
          this.tiposEntregaActivos=tiposEntregaActivos
          if (tiposEntregaActivos.length==0) {
            this.mostrarError("La empresa seleccionada no tiene ningún tipo de entrega habilitado")
            this.idEmpresa=null
          }
        })
        .catch(error => {
          this.mostrarError(error)
        })
      // this.popularListaDeOrdenes()
      this.popularListaDeOrdenesByIdEmpresa()
      this.filtrarOrdenes()
    },
    filtrarOrdenes() {
      this.ordenesFiltradas=this.ordenes.filter(e=>e.Empresa.Id===(this.idEmpresa===-1 ? e.Empresa.Id : this.idEmpresa) && e.Fecha>=this.fechaDesde && e.Fecha<=this.fechaHasta   )
    },
    clickEnEsCRR(item) {
      item.EsCRR = !item.EsCRR
      this.refrescarListaOrdenesAProcesar()
    },
    getIconoEsCRR(item) {
      return item.EsCRR ? "mdi-checkbox-marked-circle-outline" : "mdi-checkbox-blank-circle-outline"
    },
    clickEnEstadoRegistracion(item) {
      if (item.registracion) {
        this.mostrarMensaje("Id de la guía creada: "+item.IdNuevaGuia, "Registración exitosa")
      } else {
        this.mostrarMensaje("Error en registración", "Registración fallida")
      }
    },
    getIconoRegistracion(item) {
      if (typeof item.registracion=="undefined") {
        return "mdi-cloud-question"
      } else {
        if (item.registracion) {
          return "mdi-checkbox-marked-circle-outline"
        } else {
          return "mdi-checkbox-blank-circle-outline"
        }
      }
    },
    getColorIconoRegistracion(item) {
      if (typeof item.registracion=="undefined") {
        return "blue"
      } else {
        if (item.registracion) {
          return "green"
        } else {
          return "red"
        }
      }
    },
    descartarOrdenesSeleccionadas() {
      if (this.ordenesAProcesarSeleccionadas.length==0) {
        this.mostrarError("No se ha seleccionado ninguna orden para descartar")
        return
      }
      for (const unaOrdenADescartar of this.ordenesAProcesarSeleccionadas) {
        this.ordenesAProcesar=this.ordenesAProcesar.filter(e => e.Id != unaOrdenADescartar.Id)
      }
      this.ordenesAProcesarSeleccionadas=[]
      this.todosLosDatosCompletos()
      
    },
    procesarOrdenesSeleccionadas() {
      if (this.ordenesAProcesarSeleccionadas.length==0) {
        this.mostrarError("No se ha seleccionado ninguna orden para procesar")
        return
      }
      const pregunta={
        titulo: "Confirma el procesamiento?", 
        mensaje: "Confirma el procesamiento de las órdenes seleccionadas y la generación de sus guías?", 
        botonPrimario: "Si", 
        botonSecundario: "No",
        callback: response => {
          if (response=="Si") {
            this.registrarCreacionDeGuias()
          }
        }
      }
      store.dispatch("alertDialog/mostrar", pregunta)
    },
    async registrarCreacionDeGuias() {
      let guiasGeneradas='<ul>'
      const idsGuiasGeneradas=[]
      for (const unaOrden of this.ordenesAProcesarSeleccionadas) {
  console.log('[PROCESO] Procesando orden:', unaOrden.Id)
  console.log('[PROCESO] Payload para crearDesdeOrden:', {
    Id: unaOrden.Id,
    DetalleCalculo: unaOrden.DetalleCalculo ? unaOrden.DetalleCalculo.Calculo : null,
    EsCRR: unaOrden.EsCRR
  })
        try {
          const response = await guias.crearDesdeOrden(unaOrden.Id, unaOrden.DetalleCalculo.Calculo, unaOrden.EsCRR)
console.log('[PROCESO] Respuesta de crearDesdeOrden:', response)
          guiasGeneradas += "<li>"+response.Id
          idsGuiasGeneradas.push(response.Id)
          unaOrden.registracion=true
          unaOrden.IdNuevaGuia=response.Id

          // Si la empresa usa PART y remitos se crean automáticamente,
          // generamos el remito y abrimos su PDF
          if (unaOrden.Empresa && unaOrden.Empresa.PART &&
             (typeof unaOrden.Empresa.UsaRemitos === 'undefined' || unaOrden.Empresa.UsaRemitos)) {
  console.log('[PROCESO] Intentando crear remito para orden:', unaOrden.Id)
            try {
              const remito = await store.dispatch('remitos/crearFromOrden', unaOrden.Id)
console.log('[PROCESO] Respuesta de crearFromOrden:', remito)
if (remito && remito.Id) {
  console.log('[PROCESO] Remito generado, abriendo PDF:', remito.Id)
  window.open(`${process.env.VUE_APP_API_URL}/remitos/${remito.Id}/pdf`, '_blank')
  const remitente = prompt(this.emailPrompt || 'Ingrese email del remitente')
  if (remitente) {
    try {
      await store.dispatch('remitos/enviarMail', { IdRemito: remito.Id, Remitente: remitente })
    } catch (e) {
      store.dispatch('snackbar/mostrar', 'Error al enviar mail')
    }
  }
} else {
  console.warn('[PROCESO] No se generó remito para la orden:', unaOrden.Id)
}
            } catch (e) {
              // aviso opcional si falla la generaci\xC3\xB3n del remito
              store.dispatch('snackbar/mostrar', 'Error al crear remito')
            }
          }
console.log('[PROCESO] Fin de procesamiento de orden:', unaOrden.Id)

        } catch (error) {
  console.error('[PROCESO] Error procesando orden:', unaOrden.Id, error)
  unaOrden.registracion=false
} finally {
  console.log('[PROCESO] Fin de procesamiento de orden:', unaOrden.Id)
}
        this.refrescarListaOrdenesAProcesar()
      }
      guiasGeneradas += "</ul>"
      this.mostrarMensaje("Se han generado exitosamente las siguientes guías:<br><br>"+guiasGeneradas, "Guías generadas")
      const guiasAImprimir=[]
      for (const unaId of idsGuiasGeneradas) {
        const guia=await guias.getById(Number(unaId))
        guiasAImprimir.push(guia)
      } 
      guias.imprimirStickers(guiasAImprimir)

      //this.reiniciarProceso()

    },
    reiniciarProceso() {
      this.ordenesSeleccionadas=[]
      this.ordenesAProcesar=[]
      this.mostrarBotonProcesamiento=false
      this.mostrarBotonDescartamiento=false
      if(this.idEmpresa > 0){
        this.popularListaDeOrdenesByIdEmpresa()
      } else {
        this.popularListaDeOrdenes()
      }
    },
    marcarComoRetiraCliente() {
      const pregunta={
        titulo: "Confirma la registración?", 
        mensaje: "Confirma la registración de las órdenes seleccionadas como 'RetiraCliente'?", 
        botonPrimario: "Si", 
        botonSecundario: "No",
        callback: async response => {
          if (response=="Si") {
            for (const unaOrden of this.ordenesSeleccionadas) {
              try {
                await ordenes.marcarRetiraCliente(unaOrden.Id, this.fechaMarcarComoRetiraCliente)
              } catch (e) {
                store.dispatch('snackbar/mostrar', 'Error al obtener la orden')
              }
            }
            this.ordenesSeleccionadas=[]
            this.popularListaDeOrdenes()
          }
        }
      }
      store.dispatch("alertDialog/mostrar", pregunta)
    },
    refrescarListaOrdenesAProcesar() {
      this.ordenesAProcesar = this.ordenesAProcesar.map(e => e)
      this.ordenesAProcesarSeleccionadas = this.ordenesAProcesarSeleccionadas.map(e => e)
    },
    calcularValorizacion(item, mostrarResultado=false) {
      if (item.TipoEntrega=="Seleccione") {
        this.mostrarError("Debe seleccionar el tipo de entrega")
        return
      }
      if (item.TipoEntrega=="Especial" && item.ImporteManual==0) {
        this.mostrarError("Debe ingresar el importe manual para entrega especial")
        return
      }
      if (item.FechaEntrega=="Seleccione") {
        this.mostrarError("Debe seleccionar la fecha de entrega")
        return
      }
      if (item.FechaEntrega=="Específica") {
        this.mostrarError("Debe ingresa la fecha de entrega específica")
        return
      }

      guias.calcularValorizacion(item.Id, item.TipoEntrega)
        .then(response => { 
          let mensaje=""
          let total=0
          let guia=0

          if(response.Calculo.length>0){
            
          for (const unCalculo of response.Calculo) {
            unCalculo.Concepto=item.TipoEntrega+unCalculo.Concepto

            mensaje += `Concepto: <b>${unCalculo.Concepto}</b>`
            mensaje += "<br>"
            mensaje += `Valor configurado: <b>${unCalculo.ValorConfigurado}</b>`
            mensaje += "<br>"
            mensaje += `Variable: <b>${unCalculo.VariableConfigurada}</b>`
            mensaje += "<br>"
            mensaje += `Valor base de cálculo: <b>${unCalculo.ValorBase}</b>`
            mensaje += "<br>"
            mensaje += `Mínimo configurado: <b>${unCalculo.MinimoConfigurado}</b>`
            mensaje += "<br>"

            if (isNaN(unCalculo.Total)) {
              mensaje += unCalculo.Mensaje
            } else {
              mensaje += `Subtotal: <b>${unCalculo.Total}</b>`
              total += Number(unCalculo.Total)

              // if (unCalculo.Concepto.toUpperCase()=="Guia".toUpperCase()) {
              if (unCalculo.Concepto.includes("Guia")) {
                guia=unCalculo.Total
              }
            }
            mensaje += "<br><br>"
          }
          mensaje += `<h4>Total: <b>${total}</b></h4>`
          item.Guia=guia
          item.Total=total
          item.DetalleCalculo=response
          
          this.refrescarListaOrdenesAProcesar()
          this.todosLosDatosCompletos()
          if (mostrarResultado) {
            this.mostrarMensaje(mensaje)
          }
        }else{
          this.mostrarError("Error en la Valorizacion")
          return false
        }

        })
        .catch(error => { 
          console.log("Error", error) 
          this.mostrarError(error)
          
        })
    },
    todosLosDatosCompletos() {
      let todosLosDatosCompletos=true
      this.ordenesAProcesar.forEach(element => {        
        if (typeof element.DetalleCalculo=="undefined") {
          todosLosDatosCompletos=false
        }
      })
      this.mostrarBotonProcesamiento=todosLosDatosCompletos
    },
    clickSeleccionTipoEntrega(item, tipo) {
      item.TipoEntrega=tipo
      this.calcularValorizacion(item, false)
      this.refrescarListaOrdenesAProcesar()
      this.todosLosDatosCompletos()
    },
    clickSeleccionFechaEntrega(item, tipo) {
      item.FechaEntrega=tipo
      this.refrescarListaOrdenesAProcesar()
      this.todosLosDatosCompletos()
    },
    async preprocesarOrdenesSeleccionadas() {
      this.ordenesAProcesar = this.ordenesSeleccionadas.map( e => e)

      // const ordenes=this.ordenesSeleccionadas.map( e => e)
      // let posicionPrincipal=0
      // while (posicionPrincipal<ordenes.length-1) {
      //   let posicionSecundaria=posicionPrincipal+1
      //   while (posicionSecundaria<ordenes.length) {
      //     if (ordenes[posicionPrincipal].IdEmpresa===ordenes[posicionSecundaria].IdEmpresa && ordenes[posicionPrincipal].Eventual===ordenes[posicionSecundaria].Eventual) {
      //       ordenes[posicionPrincipal].Numero += "/"+ordenes[posicionSecundaria].Numero
      //       ordenes.splice(posicionSecundaria, 1)
      //     } else {
      //       posicionSecundaria++
      //     }
      //   }

      //   posicionPrincipal++
      // }
      // this.ordenesAProcesar=ordenes

      const configuraciones=[]
      for (const element of this.ordenesAProcesar) {
        element.TipoEntrega="Seleccione"
        element.ImporteManual=0
        element.FechaEntrega="48 hs"
        element.Total=0
        element.EsCRR=false
      }

      for (const element of this.ordenesAProcesar) {
        //Me fijo si la configuracion de la empresa ya la tengo guardada
        const configuracionDeLaEmpresa=configuraciones.filter(e => e.IdEmpresa==element.IdEmpresa)

        if (configuracionDeLaEmpresa.length==0) {
          try {
            const response=await empresas.getConfiguracion(element.IdEmpresa)
            configuraciones.push(response)
          } catch (error) {
            console.log(error);
          }
        }
      }


      for (const unaConfiguracionEmpresa of configuraciones) {

        let predeterminado="Seleccione"
        for (const unaConfiguracion of Object.entries(unaConfiguracionEmpresa)) {
          if (unaConfiguracion[0].includes("EntregaRegular")) {
            const unaConfiguracionDetallada=unaConfiguracion[1].split("|")
            if (unaConfiguracionDetallada[4]=="true") {
              predeterminado=unaConfiguracion[0]
            }
          }
        }

        const cualTipoPredeterminado=this.tiposEntrega.filter(e => predeterminado.includes(e))
        if (cualTipoPredeterminado.length==1) {
          const ordenesDeLaEmpresa = this.ordenesAProcesar.filter ( e => e.IdEmpresa==unaConfiguracionEmpresa.IdEmpresa)
          ordenesDeLaEmpresa.forEach(element => {
            element.TipoEntrega=cualTipoPredeterminado[0]
          });
        }              
      }

      for (const element of this.ordenesAProcesar) {
        this.calcularValorizacion(element, false)
      }

      this.refrescarListaOrdenesAProcesar()
    },
    async popularListaDeOrdenes() {
      try {
        console.log('[DEBUG] Llamando a: getPreparadasNoGuias')
const response = await ordenes.getPreparadasNoGuias()
console.log('[DEBUG] Respuesta getPreparadasNoGuias:', response)
        response.forEach(element => {
          element.Fecha = element.Fecha.substr(0, 10)
        })
        response.sort((a, b) => a.Fecha > b.Fecha ? -1 : 1)
        this.ordenes = response
        this.filtrarOrdenes()
      } catch (e) {
        store.dispatch('snackbar/mostrar', 'Error al obtener la orden')
      }
    },

    async popularListaDeOrdenesByIdEmpresa() {
      try {
        console.log(`[DEBUG] Llamando a: getPreparadasNoGuiasByIdEmpresa con idEmpresa = ${this.idEmpresa}`)
const response = await ordenes.getPreparadasNoGuiasByIdEmpresa(this.idEmpresa)
console.log('[DEBUG] Respuesta getPreparadasNoGuiasByIdEmpresa:', response)
        response.forEach(element => {
          element.Fecha = element.Fecha.substr(0, 10)
        })
        response.sort((a, b) => a.Fecha > b.Fecha ? -1 : 1)
        this.ordenes = response
        this.filtrarOrdenes()
      } catch (e) {
        store.dispatch('snackbar/mostrar', 'Error al obtener la orden')
      }
    },
    mostrarMensaje(mensaje, titulo) {
      store.dispatch("alertDialog/mostrar", {titulo, mensaje, botonPrimario: "Entendido"})
    },
    mostrarError(mensaje) {
      store.dispatch("snackbar/mostrar", mensaje)
    }
  },

  created() {
    this.fechaDesde=fechas.dateToString(fechas.getSumarDiasFecha(-6))
    this.fechaHasta=fechas.dateToString(fechas.getSumarDiasFecha(0))
    this.fechaMarcarComoRetiraCliente=fechas.dateToString(fechas.getSumarDiasFecha(0))
    store.dispatch('empresas/cargarListaEmpresas', 'SoloActivas')
    // this.popularListaDeOrdenes()
    emailTemplates.getByCode('ENVIAR_REMITO').then(t => {
      if (t && t.length) this.emailPrompt = t[0].Cuerpo
    })
  },
}
</script>