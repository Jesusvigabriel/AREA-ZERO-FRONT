<template>
  <v-container>
    <v-row justify="center">
      <v-col class="py-3" cols="12" sm="6" md="3" align="start">
        <v-checkbox label="Elegir empresa" v-model="elegirEmpresa" class="py-0 my-0" v-show="empresaLoggeada()<=0"></v-checkbox>
      </v-col>      
      <v-col cols="12" sm="6" md="4" v-show="elegirEmpresa && empresaLoggeada()<=0">
        <SelectorEmpresa @eligioEmpresa="eligioEmpresa($event)" :idEmpresaInicialmenteSeleccionada="idEmpresa" ></SelectorEmpresa>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col class="py-3" cols="12" sm="6" md="3" align="start">
        <v-checkbox label="Elegir chofer" @click="elegirChoferCheck()" class="py-0 my-0"></v-checkbox>
      </v-col>  
      <v-col cols="12" sm="6" md="4" v-if="elegirChofer">
        <v-select
        prepend-inner-icon="mdi-account-box"
        :items="listaChoferes"
        item-value="Id" 
        item-text="Nombre" 
        @change="eligioChofer($event)"
        label="Seleccione chofer"
        ></v-select>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="6" md="4">
        <v-text-field prepend-inner-icon="mdi-calendar" type="date" label="Desde" v-model="fechaDesde" dense></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-text-field prepend-inner-icon="mdi-calendar" type="date" label="Hasta" v-model="fechaHasta" dense></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col class="py-0" cols="12" sm="6" md="4">
          <v-btn @click="obtenerInformacion()" color="success" block>Obtener información<v-icon>mdi-refresh</v-icon></v-btn>
      </v-col>
      <v-col class="py-0" cols="12" sm="6" md="4" v-if="informacionAExportar.length>0">
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
          :singleSelect=false
          show-select
          v-model="guiasSeleccionadas"
          :items="informacionAExportar"  
          :footer-props="{itemsPerPageOptions:[-1]}"   
          :items-per-page="-1" 
          class="elevation-3" 
        >
        <template v-slot:item.Acciones="{item}"  v-if="empresaLoggeada()<=0">
          <v-chip dark color="green" @click="editarGuia(item)"><v-icon>mdi-application-edit-outline</v-icon></v-chip>
        </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-dialog
      v-model="mostrarVentanaEdicion"
      persistent
      max-width="600px"
    >
    <v-card class="rounded-card">
        <v-card-title>
          <span class="text-h5">Guía: {{guiaEnEdicion.Id}}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Remitos" required v-model="guiaEnEdicion.Remitos"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Bultos" required v-model="guiaEnEdicion.Bultos"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Código Postal" required v-model="guiaEnEdicion.CodigoPostal"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Contrareembolso" required v-model="guiaEnEdicion.ContraReembolso"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Domicilio" required v-model="guiaEnEdicion.Domicilio"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="ValorDeclarado" required v-model="guiaEnEdicion.ValorDeclarado"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" >
                <v-text-field label="Observaciones" required v-model="guiaEnEdicion.Observaciones"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-select
                  v-model="guiaEnEdicion.Estado"
                  :items="estadosGuia"
                  @change="(state) => eligioEstado(state)"                            
                  label="Estado"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-select
                  v-model="guiaEnEdicion.Comentario"
                  :items="novedadGuia"
                  @change="(state) => eligioNovedad(state)"                            
                  label="Stand By / A Devolucion"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancelarEdicionGuia()">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="confirmarEdicionGuia()">Grabar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import store from "../../store"
import SelectorEmpresa from '@/components/SelectorEmpresa.vue'
import empresas from "@/store/empresasV3"
import guias from "@/store/guias"
import fechas from 'vue-lsi-util/fechas'
import cadenas from 'vue-lsi-util/cadenas'
import excel from "exceljs"
import {saveAs} from "file-saver"
import choferes from '@/store/choferes'

export default {
  name: "Informes_GuiasPorPeriodo",

  data() {
    return {
      cantidadRendiciones: 0,
      cantidadDevoluciones: 0,
      ContraReembolsoExcel: 0,
      cantidadGuiasExcel: 0,
      detalleCalculoGuia:{},
      empresa:{},
      elegirChofer: false,
      elegirEmpresa: false,
      estadosGuia: ["ENTREGADO", "NO ENTREGADO", "PARCIAL", "DESPACHADO"],
      novedadGuia: ["---", "STAND BY", "A DEVOLUCION"],
      fechaDesde: '2021-11-01',
      fechaHasta: '2021-11-01',
      guiaEnEdicion: {},
      guiasSeleccionadas: [],
      hashExcel: '',
      idEmpresa: -1,
      idChofer: null,
      importeTotalExcel: 0,
      importePickingCD: 0,
      importeComplemento: 0,
      importeSeguroExcel: 0,
      importeTransporteExcel: 0,
      informacionAExportar: false,
      informacionAExportar: [],
      listaChoferes: [],
      mostrarVentanaEdicion: false,
      nombreCliente: "",
      quitarAnuladas: [],
      textoBusqueda: '',
      cabeceras: [
        {text: '', value: 'Acciones', sortable: true, width: '10%'},
        {text: 'Chofer', value: 'NombreChofer'},
        {text: 'Guia', value: 'Id', width: '10%'},
        {text: 'Remitos', value: 'Remitos', width: '5%'},
        {text: 'F.Original', value: 'FechaOriginal', width: '12%'},
        {text: 'Cliente', value: 'NombreCliente'},
        {text: 'Destino', value: 'NombreDestino'},
        {text: 'Bultos', value: 'Bultos'},
        {text: 'Estado', value: 'Estado'},
        {text: 'Ventana', value: 'Ventana'},
        {text: 'CTR', value: 'Conceptos.CTR'},
        {text: 'Fecha', value: 'Fecha', width: '12%'},
        {text: 'Canal', value: 'Canal'},
        {text: 'Rend.', value: 'IdRendicion'},
      ]
    }
  },

  methods: {
    elegirChoferCheck(){
      this.elegirChofer = !this.elegirChofer
      this.idChofer = null
    },

    empresaLoggeada() {
        if (!store.state.usuarios.usuarioActual.IdEmpresa) { 
            return -1
        } else {
            return store.state.usuarios.usuarioActual.IdEmpresa
        }
    },

    cancelarEdicionGuia() {
      this.mostrarVentanaEdicion=false
    },

    cargarChoferes(){
      choferes.getAll()
        .then(respuesta => {
          respuesta.forEach(data => {
            if(data.Disponible.toLowerCase() === "si"){
              this.listaChoferes.push({Id: data.Id, Nombre: data.Nombre})
              this.listaChoferes.sort(function(a,b){ if (a.Nombre<b.Nombre) { return -1; } else if (a.Nombre>b.Nombre) { return 1; } else { return 0; } } )
            }
          })
        })
        .catch(error => {
          console.log(error)
        })
    },

    confirmarEdicionGuia() {
      this.calculoEdicionGuia()
      this.mostrarVentanaEdicion=false
      guias.editOne(this.guiaEnEdicion.Id, this.guiaEnEdicion)
        .then(response => {
          const objetoEnEdicion=this.informacionAExportar.find(e => e.Id===this.guiaEnEdicion.Id)
          Object.assign(objetoEnEdicion, this.guiaEnEdicion)
        })
        .catch(error => {
          console.log(error)
        })   
    },

    calculoEdicionGuia(){
      let detalle=[]
      let conceptos =[]
      let concepto=""
      let variableConfigurada=""
      let valorConfigurado=0
      let minimoConfiurado=0
      let valorBase=0
      let total=""

      if(typeof this.detalleCalculoGuia.Detalle === "string"){
        this.detalleCalculoGuia.Detalle= JSON.parse(this.detalleCalculoGuia.Detalle)
      }
      
      for(const calculo of this.detalleCalculoGuia.Detalle){
        if(calculo.Concepto.includes("Seguro")){
          concepto = calculo.Concepto
          variableConfigurada = calculo.VariableConfigurada
          valorConfigurado = Number(calculo.ValorConfigurado) 
          minimoConfiurado = Number(calculo.MinimoConfigurado)
          valorBase = Number(this.guiaEnEdicion.ValorDeclarado)  
          total = Number(this.guiaEnEdicion.ValorDeclarado) * Number(calculo.ValorConfigurado) / 100

          if(minimoConfiurado > total){
            total = minimoConfiurado.toFixed(2)
            }else{
              total = total.toFixed(2)
            }
        }else{
          concepto = calculo.Concepto
          variableConfigurada = calculo.VariableConfigurada
          valorConfigurado = Number(calculo.ValorConfigurado) 
          minimoConfiurado = Number(calculo.MinimoConfigurado)
          valorBase = calculo.ValorBase  
          total = calculo.Total 
        }
        conceptos.push({concepto,variableConfigurada,valorConfigurado,minimoConfiurado,valorBase,total})        
      }
      conceptos.forEach(detalles =>
        detalle.push(`{"Concepto":"${detalles.concepto}","VariableConfigurada":"${detalles.variableConfigurada}","ValorConfigurado":${detalles.valorConfigurado},"MinimoConfigurado":${detalles.minimoConfiurado},"ValorBase":${detalles.valorBase}, "Total":"${detalles.total}"}` )
      )        
      this.guiaEnEdicion.DetalleCalculo = "["+ String(detalle) + "]" 
      detalle.pop()  
    },

    editarGuia(item) {
      this.guiaEnEdicion={
        Id: item.Id,
        Remitos: item.Remitos, 
        Bultos: item.Bultos, 
        CodigoPostal: item.CodigoPostal, 
        ContraReembolso: item.ContraReembolso, 
        Domicilio: item.Domicilio,
        ValorDeclarado: item.ValorDeclarado,
        Observaciones: item.Observaciones,
        DetalleCalculo: item.DetalleCalculo,
        Estado: item.Estado 
      }

      this.detalleCalculoGuia = {
        Detalle: item.DetalleCalculo,
        Conceptos: item.Conceptos
      }
      
      this.mostrarVentanaEdicion=true
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
          response = await guias.getByPeriodoEmpresaFecha(this.fechaDesde, this.fechaHasta)
          response.forEach(data => {
            for(const chofer of this.listaChoferes){
              if(data.IdChofer == chofer.Id){
                data.NombreChofer = chofer.Nombre
              }
            }
          })
         
          if(this.idChofer){
            this.informacionAExportar = response.filter(guia => guia.IdChofer == this.idChofer)
          }else{
            this.informacionAExportar=response.filter(guia => guia.IdChofer > 0)
          }
          
        } catch (error) {
          console.log(error)          
        }
      } else {
        try {
          response =  await guias.getByPeriodoEmpresaFecha(this.fechaDesde, this.fechaHasta, this.idEmpresa)
          response.forEach(data => {
            for(const chofer of this.listaChoferes){
              if(data.IdChofer == chofer.Id){
                data.NombreChofer = chofer.Nombre
              }
            }
          })
          
          if(this.idChofer){
            this.informacionAExportar = response.filter(guia => guia.IdChofer == this.idChofer)
          }else{
            this.informacionAExportar=response.filter(guia => guia.IdChofer > 0)
          }
              
        } catch (error) {
        console.log(error)          
        }
      }

      response.forEach (e=> {
        e.Conceptos={Guia: 0, Seguro: 0, Complemento: 0, CTR: 0, PickingCD: 0, Total: 0}

        if (e.DetalleCalculo) {
          try {
            e.DetalleCalculo=JSON.parse(e.DetalleCalculo)
          } catch (error) {
            e.DetalleCalculo=[]
          }

          if (e.DetalleCalculo.length>0) {
            e.Canal= e.DetalleCalculo[0].Concepto
            for (const unDetalle of e.DetalleCalculo) {

              if (unDetalle.Concepto.includes("EntregaRegular")) {
                e.Servicio="Entrega"    
              }

              if (unDetalle.Concepto.includes("RecoleccionRegular")) {
                e.Servicio="Recolección"
              }

              if (unDetalle.Concepto.includes("Guia")) {
                e.Conceptos.Guia=Number(unDetalle.Total)
                if (isNaN(e.Conceptos.Guia)) {
                  e.Conceptos.Guia=0
                } else {
                  e.Conceptos.Total += Number(unDetalle.Total)
                }
              }

              if (unDetalle.Concepto.includes("Seguro")) {
                e.Conceptos.Seguro=Number(unDetalle.Total)
                e.Conceptos.Total += Number(unDetalle.Total)
              }

              if (unDetalle.Concepto.includes("Complemento")) {
                e.Conceptos.Complemento=Number(unDetalle.Total)
                e.Conceptos.Total += Number(unDetalle.Total)
              }

              if (unDetalle.Concepto.includes("CTR")) {
                e.Conceptos.CTR=Number(unDetalle.Total)
                e.Conceptos.Total += Number(unDetalle.Total)
              }

              if (unDetalle.Concepto.includes("PickingCD")) {
                e.Conceptos.PickingCD=Number(unDetalle.Total)
                e.Conceptos.Total += Number(unDetalle.Total)
              }
            }
          } else {
            e.Canal="N/D"
          }
        } else {
          e.Canal="N/D"
        }
      })
    },
    
    obtenerImporteTotal(){
      this.importeTransporteExcel = 0
      this.importeComplemento = 0
      this.importeSeguroExcel = 0
      this.cantidadGuiasExcel = 0
      this.importePickingCD = 0
      this.importeTotalExcel = 0
      this.ContraReembolsoExcel = 0

      for (const concepto of this.informacionAExportar){
        this.nombreCliente = concepto.NombreCliente
        this.cantidadGuiasExcel++

        if (typeof concepto.Conceptos.Seguro==="string"){
          if (!isNaN(Number(concepto.Conceptos.Seguro))){
          this.importeSeguroExcel += Number(concepto.Conceptos.Seguro)
          }
        } else {
          this.importeSeguroExcel += concepto.Conceptos.Seguro
        }

        if (typeof concepto.Conceptos.Guia==="string"){
          if (!isNaN(Number(concepto.Conceptos.Guia))){
          this.importeTransporteExcel += Number(concepto.Conceptos.Guia)
          }
        } else {
          this.importeTransporteExcel += concepto.Conceptos.Guia
        }

        if (typeof concepto.Conceptos.Complemento==="string"){         
          if (!isNaN(Number(concepto.Conceptos.Complemento))){
          this.importeComplemento += Number(concepto.Conceptos.Complemento)
          }
        } else {
          this.importeComplemento += concepto.Conceptos.Complemento
        }

        if (typeof concepto.Conceptos.PickingCD==="string"){       
          if (!isNaN(Number(concepto.Conceptos.PickingCD))){
          this.importePickingCD += Number(concepto.Conceptos.PickingCD)
          }
        } else {
          this.importePickingCD += concepto.Conceptos.PickingCD
        }

        if (typeof concepto.ContraReembolso==="string"){          
          if (!isNaN(Number(concepto.ContraReembolso))){
          this.ContraReembolsoExcel += Number(concepto.Conceptos.CTR)
          }
        } else {
          this.ContraReembolsoExcel += concepto.Conceptos.CTR
        }

        if (typeof concepto.Conceptos.Total==="string"){         
          if (!isNaN(Number(concepto.Conceptos.Total))){
          this.importeTotalExcel += Number(concepto.Conceptos.Total)
          }
        } else {
          this.importeTotalExcel += concepto.Conceptos.Total
        } 
      }

      this.importeSeguroExcel = Number(this.importeSeguroExcel.toFixed(2))
      this.importeTransporteExcel = Number(this.importeTransporteExcel.toFixed(2))
      this.importeComplemento = Number(this.importeComplemento.toFixed(2))
      this.importePickingCD = Number(this.importePickingCD.toFixed(2))
      this.importeTotalExcel = Number(this.importeTotalExcel.toFixed(2))
      this.ContraReembolsoExcel = Number(this.ContraReembolsoExcel.toFixed(2))   
    },

    async exportarAExcel(destino="D") {
      this.cantidadRendiciones = 0
      this.cantidadDevoluciones = 0
  
      this.informacionAExportar.forEach(e=>{
        this.cantidadDevoluciones+= e.Devolucion

        if(e.Devolucion > 0){
          this.cantidadRendiciones ++
        }
      })
      
      let data

      if (destino==="D") {
        data=this.informacionAExportar
      } else {
        data=this.guiasSeleccionadas
      }

      this.obtenerImporteTotal()

      const workbook=new excel.Workbook()
      const worksheet=workbook.addWorksheet("Guias")
      const worksheetTecnico=workbook.addWorksheet("Glosario Tecnico")
      const worksheet2=workbook.addWorksheet("Resumen")
      
      let renglon=1             
      //   Para eso, tenés que resetear las variables antes que arranque el for.
      const cabecerasResumen = [
        {header: "CONCEPTOS:",width: 35},
        {header: "TOTALES:",width: 30},
      ]
        worksheet2.columns=[...cabecerasResumen]
        const filasderesumen =[
          "Transporte:",
          `$ ${this.importeTransporteExcel}`
        ] 
        worksheet2.getRow(3).values=[...filasderesumen]
        
        const filasderesumen2 =[
          "Seguro:",
          `$ ${this.importeSeguroExcel}`
        ] 
        worksheet2.getRow(4).values=[...filasderesumen2]
        
        const filasderesumen3 =[
          "Complemento:",
          `$ ${this.importeComplemento}`
        ] 
        worksheet2.getRow(5).values=[...filasderesumen3]
        
        const filasderesumen4 =[
          "ContraReembolso:",
          `$ ${this.ContraReembolsoExcel}`
        ] 
        worksheet2.getRow(6).values=[...filasderesumen4]

        const filasderesumen5 =[
          "PickingCD:",
          `$ ${this.importePickingCD}`
        ] 
        worksheet2.getRow(7).values=[...filasderesumen5]
        
        const filasderesumen6 =[
          "Total:",
          `$ ${this.importeTotalExcel}`
        ] 
        worksheet2.getRow(8).values=[...filasderesumen6]

        const filasderesumen7 =[
          "cantidad de guias (Entregas):",
          `${this.cantidadGuiasExcel}` 
        ]
        worksheet2.getRow(9).values=[...filasderesumen7]
        
        const filasderesumen8 =[
          "Cantidad de Rendiciones: ",
          `${this.cantidadRendiciones}` 
        ]
        worksheet2.getRow(10).values=[...filasderesumen8]

        const filasderesumen9 =[
          "Cantidad de Bultos de Devoluciones: ",
          `${this.cantidadDevoluciones}` 
        ]
        worksheet2.getRow(11).values=[...filasderesumen9]

        worksheet2.eachRow ( (row, rowNumber) => {
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

      worksheet.views = [{state: 'frozen', ySplit: 1}]
      worksheet.autoFilter = 'A1:X1'
      worksheetTecnico.views = [{state: 'frozen', ySplit:1}]
    
      const cabeceras=[
        {header: 'Id', width: 15}, 
        {header: 'Remitos', width: 25},
        {header: 'Fecha', width: 15},
        {header: 'F.Original', width: 15},
        {header: 'Número', width: 15}, 
        {header: 'Cliente', width: 30},
        {header: 'Transporte', width: 30},
        {header: 'Seguro', width: 30},
        {header: 'Complemento', width: 30},
        {header: 'CONTRAREEMBOLSO ', width: 30},
        {header: 'PickingCD', width: 30},
        {header: 'Imp. Total', width: 30},
        {header: 'Destino', width: 30},
        {header: 'Domicilio', width: 30},
        {header: 'Estado', width: 10},
        {header: 'Ventana', width: 8},
        {header: 'Bultos', width: 10},
        {header: 'Valor declarado', width: 10},
        {header: 'Cargos CRR', width: 10},
        {header: 'Canal', width: 10},
        {header: 'Rend.', width: 10},
        {header: 'Kilos', width: 10},
        {header: 'M3', width: 10},
        {header: 'Metro L', width: 10},
        {header: 'Observaciones', width: 100},
        {header: 'Chofer', width:50}
      ]
      worksheet.columns=[...cabeceras]

      const cabecerasTecnico = [
        {header: 'CONCEPTO', width:70},
        {header: 'DEFINICIÓN', width:170}
      ]
      worksheetTecnico.columns=[...cabecerasTecnico]

      const filaTecnica =[
        "B2B",
        'Corresponde a entregas realizadas en el canal B2B (Business to Business). Abarca locales minoristas y mayoristas con amplia franja horaria de recepción. '
      ] 
      worksheetTecnico.getRow(2).values=[...filaTecnica]

      const filaTecnica1 =[
      "SUPERMERCADOS",
      'Corresponde a entregas en bocas de supermercados'
      ] 
      worksheetTecnico.getRow(3).values=[...filaTecnica1]

      const filaTecnica2 =[
      "CND",
      'Corresponde a entregas en CENTROS DE DISTRIBUCIÓN, por lo general estas entregas implican una coordinación previa y el cumplimiento de días y horarios (turnos)'
      ] 
      worksheetTecnico.getRow(4).values=[...filaTecnica2]

      const filaTecnica3 =[
      "DEVOLUCIÓN",
      'Rechazo Parcial o total de una entrega "Se observa en la columna Rend."'
      ] 
      worksheetTecnico.getRow(5).values=[...filaTecnica3]

      data.forEach(unaGuia => {
          renglon++

          if(unaGuia.Devolucion>0){
            unaGuia.IdRendicion = "Devolución - " + unaGuia.IdRendicion
          } else {
            unaGuia.IdRendicion = unaGuia.IdRendicion
          }

          let filaCompleta = []

          if(unaGuia.Orden != null){
            filaCompleta=[
              unaGuia.Id, 
              unaGuia.Remitos, 
              unaGuia.Fecha,
              unaGuia.FechaOriginal,
              unaGuia.Comprobante,
              unaGuia.NombreCliente,
              unaGuia.Conceptos.Guia,
              unaGuia.Conceptos.Seguro,
              unaGuia.Conceptos.Complemento,
              unaGuia.Conceptos.CTR,
              unaGuia.Conceptos.PickingCD,
              unaGuia.Conceptos.Total,
              unaGuia.NombreDestino,
              unaGuia.Domicilio,
              unaGuia.Estado,
              unaGuia.Ventana,
              unaGuia.Bultos,
              unaGuia.ValorDeclarado,
              unaGuia.ContraReembolso,
              unaGuia.Canal,
              unaGuia.IdRendicion,
              unaGuia.Kilos,
              unaGuia.Volumen,
              unaGuia.Orden.Metros,
              unaGuia.Observaciones,
              unaGuia.NombreChofer
            ]
          } else {
            filaCompleta=[
              unaGuia.Id, 
              unaGuia.Remitos, 
              unaGuia.Fecha,
              unaGuia.FechaOriginal,
              unaGuia.Comprobante,
              unaGuia.NombreCliente,
              unaGuia.Conceptos.Guia,
              unaGuia.Conceptos.Seguro,
              unaGuia.Conceptos.Complemento,
              unaGuia.Conceptos.CTR,
              unaGuia.Conceptos.PickingCD,
              unaGuia.Conceptos.Total,
              unaGuia.NombreDestino,
              unaGuia.Domicilio,
              unaGuia.Estado,
              unaGuia.Ventana,
              unaGuia.Bultos,
              unaGuia.ValorDeclarado,
              unaGuia.ContraReembolso,
              unaGuia.Canal,
              unaGuia.IdRendicion,
              unaGuia.Kilos,
              unaGuia.Volumen,
              unaGuia.Metros = 0,
              unaGuia.Observaciones,
              unaGuia.NombreChofer
            ]
          }

          worksheet.getRow(renglon).values=[...filaCompleta]

          //Si la empresa tiene habilitada la vista detallada de remitos muestro los remitos en renglonen distintos.
          if(this.empresa.VistaDetalladaExcelGuias){
            const remitos = unaGuia.Remitos.split('/')
            if(remitos.length>1){
              remitos.forEach(e =>{
                renglon++
                const filaRemitos=[
                  unaGuia.Id, 
                  e, 
                  unaGuia.Fecha,
                  unaGuia.FechaOriginal,
                  unaGuia.Comprobante,
                  unaGuia.NombreCliente,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  unaGuia.NombreDestino,
                  unaGuia.Domicilio,
                  unaGuia.Estado,
                  unaGuia.Ventana,
                  0,
                  0,
                  0,
                  unaGuia.Canal,
                  unaGuia.IdRendicion,
                  0,
                  0,
                  unaGuia.Observaciones
                ]
                worksheet.getRow(renglon).values=[...filaRemitos]
              })
            }
          }          
      })

      renglon++
      const filaTotalPosicionado=renglon
      const columnasASumar=["G", "H", "I", "J", "K", "L"]
      for (const unaColumna of columnasASumar) {
        let celdaSuma=worksheet.getCell(unaColumna+""+renglon)
        const formula="SUM("+unaColumna+"2:"+unaColumna+""+(renglon-1)+")"
        celdaSuma.value={formula}
        celdaSuma.font={bold: true}   
      }

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

      worksheetTecnico.eachRow ( (row, rowNumber) => {
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

      if (destino==="D") {
        if (!this.elegirEmpresa) {
          saveAs(new Blob([buf]), `guias_${this.fechaDesde}_al_${this.fechaHasta}.xlsx`)
        } else {
          saveAs(new Blob([buf]), `${cadenas.stringToSlug(this.nombreCliente)}_Distribucion_desde_${this.fechaDesde}_al_${this.fechaHasta}.xlsx`)
        }
      } else {
        this.subirExcelAS3(buf)
      } 
    },

    subirExcelAS3(excelASubir) {
      var AWS = require('aws-sdk');
      const credentials = new AWS.Credentials('AKIA4UL5BS455UXSIPRO', '1reT5pqpYsi/3RmM2Zf++d8NHofWWTW6Q+zUjKQp')
      var s3 = new AWS.S3({credentials})

      const nombreArchivo=`informe-${this.hashExcel}.xlsx`

      var params = {Bucket: "a54-informes-facturacion", Key: nombreArchivo, Body: excelASubir, ContentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"};
      this.mostrarLoading("Subiendo informe a S3...")
      s3.putObject(params, (err, data) => {
        this.ocultarLoading()
        if (err) {
          this.mostrarError(err)
        }
      })
    },

    eligioChofer(idChofer){
      this.idChofer = idChofer
    },

    eligioEstado(estado){
      this.guiaEnEdicion.Estado = estado
    },

    eligioNovedad(novedad){
      this.guiaEnEdicion.Comentario = novedad
    },

    eligioEmpresa(idEmpresaElegida) {
      this.idEmpresa=idEmpresaElegida
      this.informacionAExportar=[]
      this.guiasSeleccionadas=[]

      empresas.getOneById(this.idEmpresa)
        .then(respuesta => {
              this.empresa=respuesta      
            })
             .catch(error => {
               this.mostrarSnackbar(error)
               console.log("Error", error)
           })

    },

    mostrarMensaje(mensaje, titulo) {
      store.dispatch("alertDialog/mostrar", {titulo, mensaje, botonPrimario: "Entendido"})
    },
    mostrarError(mensaje) {
      store.dispatch("snackbar/mostrar", mensaje)
    },
    mostrarLoading(texto) {
        store.dispatch("loading/mostrar", texto)
    },
    ocultarLoading() {
        store.dispatch("loading/ocultar")
    },
  },

  components: {
    SelectorEmpresa
  },

  mounted() {
  },

  created() {
    store.dispatch('actualizarTituloPrincipal', 'Informe de guías')
    store.dispatch('empresas/cargarListaEmpresas', 'SoloActivas')
    if (process.env.NODE_ENV==="development") {
      this.fechaDesde=fechas.dateToString(fechas.getSumarDiasFecha(-10))
      this.fechaDesde='2023-12-02'
      this.fechaHasta='2023-12-02'
      this.elegirEmpresa=false
      this.idEmpresa=0
    } else {
      this.fechaDesde=fechas.dateToString(fechas.getSumarDiasFecha(-1))      
      this.fechaHasta=fechas.dateToString(fechas.getSumarDiasFecha(0))
    }

    if (store.state.usuarios.usuarioActual.IdEmpresa>0) {
      this.idEmpresa=store.state.usuarios.usuarioActual.IdEmpresa
      this.eligioEmpresa(store.state.usuarios.usuarioActual.IdEmpresa)
      this.elegirEmpresa=true
    }

    this.cargarChoferes()
  },
}
</script>