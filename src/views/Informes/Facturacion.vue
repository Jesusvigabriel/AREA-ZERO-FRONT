<template>
  <v-container>
    <v-row justify="center">
      <v-col class="py-3" cols="2" align="start">
         <v-checkbox label="Una empresa" @change="eligirEmpresa($event)" class="py-0 my-0"></v-checkbox>
      </v-col>      
      <v-col cols="4" v-show="elegirEmpresa">
        <SelectorEmpresa @eligioEmpresa="eligioEmpresa($event)"  ></SelectorEmpresa>
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
      <v-col class="py-0" cols="3" >
          <v-btn @click="exportarAExcel()" color="success" block>Exportar a Excel<excel-icon style="width: 20px; height: 20px; margin-left: 8px;" /></v-btn>
      </v-col>
    </v-row> 
    <!-- Distribucion -->
    <v-row> 
        <br>
        <div class="team" >
          <div><v-divider></v-divider></div>
          <h1 class="subheading grey--text" style="text-align:center">Informe de Facturación</h1>
          <br>
          <h1 class="subheading grey--text" >Distribución</h1>
        <v-container >
          <v-layout row wrap>
        <br>

        <!-- Transporte -->
         <v-flex sm6 xs12 md6 lg3>
       <v-card class="ma-3">
    <v-list-item  >
       <v-list-item-avatar tile class="mt-n7">
      <v-sheet color="green" width="50" height="80" elevation="10">
            <v-icon dark large>mdi-chart-bar</v-icon>
      </v-sheet>
      </v-list-item-avatar>
       <v-list-item-content>
        <v-list-item-title class="headline mb-1 text-right" v-model="importeTransporteExcel">${{this.importeTransporteExcel}}</v-list-item-title>
        <div><v-divider></v-divider></div>
      </v-list-item-content> 
    </v-list-item>
    <v-card-actions>
      <v-icon text class="ma-2">Transporte</v-icon>
    </v-card-actions>
  </v-card>
      </v-flex>

        <!-- Seguro -->
       <v-flex sm6 xs12 md6 lg3>
       <v-card class="ma-3">
    <v-list-item>
       <v-list-item-avatar tile class="mt-n7">
      <v-sheet color="#03A9F4" width="50" height="80" elevation="10">
            <v-icon dark large>mdi-chart-bar</v-icon>
      </v-sheet>
      </v-list-item-avatar>
       <v-list-item-content>
        <v-list-item-title class="headline mb-1 text-right" v-model="importeSeguroExcel">${{this.importeSeguroExcel}}</v-list-item-title>
        <div><v-divider></v-divider></div>
      </v-list-item-content> 
    </v-list-item>
    <v-card-actions>
      <v-icon text class="ma-2">Seguro</v-icon>
    </v-card-actions>
  </v-card>
      </v-flex>

        <!-- Complemento -->
         <v-flex sm6 xs12 md6 lg3>
       <v-card class="ma-3">
    <v-list-item  >
       <v-list-item-avatar tile class="mt-n7">
      <v-sheet color="#F44336" width="50" height="80" elevation="10">
            <v-icon dark large>mdi-chart-bar</v-icon>
      </v-sheet>
      </v-list-item-avatar>
       <v-list-item-content>
        <v-list-item-title class="headline mb-1 text-right" v-model="importeComplemento">${{this.importeComplemento}}</v-list-item-title>
        <div><v-divider></v-divider></div>
      </v-list-item-content> 
    </v-list-item>
    <v-card-actions>
      <v-icon text class="ma-2">Complemento</v-icon>
    </v-card-actions>
  </v-card>
      </v-flex>

      <!-- ContraReembolso -->
       <v-flex sm6 xs12 md6 lg3>
       <v-card class="ma-3">
    <v-list-item>
       <v-list-item-avatar tile class="mt-n7">
      <v-sheet color="success" width="50" height="80" elevation="10">
            <v-icon dark large>mdi-chart-bar</v-icon>
      </v-sheet>
      </v-list-item-avatar>
       <v-list-item-content>
        <v-list-item-title class="headline mb-1 text-right" v-model="ContraReembolsoExcel">${{this.ContraReembolsoExcel}}</v-list-item-title>
        <div><v-divider></v-divider></div>
      </v-list-item-content> 
    </v-list-item>
    <v-card-actions>
      <v-icon text class="ma-2">ContraReembolso</v-icon>
    </v-card-actions>
  </v-card>
      </v-flex>

       <!-- PickingCD -->
       <v-flex sm6 xs12 md6 lg3>
      <v-card class="ma-3">
    <v-list-item >
       <v-list-item-avatar tile class="mt-n7">
      <v-sheet color="success" width="50" height="80" elevation="10">
            <v-icon dark large>mdi-chart-bar</v-icon>
      </v-sheet>
      </v-list-item-avatar>
       <v-list-item-content>
        <v-list-item-title class="headline mb-1 text-right" v-model="importePickingCD">${{this.importePickingCD}}</v-list-item-title>
        <div><v-divider></v-divider></div>
      </v-list-item-content> 
    </v-list-item>
    <v-card-actions>
      <v-icon text class="ma-2">PickingCD</v-icon>
    </v-card-actions>
  </v-card>
      </v-flex>

      <!-- Total -->
       <v-flex sm6 xs12 md6 lg3>
      <v-card class="ma-3">
    <v-list-item >
       <v-list-item-avatar tile class="mt-n7">
      <v-sheet color="#03A9F4" width="50" height="80" elevation="10">
            <v-icon dark large>mdi-chart-bar</v-icon>
      </v-sheet>
      </v-list-item-avatar>
       <v-list-item-content>
        <v-list-item-title class="headline mb-1 text-right" v-model="importeTotalExcel">${{this.importeTotalExcel}}</v-list-item-title>
        <div><v-divider></v-divider></div>
      </v-list-item-content> 
    </v-list-item>
    <v-card-actions>
      <v-icon text class="ma-2">Total</v-icon>
    </v-card-actions>
  </v-card>
      </v-flex>

      <!-- Cantidad de guias -->
       <v-flex sm6 xs12 md6 lg3>
      <v-card class="ma-3">
    <v-list-item >
       <v-list-item-avatar tile class="mt-n7">
      <v-sheet color="#F44336" width="50" height="80" elevation="10">
            <v-icon dark large>mdi-chart-bar</v-icon>
      </v-sheet>
      </v-list-item-avatar>
       <v-list-item-content>
        <v-list-item-title class="headline mb-1 text-right" v-model="cantidadGuiasExcel">{{this.cantidadGuiasExcel}}</v-list-item-title>
        <div><v-divider></v-divider></div>
      </v-list-item-content> 
    </v-list-item>
    <v-card-actions>
      <v-icon text class="ma-2">Cantidad de Guias</v-icon>
    </v-card-actions>
  </v-card>
      </v-flex>
        </v-layout>
          <br>  
      <div><v-divider></v-divider></div>
       <br>
           <LineChartGenerator
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey" 
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
       
      <div><v-divider></v-divider></div>
         <Bar
    :chart-options="chartOptions2"
    :chart-data="chartData2"
    :chart-id="chartId2"
    :dataset-id-key="datasetIdKey2"
    :plugins="plugins2"
    :css-classes="cssClasses2"
    :styles="styles2"
    :width="width2"
    :height="height2"
  />
    
    </v-container>
  </div>
   </v-row>

   <!-- Ordemes -->
   <v-row> 
        <br>
        <div class="team" >
          <div><v-divider></v-divider></div>
          <h1 class="subheading grey--text" >Ordenes e Ingresos</h1>
        <v-container >
          <v-layout row wrap>
        <br>

        <!-- Total Ordenes -->
      <v-flex sm6 xs12 md6 lg3>
       <v-card class="ma-3">
        <v-list-item  >
          <v-list-item-avatar tile class="mt-n7">
          <v-sheet color="green" width="50" height="80" elevation="10">
                <v-icon dark large>mdi-chart-bar</v-icon>
          </v-sheet>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="headline mb-1 text-right" v-model="totalOrdenes">{{this.totalOrdenes}}</v-list-item-title>
            <div><v-divider></v-divider></div>
          </v-list-item-content> 
        </v-list-item>
        <v-card-actions>
          <v-icon text class="ma-2">Total Ordenes</v-icon>
        </v-card-actions>
      </v-card>
      </v-flex>

        <!-- Total Ingresos -->
       <v-flex sm6 xs12 md6 lg3>
       <v-card class="ma-3">
    <v-list-item>
       <v-list-item-avatar tile class="mt-n7">
      <v-sheet color="#03A9F4" width="50" height="80" elevation="10">
            <v-icon dark large>mdi-chart-bar</v-icon>
      </v-sheet>
      </v-list-item-avatar>
       <v-list-item-content>
        <v-list-item-title class="headline mb-1 text-right" v-model="totalIngresos">{{this.totalIngresos}}</v-list-item-title>
        <div><v-divider></v-divider></div>
      </v-list-item-content> 
    </v-list-item>
    <v-card-actions>
      <v-icon text class="ma-2">Total Ingresos</v-icon>
    </v-card-actions>
  </v-card>
      </v-flex>

         <!-- Total Metros Cubicos -->
         <v-flex sm6 xs12 md6 lg3>
       <v-card class="ma-3">
    <v-list-item>
       <v-list-item-avatar tile class="mt-n7">
      <v-sheet color="#03A9F4" width="50" height="80" elevation="10">
            <v-icon dark large>mdi-chart-bar</v-icon>
      </v-sheet>
      </v-list-item-avatar>
       <v-list-item-content>
        <v-list-item-title class="headline mb-1 text-right" v-model="acumuladoM3">{{Number(this.acumuladoM3).toFixed(2)}}</v-list-item-title>
        <div><v-divider></v-divider></div>
      </v-list-item-content> 
    </v-list-item>
    <v-card-actions>
      <v-icon text class="ma-2">Total M3</v-icon>
    </v-card-actions>
  </v-card>
      </v-flex> 
      
        <!-- Total In -->
        <v-flex sm6 xs12 md6 lg3>
          <v-card class="ma-3">
        <v-list-item>
          <v-list-item-avatar tile class="mt-n7">
          <v-sheet color="#03A9F4" width="50" height="80" elevation="10">
                <v-icon dark large>mdi-chart-bar</v-icon>
          </v-sheet>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="headline mb-1 text-right" v-model="importeTotalIn">${{this.importeTotalIn}}</v-list-item-title>
            <div><v-divider></v-divider></div>
          </v-list-item-content> 
        </v-list-item>
        <v-card-actions>
          <v-icon text class="ma-2">Total In</v-icon>
        </v-card-actions>
      </v-card>
          </v-flex> 

              <!-- Total Out -->
     <v-flex sm6 xs12 md6 lg3>
          <v-card class="ma-3">
        <v-list-item>
          <v-list-item-avatar tile class="mt-n7">
          <v-sheet color="#03A9F4" width="50" height="80" elevation="10">
                <v-icon dark large>mdi-chart-bar</v-icon>
          </v-sheet>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="headline mb-1 text-right" v-model="importeTotalOut">${{this.importeTotalOut}}</v-list-item-title>
            <div><v-divider></v-divider></div>
          </v-list-item-content> 
        </v-list-item>
        <v-card-actions>
          <v-icon text class="ma-2">Total Out</v-icon>
        </v-card-actions>
      </v-card>
          </v-flex>    
          
                  <!-- Total Almacenaje -->
       <v-flex sm6 xs12 md6 lg3>
          <v-card class="ma-3">
        <v-list-item>
          <v-list-item-avatar tile class="mt-n7">
          <v-sheet color="#03A9F4" width="50" height="80" elevation="10">
                <v-icon dark large>mdi-chart-bar</v-icon>
          </v-sheet>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="headline mb-1 text-right" v-model="importeTotalDiario">${{importeTotalDiario}}</v-list-item-title>
            <div><v-divider></v-divider></div>
          </v-list-item-content> 
        </v-list-item>
        <v-card-actions>
          <v-icon text class="ma-2">Total Almacenaje</v-icon>
        </v-card-actions>
      </v-card>
          </v-flex> 

            <!-- Total Seguro -->
       <v-flex sm6 xs12 md6 lg3>
          <v-card class="ma-3">
        <v-list-item>
          <v-list-item-avatar tile class="mt-n7">
          <v-sheet color="#03A9F4" width="50" height="80" elevation="10">
                <v-icon dark large>mdi-chart-bar</v-icon>
          </v-sheet>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="headline mb-1 text-right" v-model="importeSeguro">${{importeSeguro}}</v-list-item-title>
            <div><v-divider></v-divider></div>
          </v-list-item-content> 
        </v-list-item>
        <v-card-actions>
          <v-icon text class="ma-2">Total Seguro</v-icon>
        </v-card-actions>
      </v-card>
          </v-flex>
          
           <!-- Total Seguro -->
       <v-flex sm6 xs12 md6 lg3>
          <v-card class="ma-3">
        <v-list-item>
          <v-list-item-avatar tile class="mt-n7">
          <v-sheet color="#03A9F4" width="50" height="80" elevation="10">
                <v-icon dark large>mdi-chart-bar</v-icon>
          </v-sheet>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="headline mb-1 text-right" v-model="importePrepago">${{importePrepago}}</v-list-item-title>
            <div><v-divider></v-divider></div>
          </v-list-item-content> 
        </v-list-item>
        <v-card-actions>
          <v-icon text class="ma-2">Total Prepago</v-icon>
        </v-card-actions>
      </v-card>
          </v-flex>

     </v-layout>
         <br>  
      <div><v-divider></v-divider></div>
       <br>
       <template>
      <div class="contenedor">
        <v-flex sm6 xs12 md6 lg3>
        <Doughnut
          :chart-options="chartOptionsOrdenes"
          :chart-data="chartDataOrdenes"
          :chart-id="chartOrdenes"
          :dataset-id-key="datasetIdKey"
          :plugins="plugins"
          :css-classes="cssClasses"
          :styles="styles"
          :width="width"
          :height="height"
        />
        <p class="parrafo">Cantidad de Ordenes</p>
      </v-flex>
      
        <v-flex sm6 xs12 md6 lg3>
        <Doughnut
          :chart-options="chartOptionsIngresos"
          :chart-data="chartDataIngresos"
          :chart-id="chartIngresos"
          :dataset-id-key="datasetIdKey"
          :plugins="plugins"
          :css-classes="cssClasses"
          :styles="styles"
          :width="width"
          :height="height"
        />
        <p class="parrafo">Cantidad de Ingresos</p>
      </v-flex>
    </div>
      </template>
       
      <div><v-divider></v-divider></div>
    
    </v-container>
  </div>
   </v-row>
 </v-container>
</template>

<style>
  .contenedor
  {
    display: flex;
    justify-content: space-around;
  }
  .parrafo
  {
    text-align: center;
    margin-top: 5px;
  }
</style>

<script>
import { Line as LineChartGenerator } from 'vue-chartjs/legacy'
import { Doughnut } from 'vue-chartjs/legacy'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
} from 'chart.js'

import { Bar } from 'vue-chartjs/legacy'
import store from "../../store"
import SelectorEmpresa from '@/components/SelectorEmpresa.vue'
import empresas from "@/store/empresasV3"
import guias from "@/store/guias"
import fechas from 'vue-lsi-util/fechas'
import ordenes from "@/store/ordenesV3"
import excel from "exceljs"
import {saveAs} from "file-saver"
import cadenas from 'vue-lsi-util/cadenas'

import { ExcelIcon } from '@/components/icons'

ChartJS.register(Title,Tooltip,Legend,LineElement,LinearScale,CategoryScale,PointElement,ArcElement,BarElement)

export default {
  name: "Informes_InformesFacturacion",

  components: {
    ExcelIcon,
    SelectorEmpresa, Bar, LineChartGenerator, Doughnut
  },

  props: {
    chartId2: {
      type: String,
      default: 'bar-chart'
    },
    datasetIdKey2: {
      type: String,
      default: 'label'
    },
    width2: {
      type: Number,
      default: 400
    },
    height2: {
      type: Number,
      default: 400
    },
    cssClasses2: {
      default: '',
      type: String
    },
    styles2: {
      type: Object,
      default: () => {}
    },
    plugins2: {
      type: Array,
      default: () => []
    },
    
    chartOrdenes: {
      type: String,
      default: 'doughnut-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    },
    cssClasses: {
      default: '',
      type: String
    },
    styles: {
      type: Object,
      default: () => {}
    },
    plugins: {
      type: Array,
      default: () => []
    },

    chartIngresos: {
      type: String,
      default: 'doughnut-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    },
    cssClasses: {
      default: '',
      type: String
    },
    styles: {
      type: Object,
      default: () => {}
    },
    plugins: {
      type: Array,
      default: () => []
    },
    
    chartId: {
      type: String,
      default: 'line-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    },
    cssClasses: {
      default: '',
      type: String
    },
    styles: {
      type: Object,
      default: () => {}
    },
    plugins: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      chartData: {
        labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        datasets: [
          {
            label: 'Cantidad de guias por mes en un año',
            backgroundColor: ['var(--estado-entregado)'],
            data: [0,0,0,0,0,0,0,0,0,0,0,0]
          }
        ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      },
      
      chartData2: {
        labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        datasets: [
          {
            label: 'Cantidad de facturacion Total por mes en un año',
            backgroundColor: ['#03a9f4'],
            data: [0,0,0,0,0,0,0,0,0,0,0,0]
          }
        ]
      },
      chartOptions2: {
        responsive: true,
        maintainAspectRatio: false
      },

      chartDataOrdenes: {
        labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        datasets: [
          {
            backgroundColor: ['#0A8049', '#0BD64F', '#23D613', '#47CC06','#11BD27','#12FF2A','#0DE077'],
            data: [0,0,0,0,0,0,0,0,0,0,0,0]
          }
        ]
      },
      chartOptionsOrdenes: {
        responsive: true,
        maintainAspectRatio: false
      },

      chartDataIngresos: {
        labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        datasets: [
          {
            backgroundColor: ['#6728F8', '#2823D9', '#325DF0', '#237DD9','#28C6F8','#2390D9','#3F8ED9'],
            data: [0,0,0,0,0,0,0,0,0,0,0,0]
          }
        ]
      },
      chartOptionsIngresos: {
        responsive: true,
        maintainAspectRatio: false
      },
 
      acumuladoKilosPrevio: 0,
      acumuladoUnidadesPrevio: 0,
      ContraReembolsoExcel: 0,
      importeTotalExcel: 0,
      importePickingCD: 0,
      importeComplemento: 0,
      importeSeguroExcel: 0,
      importeTransporteExcel: 0,
      importeSeguroExcelAlmacenaje: 0,
      configuracionPrepagoSeguro: [],
      ContraReembolso:0,
      importeTotal:0,
      importePickingCDExcel:0,
      importeComplementoExcel: 0,
      importeSeguro: 0,
      importeTransporte: 0,
      cantidadGuiasExcel:0,
      fechaDesde: '2021-11-01',
      fechaHasta: '2021-11-01',
      finalizoTodo: false,
      idEmpresa:-1,
      informacionAExportar: false,
      elegirEmpresa: false,
      informacionAExportar: [],
      textoBusqueda: '',
      numeroDeMeses: [],
      mesesArray: [],
      mesesTotalesArray: [],
      nuevoMesArray:[],
      mesesOrdenes:[],
      mesesIngresos:[],
      totalOrdenes:0,
      totalIngresos:0,
      arrEmpresas: [],
      sumaUno:0,
      acumuladoM3:0,
      configuracionesEmpresa:[],
      importeTotalIn:0,
      importeTotalOut:0,
      importeTotalDiario:0,
      importeTotalAlmacenajeExcel:0,
      importeTotalIntegralExcel:0,
      empresas:[],
      importeSeguro:0,
      importePrepago:0,
      empresa :{},
      importeTotalInExcel:0,
      importeTotalOutExcel:0,
      importeTotalDiarioExcel:0,
      importeSeguroAlmacenajeExcel:0,
      importeTotalExcelFinal:0,
      informacionAExportarExcel: [],
      nuevasEmpresas: [],
    }
  },

  methods: {
    eligirEmpresa(){
      this.elegirEmpresa = !this.elegirEmpresa  
    },

    async obtenerInformacion() {
      this.mesesArray=[]
      this.numeroDeMeses=[]
      this.mesesTotalesArray=[]
      this.importeSeguroExcel = 0
      this.importeTransporteExcel = 0
      this.importeComplemento = 0
      this.importePickingCD = 0
      this.importeTotalExcel = 0
      this.importeTotalDiario = 0
      this.importeTotalDiarioExcel = 0
      this.ContraReembolsoExcel = 0
      this.informacionAExportar = []
      this.informacionAExportarExcel = []
      this.finalizoTodo = false
      this.configuracionesEmpresa = []
      this.acumuladoM3 = 0     
      this.acumuladoKilosPrevio = 0    
      this.acumuladoUnidadesPrevio = 0
      this.importeTotalIn = 0
      let response   

      if (this.elegirEmpresa) {
        if (this.idEmpresa==-1) {
          this.mostrarError("No se ha seleccionado Empresa")
          return
        }
      }

      if (!this.elegirEmpresa) {
        try {
          //  for(const empresa of this.empresas){ 
          //    // 90 - 138 - 224 - 194 - 209 - 198 - 199 -188 - 53 - 25 - 156 - 87 - 184 - 236 - 8 - 136 - 208 - 219 - 70 - 191
          //    if(empresa.Id == 90  || empresa.Id == 183){
          //      this.nuevasEmpresas.push(empresa)
          //   }
          //  }
       
          for await (const empresa of this.empresas){
                
            //response = await guias.getByPeriodoFechaIdEmpresa(this.fechaDesde, this.fechaHasta, empresa.Id)

            //obtenemos las guias de las empresas en el periodo seleccionado
            response = await guias.getByPeriodoIdEmpresa(this.fechaDesde, this.fechaHasta, empresa.Id)
            this.informacionAExportar=response
            // Obtengo importes totales de las Guias
            this.obtenerImporteTotal(this.informacionAExportar, empresa.Id)
          }
        } catch (error) {
          console.log(error)            
        }
      } else {
        try {
          //obtenemos las guias de la empresa en el periodo seleccionado
          response =  await guias.getByPeriodoIdEmpresa(this.fechaDesde, this.fechaHasta, this.idEmpresa)
          this.informacionAExportar=response
          // Obtengo importes totales de las Guias
          this.obtenerImporteTotal(this.informacionAExportar, this.idEmpresa)
          //complemento
        } catch (error) {
          console.log(error)          
        } 
      }
      
      //Info de Ordenes
      this.obtenerOrdenes()
      // Info de Ingresos
      this.obtenerIngresos()
      // Obtener M3
      this.ObtenerM3()

    },
    
    async obtenerImporteTotal(guias, idEmpresa){
  
      if (!this.elegirEmpresa) {      
        this.ContraReembolso=0
        this.ContraReembolsoExcel = 0
        this.importeTotal=0
        this.importeTotalExcel = 0
        this.importePickingCDExcel=0
        this.importePickingCD = 0
        this.importeComplemento = 0
        this.importeComplementoExcel= 0
        this.importeSeguro= 0
        this.importeSeguroExcel = 0
        this.importeTransporte= 0
        this.cantidadGuiasExcel = 0
        this.importeTransporteExcel = 0
        this.importeSeguroExcel = 0      
      }else{
        this.importeTransporte= 0
        this.importeTransporteExcel = 0
        this.importeComplemento = 0
        this.importeComplementoExcel= 0
        this.importeSeguro= 0
        this.importeSeguroExcel = 0
        this.cantidadGuiasExcel = 0
        this.importePickingCD = 0
        this.importePickingCDExcel=0
        this.importeTotal=0
        this.importeTotalExcel = 0
        this.importeTotalExcelFinal = 0
        this.ContraReembolso=0
        this.ContraReembolsoExcel = 0
      }

      guias.forEach (e=> {

          this.mesesArray.push(e.Fecha.substring(5,7))

          if (e.Id===952867) {}

          e.Conceptos={Guia: 0, Seguro: 0, Complemento: 0, CTR: 0, PickingCD: 0, Total: 0}

          if (e.DetalleCalculo) {
            e.DetalleCalculo=JSON.parse(e.DetalleCalculo)
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
                this.mesesTotalesArray.push({mes: e.Fecha.substring(5,7), valor: e.Conceptos.Total})
            } else {
              e.Canal="N/D"
            }
          } else {
            e.Canal="N/D"
          }
        })
      
        for (const concepto of this.informacionAExportar){                
          this.cantidadGuiasExcel++
          if (typeof concepto.Conceptos.Seguro==="string"){
            if (!isNaN(Number(concepto.Conceptos.Seguro))){
              this.importeSeguroExcel += Number(concepto.Conceptos.Seguro)
              this.importeSeguro += Number(concepto.Conceptos.Seguro)
            }
          } else {
            this.importeSeguroExcel += concepto.Conceptos.Seguro
            this.importeSeguro += concepto.Conceptos.Seguro
          }
          if (typeof concepto.Conceptos.Guia==="string"){   
            if (!isNaN(Number(concepto.Conceptos.Guia))){
              this.importeTransporteExcel += Number(concepto.Conceptos.Guia)
              this.importeTransporte += Number(concepto.Conceptos.Guia)
          }
        } else {
            this.importeTransporteExcel += concepto.Conceptos.Guia
            this.importeTransporte += concepto.Conceptos.Guia
          }
          if (typeof concepto.Conceptos.Complemento==="string"){        
            if (!isNaN(Number(concepto.Conceptos.Complemento))){
              this.importeComplemento += Number(concepto.Conceptos.Complemento)
              this.importeComplementoExcel += Number(concepto.Conceptos.Complemento)
            }
          } else {
            this.importeComplemento += concepto.Conceptos.Complemento
            this.importeComplementoExcel += concepto.Conceptos.Complemento
          }
          if (typeof concepto.Conceptos.PickingCD==="string"){          
            if (!isNaN(Number(concepto.Conceptos.PickingCD))){
              this.importePickingCD += Number(concepto.Conceptos.PickingCD)
              this.importePickingCDExcel += Number(concepto.Conceptos.PickingCD)
            }
          } else {
            this.importePickingCD += concepto.Conceptos.PickingCD
            this.importePickingCDExcel += concepto.Conceptos.PickingCD
          }
          if (typeof concepto.ContraReembolso==="string"){        
            if (!isNaN(Number(concepto.ContraReembolso))){
              this.ContraReembolsoExcel += Number(concepto.Conceptos.CTR)
              this.ContraReembolso += Number(concepto.Conceptos.CTR)
            }
          } else {
            this.ContraReembolsoExcel += concepto.Conceptos.CTR
            this.ContraReembolso += concepto.Conceptos.CTR
          }
          if (typeof concepto.Conceptos.Total==="string"){
            if (!isNaN(Number(concepto.Conceptos.Total))){
              this.importeTotalExcel += Number(concepto.Conceptos.Total)
              this.importeTotal += Number(concepto.Conceptos.Total)
            }
          } else {
            this.importeTotalExcel += concepto.Conceptos.Total
            this.importeTotal += concepto.Conceptos.Total
          } 
        }  
       
        //Valores Excel
        this.importeTotalExcelFinal = this.importeTotalExcel
        // Valores Excel
        this.informacionAExportarExcel.push({id: idEmpresa, importeSeguro: this.importeSeguro, importeTransporte: this.importeTransporte, importeComplemento: this.importeComplementoExcel, importePickingCD: this.importePickingCDExcel, ContraReembolsoExcel: this.ContraReembolso, importeTotalExcel: this.importeTotal })

      this.fechasGrafico()     
    },

    eligioEmpresa(idEmpresaElegida) {
      this.idEmpresa=idEmpresaElegida
      this.informacionAExportar=[]
      this.guiasSeleccionadas=[]

      //Obtengo la configuracion de la empresa.
      empresas.getOneById(idEmpresaElegida)
        .then(respuesta => {
          this.empresa = respuesta
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

    fechasGrafico(){

      this.chartData.datasets[0].data = [0,0,0,0,0,0,0,0,0,0,0,0]
      this.sumaUno = 1
      this.mesesArray.forEach(e => {
        switch (e) {
          case "01":
          this.chartData.datasets[0].data[0] += this.sumaUno 
            break;
          case "02":
            this.chartData.datasets[0].data[1] += this.sumaUno
            break;
          case "03":
            this.chartData.datasets[0].data[2] += this.sumaUno
            break;
          case "04":
            this.chartData.datasets[0].data[3] += this.sumaUno
            break;
          case "05":
            this.chartData.datasets[0].data[4]+= this.sumaUno
            break;
          case "06":
            this.chartData.datasets[0].data[5] += this.sumaUno
            break;
          case "07":
            this.chartData.datasets[0].data[6] += this.sumaUno
            break;
          case "08":
            this.chartData.datasets[0].data[7] += this.sumaUno
            break;
          case "09":
            this.chartData.datasets[0].data[8] += this.sumaUno
            break;
          case "10":
            this.chartData.datasets[0].data[9] += this.sumaUno
            break;
          case "11":
            this.chartData.datasets[0].data[10] += this.sumaUno
            break;
          case "12":
            this.chartData.datasets[0].data[11] += this.sumaUno
            break;

          default:
            break;
        }
      })

      this.sumaUno = 0
      this.chartData2.datasets[0].data = [0,0,0,0,0,0,0,0,0,0,0,0]
   
      this.mesesTotalesArray.forEach(e => {
        switch (e.mes) {
          case "01":
          this.chartData2.datasets[0].data[0] += e.valor
            break;
          case "02":
            this.chartData2.datasets[0].data[1] += e.valor
            break;
          case "03":
            this.chartData2.datasets[0].data[2] += e.valor
            break;
          case "04":
            this.chartData2.datasets[0].data[3] += e.valor
            break;
          case "05":
            this.chartData2.datasets[0].data[4]+= e.valor
            break;
          case "06":
            this.chartData2.datasets[0].data[5] += e.valor
            break;
          case "07":
            this.chartData2.datasets[0].data[6] += e.valor
            break;
          case "08":
            this.chartData2.datasets[0].data[7] += e.valor
            break;
          case "09":
            this.chartData2.datasets[0].data[8] += e.valor
            break;
          case "10":
            this.chartData2.datasets[0].data[9] += e.valor
            break;
          case "11":
            this.chartData2.datasets[0].data[10] += e.valor
            break;
          case "12":
            this.chartData2.datasets[0].data[11] += e.valor
            break;

          default:
            break;
        }
      })

    const Inicio = this.fechasSeparadas(this.fechaDesde)
    const Final = this.fechasSeparadas(this.fechaHasta)

    },

    nombreDeMeses(fecha){
   
      switch (fecha) {
        case 1:
          fecha = "Enero"
          break;
        case 2:
          fecha = "Febrero"
          break;
        case 3:
          fecha = "Marzo"
          break;
        case 4:
          fecha = "Abril"
          break;
        case 5:
          fecha = "Mayo"
          break;
        case 6:
          fecha = "Junio"
          break;
        case 7:
          fecha = "Julio"
          break;
        case 8:
          fecha = "Agosto"
          break;
        case 9:
          fecha = "Septiembre"
          break;
        case 10:
          fecha = "Octubre"
          break;
        case 11:
          fecha = "Noviembre"
          break;
        case 12:
          fecha = "Diciembre"
          break;

        default:
          break;
      }
      return fecha
    },

    fechasSeparadas(fecha){

      const [dia, mes, año] = fecha.split('-')
      this.numeroDeMeses.push(Number(mes))
      return [dia, mes, año]

    },


    async obtenerOrdenes() {
      let response

      if (this.elegirEmpresa) {
        if (this.idEmpresa==-1) {
          this.mostrarError("No se ha seleccionado Empresa")
          return
        }
      }

      if (!this.elegirEmpresa) {
        
        try {
          this.mesesOrdenes = []
          this.totalOrdenes = 0
          response = await ordenes.getCantByPeriodo(this.fechaDesde, this.fechaHasta)
          if(response.length>=0){
            response.forEach(e => {
              this.totalOrdenes++
              this.mesesOrdenes.push(e.Fecha.substring(5,7))
            })
            
            this.agruparOrdenes()
          }     
        } catch (error) {
          console.log(error)          
        }
      } else {
        try {
          this.mesesOrdenes = []
          this.totalOrdenes = 0
          response =  await ordenes.getCantByPeriodoEmpresa(this.fechaDesde, this.fechaHasta, this.idEmpresa)
          if(response.length>=0){
            response.forEach(e => {
            this.totalOrdenes++
            this.mesesOrdenes.push(e.Fecha.substring(5,7))
           })

            this.agruparOrdenes() 
          }
        } catch (error) {
          console.log(error)          
        }
      } 
      // this.generarInformeExcel(response)
    },

    agruparOrdenes(){
      this.chartDataOrdenes.datasets[0].data = [0,0,0,0,0,0,0,0,0,0,0,0]
      this.sumaUno = 1
      this.mesesOrdenes.forEach(e => {
        switch (e) {
          case "01":
            this.chartDataOrdenes.datasets[0].data[0] += this.sumaUno
            break;
          case "02":
            this.chartDataOrdenes.datasets[0].data[1] += this.sumaUno
            break;
          case "03":
            this.chartDataOrdenes.datasets[0].data[2] += this.sumaUno
            break;
          case "04":
            this.chartDataOrdenes.datasets[0].data[3] += this.sumaUno
            break;
          case "05":
            this.chartDataOrdenes.datasets[0].data[4]+= this.sumaUno
            break;
          case "06":
            this.chartDataOrdenes.datasets[0].data[5] += this.sumaUno
            break;
          case "07":
            this.chartDataOrdenes.datasets[0].data[6] += this.sumaUno
            break;
          case "08":
            this.chartDataOrdenes.datasets[0].data[7] += this.sumaUno
            break;
          case "09":
            this.chartDataOrdenes.datasets[0].data[8] += this.sumaUno
            break;
          case "10":
            this.chartDataOrdenes.datasets[0].data[9] += this.sumaUno
            break;
          case "11":
            this.chartDataOrdenes.datasets[0].data[10] += this.sumaUno
            break;
          case "12":
            this.chartDataOrdenes.datasets[0].data[11] += this.sumaUno
            break;

          default:
            break;
        }
     })
     this.sumaUno = 0
    },

    async obtenerIngresos() {
       this.chartDataIngresos.datasets[0].data = [0,0,0,0,0,0,0,0,0,0,0,0]
          this.mesesIngresos = []
          this.totalIngresos = 0
      if (!this.elegirEmpresa) {
        
        try {
          const ingresos = await empresas.getInPeriodo(this.fechaDesde, this.fechaHasta,  "Obteniendo Ingresos")
          if(typeof ingresos[0].fecha === 'undefined'){
              this.totalIngresos = 0
              this.mesesIngresos = []        
            }else{ 
              ingresos.forEach(e => {
                this.totalIngresos++
                this.mesesIngresos.push(e.fecha.substring(5,7))
              }) 

              this.agruparIngresos()
            }

        } catch (error) {
          console.log(error)          
        }
      } else {
        try {
          this.mesesIngresos = []
          this.totalIngresos = 0
          const ingresos = await empresas.getInPeriodoEmpresa(this.idEmpresa,this.fechaDesde, this.fechaHasta,  "Obteniendo Ingresos")
          
          if(typeof ingresos[0].fecha === 'undefined'){
              this.totalIngresos = 0
              this.mesesIngresos = []
            }else{
              ingresos.forEach(e => {
                this.totalIngresos++
                this.mesesIngresos.push(e.fecha.substring(5,7))
              })

              this.agruparIngresos()
            }
        } catch (error) {
          console.log(error)          
        }
      }   
    },

    agruparIngresos(){
      this.chartDataIngresos.datasets[0].data = [0,0,0,0,0,0,0,0,0,0,0,0]
      this.sumaUno = 1
      this.mesesIngresos.forEach(e => {
        switch (e) {
          case "01":
            this.chartDataIngresos.datasets[0].data[0] += this.sumaUno
            break;
          case "02":
            this.chartDataIngresos.datasets[0].data[1] += this.sumaUno
            break;
          case "03":
            this.chartDataIngresos.datasets[0].data[2] += this.sumaUno
            break;
          case "04":
            this.chartDataIngresos.datasets[0].data[3] += this.sumaUno
            break;
          case "05":
            this.chartDataIngresos.datasets[0].data[4]+= this.sumaUno
            break;
          case "06":
            this.chartDataIngresos.datasets[0].data[5] += this.sumaUno
            break;
          case "07":
            this.chartDataIngresos.datasets[0].data[6] += this.sumaUno
            break;
          case "08":
            this.chartDataIngresos.datasets[0].data[7] += this.sumaUno
            break;
          case "09":
            this.chartDataIngresos.datasets[0].data[8] += this.sumaUno
            break;
          case "10":
            this.chartDataIngresos.datasets[0].data[9] += this.sumaUno
            break;
          case "11":
            this.chartDataIngresos.datasets[0].data[10] += this.sumaUno
            break;
          case "12":
            this.chartDataIngresos.datasets[0].data[11] += this.sumaUno
            break;

          default:
            break;
        }
      })
      this.sumaUno = 0
    },    

    async  ObtenerM3(){
      this.importeSeguroExcel = Number(this.importeSeguroExcel.toFixed(2)).toLocaleString('es', { style: 'currency', currency: 'ARS' })
      this.importeTransporteExcel = Number(this.importeTransporteExcel.toFixed(2)).toLocaleString('es', { style: 'currency', currency: 'ARS'})
      this.importeComplemento = Number(this.importeComplemento.toFixed(2)).toLocaleString('es', { style: 'currency', currency: 'ARS'})
      this.importePickingCD = Number(this.importePickingCD.toFixed(2)).toLocaleString('es', { style: 'currency', currency: 'ARS'})
      this.importeTotalExcel = Number(this.importeTotalExcel.toFixed(2)).toLocaleString('es', { style: 'currency', currency: 'ARS'})
      this.ContraReembolsoExcel = Number(this.ContraReembolsoExcel.toFixed(2)).toLocaleString('es', { style: 'currency', currency: 'ARS'})

      this.acumuladoM3 = 0
      try {
        // Inicio del codigo para obtener los M3 cubicos ocupados de una empresa o Varias empresas.
        let response
        let acumuladoUnidades = 0
        let acumuladoKilos = 0
        let acumM3 = 0
        this.importeSeguroExcelAlmacenaje = 0
        this.importeTotalDiarioExcel = 0
        this.importeTotalInExcel = 0
        this.importeTotalOutExcel = 0
        this.importeTotalDiario = 0
        this.importeTotalIn = 0
        this.importeTotalOut=0
        this.importeSeguro=0
        this.importePrepago=0
        const hastaInformacionPrevia=fechas.dateToString(fechas.getSumarDiasFecha(0, new Date(this.fechaDesde)))
        //Obtengo la info previa si eligio empresa o no.
        if (!this.elegirEmpresa){
          // for await (const empresa of this.empresas){
          //     response = await empresas.getAlmacenajePrevio(empresa.Id, '1900-01-01', hastaInformacionPrevia, "Obteniendo información previa")
          //     this.acumuladoM3 += response[0].totalM3
          // }
        }else{
          // obtenemos almacenaje previo de la empresa seleccionada
          response = await empresas.getAlmacenajePrevio(this.idEmpresa, '1900-01-01', hastaInformacionPrevia, "Obteniendo información previa")

          this.acumuladoM3 += response[0].totalM3            
          this.acumuladoKilosPrevio += response[0].totalKilos   
          this.acumuladoUnidadesPrevio += response[0].totalUnidades

          //Obtengo las configuraciones
          // empresas.getConfiguracionesEmpresa(this.idEmpresa,String(this.fechaDesde),String(this.fechaHasta+ ' 23:59:59'))
          // .then(response => {          
          //   this.configuracionesEmpresa.push(response[0])
          // })
          // .catch(error => {
          //   console.log(error)
          // })           
        }

        const desdePeriodoAProcesar=fechas.dateToString(fechas.getSumarDiasFecha(2, new Date(this.fechaDesde)))
        const hastaPeriodoAProcesar=fechas.dateToString(fechas.getSumarDiasFecha(2, new Date(this.fechaHasta)))
        const fechaAumentoAnterior=fechas.dateToString(fechas.getSumarDiasFecha(-120, new Date(this.fechaDesde)))  
        // const fechasAObtener=this.getDaysArray(new Date(this.fechaDesde), new Date(this.fechaHasta))
        const fechasAObtener=this.getDaysArray(new Date(desdePeriodoAProcesar), new Date(hastaPeriodoAProcesar))
                            
        if (!this.elegirEmpresa){
          const arrayExportarExcel = this.informacionAExportarExcel
          this.informacionAExportarExcel = []

          for await(const empresa of this.empresas){
            let flag = 0
            acumM3 = 0
            this.importeTotalInExcel = 0
            this.importeSeguroAlmacenajeExcel = 0
            this.importeTotalDiarioExcel = 0
            this.importeTotalOutExcel = 0
            this.acumuladoM3 = 0
            this.acumuladoKilosPrevio = 0
            this.acumuladoUnidadesPrevio = 0
            this.importePrepago = 0
            this.importeSeguro = 0

            // obtenemos almacenaje previo de las empresas
            response = await empresas.getAlmacenajePrevio(empresa.Id, '1900-01-01', hastaInformacionPrevia, "Obteniendo información previa" + ` de ${empresa.Nombre}`)

            this.acumuladoM3 += response[0].totalM3
            this.acumuladoKilosPrevio += response[0].totalKilos   
            this.acumuladoUnidadesPrevio += response[0].totalUnidades 
      
            //obtenemos la configuracion de las empresas ejemplo: M3|1000|20|true|false
            this.configuracionesEmpresa = await empresas.getConfiguracionesEmpresa(empresa.Id,String(fechaAumentoAnterior),String(this.fechaHasta+ ' 23:59:59'))
            //this.configuracionesEmpresa.push(configEmpresa[0])                
            
            if(this.configuracionesEmpresa.length===0){
              this.configuracionesEmpresa = await empresas.getConfiguracionesEmpresa(empresa.Id,String(fechaAumentoAnterior),String(this.fechaHasta+ ' 23:59:59'))
            }

            //Si la configuracion es Mayor a cero continuo...
            for (const config of this.configuracionesEmpresa){
              if(Number(config.AlmacenPostpago.split("|")[1])>0){
                flag = 1
              }
            }

            if(flag == 1){

              // Nuevo Codigo Agilidad del Reporte
              let almacenaje = await empresas.getAlmacenaje(empresa.Id, this.fechaDesde, this.fechaHasta)

              //iteramos las fechas seleccionadas
              for (const fechaActual of fechasAObtener) {
                acumM3 = 0
                acumuladoUnidades = 0
                acumuladoKilos = 0 
                fechaActual.setHours(0, 0, 0, 0)
                //const response = await empresas.getAlmacenaje(empresa.Id, fechas.dateToString(fechaActual), fechas.dateToString(fechaActual), "Obteniendo "+fechas.dateToString(fechaActual) + ` de ${empresa.Nombre}`)
                let fechaAlmacenaje = new Date()
                let fechaConfig = new Date() 
                let configuracionAlmacenPostpago=""
                // Nuevo codigo de obtencion de configuraciones.
                for(const config of this.configuracionesEmpresa){
                            
                  fechaAlmacenaje = new Date(fechaActual)           
                  fechaConfig = new Date(config.Fecha)
                  fechaConfig.setHours(0,0,0,0)
                              
                    if(fechaAlmacenaje >= fechaConfig){                          
                      configuracionAlmacenPostpago = config.AlmacenPostpago                             
                      break
                    }
                }

                // acumuladoUnidades += response[0].totalUnidades
                // this.acumuladoM3 += response[0].totalM3
                // acumM3 += response[0].totalM3
                // acumuladoKilos += response[0].totalKilos

                //iteramos el almacenaje obtenido en el periodo de fecha seleccionado
                for (const valorAlmacen of almacenaje){     
                  if(new Date(fechaActual).toDateString()==new Date(valorAlmacen.Fecha).toDateString()){
                    acumuladoUnidades += valorAlmacen.totalUnidades
                    acumM3 += valorAlmacen.totalM3
                    acumuladoKilos += valorAlmacen.totalKilos
                  }
                }
                
                let precioUnidades=0
                let precioKilos=0
                let precioM3=0    
                let activo=configuracionAlmacenPostpago.split("|")[3]

                if (activo==="true"){
                  const unidad=configuracionAlmacenPostpago.split("|")[0]
                  const valor=Number(configuracionAlmacenPostpago.split("|")[1])
                  
                  //si el concepto de la cuenta es "M3" se suma y se agrega al excel
                  if (unidad==="M3") {
                    precioM3 = Number((valor * (this.acumuladoM3 + acumM3)).toFixed(2))
                    this.acumuladoM3 += acumM3
                    this.importeTotalDiario += precioM3
                    this.importeTotalDiarioExcel += precioM3 
                  }

                  //si el concepto de la cuenta es "Kilos" se suma y se agrega al excel
                  if (unidad==="Kilos") {
                    precioKilos = Number((valor * (this.acumuladoKilosPrevio + acumuladoKilos)).toFixed(2))
                    this.acumuladoKilosPrevio += acumuladoKilos
                    this.importeTotalDiario += precioKilos
                    this.importeTotalDiarioExcel += precioKilos 
                  }                   

                  //si el concepto de la cuenta es "Unidades" se suma y se agrega al excel
                  if (unidad==="Unidades") {
                    precioUnidades = Number((valor * (this.acumuladoUnidadesPrevio + acumuladoUnidades)).toFixed(2))
                    this.acumuladoUnidadesPrevio += acumuladoUnidades
                    this.importeTotalDiario += precioUnidades
                    this.importeTotalDiarioExcel += precioUnidades
                  }
                }
              }
            }

            // Calculo el seguro y el Prepago en base a la ultima configuracion existente
            if(this.configuracionesEmpresa.length>0){
              this.configuracionPrepagoSeguro = []
              this.configuracionPrepagoSeguro = await empresas.getConfiguracionesEmpresa(empresa.Id, String(fechaAumentoAnterior), fechas.getHoy())
              this.configuracionPrepagoSeguro = this.configuracionPrepagoSeguro.reverse()
              let ultimoConfig = this.configuracionPrepagoSeguro[this.configuracionPrepagoSeguro.length - 1]
            
              if (ultimoConfig.AlmacenSeguro.split("|")[3]==="true") {
                this.importeSeguro +=Number(ultimoConfig.AlmacenSeguro.split("|")[1])
                this.importeSeguroAlmacenajeExcel = Number(ultimoConfig.AlmacenSeguro.split("|")[1])
              } else {
                this.importeSeguro +=0
                this.importeSeguroAlmacenajeExcel = 0
              }

              if (ultimoConfig.AlmacenPrepago.split("|")[3]==="true") {
                this.importePrepago +=Number(ultimoConfig.AlmacenPrepago.split("|")[1])
                this.importeTotalDiario += this.importePrepago
                this.importeTotalDiarioExcel += this.importePrepago  
              } else {
                this.importePrepago +=0
              }

              this.configuracionPrepagoSeguro = this.configuracionPrepagoSeguro.reverse()
            } 

            // Inicio del codigo para calcular el IN de una empresa o Varias.
            //Obtengo los In del Periodo                
            const detalleIn = await empresas.getIn(empresa.Id, this.fechaDesde, this.fechaHasta,  `Obteniendo In... ${empresa.Nombre}`)

            // Declaro las Variables necesarias  
            let fechaIN= new Date()
            let fechaOUT= new Date()
            let fechaConfig = new Date() 
            let unidadIn="", valorIn=0, minimoIn=0
            let configuracionAProcesar =""

            //Calculo el valor del Total
            for (const unaFecha of detalleIn) {

              if (unaFecha.Detalle.length>0) {

                //aca va el for que busca la configuracion correcta
                for(const config of this.configuracionesEmpresa){
                  fechaIN = new Date(unaFecha.Fecha + ' 23:59:59')
                  fechaConfig = new Date(config.Fecha)
                    
                  if(fechaIN >= fechaConfig){
                    configuracionAProcesar= config.AlmacenIngresoIn
                    if (configuracionAProcesar.split("|")[3]==="true") {
                        unidadIn=configuracionAProcesar.split("|")[0]
                        valorIn=Number(configuracionAProcesar.split("|")[1])
                        minimoIn=Number(configuracionAProcesar.split("|")[2])
                    }
                    break
                  }
                }

                let ordenActual=unaFecha.Detalle[0].Orden
                let precioUnitario=0, unidades=0, kilos=0, m3=0

                for (const unDetalle of unaFecha.Detalle) {

                  if (unDetalle.Orden===ordenActual) {
                    unidades += unDetalle.Unidades
                    kilos += unDetalle.Kilos
                    m3 += unDetalle.M3

                    if (unidadIn==="Unidades") {
                      precioUnitario += unDetalle.Unidades * valorIn
                    } else if (unidadIn==="Kilos") {
                      precioUnitario += unDetalle.Kilos * valorIn
                    } else if (unidadIn==="M3") {
                      precioUnitario += unDetalle.M3 * valorIn
                    } else if (unidadIn==="Fijo") {
                      precioUnitario = valorIn
                    } else {
                      // console.log("UnidadIn desconocida", unidadIn)
                    }
                  } else {
                    precioUnitario=Number(precioUnitario.toFixed(2))
                    const subtotal=Math.max(precioUnitario, minimoIn)
                    this.importeTotalIn += subtotal
                    this.importeTotalInExcel += subtotal
                    ordenActual=unDetalle.Orden
                    unidades = unDetalle.Unidades
                    kilos = unDetalle.Kilos
                    m3 = unDetalle.M3

                    if (unidadIn==="Unidades") {
                      precioUnitario = unDetalle.Unidades * valorIn
                    } else if (unidadIn==="Kilos") {
                      precioUnitario = unDetalle.Kilos * valorIn
                    } else if (unidadIn==="M3") {
                      precioUnitario = unDetalle.M3 * valorIn
                    } else if (unidadIn==="Fijo") {
                      precioUnitario = valorIn
                    }                
                  }
                }

                precioUnitario=Number(precioUnitario.toFixed(2))
                const subtotal=Math.max(precioUnitario, minimoIn)
                this.importeTotalIn += subtotal
                this.importeTotalInExcel += subtotal    
              }
            }
          
            //Obtengo todos los Out
            const detalleOut = await empresas.getOut(empresa.Id, this.fechaDesde, this.fechaHasta, `Obteniendo Out... ${empresa.Nombre}` )

            let unidadOut="", valorOut=0, minimoOut=0 
            let configuracionAProcesarOUT="" 

            if(detalleOut){
              this.finalizoTodo = true
            }
            
            for (const unaFecha of detalleOut) {

              if (unaFecha.Detalle.length>0) {

                let ordenActual=unaFecha.Detalle[0].Orden
                let idMovimientoActual=unaFecha.Detalle[0].idMovimiento
                let valorDeclaradoActual=unaFecha.Detalle[0].ValorDeclarado
                let precioUnitario=0, unidades=0, kilos=0, m3=0
                  
                for(const config of this.configuracionesEmpresa){
                  fechaOUT = new Date(unaFecha.Fecha + ' 23:59:59')
                  fechaConfig = new Date(config.Fecha)
                  
                  if(fechaOUT >= fechaConfig){
                    configuracionAProcesarOUT = config.AlmacenEgresoOut
                    
                    if(configuracionAProcesarOUT.split("|")[3]==="true"){
                      unidadOut=configuracionAProcesarOUT.split("|")[0]
                      valorOut=Number(configuracionAProcesarOUT.split("|")[1])
                      minimoOut=Number(configuracionAProcesarOUT.split("|")[2])
                    }

                    break
                  }
                }

                if (unidadOut==="%VD") {
                  precioUnitario = valorDeclaradoActual * valorOut / 100
                }
      
                const ordenEnEstudio="3128"
                for (const unDetalle of unaFecha.Detalle) {

                  if (ordenActual===ordenEnEstudio) {
                    // console.log("UnDetalle", unDetalle)
                  }

                  if (unDetalle.Orden===ordenActual) {
                    unidades += unDetalle.Unidades
                    kilos += unDetalle.Kilos
                    m3 += unDetalle.M3

                    if (unidadOut==="Unidades") {
                      precioUnitario += unDetalle.Unidades * valorOut
                    } else if (unidadOut==="Kilos") {
                      precioUnitario += unDetalle.Kilos * valorOut
                    } else if (unidadOut==="M3") {
                      precioUnitario += unDetalle.M3 * valorOut
                    } else if (unidadOut==="%VD") {
                      //No se acumula, porque se le calculó la primera vez
                      // precioUnitario += unDetalle.ValorDeclarado * valorOut / 100
                    }

                    if (ordenActual===ordenEnEstudio) {
                      // console.log("En la actual", precioUnitario)
                    }
                  } else {
                    if (ordenActual===ordenEnEstudio) {
                      // console.log("Empezar al terminar la actual", precioUnitario)
                    }

                    precioUnitario=Number(precioUnitario.toFixed(2))
                    const subtotal=Math.max(precioUnitario, minimoOut)
                    this.importeTotalOut += subtotal
                    this.importeTotalOutExcel += subtotal
                    ordenActual=unDetalle.Orden
                    idMovimientoActual=unDetalle.idMovimiento
                    valorDeclaradoActual=unDetalle.ValorDeclarado
                    unidades = unDetalle.Unidades
                    kilos = unDetalle.Kilos
                    m3 = unDetalle.M3

                    if (unidadOut==="Unidades") {
                      precioUnitario = unDetalle.Unidades * valorOut
                    } else if (unidadOut==="Kilos") {
                      precioUnitario = unDetalle.Kilos * valorOut
                    } else if (unidadOut==="M3") {
                      precioUnitario = unDetalle.M3 * valorOut
                    } else if (unidadOut==="%VD") {
                      precioUnitario = unDetalle.ValorDeclarado * valorOut / 100
                    }
                  }    
                }

                precioUnitario=Number(precioUnitario.toFixed(2))
                const subtotal=Math.max(precioUnitario, minimoOut)
                this.importeTotalOut += subtotal
                this.importeTotalOutExcel += subtotal
              }
            }

            //aca hay que hacerle el push al informacion a exportar con los datos del excel
            let totalIntegralExcel = 0
            totalIntegralExcel = Number(this.importeTotalInExcel) + Number(this.importeTotalOutExcel) + Number(this.importeTotalDiarioExcel) + Number(this.importeSeguroAlmacenajeExcel)
            let importeTotalizador = 0
            
            arrayExportarExcel.forEach(i => {
              if(i.id == empresa.Id){
                importeTotalizador =  i.importeTotalExcel + totalIntegralExcel
          
                this.informacionAExportarExcel.push({...i , NombreEmpresa: empresa.Nombre, In: this.importeTotalInExcel, Almacenaje: this.importeTotalDiarioExcel, Out: this.importeTotalOutExcel ,seguroAlmacenaje: this.importeSeguroAlmacenajeExcel, totalIntegral: totalIntegralExcel, importeTotalIntegralExcel: importeTotalizador, importeSeguro: i.importeSeguro, importeTransporte: i.importeTransporte, importeComplemento: i.importeComplemento, importePickingCD: i.importePickingCD, ContraReembolsoExcel: i.ContraReembolsoExcel, importeTotalExcel: i.importeTotalExcel  })   
              }
            })          
          }         

          this.importeTotalDiario = Number(this.importeTotalDiario.toFixed(2)).toLocaleString('es', { style: 'currency', currency: 'ARS'})
          this.importeTotalIn = Number(this.importeTotalIn.toFixed(2)).toLocaleString('es', { style: 'currency', currency: 'ARS'})
          this.importeTotalOut = Number(this.importeTotalOut.toFixed(2)).toLocaleString('es', { style: 'currency', currency: 'ARS'})
          this.importeSeguro = Number(this.importeSeguro.toFixed(2)).toLocaleString('es', { style: 'currency', currency: 'ARS'})
          this.importePrepago = Number(this.importePrepago.toFixed(2)).toLocaleString('es', { style: 'currency', currency: 'ARS'})
                              
        } else {
          // Si eligio empresa obtengo el totalM3, IN, OUT y Almacenaje para esa empresa.
          // obtengo el almacenaje de la empresa seleccionada en el periodo seleccionado
          let almacenaje = await empresas.getAlmacenaje(this.idEmpresa, this.fechaDesde, this.fechaHasta)
          this.importePrepago = 0
          this.importeSeguro = 0

          // Si no encontre ninguna configuracion actual busco una anterior
          if(this.configuracionesEmpresa.length===0){
            this.configuracionesEmpresa = await empresas.getConfiguracionesEmpresa(this.idEmpresa,String(fechaAumentoAnterior),String(this.fechaHasta+ ' 23:59:59'))
          }

          //iteramos las fechas seleccionadas
          for (const fechaActual of fechasAObtener) {
            acumM3 = 0
            acumuladoUnidades = 0
            acumuladoKilos = 0 
            fechaActual.setHours(0, 0, 0, 0)
            let fechaAlmacenaje = new Date()
            let configuracionAlmacenPostpago=""
            let fechaConfig = new Date()

            // Nuevo codigo de obtencion de configuraciones.
            for(const config of this.configuracionesEmpresa){          
              fechaAlmacenaje = new Date(fechaActual)
              fechaConfig = new Date(config.Fecha)
              fechaConfig.setHours(0,0,0,0)
                          
              if(fechaAlmacenaje >= fechaConfig){
                configuracionAlmacenPostpago = config.AlmacenPostpago
              break
              }
            }
                
            for (const valorAlmacen of almacenaje){
              if(new Date(fechaActual).toDateString()==new Date(valorAlmacen.Fecha).toDateString()){
                acumuladoUnidades += valorAlmacen.totalUnidades
                acumM3 += valorAlmacen.totalM3
                acumuladoKilos += valorAlmacen.totalKilos
              }
            }
              
            let precioUnidades=0
            let precioKilos=0
            let precioM3=0      
            const activo=configuracionAlmacenPostpago.split("|")[3]

            if (activo==="true") {
              const unidad=configuracionAlmacenPostpago.split("|")[0]
              const valor=Number(configuracionAlmacenPostpago.split("|")[1])
              
              //si el concepto de la cuenta es "M3" se suma
              if (unidad==="M3") {
                precioM3 = Number((valor * (this.acumuladoM3 + acumM3)).toFixed(2))
                this.acumuladoM3 += acumM3
                this.importeTotalDiario += precioM3
              }

              //si el concepto de la cuenta es "Kilos" se suma
              if (unidad==="Kilos") {
                precioKilos = Number((valor * (this.acumuladoKilosPrevio + acumuladoKilos)).toFixed(2))
                this.acumuladoKilosPrevio += acumuladoKilos
                this.importeTotalDiario += precioKilos
              }                   

              //si el concepto de la cuenta es "Unidades" se suma
              if (unidad==="Unidades") {
                precioUnidades = Number((valor * (this.acumuladoUnidadesPrevio + acumuladoUnidades)).toFixed(2))
                this.acumuladoUnidadesPrevio += acumuladoUnidades
                this.importeTotalDiario += precioUnidades
              } 
            } 
          }

          // Calculo el seguro y el Prepago en base a la ultima configuracion existente
          if(this.configuracionesEmpresa.length>0){
            this.configuracionPrepagoSeguro = []
            this.configuracionPrepagoSeguro = await empresas.getConfiguracionesEmpresa(this.idEmpresa, String(fechaAumentoAnterior) ,fechas.getHoy())
            console.log(this.configuracionPrepagoSeguro)
            this.configuracionPrepagoSeguro = this.configuracionPrepagoSeguro.reverse()
            let ultimoConfig = this.configuracionPrepagoSeguro[this.configuracionPrepagoSeguro.length - 1]
        
            if (ultimoConfig.AlmacenSeguro.split("|")[3]==="true") {
              this.importeSeguro +=Number(ultimoConfig.AlmacenSeguro.split("|")[1])
            } else {
              this.importeSeguro +=0
            }

            if (ultimoConfig.AlmacenPrepago.split("|")[3]==="true") {
              this.importePrepago +=Number(ultimoConfig.AlmacenPrepago.split("|")[1])
              this.importeTotalDiario += this.importePrepago
            } else {
              this.importePrepago +=0
            }
            
            this.configuracionPrepagoSeguro = this.configuracionPrepagoSeguro.reverse()
          }
      
          // Cargo las variables para el excel
          this.importeTotalDiarioExcel = this.importeTotalDiario.toFixed(2)
          this.importeSeguroExcelAlmacenaje = this.importeSeguro.toFixed(2)
          // Cargo las variables para el excel

          // se redondea los decimales a 2 digitos y se agrega la moneda ARS en los campos del panel
          // el currency: 'ARS' en el futuro vamos a cambiarlo por una variable que ponga el tipo de moneda
          this.importeTotalDiario = Number(this.importeTotalDiario.toFixed(2)).toLocaleString('es', { style: 'currency', currency: 'ARS'})
          this.importeSeguro = Number(this.importeSeguro.toFixed(2)).toLocaleString('es', { style: 'currency', currency: 'ARS'})
          this.importePrepago = Number(this.importePrepago.toFixed(2)).toLocaleString('es', { style: 'currency', currency: 'ARS'})
    
  
  
          // Fin del codigo para obtener los M3 cubicos ocupados de una empresa o Varias empresas.

          // Inicio del codigo para calcular el IN de una empresa o Varias.

          //Obtengo los In del Periodo
          this.importeTotalIn = 0
          let configuracionAProcesar =""    
          const detalleIn = await empresas.getIn(this.idEmpresa, this.fechaDesde, this.fechaHasta,  "Obteniendo In...")
          
          // // Declaro las Variables necesarias  
          let fechaIN= new Date()
          let fechaOUT= new Date()
          let fechaConfig = new Date() 
          let unidadIn="", valorIn=0, minimoIn=0
    
          //Calculo el valor del Total
          for (const unaFecha of detalleIn) {
            if (unaFecha.Detalle.length>0) {                        

              //aca va el for que busca la configuracion correcta
              for(const config of this.configuracionesEmpresa){
                fechaIN = new Date(unaFecha.Fecha + ' 23:59:59')
                fechaConfig = new Date(config.Fecha)                        
                
                if(fechaIN >= fechaConfig){                         
                  configuracionAProcesar= config.AlmacenIngresoIn
                  if (configuracionAProcesar.split("|")[3]==="true") {
                    unidadIn=configuracionAProcesar.split("|")[0]
                    valorIn=Number(configuracionAProcesar.split("|")[1])
                    minimoIn=Number(configuracionAProcesar.split("|")[2])
                  }
                  break
                }
              }

              let ordenActual=unaFecha.Detalle[0].Orden
              let precioUnitario=0, unidades=0, kilos=0, m3=0

              for (const unDetalle of unaFecha.Detalle) {

                if (unDetalle.Orden===ordenActual) {
                  unidades += unDetalle.Unidades
                  kilos += unDetalle.Kilos
                  m3 += unDetalle.M3

                  // dependiendo del concepto de la cuenta se suma al precioUnitario
                  if (unidadIn==="Unidades") {
                    precioUnitario += unDetalle.Unidades * valorIn
                  } else if (unidadIn==="Kilos") {
                    precioUnitario += unDetalle.Kilos * valorIn
                  } else if (unidadIn==="M3") {
                    precioUnitario += unDetalle.M3 * valorIn
                  } else {
                    // console.log("UnidadIn desconocida", unidadIn)
                  }
                } else {
                  precioUnitario=Number(precioUnitario.toFixed(2))
                  const subtotal=Math.max(precioUnitario, minimoIn)
                  this.importeTotalIn += subtotal
                  
                  if (unidadIn==="Unidades") {
                    precioUnitario = unDetalle.Unidades * valorIn
                  } else if (unidadIn==="Kilos") {
                    precioUnitario = unDetalle.Kilos * valorIn
                  } else if (unidadIn==="M3") {
                    precioUnitario = unDetalle.M3 * valorIn
                  } else if (unidadIn==="Fijo") {
                    precioUnitario = valorIn
                  }
                }
              } 
              precioUnitario=Number(precioUnitario.toFixed(2))
              const subtotal=Math.max(precioUnitario, minimoIn)
              this.importeTotalIn += subtotal
            }
          }
    
          // Cargo las variables para el excel
          this.importeTotalInExcel = this.importeTotalIn.toFixed(2)
          // Cargo las variables para el excel
          this.importeTotalIn = Number(this.importeTotalIn.toFixed(2)).toLocaleString('es', { style: 'currency', currency: 'ARS'})

          //Obtengo todos los Out
          const detalleOut = await empresas.getOut(this.idEmpresa, this.fechaDesde, this.fechaHasta,  "Obteniendo Out...")
          
          let unidadOut="", valorOut=0, minimoOut=0 
          let configuracionAProcesarOUT=""  
          this.importeTotalOut=0

          if(detalleOut){
            this.finalizoTodo = true
          }

          for (const unaFecha of detalleOut) {
            if (unaFecha.Detalle.length>0) {
              let ordenActual = null
              let idMovimientoActual = null
              let valorDeclaradoActual = null
              ordenActual=unaFecha.Detalle[0].Orden
              idMovimientoActual=unaFecha.Detalle[0].idMovimiento
              valorDeclaradoActual=unaFecha.Detalle[0].ValorDeclarado
              let precioUnitario=0, unidades=0, kilos=0, m3=0

              for(const config of this.configuracionesEmpresa){
                fechaOUT = new Date(unaFecha.Fecha + ' 23:59:59')
                fechaConfig = new Date(config.Fecha)
                fechaConfig.setHours(0,0,0,0)
                
                if(fechaOUT >= fechaConfig){
                  configuracionAProcesarOUT = config.AlmacenEgresoOut
                  
                  if(configuracionAProcesarOUT.split("|")[3]==="true"){
                    unidadOut=configuracionAProcesarOUT.split("|")[0]
                    valorOut=Number(configuracionAProcesarOUT.split("|")[1])
                    minimoOut=Number(configuracionAProcesarOUT.split("|")[2])
                  }
                  break
                }
              }

              if (unidadOut==="%VD") {
                precioUnitario = valorDeclaradoActual * valorOut / 100
              }
              
              const ordenEnEstudio="3128"
              for (const unDetalle of unaFecha.Detalle) {

                if (ordenActual===ordenEnEstudio) {
                  // console.log("UnDetalle", unDetalle)
                }

                if (unDetalle.Orden===ordenActual) {
                  unidades += unDetalle.Unidades
                  kilos += unDetalle.Kilos
                  m3 += unDetalle.M3

                  // dependiendo del concepto de la cuenta se suma al precioUnitario
                  if (unidadOut==="Unidades") {
                    precioUnitario += unDetalle.Unidades * valorOut
                  } else if (unidadOut==="Kilos") {
                    precioUnitario += unDetalle.Kilos * valorOut
                  } else if (unidadOut==="M3") {
                    precioUnitario += unDetalle.M3 * valorOut
                  } else if (unidadOut==="%VD") {
                    //No se acumula, porque se le calculó la primera vez
                    // precioUnitario += unDetalle.ValorDeclarado * valorOut / 100
                  }

                  if (ordenActual===ordenEnEstudio) {
                    // console.log("En la actual", precioUnitario)
                  }
                } else {
                  if (ordenActual===ordenEnEstudio) {
                    // console.log("Empezar al terminar la actual", precioUnitario)
                  }

                  precioUnitario=Number(precioUnitario.toFixed(2))
                  const subtotal=Math.max(precioUnitario, minimoOut)
                  this.importeTotalOut += subtotal
                  ordenActual=unDetalle.Orden
                  idMovimientoActual=unDetalle.idMovimiento
                  valorDeclaradoActual=unDetalle.ValorDeclarado
                  unidades = unDetalle.Unidades
                  kilos = unDetalle.Kilos
                  m3 = unDetalle.M3

                  if (unidadOut==="Unidades") {
                    precioUnitario = unDetalle.Unidades * valorOut
                  } else if (unidadOut==="Kilos") {
                    precioUnitario = unDetalle.Kilos * valorOut
                  } else if (unidadOut==="M3") {
                    precioUnitario = unDetalle.M3 * valorOut
                  } else if (unidadOut==="%VD") {
                    precioUnitario = unDetalle.ValorDeclarado * valorOut / 100
                  }
                }    
              }

              precioUnitario=Number(precioUnitario.toFixed(2))
              const subtotal=Math.max(precioUnitario, minimoOut)
              this.importeTotalOut += subtotal
              
              
            }
          }

          // Cargo las variables para el excel
          this.importeTotalOutExcel = this.importeTotalOut.toFixed(2)
          // Cargo las variables para el excel
          this.importeTotalOut = Number(this.importeTotalOut.toFixed(2)).toLocaleString('es', { style: 'currency', currency: 'ARS'})
  
        }

        this.finalizoTodo = true
        this.sumaTotalesExcel()
        
      } catch (error) {
        console.log(error)          
      }

      if(this.finalizoTodo){
        this.mostrarMensaje("¡Se completo la cargar de datos!", "Busqueda finalizada")
      }
    },

    getDaysArray (s,e) {for(var a=[],d=new Date(s);d<=e;d.setDate(d.getDate()+1)){ a.push(new Date(d));}return a;},

    sumaTotalesExcel(){
      this.importeTotalAlmacenajeExcel=0
      this.importeTotalIntegralExcel=0
      this.importeTotalAlmacenajeExcel = Number(this.importeTotalInExcel) + Number(this.importeTotalOutExcel) + Number(this.importeTotalDiarioExcel) + Number(this.importeSeguroAlmacenajeExcel)
      this.importeTotalIntegralExcel = this.importeTotalExcelFinal + this.importeTotalAlmacenajeExcel
      this.importeTotalAlmacenajeExcel = Number(this.importeTotalAlmacenajeExcel.toFixed(2)).toLocaleString('es', { style: 'currency', currency: 'ARS'})
      this.importeTotalIntegralExcel = Number(this.importeTotalIntegralExcel.toFixed(2)).toLocaleString('es', { style: 'currency', currency: 'ARS'})   
    },

    async  exportarAExcel(){ 
      const workbook=new excel.Workbook()
      const worksheet=workbook.addWorksheet("Panel de Control")
      let renglon=1

      worksheet.views = [{state: 'frozen', ySplit: 1}]
      worksheet.autoFilter = 'A1:X1'
      //Nombres de las columnas excel
      const cabeceras=[
        {header: 'CUENTA', width: 25}, 
        {header: 'IN', width: 15},
        {header: 'ALMACENAJE', width: 15},
        {header: 'OUT', width: 15},
        {header: 'SEGURO ALMACENAJE', width: 15}, 
        {header: 'TOTAL INTEGRAL', width: 20},
        {header: 'TRANSPORTE', width: 20},
        {header: 'SEGURO DISTRIBUCIÓN', width: 25},
        {header: 'COMPLEMENTO', width: 20},
        {header: 'CONTRAREEMBOLSO ', width: 25},
        {header: 'PICKING CD', width: 20},
        {header: 'TOTAL DISTRIBUCÓN', width: 25},
        {header: 'TOTAL VALORIZADO', width: 25},
      ]

      worksheet.columns=[...cabeceras]

      if (!this.elegirEmpresa){

        this.informacionAExportarExcel.forEach(r =>{
          renglon++
          const filaCompleta=[
            r.NombreEmpresa, 
            r.In, 
            r.Almacenaje,
            r.Out,
            r.seguroAlmacenaje,
            r.totalIntegral,
            r.importeTransporte,
            r.importeSeguro,
            r.importeComplemento,
            r.ContraReembolsoExcel,
            r.importePickingCD,
            r.importeTotalExcel,
            r.importeTotalIntegralExcel
          ]
          worksheet.getRow(renglon).values=[...filaCompleta]
        })
        
      }else{
        renglon++
        const filaCompleta=[
          this.empresa.Nombre, 
          this.importeTotalIn, 
          this.importeTotalDiario,
          this.importeTotalOut,
          this.importeSeguro,
          this.importeTotalAlmacenajeExcel,
          this.importeTransporteExcel,
          this.importeSeguroExcel,
          this.importeComplemento,
          this.ContraReembolsoExcel,
          this.importePickingCD,
          this.importeTotalExcel,
          this.importeTotalIntegralExcel,
        ]
        worksheet.getRow(renglon).values=[...filaCompleta]
      }     

      worksheet.eachRow ( (row, rowNumber) => {
        row.eachCell ( (cell, colNumber) => {
          if (rowNumber==1) {
            cell.font={size: 16, bold: true}
          } else {
            if (rowNumber==renglon) {
              cell.font={size: 16, bold: false}
            } else {
              cell.font={size: 14}
            }
          }
        })
      } )

      const buf=await workbook.xlsx.writeBuffer()

      if (!this.elegirEmpresa) {
        saveAs(new Blob([buf]), `facturacion_${this.fechaDesde}_al_${this.fechaHasta}.xlsx`)
      } else {
        saveAs(new Blob([buf]), `${cadenas.stringToSlug(this.empresa.Nombre)}_Facturacion_desde_${this.fechaDesde}_al_${this.fechaHasta}.xlsx`)
      }
    }, 
    
    setearFechaInicialDesde() {
      const fechaHoy = new Date()
      let anioHoy=fechaHoy.getFullYear()
      let mesHoy=fechaHoy.getMonth()+1
      mesHoy--
      if (mesHoy === 0) {
        mesHoy = 12
        anioHoy--
      }
      const diaHoy = 1
      const devolver = anioHoy + "-" + (mesHoy < 10 ? "0" : "") + mesHoy + "-" + (diaHoy < 10 ? "0" : "") + diaHoy
      this.fechaDesde = devolver

      if (process.env.NODE_ENV === "development") {
        this.fechaDesde = "2023-05-01"
      }
    },

    setearFechaInicialHasta() {
      this.fechaHasta = fechas.getHoy()

      if (process.env.NODE_ENV === "development") {
        this.fechaHasta = "2023-06-02"
      }
    },

  },

  created() {

    store.dispatch('actualizarTituloPrincipal', 'Informe de guías')
    store.dispatch('empresas/cargarListaEmpresas', 'SoloActivas')
    this.setearFechaInicialDesde()
    this.setearFechaInicialHasta()
    if (process.env.NODE_ENV==="development") {
      this.fechaDesde=fechas.dateToString(fechas.getSumarDiasFecha(-10))
      this.fechaDesde='2024-01-01'
      this.fechaHasta='2024-01-16'

      // this.elegirEmpresa=true
      // this.idEmpresa=90
      
    } 
},

mounted() {
  store.dispatch('actualizarTituloPrincipal', 'Informe de facturación')

  empresas.getAll(false,true)
      .then(respuesta => {
          this.empresas=respuesta
      })
      .catch(puteada => {
          console.error(puteada)
      })
    },
}
</script>