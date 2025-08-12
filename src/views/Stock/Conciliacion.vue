<template>
  <v-container>
    <v-row>
      <v-col>
        <SelectorEmpresa @eligioEmpresa="eligioEmpresa($event)" ></SelectorEmpresa>
      </v-col>
    </v-row>

    <v-row v-show="articulos.length>0" class="pb-0 mb-0">
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
      <v-col class="py-0" v-if="articulos.length>0">
          <v-data-table 
              :headers="cabeceras" 
              :items="articulos"  
              :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
              :items-per-page="30" 
              :search="textoBusqueda"
              class="elevation-3" 
          >
            <template v-slot:item.Estado="{ item }">
                <v-icon :class="getClassIconoEstado(item)" :color="getColorEstado(item)" >{{getIconoEstado(item)}}</v-icon>
            </template>
            <template v-slot:item.Actualizar="{ item }">
                <v-icon color="blue" @click="actualizarArticulo(item)" >mdi-refresh</v-icon>
            </template>
            <template v-slot:item.Acciones="{ item }">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon color="red" @click="repararAjustandoStock(item)" v-bind="attrs" v-on="on"  v-show="getMostrarHerramientasAjustarStock(item)">mdi-tools</v-icon>
                    </template>
                    <span>Reparar ajustando stock conciliado: {{item.Id}} - {{item.Nombre}}</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon color="red" @click="repararAgregandoMovimientoStock(item)" v-bind="attrs" v-on="on"  v-show="getMostrarHerramientasAgregarMovimiento(item)">mdi-tools</v-icon>
                    </template>
                    <span>Reparar agregando movimiento de stock: {{item.Id}} - {{item.Nombre}}</span>
                </v-tooltip>
            </template>
        </v-data-table>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>

import SelectorEmpresa from '../../components/SelectorEmpresa.vue'
import store from '../../store'
import fechas from 'vue-lsi-util/fechas'
import productos from '../../store/productosV3'
import movimientosStock from '../../store/movimientosStockV3'

export default {
  name: "ConciliacionStock",

  data() {
    return {
      idEmpresa: null,
      articulos: [],
      textoBusqueda: '',
      cabeceras: [
          {text: '', value: 'Actualizar', sortable: false},
          {text: 'Id', value: 'Id'},
          {text: 'Nombre', value: 'Nombre'},
          {text: 'Barcode', value: 'Barcode'},
          {text: 'Stock conc.', value: 'Stock'},
          {text: 'Stock movim.', value: 'StockEnMovimientos'},
          {text: '', value: 'Estado', sortable: false},
          {text: '', value: 'Acciones', sortable: false},
      ],
      textoBusqueda: '',
    }
  },

  methods: {
    async actualizarArticulo(item) {
      item.Estado="A"
      movimientosStock.conciliarMovimientosStock(item.Id, "N")
      .then( response => {
          item.StockEnMovimientos=response.movimientosEnStock  
          item.Estado=""
        })
    },
    async repararAgregandoMovimientoStock(item) {
      item.Estado="A"
      movimientosStock.conciliarMovimientosStock(item.Id, "M")
        .then ( response => {
          // console.log("Respuesta del agregado de movimientos", response)
          movimientosStock.conciliarMovimientosStock(item.Id, "N")
          .then( response => {
              // console.log("Respuesta de la actualizacion", response)
              item.StockEnMovimientos=response.movimientosEnStock  
              item.Estado=""
            })
        })
    },
    async repararAjustandoStock(item) {
      item.Estado="A"
      movimientosStock.conciliarMovimientosStock(item.Id, "S")
        .then ( response => {
          // console.log("Respuesta del agregado de movimientos", response)
          movimientosStock.conciliarMovimientosStock(item.Id, "N")
          .then( response => {
              // console.log("Respuesta de la actualizacion", response)
              item.Stock=response.articulo.Stock
              item.Estado=""
            })
        })      
    },
    getClassIconoEstado(item) {
      if (item.Estado==="A") {
        return "mdi-spin"
      } else {
        return ""
      }
    },
    getMostrarHerramientasAjustarStock(item) {
      if (item.Estado==="A") {
        return false
      } else if (item.StockEnMovimientos===null) {
        return false
      } else if (item.StockEnMovimientos==item.Stock) {
        return false
      } else if (item.StockEnMovimientos!=item.Stock) {
        return true
      } else {
        return true
      }
    },
    getMostrarHerramientasAgregarMovimiento(item) {
      if (item.Estado==="A") {
        return false
      } else if (item.StockEnMovimientos===null) {
        if (item.Stock==0) {
          return false
        } else {
          return true
        }
      } else if (item.StockEnMovimientos==item.Stock) {
        return false
      } else if (item.StockEnMovimientos!=item.Stock) {
        return true
      } else {
        return true
      }
    },
    getIconoEstado(item) {
      if (item.Estado==="A") {
        return "mdi-refresh"
      } else if (item.StockEnMovimientos===null) {
        if (item.Stock==0) {
          return 'mdi-check'
        } else {
          return "mdi-alert-outline"
        }
      } else if (item.StockEnMovimientos==item.Stock) {
        return 'mdi-check'
      } else if (item.StockEnMovimientos!=item.Stock) {
        return 'mdi-alert-outline'
      } else {
        return 'mdi-excel'
      }
    },
    getColorEstado(item) {
      if (item.Estado==="A") {
        return "orange"
      } else if (item.StockEnMovimientos===null) {
        if (item.Stock==0) {
          return "green"
        } else {
          return "red"
        }
      } else if (item.StockEnMovimientos==item.Stock) {
        return 'green'
      } else if (item.StockEnMovimientos!=item.Stock) {
        return 'red'
      } else {
        return 'grey'
      }
    },
    eligioEmpresa(idEmpresaElegida) {
      this.idEmpresa=idEmpresaElegida
      this.popularArticulosDeLaEmpresa()
    },
    async popularArticulosDeLaEmpresa() {
      try {
        const articulos=await productos.getAllProductosByEmpresa(this.idEmpresa)
        articulos.forEach(e => e.Estado="ND")
        articulos.forEach(e => e.StockEnMovimientos=null)
        this.articulos=articulos
        this.actualizarEstadoConcilacion()
      } catch (error) {
        console.log("Error al leer artículos de la empresa", error)
      }
    },
    async actualizarEstadoConcilacion() {
      for (const e of this.articulos) {
        e.Estado="A"
        try {
          const response=await movimientosStock.conciliarMovimientosStock(e.Id, "N")
          // console.log(response)
          e.StockEnMovimientos=response.movimientosEnStock
          e.Estado=""
        } catch (error) {

        }

      }
     // Despues de la validacion, dejamos solo los que tienen diferencia de Stock
      this.articulos = this.articulos.filter( a => a.Stock != Number(a.StockEnMovimientos))

      // this.articulos.forEach( e => {
      //   e.Estado="A"
      //   movimientosStock.conciliarMovimientosStock(e.Id, "N")
      //     .then( response => {
      //       console.log(response)
      //       e.StockEnMovimientos=response.movimientosEnStock
      //       e.Estado=""
      //     })
      // })
    },
    mostrarError(mensaje) {
      store.dispatch("snackbar/mostrar", mensaje)
    },
    sonidoExito() {
      store.dispatch('sonidos/exito')
    }
  },

  components: {
    SelectorEmpresa
  },

  created() {
    store.dispatch('actualizarTituloPrincipal', 'Stock - Conciliacion')
    store.dispatch('empresas/cargarListaEmpresas','SoloActivas')
  },

  mounted() {
    if (process.env.NODE_ENV==="development") {
      this.idEmpresa=133
      this.popularArticulosDeLaEmpresa()

    }
  }

}
</script>