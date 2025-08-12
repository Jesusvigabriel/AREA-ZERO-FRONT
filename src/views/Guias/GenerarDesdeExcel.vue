<template>
  <v-container>

    <!-- Selector de empresa -->
    <v-row>
      <v-col>
        <SelectorEmpresa @eligioEmpresa="eligioEmpresa($event)" ></SelectorEmpresa>
      </v-col>
    </v-row>

    <!-- Selector de Excel a procesar -->
    <v-row v-if="idEmpresa != null">
      <v-col>
        <v-file-input 
          label="Planilla a procesar" 
          @change="fileOnChange" 
          accept=".xlsx"
          v-model="excelAProcesar"
          filled
          prepend-icon="mdi-microsoft-excel"
        >Importar planilla excel</v-file-input>
      </v-col>
    </v-row>

    <!-- Mensajes de estado de procesamiento -->
    <v-row v-for="(item, index) in mensajes" :key="index" class="py-0">
      <v-col class="py-0">
        <v-alert :color="item.color ?  item.color : 'success'" class="py-0 my-1" dark>{{item.texto}}</v-alert>
      </v-col>
    </v-row>

    <!-- Botón de pre-procesamiento y de generación de guías -->
    <v-row v-show="ordenesSeleccionadas.length>0">
      <v-col cols="6">
        <v-btn @click="preprocesarOrdenesSeleccionadas" color="blue" block dark>Pre-procesar órdenes seleccionadas</v-btn>
      </v-col>
      <v-col v-show="mostrarBotonGeneracionGuias">
        <v-btn @click="generarGuias" color="green" block dark>Generar guías desde las órdenes seleccionadas</v-btn>
      </v-col>
    </v-row>


    <!-- Listado de órdenes a procesar -->
    <v-row>
      <v-col class="py-0" v-if="ordenes.length>0">
        <v-data-table 
          v-model="ordenesSeleccionadas"
          :headers="cabeceras" 
          :singleSelect=false
          item-key="Id"
          show-select
          :items="ordenes"  
          :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
          :items-per-page="30" 
          class="elevation-3" 
        >
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
          <template v-slot:item.ImporteTotal="{item}">
            <v-row>
              <v-col>
                {{item.ImporteTotal ? item.ImporteTotal : "???"}}
              </v-col>
            </v-row>
          </template>
          <template v-slot:item.Desglose="{item}">
            <v-row v-if="item.ImporteTotal">
              <v-col>
                <v-btn color="blue" dark @click="mostrarDesglose(item)"><v-icon>mdi-calculator</v-icon></v-btn>                
              </v-col>
            </v-row>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>

import guias from "../../store/guias"
import store from "../../store"
import ordenes from "@/store/ordenesV3"
import empresas from "@/store/empresasV3"
import {xlsx, read, utils} from 'xlsx'
import SelectorEmpresa from '@/components/SelectorEmpresa.vue'
import fechas from 'vue-lsi-util/fechas'



export default {
  name: "GuiasGenerar",

  data() {
    return {
      mensajes: [],
      ordenes: [],
      ordenesSeleccionadas: [],
      fechasEntrega: ["48 hs", "Específica"],
      tiposEntrega: ["EntregaRegularHD", "EntregaRegularB2B", "EntregaRegularSupermercado", "EntregaRegularCND", "EntregaRegularRendiciones", "EntregaEspecial", "RecoleccionRegularHD", "RecoleccionRegularB2B", "RecoleccionRegularSupermercado", "RecoleccionRegularCND", "RecoleccionEspecial"],
      tiposEntregaActivos: [],
      idEmpresa: null,
      excelAProcesar: null,
      excelOk: true,
      configuracionEmpresaSeleccionada: {},
      cabeceras: [
        {text: 'Remitos', value: 'Remitos'},
        {text: 'Destinatario', value: 'Destinatario'},
        {text: 'Kg', value: 'Kilos'},
        {text: 'M3', value: 'M3'},
        {text: 'Bultos', value: 'Bultos'},
        {text: 'CRR', value: 'CRR'},
        {text: 'VD', value: 'ValorDeclarado'},
        {text: 'Tipo', value: 'AccionesTipo'},
        {text: 'Fecha', value: 'AccionesFecha'},
        {text: 'Flete', value: 'Flete'},
        {text: 'Importe', value: 'ImporteTotal'},
        {text: 'Desglose', value: 'Desglose'},
      ],
      mostrarBotonGeneracionGuias: false
    }
  },


  methods: {
    clickSeleccionFechaEntrega(item, tipo) {
      item.FechaEntrega=tipo
      // this.refrescarListaOrdenesAProcesar()
      // this.todosLosDatosCompletos()
    },
    generarGuias() {
      if(this.excelOk){
        const botonPrimario= "Generar las guías"
        const botonSecundario= "No generar"
        const pregunta={
          titulo: "Confirma la generación?", 
          mensaje: "Confirma la generación de las guías?", 
          botonPrimario, 
          botonSecundario,
          callback: response => {
            if (response==botonPrimario) {
              this.generarGuiasConfirmado()
            }
          }
        }
        store.dispatch("alertDialog/mostrar", pregunta)
      }else {
        this.mostrarError("Hay un error en el excel")
      }

    },
    async generarGuiasConfirmado() {
      const idsGuiasGeneradas=[]
      let guiasGeneradas="<ul>"
      for (const unaGuia of this.ordenesSeleccionadas) {
        if (unaGuia.FechaEntrega==="48 hs") {
          unaGuia.FechaEntrega=fechas.dateToString(fechas.getSumarDiasFecha(0))
        }
        // console.log(unaGuia)
        await guias.crearDesdeExcel({...unaGuia, IdEmpresa: this.idEmpresa}) 
          .then ( response => {
            idsGuiasGeneradas.push(response.Id)
            guiasGeneradas += "<li>"+response.Id
          })
          .catch ( error => {
            console.log("Error", error)
          })
      }
      guiasGeneradas += "</ul>"
      this.mostrarMensaje("Se han generado exitosamente las siguientes guías:;"+guiasGeneradas, "Generación exitosa")

      const guiasAImprimir=[]
      for (const unaId of idsGuiasGeneradas) {
        const guia=await guias.getById(Number(unaId))
        guiasAImprimir.push(guia)
      } 
      guias.imprimirStickers(guiasAImprimir)
      this.mensajes=[]
      this.ordenes=[]
      this.ordenesSeleccionadas=[]
      this.mostrarBotonGeneracionGuias=false
      this.excelAProcesar=null
    },
    mostrarDesglose(item) {
      // console.log(item);

      let mensaje=""
      let total=0
      for (const unCalculo of item.Desglose) {
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
        }
        mensaje += "<br><br>"
      }
      // console.log(mensaje);
      mensaje += `<h4>Total: <b>${total}</b></h4>`
      // item.Total=total
      this.mostrarMensaje(mensaje)

    },
    clickSeleccionTipoEntrega(item, tipo) {
      item.TipoEntrega=tipo
      if (this.ordenesSeleccionadas.filter(e=>e.Id==item.Id).length==0) {
        this.ordenesSeleccionadas.push(item)
      }
    },
    preprocesarOrdenesSeleccionadas() {
      for (const unaEntrega of this.ordenesSeleccionadas) {
        if (unaEntrega.TipoEntrega!="Seleccione") {
          unaEntrega.ImporteTotal=0
          unaEntrega.Flete=0
          let conceptosActivos

          const conceptosTodos=Object.entries(this.configuracionEmpresaSeleccionada).filter(e=>e[0].includes(unaEntrega.TipoEntrega))
          conceptosActivos=conceptosTodos.filter(e=>e[1].split('|')[3]=='true')

          const desglose=[]
          for (const unConcepto of conceptosActivos) {

            const nombreConcepto=unConcepto[0]
            const configConcepto=unConcepto[1]

            const variable=configConcepto.split('|')[0]
            const valor=Number(configConcepto.split('|')[1])
            const minimo=Number(configConcepto.split('|')[2])
            let subtotal, baseCalculo
            if (variable=="M3") {
              baseCalculo=unaEntrega.M3
              subtotal = Math.max(valor * unaEntrega.M3, minimo)
            }
            if (variable=="Kilos") {
              baseCalculo=unaEntrega.Kilos
              subtotal = Math.max(valor * unaEntrega.Kilos, minimo)
            }
            if (variable=="Bultos") {
              baseCalculo=unaEntrega.Bultos
              subtotal = Math.max(valor * unaEntrega.Bultos, minimo)
            }
            if (variable=="Unidades") {
              baseCalculo=unaEntrega.Unidades
              subtotal = Math.max(valor * unaEntrega.Unidades, minimo)
            }
            if (variable=="%VD") {
              baseCalculo=unaEntrega.ValorDeclarado
              subtotal = Math.max((valor/100) * unaEntrega.ValorDeclarado, minimo)
            }
            if (variable=="Fijo") {
              baseCalculo=valor
              subtotal = Math.max(baseCalculo, minimo)
            }

            let procesarImporte=true
            if (nombreConcepto.includes("CTR")) {
              procesarImporte = (unaEntrega.CRR>0)
            }

            if (procesarImporte)  {
              unaEntrega.ImporteTotal += Number(subtotal)
              const unDesglose={Concepto: nombreConcepto, VariableConfigurada: variable, ValorConfigurado: valor, MinimoConfigurado: minimo, ValorBase: baseCalculo, Total: subtotal.toFixed(2)}
              desglose.push(unDesglose)
  
              if (nombreConcepto.includes('Guia')) {
                unaEntrega.Flete=Number(subtotal)
              }

            }
          }
          unaEntrega.ImporteTotal = unaEntrega.ImporteTotal.toFixed(2)
          unaEntrega.Desglose=desglose
        }

      }
      this.mostrarBotonGeneracionGuias=true

    },
    procesarPlanilla(planilla) {
      this.excelOk = true
      this.ordenesSeleccionadas = []
      this.mostrarBotonGeneracionGuias = false
      for (const unaFila of planilla) {
        try{
          this.validarComaPuntoEsNan(unaFila.KILOS)
          this.validarComaPuntoEsNan(unaFila.M3)
          this.validarComaPuntoEsNan(unaFila["VALOR DECLARADO"])
        }catch(error){
          console.log(error)
        }

        //Me fijo si hay otra orden para el mismo Destinatario, DomicilioDestinatario y CodigoPostal
        let posicionExistente

        if (this.configuracionEmpresaSeleccionada.UnificarGuias) {
          posicionExistente=this.ordenes.findIndex( e => e.DomicilioDestinatario===unaFila['DOMICILIO DESTINATARIO'] && e.Destinatario===unaFila.DESTINATARIO && e.CodigoPostal===unaFila['CODIGO POSTAL'])
        } else {
          posicionExistente=-1
        }
        if (posicionExistente>=0) {
          this.ordenes[posicionExistente].Remitos += "/"+unaFila.REMITO
          this.ordenes[posicionExistente].Observaciones = unaFila.OBSERVACIONES == 0 ? this.ordenes[posicionExistente].Observaciones : unaFila.OBSERVACIONES
          this.ordenes[posicionExistente].Kilos += Number(unaFila.KILOS)
          this.ordenes[posicionExistente].M3 += Number(unaFila.M3)
          this.ordenes[posicionExistente].Bultos += Number(unaFila.BULTOS)
          this.ordenes[posicionExistente].Unidades += Number(unaFila.UNIDADES)
          this.ordenes[posicionExistente].ValorDeclarado += Number(unaFila['VALOR DECLARADO'])
          this.ordenes[posicionExistente].EmailDestinatario = unaFila['EMAIL DESTINATARIO'] == 0 ? this.ordenes[posicionExistente].EmailDestinatario : unaFila['EMAIL DESTINATARIO']
        } else {
          this.ordenes.push(
            {
              Id: this.ordenes.length,
              Remitos: unaFila.REMITO, 
              Destinatario: unaFila.DESTINATARIO,
              DomicilioDestinatario: unaFila['DOMICILIO DESTINATARIO'],
              CodigoPostal: unaFila["CODIGO POSTAL"],
              Kilos: Number(unaFila.KILOS),
              M3: Number(unaFila.M3),
              CRR: unaFila.CRR,
              Observaciones: unaFila.OBSERVACIONES,
              EmailDestinatario: unaFila['EMAIL DESTINATARIO'],
              Bultos: Number(unaFila.BULTOS),
              Unidades: Number(unaFila.UNIDADES),
              ValorDeclarado: Number(unaFila["VALOR DECLARADO"]),
              ImporteTotal: null,
              FechaEntrega: "48 hs",
              TipoEntrega: this.tiposEntregaActivos.length==1 ? this.tiposEntregaActivos[0] : "Seleccione",
            }
          )
        }
      }
    },
    verificarColumnasExcel(planilla) {
      let columnasObligatorias=['Remito', 'Fecha', 'Destinatario', 'Domicilio Destinatario', 'Codigo Postal', 'Kilos', 'Bultos', 'M3', 'Valor declarado', 'Unidades', 'CRR', 'Observaciones', 'Email Destinatario']
      let columnasFaltantes=[]
      let filaActual=1
      let tituloMostrado=false
      planilla.forEach(unaFila => {
          filaActual++
          columnasObligatorias.forEach(unaColumnaObligatoria => {
              if (!Object.keys(unaFila).map(e=>e).includes(unaColumnaObligatoria.toUpperCase())) {
                  if (!columnasFaltantes.includes(unaColumnaObligatoria)) {
                      if (!tituloMostrado) {
                          this.mensajes.push({texto: "Faltan las siguientes columnas:", color:"red"})
                          tituloMostrado=true
                      }
                      this.mensajes.push({texto: "Fila: "+filaActual+" - Columna: "+unaColumnaObligatoria, color:"orange"})
                  }
              }
          })
      })
      if (tituloMostrado) {
          this.mensajes.push({texto: "La planilla no puede ser procesada", color: "red"})
      } else {
          this.procesarPlanilla(planilla)
      }
    },
    fileOnChange(archivoLeido) {
      if (archivoLeido!=null) {
        // this.mensajes.push({texto: "Leyendo archivo ..."})
        const lector=new FileReader()
        lector.onload = ev => {
            const datosCrudos = ev.target.result;
            const planillaCruda = read(datosCrudos, {type: "binary", cellDates: true, cellNF: true, cellText:true})
            const nombreHoja1=planillaCruda.SheetNames[0]
            const datosPlanilla=utils.sheet_to_json(planillaCruda.Sheets[nombreHoja1])
            this.verificarColumnasExcel(datosPlanilla)
        }

        lector.readAsBinaryString(archivoLeido)            
      } else {
          this.mensajes=[]
          this.ordenes=[]
          this.ordenesSeleccionadas=[]
      }
    },
    eligioEmpresa(idEmpresaElegida) {
      this.idEmpresa=idEmpresaElegida;
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
    },
    mostrarMensaje(mensaje, titulo) {
      store.dispatch("alertDialog/mostrar", {titulo, mensaje, botonPrimario: "Entendido"})
    },
    mostrarError(mensaje) {
      store.dispatch("snackbar/mostrar", mensaje)
    },

    validarComaPuntoEsNan(numero) {
    // Convertir el número a cadena y contar las comas
    const numeroComoCadena = numero.toString();
    const cantidadComas = numeroComoCadena.split(',').length - 1;
    const cantidadPuntos = numeroComoCadena.split('.').length - 1;
    let mensaje

    //Validamos si el numero es NaN
    if(isNaN(numero)){
      this.mostrarError("Verificar el excel, uno de los campos no tiene valor numerico")
      this.mostrarMensaje("Verificar el excel, uno de los campos no tiene valor numerico", "Error en el excel")
      this.excelOk = false
      return false
    }

    // Verificar si hay más de una coma o punto
    if (cantidadComas > 1 || cantidadPuntos > 1) {

      //Mostramos el mensaje dependiendo de cual sea el error
      mensaje = cantidadComas > 1 
        ?  "Verificar el excel, hay un campo con mas de una coma ( , )" 
        : cantidadPuntos > 1 ?  "Verificar el excel, hay un campo con mas de un punto ( . )" : ""
      
      this.mostrarError(mensaje)
      this.mostrarMensaje(mensaje, "Error en el excel")
      return false
    } else {
      // Si no hay más de una coma, retornar el número
      return parseFloat(numero);
    }
}
  },

  components: {
      SelectorEmpresa
  },

  created() {
    store.dispatch('empresas/cargarListaEmpresas', 'SoloActivas')
  },
}
</script>