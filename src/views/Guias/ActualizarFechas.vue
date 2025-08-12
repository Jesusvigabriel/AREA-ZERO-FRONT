<template>
  <v-container>
    <v-row v-if="guias.length>0">
      <v-col cols="12" sm="4" md="3">
        <v-text-field prepend-inner-icon="mdi-calendar" type="date" label="Desde" v-model="fechaDesde" dense></v-text-field>
      </v-col>
      <v-col  cols="12" sm="4" md="3">
        <v-text-field prepend-inner-icon="mdi-calendar" type="date" label="Hasta" v-model="fechaHasta" dense></v-text-field>
      </v-col>
      <v-col class="py-0" cols="12" sm="4" md="6">
          <v-btn @click="filtrarGuias()" color="success" block>Actualizar información <v-icon>mdi-refresh</v-icon></v-btn>
      </v-col>
    </v-row>
    <v-row v-show="guias.length>0" class="pb-0 mb-0">
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
      <v-col class="py-0" v-if="guias.length>0">
        <v-data-table 
          v-model="guiasSeleccionadas"
          :headers="cabeceras" 
          :singleSelect=false
          :search="textoBusqueda"
          item-key="Id"
          show-select
          :items="guiasFiltradas"  
          :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
          :items-per-page="30" 
          class="elevation-3" 
        >
        </v-data-table>
      </v-col>
    </v-row>
    <v-row >
      <v-col>
           <v-alert  class="my-1 mx-0 white--text" v-for="(item, index) in listaCodigosLeidos" :key="index" dense :color="colorLectura(item)" >{{item.Descripcion}}</v-alert>
      </v-col>
    </v-row>
    <v-row v-if="guiasSeleccionadas.length>0">
      <v-col cols="12" sm="3" md="3">
        <v-text-field prepend-inner-icon="mdi-calendar" type="date" label="Fecha" v-model="fecha" dense></v-text-field>
      </v-col>
      <v-col cols="12" sm="9" md="9">
        <v-btn @click="actualizarGuiasSeleccionadas" color="blue" block dark>Actualizar la fecha de las  guías seleccionadas</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import guias from "../../store/guias"
import store from "../../store"
import empresas from "@/store/empresasV3"
import fechas from 'vue-lsi-util/fechas'
import router from '../../router'

export default {
  name: "GuiasGenerarRendiciones",

  data() {
    return {
      fechaDesde: '2021-11-01',
      fechaHasta: '2021-11-01',
      textoBusqueda: '',
      guias: [],
      guiasFiltradas: [],
      guiasSeleccionadas: [],
      guiasParaActualizar: [],
      fecha: fechas.getHoy(),
      listaCodigosLeidos: [],
      cabeceras: [
        {text: 'Fecha', value: 'Fecha', width: '10%'},
        {text: 'Comprobante', value: 'Comprobante'},
        {text: 'Cliente', value: 'NombreCliente'},
        {text: 'Remitos', value: 'Remitos'},
        {text: 'Destino', value: 'NombreDestino'},
        {text: 'Domicilio', value: 'Domicilio', width: '20%'},
        {text: 'Estado', value: 'Estado'},
        {text: 'Id', value: 'Id'},
      ],
    }
  },

  methods: {
    filtrarGuias() {
      this.guiasFiltradas = this.guias.filter(e => e.Fecha>=this.fechaDesde && e.Fecha<=this.fechaHasta)
    },
    actualizarGuiasSeleccionadas() {
      const textoPrimario="Actualizar las guías seleccionadas"
      const textoSecundario="No actualizar"
      const ad={
        titulo: 'Confirma la actualización?',
        mensaje: 'Confirma la actualización de la fecha de las guías seleccionadas?',
        botonPrimario: textoPrimario,
        botonSecundario: textoSecundario,
        callback: ((respuesta) => {
          if (respuesta==textoPrimario) {
            this.actualizarGuiasSeleccionadasConfirmado()
          }
        })
      }
      store.dispatch("alertDialog/mostrar", ad)
    },
    async actualizarGuiasSeleccionadasConfirmado() {

      const elementoEliminar = ["STAND BY", "A DEVOLUCION"]
      let guiasNoActualizar = ""
      this.guiasParaActualizar = []
      
      this.guiasSeleccionadas.forEach((guia, indice) => {
        if(elementoEliminar.includes(guia.Comentario)){
          guiasNoActualizar += guia.Id

          if (indice < this.guiasSeleccionadas.length - 1) {
            guiasNoActualizar += ", ";
          }
          
        } else {
          this.guiasParaActualizar.push(guia)
        }
      })

      if(guiasNoActualizar){
        this.listaCodigosLeidos.unshift({Correcto: false, Descripcion: `Guias no actualizadas: (${guiasNoActualizar} ) con novedad "STAND BY o A DEVOLUCION"`})
        store.dispatch("snackbar/mostrar", 'Guias no actualizadas: (' + guiasNoActualizar + ') con novedad "STAND BY o A DEVOLUCION"' )
      }
      
      const idsGuias = this.guiasParaActualizar.reduce((acc, el) => acc + el.Id+ "|", '').slice(0, -1)

      try {
        if(idsGuias){
          const response=await guias.actualizarFecha(this.fecha, idsGuias)
          this.mostrarMensaje("Fechas actualizadas")
          this.guiasSeleccionadas=[]
          this.popularGuiasAModificar()
        }
      } catch (error) {
        console.log(error)
      }
    },

    colorLectura: function(item) {
        return item.Correcto ? "green" : "red";
    },

    popularGuiasAModificar() {
      guias.getEnPlanchada()
        .then(response => {
          // console.log(response)
          this.guias=response
          this.filtrarGuias()
        })
        .catch(error => {
          console.log(error)          
        })
    },
    mostrarMensaje(mensaje, titulo) {
      store.dispatch("alertDialog/mostrar", {titulo, mensaje, botonPrimario: "Entendido"})
    },
    mostrarError(mensaje) {
      store.dispatch("snackbar/mostrar", mensaje)
    }
  },

  created() {
    this.popularGuiasAModificar()
    this.fechaDesde=fechas.dateToString(fechas.getSumarDiasFecha(-1))
    this.fechaHasta=fechas.dateToString(fechas.getSumarDiasFecha(-1))
  },
}
</script>