<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn-toggle v-model="tipoGuiasARendir">
          <v-btn @click="popularGuiasSinRendir()" color="blue" dark>Rendir entregas</v-btn>
          <v-btn @click="popularGuiasSinRendir()" color="blue" dark>Rendir devoluciones</v-btn>
          <v-btn @click="popularGuiasSinRendir()" color="blue" dark>Rendir CTR</v-btn>
        </v-btn-toggle>        
      </v-col>
    </v-row>
    <v-row v-if="tipoGuiasARendir>=0">
      <v-col>
        <SelectorEmpresa @eligioEmpresa="eligioEmpresa($event)" ></SelectorEmpresa>
      </v-col>
    </v-row>
    <v-row v-if="guiasARendir.length>0">
      <v-col cols="2">
        <v-text-field prepend-inner-icon="mdi-calendar" type="date" label="Desde" v-model="fechaDesde" dense></v-text-field>
      </v-col>
      <v-col  cols="2">
        <v-text-field prepend-inner-icon="mdi-calendar" type="date" label="Hasta" v-model="fechaHasta" dense></v-text-field>
      </v-col>

       <v-radio-group v-model="row" row v-if="tipoGuiasARendir==1" >
              <v-radio label="Mostrar Solo Parciales" color="primary" value="checkSoloParciales"></v-radio>
              <v-radio label="Mostrar Solo No Entregadas" color="primary" value="checkSoloNoEntregadas"></v-radio>
              <v-radio label="Mostrar Ambas" color="primary" value="MostrarAmbas"></v-radio>
      </v-radio-group>
      
      <v-col class="py-0">
          <v-btn @click="filtrarGuias()" color="success" block>Actualizar información <v-icon>mdi-refresh</v-icon></v-btn>
      </v-col>
    </v-row>
    <v-row v-if="guiasARendirFiltradas.length>0" class="pb-0 mb-0">
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
      <v-col class="py-0" v-if="guiasARendirFiltradas.length>0">
        <v-data-table 
          v-model="guiasSeleccionadas"
          :headers="cabeceras" 
          :singleSelect=false
          item-key="Id"
          show-select
          :search="textoBusqueda"
          :items="guiasARendirFiltradas"  
          :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
          :items-per-page="30" 
          class="elevation-3" 
        >
               
        <template v-slot:item.devolucion="{item}">
          <v-edit-dialog
            :return-value.sync="item.devolucion"
            large
            persistent  
            @save="save"
            @cancel="cancel"
            @open="open"
            @close="close"
          >
            <div>{{ item.devolucion }}</div>
            
            <template v-slot:input>
              <v-text-field
                v-model="item.devolucion"
                label="Edit"
                single-line
                counter
                autofocus
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </template>

        </v-data-table>
      </v-col>
    </v-row>
    <v-col v-if="guiasSeleccionadas.length>0">
      <v-btn @click="rendirGuiasSeleccionadas" color="blue" block dark>Rendir guías seleccionadas</v-btn>
    </v-col>
  </v-container>
</template>

<script>

import guias from "../../store/guias"
import store from "../../store"
import SelectorEmpresa from '@/components/SelectorEmpresa.vue'
import router from '../../router'
import fechas from 'vue-lsi-util/fechas'
import empresas from "@/store/empresasV3"
import guiasRendiciones from '../../store/guiasRendiciones'

export default {
  name: "GuiasGenerarRendiciones",

  data() {
    return {
      row: 'MostrarAmbas',
      checkSoloParciales: false,
      checkSoloNoEntregadas: false,
      MostrarAmbas: false,
      fechaDesde: '2021-11-01',
      fechaHasta: '2021-11-01',
      idEmpresa: -1,
      tipoGuiasARendir: -1,
      guiasARendir: [],
      guiasARendirFiltradas: [],
      guiasSeleccionadas: [],
      tiposEntrega: ["EntregaRegularDevolucionesGuia"],
      tiposEntregaActivos: [],
      configuracionEmpresaSeleccionada: {},
      unaGuia: {},
      textoBusqueda: '',
      cabeceras: [],
      cabeceraEntregasCTR: [
        {text: 'Id', value: 'Id'},
        {text: 'Fecha', value: 'Fecha'},
        {text: 'Comprobante', value: 'Comprobante'},
        {text: 'Domicilio', value: 'Domicilio'},
        {text: 'Estado', value: 'Estado'},
        {text: 'Flete', value: 'Flete'},
        {text: 'Destino', value: 'NombreDestino'},
        {text: 'Remitos', value: 'Remitos'},
        
      ],
      cabeceraDevolucion: [
        {text: 'Id', value: 'Id'},
        {text: 'Fecha', value: 'Fecha'},
        {text: 'Comprobante', value: 'Comprobante'},
        {text: 'Domicilio', value: 'Domicilio'},
        {text: 'Estado', value: 'Estado'},
        {text: 'Flete', value: 'Flete'},
        {text: 'Destino', value: 'NombreDestino'},
        {text: 'Remitos', value: 'Remitos'},
        {text: 'Devolucion', value: 'devolucion'},
        
      ],
      devolucion: 0,
      fecha: new Date(),
      desglose:[]
      

    }
  },

  methods: {
      save () {
      this.snack = true
      this.snackColor = 'success'
      this.snackText = 'Data saved'
    },
    cancel () {
      this.snack = true
      this.snackColor = 'error'
      this.snackText = 'Canceled'
    },
    open () {
      this.snack = true
      this.snackColor = 'info'
      this.snackText = 'Dialog opened'
    },
    close () {
      console.log('Dialog closed')
    },

    filtrarGuias() {
      // this.guiasARendirFiltradas = this.guiasARendir.filter(e => e.Fecha>=this.fechaDesde && e.Fecha<=this.fechaHasta)
      if(this.row === "checkSoloParciales"){
        this.guiasARendirFiltradas = this.guiasARendir.filter(e => e.Fecha>=this.fechaDesde && e.Fecha<=this.fechaHasta && e.Estado=="PARCIAL" && e.ContraReembolso==0)
      }
      if(this.row === "checkSoloNoEntregadas"){
        this.guiasARendirFiltradas = this.guiasARendir.filter(e => e.Fecha>=this.fechaDesde && e.Fecha<=this.fechaHasta && e.Estado=="NO ENTREGADO" && e.ContraReembolso==0)
      }
      if(this.row === "MostrarAmbas"){
        if(this.tipoGuiasARendir == 2){
          this.guiasARendirFiltradas = this.guiasARendir.filter(e => e.Fecha>=this.fechaDesde && e.Fecha<=this.fechaHasta && e.ContraReembolso>0)
        }else{
          this.guiasARendirFiltradas = this.guiasARendir.filter(e => e.Fecha>=this.fechaDesde && e.Fecha<=this.fechaHasta && e.ContraReembolso==0)
        }
      }
    },
    rendirGuiasSeleccionadas() {
      const textoPrimario="Procesar las guías seleccionadas"
      const textoSecundario="No procesar"
      const ad={
        titulo: 'Confirma el procesamiento?',
        mensaje: 'Confirma la generación de la rendición de las guías seleccionadas?',
        botonPrimario: textoPrimario,
        botonSecundario: textoSecundario,
        callback: ((respuesta) => {
          if (respuesta==textoPrimario) {
            this.rendirGuiasSeleccionadasConfirmado()
          }
        })
      }
      store.dispatch("alertDialog/mostrar", ad)
    },
    rendirGuiasSeleccionadasConfirmado() {
      const idsGuias=this.guiasSeleccionadas.reduce((acc, el) => acc+el.Id+"|", '').slice(0, -1)
      
       this.guiasSeleccionadas.forEach(e => {
         if (e.devolucion>0) {
               guias.editOne(e.Id, {Devolucion: e.devolucion})
                 .then(response => {
                  
                 })
                 .catch(error => {
                   console.log(error)
                 })
           }
         })
         
      guias.registrarRendicion(this.idEmpresa, idsGuias,store.state.usuarios.usuarioActual.Nombre)
        .then(response => {
          this.mostrarMensaje("Se ha generado exitosamente la rendición "+response.Id, "Rendición generada")
          this.getRendicion(response.Id)
          router.push(`/Rendiciones/ImprimirUnaRendicion/${response.Id}`)
          this.popularGuiasSinRendir()
        })
        .catch(error => {
          console.log(error)
          
        })
      
    },

     getRendicion(idRendicion){

       guiasRendiciones.getOneByIdRendicion(idRendicion)
                 .then(response => {
                     //console.log(response)
                     this.generarGuiaRendicion(response)
                 })
                 .catch(error => {
                     console.log("Error", error)                
                 })
     },

   async  generarGuiaRendicion(rendicion){
        let devoluciones = 0
         rendicion.Guias.forEach(g => {
             devoluciones += g.Devolucion
         })
 
    this.preprocesarOrdenesSeleccionadas(devoluciones,1)

          this.unaGuia = {

                Remitos: rendicion.Id, 
                Destinatario: rendicion.Empresa.Nombre,
                DomicilioDestinatario: rendicion.Empresa.DireccionDeposito,
                CodigoPostal: rendicion.Empresa.CodigoPostal,
                Descripcion: '',
                Desglose:this.desglose,
                Kilos: 1,
                M3: 0,
                CRR: 0,
                Observaciones: 'Rendicion de Devolucion - Numero ' + rendicion.Id,
                EmailDestinatario: rendicion.Empresa.ContactoDeposito,
                Bultos: devoluciones,
                Unidades: devoluciones,
                ValorDeclarado: 1,
                TipoEntrega: '',
                FechaEntrega: fechas.dateToString(this.fecha),
               
          }

          await guias.crearDesdeExcel({...this.unaGuia, IdEmpresa: this.idEmpresa}) 
           .then ( response => {
             //console.log(response)
             this.unaGuia={}
           })
           .catch ( error => {
             console.log("Error", error)
           })
     },

    eligioEmpresa(idEmpresaElegida) {
      this.idEmpresa=idEmpresaElegida
      this.popularGuiasSinRendir()

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
            this.mostrarError("La empresa seleccionada no tiene ningún tipo de entrega para las devoluciones activa")
           
          }


        })
        .catch(error => {
          this.mostrarError(error)
        })
    },


   async preprocesarOrdenesSeleccionadas(devoluciones, valorDeclarado) {

    
          let ImporteTotal=0
          let Flete=0
          let conceptosActivos

          const conceptosTodos=Object.entries(this.configuracionEmpresaSeleccionada).filter(e=>e[0].includes('EntregaRegularDevolucionesGuia'))
          conceptosActivos=conceptosTodos.filter(e=>e[1].split('|')[3]=='true')

          
          for (const unConcepto of conceptosActivos) {

            const nombreConcepto=unConcepto[0]
            const configConcepto=unConcepto[1]

            const variable=configConcepto.split('|')[0]
            const valor=Number(configConcepto.split('|')[1])
            const minimo=Number(configConcepto.split('|')[2])
            let subtotal, baseCalculo
            if (variable=="M3") {
              baseCalculo=devoluciones
              subtotal = Math.max(valor * devoluciones, minimo)
            }
            if (variable=="Kilos") {
              baseCalculo=devoluciones
              subtotal = Math.max(valor * devoluciones, minimo)
            }
            if (variable=="Bultos") {
              baseCalculo=devoluciones
              subtotal = Math.max(valor * devoluciones, minimo)
            }
            if (variable=="Unidades") {
              baseCalculo=devoluciones
              subtotal = Math.max(valor * devoluciones, minimo)
            }
            if (variable=="%VD") {
              baseCalculo=1
              subtotal = Math.max((valor/100) * 1, minimo)
            }
            if (variable=="Fijo") {
              baseCalculo=valor
              subtotal = Math.max(baseCalculo, minimo)
            }

            let procesarImporte=true
            // if (nombreConcepto.includes("CTR")) {
            //   procesarImporte = (unaEntrega.CRR>0)
            // }

            if (procesarImporte)  {
              ImporteTotal += Number(subtotal)
              const unDesglose={Concepto: nombreConcepto, VariableConfigurada: variable, ValorConfigurado: valor, MinimoConfigurado: minimo, ValorBase: baseCalculo, Total: subtotal.toFixed(2)}
              this.desglose.push(unDesglose)
              console.log(this.desglose)
              // if (nombreConcepto.includes('Guia')) {
              //   unaEntrega.Flete=Number(subtotal)
              // }

            }
          }
          // unaEntrega.ImporteTotal = unaEntrega.ImporteTotal.toFixed(2)
          // unaEntrega.Desglose=desglose
        
 

    },

    filtrarGuiasPorTipoARendir() {
      
      switch (this.tipoGuiasARendir) {
        case 0:
          this.guiasARendir=this.guiasARendir.filter(e => e.Estado==="ENTREGADO" && e.ContraReembolso==0)
          this.cabeceras = this.cabeceraEntregasCTR
          break;

        case 1:
          this.guiasARendir=this.guiasARendir.filter(e => e.Estado==="PARCIAL" || e.Estado==="NO ENTREGADO" && e.ContraReembolso===0)
          this.cabeceras = this.cabeceraDevolucion
          break;
      
        case 2:
          this.guiasARendir=this.guiasARendir.filter(e => e.ContraReembolso>0)
          this.cabeceras = this.cabeceraEntregasCTR
          break;
      
        default:
          break;
      }
   
    },
    popularGuiasSinRendir() {
      this.guiasARendir=[]
      this.guiasARendirFiltradas=[]
      if(this.idEmpresa>0)
      {
        guias.getSinRendirByIdEmpresa(this.idEmpresa)
        .then(response => {
          this.guiasARendir=response
          this.filtrarGuiasPorTipoARendir()
        })
        .catch(error => {
          console.log(error)
          
        })

      }
    
    },
    mostrarMensaje(mensaje, titulo) {
      store.dispatch("alertDialog/mostrar", {titulo, mensaje, botonPrimario: "Entendido"})
    },
    mostrarError(mensaje) {
      store.dispatch("snackbar/mostrar", mensaje)
    }
  },

  components: {
      SelectorEmpresa
  },

  created() {
    store.dispatch('empresas/cargarListaEmpresas', 'SoloActivas')
    this.fechaDesde=fechas.dateToString(fechas.getSumarDiasFecha(-1))
    this.fechaHasta=fechas.dateToString(fechas.getSumarDiasFecha(-1))
},
}
</script>