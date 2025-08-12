<template>
    <v-container>
        <v-row v-show="empresaLoggeada()<=0">
            <v-col class="pt-1 pb-0">
                <SelectorEmpresa @eligioEmpresa="eligioEmpresa($event)" :idEmpresaInicialmenteSeleccionada="idEmpresa"></SelectorEmpresa>
            </v-col>
        </v-row>
        <v-row v-if="idEmpresa>0" class="py-0">
            <v-col class="py-0 my-0">
                <v-checkbox class="my-0" @change="changeVerSoloConStock" v-model="verSoloConStock" :label="verSoloConStock ? 'Ver todos los artículos' : 'Ver solo artículos con stock'"></v-checkbox>
            </v-col>
            <v-col class="py-0" v-show="empresaElegida.StockPosicionado">
                <v-checkbox class="my-0" @change="changeVerSoloStockSinPosicionar" v-model="verSoloConStockSinPosicionar" label="Ver solo artículos con stock sin posicionar"></v-checkbox>
            </v-col>
        </v-row>
        <v-row v-show="empresaLoggeada()>0" justify="center" class="p-1">
            <v-row v-if="listaArticulosCompleta.length>0" justify="center">
                <v-col class="p-1" cols="12" sm="6" md="4">
                    <v-btn @click="popularListaProductos" color="success" block>Actualizar información <v-icon>mdi-refresh</v-icon></v-btn>
                </v-col>
            </v-row>
        </v-row>
        <v-row v-show="empresaLoggeada()<=0" justify="center" class="p-3">
            <v-row v-if="listaArticulosCompleta.length>0" justify="center">
                <v-row justify="center">
                    <v-col class="p-1" cols="12" sm="6" md="4">
                        <v-btn @click="popularListaProductos" color="success" block>Actualizar información <v-icon>mdi-refresh</v-icon></v-btn>
                    </v-col>
                </v-row>
                <v-row justify="center" v-show="!tieneLOTE">
                    <v-col class="p-1" v-show="estoyEnFuente" cols="12" sm="6" md="4">
                        <v-btn @click="repararTodosLosArticulos" color="red" block dark>Reparar <v-icon>mdi-tool</v-icon></v-btn>
                    </v-col>
                    <v-col class="p-1" cols="12" sm="6" md="4">
                        <v-btn @click="verificarDiferenciasStockMovimiento" color="purple" block dark>Diferencias <v-icon>mdi-tool</v-icon></v-btn>
                    </v-col>
                </v-row>
            </v-row>
        </v-row>
       <!-- tarjetas resumen de stock -->
<v-row class="py-0" v-if="cards.length">
  <v-col
    v-for="card in cards"
    :key="card.label"
    cols="12" sm="6" md="3"
    class="pa-2"
  >
    <v-card 
      outlined 
      class="d-flex flex-column cursor-pointer rounded-lg" 
      @click="seleccionarCategoria(card.categoria)"
      :style="{ '--card-color': card.color, '--card-text-color': card.textColor }"
    >
      <!-- Mitad superior: usa v-sheet para el color de tema-->
      <v-sheet
        :style="{ 'background-color': card.color }"
        dark
        height="120"
        class="d-flex align-center justify-center"
      >
        <template v-if="card.categoria === 'comprometido'">
          <div class="custom-icon-container">
            <img 
              :src="require('@/assets/icons/comprometido.svg')" 
              :alt="card.label"
              class="custom-icon"
            />
          </div>
        </template>
        <template v-else-if="card.categoria === 'posicionado'">
          <div class="custom-icon-container">
            <img 
              :src="require('@/assets/icons/posicionado.svg')" 
              :alt="card.label"
              class="custom-icon"
            />
          </div>
        </template>
        <template v-else-if="card.categoria === 'sinPosicionar'">
          <div class="custom-icon-container">
            <img 
              :src="require('@/assets/icons/sin-posicionar.svg')" 
              :alt="card.label"
              class="custom-icon"
            />
          </div>
        </template>
        <template v-else-if="card.categoria === 'total'">
          <div class="custom-icon-container">
            <img 
              :src="require('@/assets/icons/stock-total.svg')" 
              :alt="card.label"
              class="custom-icon"
            />
          </div>
        </template>
        <v-icon v-else x-large :style="{ color: card.textColor }">{{ card.icon }}</v-icon>
      </v-sheet>

      <!-- Mitad inferior: fondo blanco + texto en color -->
      <v-card-text class="text-center py-4" style="flex: 1;">
        <div class="text-subtitle-2" :style="{ color: card.color }">
          {{ card.label }}
        </div>
        <div class="text-h5 font-weight-bold mb-2" :style="{ color: card.color }">
          {{ card.value.toLocaleString('es-AR') }}
        </div>
        <v-btn 
          small 
          outlined
          @click.stop="card.download"
          :style="{
            color: card.color,
            borderColor: card.color,
            textTransform: 'none',
            fontSize: '0.75rem',
            height: '28px',
            minWidth: '90px',
            borderRadius: '4px',
            padding: '0 8px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '--btn-hover-color': `${card.color}15`
          }"
          class="export-btn"
        >
          <v-icon small class="mr-1" :style="{ color: card.color }">mdi-microsoft-excel</v-icon>
          <span style="font-size: 0.75rem;">Exportar</span>
        </v-btn>
      </v-card-text>
    </v-card>
  </v-col>
</v-row>

        <v-row v-show="listaArticulosMostrar.length>0" class="pb-0 mb-0">
            <v-col class="py-0 my-0">
                <v-card-title class="py-1 my-0 px-0">
                    <v-text-field
                        v-model="textoBusqueda"
                        append-icon="mdi-magnify"
                        label="Búsqueda"
                        single-line
                        dense
                        hide-details
                        class="search-field"
                        :class="{ 'dark-search': $vuetify.theme.dark }"
                        
                        outlined
                    ></v-text-field>
                </v-card-title>
            </v-col>
        </v-row>
        <v-row v-show="!tieneLOTE">
            <v-col class="py-0" v-if="listaArticulosMostrar.length>0">
                <v-data-table 
                    :headers="cabeceras" 
                    :items="listaArticulosMostrar"  
                    :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
                    :items-per-page="30" 
                    :search="textoBusqueda"
                    class="elevation-3 rounded-lg"
                    loading-text="Cargando..."
                    no-data-text="No hay datos disponibles"
                    no-results-text="No se encontraron resultados"
                >
                <template v-slot:item.Stock="{item}">
                    <v-chip :color="getColorStock(item)" dark>{{ item.Stock}}</v-chip>
                </template>
                <template v-slot:item.StockPosicionado="{item}">
                    <v-chip :color="getColorStockPosicionado(item)" dark>{{ item.StockPosicionado}}</v-chip>
                </template>
                <template v-slot:item.StockSinPosicionar="{item}">
                    <v-chip :color="getColorStockSinPosicionar(item)" dark>{{ item.StockSinPosicionar}}</v-chip>
                </template>
                <template v-slot:item.StockComprometido="{item}">
                    <v-chip @click="verOrdenesPendientes(item)" :color="getColorStockComprometido(item)" dark>{{ item.StockComprometido}}</v-chip>
                </template>
                <template v-slot:item.Acciones="{ item }">
                     <v-icon @click="repararArticulo(item)" color="red" v-show="estoyEnFuente">mdi-tools</v-icon>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon color="blue" @click="verPosicionesDelArticulo(item)" v-bind="attrs" v-on="on">mdi-library-shelves</v-icon>
                        </template>
                        <span>Ver posiciones del artículo: {{item.Id}} - {{item.Nombre}}</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon color="blue" @click="actualizarArticulo(item)" v-bind="attrs" v-on="on">mdi-refresh</v-icon>
                        </template>
                        <span>Actualizar información</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon color="blue" @click="verMovimientosDelArticulo(item)" v-bind="attrs" v-on="on">mdi-clipboard-list-outline</v-icon>
                        </template>
                        <span>Ver movimientos del artículo: {{item.Id}} - {{item.Nombre}}</span>
                    </v-tooltip>

                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon color="blue" @click="verDetallesDelArticulo(item)" v-bind="attrs" v-on="on">mdi-magnify</v-icon>
                        </template>
                        <span>Ver detalles del artículo: {{item.Id}} - {{item.Nombre}}</span>
                    </v-tooltip>




                </template>
                </v-data-table>
            </v-col>
        </v-row>
        <v-row v-show="tieneLOTE" v-if="!verDetalleLote">
            <v-col class="py-0" v-if="listaArticulosMostrar.length>0">
                <v-data-table 
                    :headers="cabecerasLote" 
                    :items="listaArticulosMostrar"  
                    :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
                    :items-per-page="30" 
                    :search="textoBusqueda"
                    class="elevation-3 rounded-lg"
                >
                <template v-slot:item.StockComprometido="{item}">
                    <v-chip @click="verOrdenesPendientesLote(item)" :color="getColorStockComprometidoLote(item)" dark>{{ item.StockComprometido}}</v-chip>
                </template>
                <template v-slot:item.Acciones="{ item }">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon color="blue" @click="actualizarLotes(item)" v-bind="attrs" v-on="on">mdi-refresh</v-icon>
                        </template>
                        <span>Actualizar información</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon color="blue" @click="verLoteDetalle(item)" v-bind="attrs" v-on="on">mdi-magnify</v-icon>
                        </template>
                        <span>Ver detalles del Lote: {{item.Lote}}</span>
                    </v-tooltip>
                </template>
                </v-data-table>
            </v-col>
        </v-row>
        <v-card v-show="verDetalleLote">
                <v-card-title>
                    <span class="text-h5">{{"Productos"}}</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row v-if="listaArticulosProductos.length>0">
                            <v-col class="py-0" >
                                <v-data-table v-if="!this.textil"
                                    :headers="cabecerasLoteDetalle" 
                                    :items="listaArticulosProductos"  
                                    :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
                                    :items-per-page="30" 
                                    class="elevation-3" >
                                    <template v-slot:item.Acciones="{ item, index }">
                                        <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon color="blue" @click="verDetallesDelArticulo(item)" v-bind="attrs" v-on="on">mdi-magnify</v-icon>
                                        </template>
                                        <span>Ver detalle del artículo</span>
                                    </v-tooltip>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon color="blue" @click="verPosicionesDelArticulo(item)" v-bind="attrs" v-on="on">mdi-library-shelves</v-icon>
                                        </template>
                                        <span>Ver posiciones del artículo</span>
                                    </v-tooltip>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon color="blue" @click="actualizarArticulo(item)" v-bind="attrs" v-on="on">mdi-refresh</v-icon>
                                        </template>
                                        <span>Actualizar articulo</span>
                                    </v-tooltip>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon color="blue" @click="verMovimientosDelArticulo(item)" v-bind="attrs" v-on="on">mdi-clipboard-list-outline</v-icon>
                                        </template>
                                        <span>Ver movimientos del artículo</span>
                                    </v-tooltip>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="verDetalleLote=false; textoBusqueda=''">Cerrar</v-btn>
                </v-card-actions>
            </v-card>

        <v-dialog
            v-model="mostrarVentanaEdicion"
            persistent
            max-width="800px"
            class="editar-producto-dialog"
        >
        <v-card class="rounded-lg">
            <v-card-title class="px-6 pt-6 pb-3">
                <span class="text-h5">Producto: {{itemEnEdicion.Id}} - Barcode: {{itemEnEdicion.Barcode}}</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row class="form-row-odd">
                        <v-col>
                            <v-text-field 
                                :disabled="empresaLoggeada()>=0" 
                                label="Nombre" 
                                required 
                                v-model="itemEnEdicion.Nombre"
                                outlined
                                dense
                                class="rounded-lg"
                            ></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field 
                                :disabled="empresaLoggeada()>=0" 
                                label="CodeEmpresa" 
                                required 
                                v-model="itemEnEdicion.CodeEmpresa"
                                outlined
                                dense
                                class="rounded-lg"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row v-if="!this.textil">
                        <v-col v-show="!tieneLOTE">
                            <v-text-field 
                                type="number" 
                                :disabled="empresaLoggeada()>=0" 
                                label="Ancho" 
                                required 
                                v-model="itemEnEdicion.Ancho"
                                outlined
                                dense
                                class="rounded-lg"
                            ></v-text-field>
                        </v-col >
                        <v-col v-show="tieneLOTE">
                            <v-text-field 
                                type="number" 
                                :disabled="empresaLoggeada()>=0" 
                                label="Largo" 
                                required 
                                v-model="itemEnEdicion.Ancho"
                                outlined
                                dense
                                class="rounded-lg"
                            ></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field type="number" :disabled="empresaLoggeada()>=0" label="Alto" required v-model="itemEnEdicion.Alto"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row v-if="!this.textil">
                        <v-col v-show="!tieneLOTE">
                            <v-text-field 
                                type="number" 
                                :disabled="empresaLoggeada()>=0" 
                                label="Largo" 
                                required 
                                v-model="itemEnEdicion.Largo"
                                outlined
                                dense
                                class="rounded-lg"
                            ></v-text-field>
                        </v-col>
                        <v-col v-show="tieneLOTE">
                            <v-text-field type="number" :disabled="empresaLoggeada()>=0" label="Ancho" required v-model="itemEnEdicion.Largo"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field type="number" :disabled="empresaLoggeada()>=0" label="Peso" required v-model="itemEnEdicion.Peso"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row v-if="this.textil">
                        <v-col>
                            <v-text-field 
                                type="number" 
                                :disabled="empresaLoggeada()>=0" 
                                label="Metros" 
                                required 
                                v-model="itemEnEdicion.Ancho"
                                outlined
                                dense
                                class="rounded-lg"
                            ></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field type="number" :disabled="empresaLoggeada()>=0" label="Alto" required v-model="itemEnEdicion.Alto"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row v-if="this.textil">
                        <v-col>
                            <v-text-field type="number" :disabled="empresaLoggeada()>=0" label="Ancho" required v-model="itemEnEdicion.Largo"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field type="number" :disabled="empresaLoggeada()>=0" label="Peso" required v-model="itemEnEdicion.Peso"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field 
                                type="number" 
                                :disabled="empresaLoggeada()>=0" 
                                label="Calidad" 
                                required 
                                v-model="itemEnEdicion.Precio"
                                outlined
                                dense
                                class="rounded-lg"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions class="px-6 pb-4">
                <v-spacer></v-spacer>
                <v-btn 
                    color="blue darken-1" 
                    text 
                    @click="cancelarEdicionItem()"
                    class="rounded-lg px-4"
                >{{empresaLoggeada()<0 ? 'Cancelar' : 'Cerrar'}}</v-btn>
                <v-btn 
                    color="blue darken-1" 
                    text 
                    @click="confirmarEdicionItem()" 
                    v-if="empresaLoggeada()<0"
                    class="rounded-lg px-4"
                >Guardar</v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>



    </v-container>
</template>

<script>

import SelectorEmpresa from '@/components/SelectorEmpresa.vue'
import { mapState } from 'vuex'
import store from '@/store'
import ComprometidoIcon from '@/components/icons/ComprometidoIcon.vue'
import ExcelIcon from '@/components/icons/ExcelIcon.vue'
import productos from '@/store/productos'
import posiciones from '@/store/posiciones'
import posicionesV3 from '@/store/posicionesV3'
import productosV3 from '@/store/productosV3'
import {xlsx, read, utils, writeFile} from 'xlsx'
import ordenes from "@/store/ordenes"
import ordenesV3 from "@/store/ordenesV3"
import empresas from "@/store/empresasV3"
import excel from "exceljs"
import {saveAs} from "file-saver"
import fechas from 'vue-lsi-util/fechas'


export default {
    name: "Stock",

    data() {
        return  {
            itemEnEdicion: {},
            mostrarVentanaEdicion: false,
            idEmpresa: -1,
            empresaElegida: 0,
            listaArticulosCompleta: [],
            listaArticulosMostrar: [],
            listaArticulosProductos: [],
            tieneLOTE: false,
            tienePART: false,
            verSoloConStockSinPosicionar: false,
            verSoloConStock: true,
            stockTotal: 0,
            stockSinPosicionar: 0,
            stockPosicionado: 0,
            metrosTotales: 0,
            kilosTotales: 0,
            cabeceras: [],
            cabecerasLote: [],
            verDetalleLote: false,
            cabecerasStockPartidasPosicionado: [
                    {text: 'Id', value: 'id'},
                    {text: 'Nombre', value: 'Nombre'},
                    {text: 'Partida', value: 'Partida'},
                    {text: 'Barcode', value: 'Barcode'},
                    {text: 'Un.Xcaja', value: 'UnXCaja'},
                    {text: 'Alto', value: 'Alto'},
                    {text: 'Ancho', value: 'Largo'},
                    {text: 'Largo', value: 'Ancho'},
                    {text: 'Peso', value: 'Peso'},
                    {text: 'Stock', align: 'end', value: 'Stock'},
                    {text: 'Posicionado', align: 'end', value: 'StockPosicionado'},
                    {text: 'Sin posicionar', align: 'end', value: 'StockSinPosicionar'},
                    {text: 'Comprometido', align: 'end', value: 'StockComprometido'},
                    {text: '', value: 'Acciones'},
            ],
            cabecerasLote: [
                {text: 'BoxNumber', value: 'Lote'},
                {text: 'SerialNumber', value: 'SerialNumber'},
                {text: 'PartNumber', value: 'PartNumber'},
                {text: 'Stock', value: 'Stock'},
                {text: 'StockDisponible', align: 'center', value: 'StockDisponible'},
                {text: 'StockComprometido', align: 'center', value: 'StockComprometido'},
                {text: '', value: 'Acciones'},
            ],
            cabecerasLoteDetalle: [
                {text: 'SerialNumber', value: 'Barcode'},
                {text: 'PartNumber', value: 'PartNumber'},
                {text: 'Stock', value: 'Unidades'},
                {text: 'StockDisponible', align: 'center', value: 'StockDisponible'},
                {text: 'StockComprometido', align: 'center', value: 'StockComprometido'},
                {text: '', value: 'Acciones'},
            ],
            cabecerasStockPosicionado: [
                    {text: 'Id', value: 'Id'},
                    {text: 'Nombre', value: 'Nombre'},
                    {text: 'Barcode', value: 'Barcode'},
                    {text: 'CodeEmpresa', value: 'CodeEmpresa'},
                    {text: 'Un.Xcaja', value: 'UnXCaja'},
                    {text: 'Alto', value: 'Alto'},
                    {text: 'Ancho', value: 'Largo'},
                    {text: 'Largo', value: 'Ancho'},
                    {text: 'Peso', value: 'Peso'},
                    {text: 'Stock', align: 'end', value: 'Stock'},
                    {text: 'Posicionado', align: 'end', value: 'StockPosicionado'},
                    {text: 'Sin posicionar', align: 'end', value: 'StockSinPosicionar'},
                    {text: 'Comprometido', align: 'end', value: 'StockComprometido'},
                    {text: '', value: 'Acciones'},
            ],
            cabecerasStockNoPosicionado: [
                    {text: 'Id', value: 'Id'},
                    {text: 'Nombre', value: 'Nombre'},
                    {text: 'Barcode', value: 'Barcode'},
                    {text: 'CodeEmpresa', value: 'CodeEmpresa'},
                    {text: 'Un.Xcaja', value: 'UnXCaja'},
                    {text: 'Alto', value: 'Alto'},
                    {text: 'Ancho', value: 'Largo'},
                    {text: 'Largo', value: 'Ancho'},
                    {text: 'Peso', value: 'Peso'},
                    {text: 'Stock', align: 'end', value: 'Stock'},
                    {text: 'Comprometido', align: 'end', value: 'StockComprometido'},
                    {text: '', value: 'Acciones'},
            ],
            cabecerasStockPosicionadoTextil: [
                    {text: 'Id', value: 'Id'},
                    {text: 'Nombre', value: 'Nombre'},
                    {text: 'Barcode', value: 'Barcode'},
                    {text: 'CodeEmpresa', value: 'CodeEmpresa'},
                    {text: 'Alto', value: 'Alto'},
                    {text: 'Metros', value: 'Ancho'},
                    {text: 'Ancho', value: 'Largo'},
                    {text: 'Kilos', value: 'Peso'},
                    {text: 'Calidad', value: 'Precio'},
                    {text: 'Stock', align: 'end', value: 'Stock'},
                    {text: 'Posicionado', align: 'end', value: 'StockPosicionado'},
                    {text: 'Sin posicionar', align: 'end', value: 'StockSinPosicionar'},
                    {text: 'Comprometido', align: 'end', value: 'StockComprometido'},
                    {text: '', value: 'Acciones'},
            ],
            cabecerasStockNoPosicionadoTextil: [
                    {text: 'Id', value: 'Id'},
                    {text: 'Nombre', value: 'Nombre'},
                    {text: 'Barcode', value: 'Barcode'},
                    {text: 'CodeEmpresa', value: 'CodeEmpresa'},
                    {text: 'Alto', value: 'Alto'},
                    {text: 'Metros', value: 'Ancho'},
                    {text: 'Ancho', value: 'Largo'},
                    {text: 'Kilos', value: 'Peso'},
                    {text: 'Calidad', value: 'Precio'},
                    {text: 'Stock', align: 'end', value: 'Stock'},
                    {text: 'Comprometido', align: 'end', value: 'StockComprometido'},
                    {text: '', value: 'Acciones'},
            ],
            textoBusqueda: '',
            textil: false,
            // stock comprometido :
            stockComprometido: 0,
            cards: [],
            categoriaSeleccionada: 'total'
        }
    },

    methods: {
        cancelarEdicionItem() {
            this.mostrarVentanaEdicion=false
        },
        confirmarEdicionItem() {

            delete this.itemEnEdicion.Stock
            delete this.itemEnEdicion.StockComprometido
            delete this.itemEnEdicion.StockPosicionado
            delete this.itemEnEdicion.StockDisponible
            delete this.itemEnEdicion.StockUnitario
            delete this.itemEnEdicion.StockSinPosicionar
            delete this.itemEnEdicion.Posiciones
            delete this.itemEnEdicion.Barcode

            productosV3.editOne(this.itemEnEdicion)
                .then( response => {
                    const posicionListaCompleta=this.listaArticulosCompleta.findIndex(elemento => elemento.Id==response.Id)
                    this.listaArticulosCompleta[posicionListaCompleta]=response
                    this.filtrarLista()
                })
                .catch( error => {
                    console.log(error)
                })
                .finally( () => {
                    this.mostrarVentanaEdicion=false
                })



        },
        verDetallesDelArticulo(item) {
            if(this.tieneLOTE){
                this.itemEnEdicion={...item.Producto}
                this.mostrarVentanaEdicion=true
            } else {
                this.itemEnEdicion={...item}
                this.mostrarVentanaEdicion=true
            }
        },

       async verLoteDetalle(item) {
            this.verDetalleLote = true
            if(this.listaArticulosProductos.length <= 0 || this.listaArticulosProductos[0].Lote != item.Lote){
                this.listaArticulosProductos = []
                // await productosV3.getLotesDetalle(this.idEmpresa, item.Lote)
                await productosV3.getLotesDetalleV2(this.idEmpresa, item.Lote)
                .then(response => {
                        response.forEach(itemResponse => {
                            itemResponse.Lote = item.Lote
                            this.listaArticulosProductos.push(itemResponse)
                        })
                    })
                    .catch(error => {
                        this.listaArticulos=[]
                        this.mostrarError(error)
                    })
            }
        },

        empresaLoggeada() {
            if (!store.state.usuarios.usuarioActual.IdEmpresa) { 
                return -1
            } else {
                return store.state.usuarios.usuarioActual.IdEmpresa

            }
        },
        verMovimientosDelArticulo(item) {
            if(this.tieneLOTE){
                productosV3.getMovimientosByPeriodoAndEmpresaAndArticuloAndLote(this.idEmpresa, '2010-01-01', fechas.getHoy(), item.IdProducto, item.Lote) 
                    .then (response => {
                        if (response.length>0) {
                            let totalIngresos=0
                            let totalEgresos=0
                            let totalStock=0
                            let stockExcel=0
                            let mensaje=`<table border="0" width="100%"><tr><td width="15%"><b>Fecha</b></td><td><b>Comprobante</b></td><td width="10%" align="right"><b>Ingreso</b></td><td width="10%" align="right"><b>Egreso</b></td><td width="10%" align="right"><b>Stock</b></td></tr>`
                                
                            for (const unMovimiento of response) {
                                mensaje += "<tr>"
                                mensaje += `<td>${unMovimiento.fecha.substr(0,10)}</td>`
                                mensaje += `<td>&nbsp${unMovimiento.orden.substr(0,150)}</td>`
                                if (unMovimiento.signo===-1) {
                                    mensaje += `<td>&nbsp</td>`
                                    mensaje += `<td align="right">${unMovimiento.unidades}</td>`
                                    totalEgresos += unMovimiento.unidades
                                    totalStock -= unMovimiento.unidades
                                } else {
                                    mensaje += `<td align="right">${unMovimiento.unidades}</td>`
                                    mensaje += `<td>&nbsp</td>`
                                    totalIngresos += unMovimiento.unidades
                                    totalStock += unMovimiento.unidades
                                }
    
                                mensaje += `<td align="right">${totalStock}</td>`
                                mensaje += "</tr>"
                            }
    
                            totalStock = totalIngresos - totalEgresos
                               
                            mensaje += "</table>"
                            const textoPrimario="Aceptar"
                            const textoSecundario="Descargar Excel" 
                            const movimientos={
                                titulo: `Tabla de Movimientos <br>Artículo: ${item.Descripcion} ( ${item.IdProducto} )<br>Barcode: ${item.Barcode}`,
                                mensaje: `${mensaje}`,
                                botonSecundario: textoSecundario,
                                botonPrimario: textoPrimario,
                                callback: ((respuesta) => {
                                    if (respuesta===textoSecundario) {
                                        const workbook = utils.book_new()
                           
                                        const nombreHoja="Movimientos - " + item.Barcode
                                        workbook.SheetNames.push(nombreHoja)
                                        const datosPlanilla = []
                                        datosPlanilla.push(["Fecha", "Comprobante", "Ingreso", "Egreso", "Stock"])
                                        let unRenglon = []
    
                                        response.forEach(unItem => {
    
                                            if (unItem.signo===-1) {
                                                stockExcel -= unItem.unidades
                                                unRenglon=[unItem.fecha.substr(0,10), unItem.orden.substr(0,150), '', unItem.unidades, stockExcel]
                                                
                                            } else {
                                                stockExcel += unItem.unidades
                                                unRenglon=[unItem.fecha.substr(0,10), unItem.orden.substr(0,150), unItem.unidades, '',stockExcel]
                                            }
                                            
                                            datosPlanilla.push(unRenglon)
                                        })
                                        
                                        var worksheet = utils.aoa_to_sheet(datosPlanilla);
                                        workbook.Sheets[nombreHoja] = worksheet;
                                       
                                        writeFile(workbook, "Movimientos_"+item.Descripcion+".xlsx");
                                    }
                                })
                            }
                            store.dispatch("alertDialog/mostrar",  movimientos)
                        } else {
                            store.dispatch("alertDialog/mostrar", {titulo: "Artículo: "+item.Nombre + " ("+item.Id+")<br>Barcode: "+item.Barcode, mensaje: "No hay movimientos registrados"})
                        }
                    })
            } else if(this.tienePART){
                productosV3.getMovimientosByPeriodoAndEmpresaAndArticuloAndPartida(this.idEmpresa, '2010-01-01', fechas.getHoy(),item.IdProducto,item.Id)
                .then(response => {
                    
                    if (response.length>0) {
                        let totalIngresos=0
                        let totalEgresos=0
                        let totalStock=0
                        let stockExcel=0
                        let mensaje=`<table border="0" width="100%"><tr><td width="15%"><b>Fecha</b></td><td><b>Comprobante</b></td><td width="10%" align="right"><b>Ingreso</b></td><td width="10%" align="right"><b>Egreso</b></td><td width="10%" align="right"><b>Stock</b></td></tr>`
    
                        for (const unMovimiento of response) {
                                mensaje += "<tr>"
                                mensaje += `<td>${unMovimiento.fecha.substr(0,10)}</td>`
                                mensaje += `<td>&nbsp${unMovimiento.orden.substr(0,150)}</td>`
                                if (unMovimiento.signo===-1) {
                                    mensaje += `<td>&nbsp</td>`
                                    mensaje += `<td align="right">${unMovimiento.unidades}</td>`
                                    totalEgresos += unMovimiento.unidades
                                    totalStock -= unMovimiento.unidades
                                } else {
                                    mensaje += `<td align="right">${unMovimiento.unidades}</td>`
                                    mensaje += `<td>&nbsp</td>`
                                    totalIngresos += unMovimiento.unidades
                                    totalStock += unMovimiento.unidades
                                }
    
                                mensaje += `<td align="right">${totalStock}</td>`
                                mensaje += "</tr>"
                            }
    
                            totalStock = totalIngresos - totalEgresos
    
                            mensaje += "</table>"
                            const textoPrimario="Aceptar"
                            const textoSecundario="Descargar Excel" 
                            const movimientos={
                                titulo: `Tabla de Movimientos <br>Artículo: ${item.Nombre} ( ${item.Id} )<br>Partida: ${item.Partida} Barcode: ${item.Barcode}`,
                                mensaje: `${mensaje}`,
                                botonSecundario: textoSecundario,
                                botonPrimario: textoPrimario,
                                callback: ((respuesta) => {
                                    if (respuesta===textoSecundario) {
                                        const workbook = utils.book_new()
                           
                                        const nombreHoja="Movimientos - " + item.Barcode
                                        workbook.SheetNames.push(nombreHoja)
                                        const datosPlanilla = []
                                        datosPlanilla.push(["Fecha", "Comprobante", "Ingreso", "Egreso", "Stock"])
                                        let unRenglon = []
    
                                        response.forEach(unItem => {
    
                                            if (unItem.signo===-1) {
                                                stockExcel -= unItem.unidades
                                                unRenglon=[unItem.fecha.substr(0,10), unItem.orden.substr(0,150), '', unItem.unidades, stockExcel]
                                                
                                            } else {
                                                stockExcel += unItem.unidades
                                                unRenglon=[unItem.fecha.substr(0,10), unItem.orden.substr(0,150), unItem.unidades, '',stockExcel]
                                            }
                                            
                                            datosPlanilla.push(unRenglon)
                                        })
                                        
                                        var worksheet = utils.aoa_to_sheet(datosPlanilla);
                                        workbook.Sheets[nombreHoja] = worksheet;
                                       
                                        writeFile(workbook, "Movimientos_"+item.Nombre+".xlsx");
                                    
                                    }
                                })
                            }
                            store.dispatch("alertDialog/mostrar",  movimientos)
                        } else {
                            store.dispatch("alertDialog/mostrar", {titulo: "Artículo: "+item.Nombre + " ("+item.Id+")<br>Barcode: "+item.Barcode, mensaje: "No hay movimientos registrados"})
                        }
                })
            }else{
                
                productosV3.getMovimientosByPeriodoAndEmpresaAndArticulo(this.idEmpresa, '2010-01-01', fechas.getHoy(), item.Id) 
                    .then (response => {
                        if (response.length>0) {
                            let totalIngresos=0
                            let totalEgresos=0
                            let totalStock=0
                            let stockExcel=0
                            let mensaje=`<table border="0" width="100%"><tr><td width="15%"><b>Fecha</b></td><td><b>Comprobante</b></td><td width="10%" align="right"><b>Ingreso</b></td><td width="10%" align="right"><b>Egreso</b></td><td width="10%" align="right"><b>Stock</b></td></tr>`
    
                            for (const unMovimiento of response) {
                                mensaje += "<tr>"
                                mensaje += `<td>${unMovimiento.fecha.substr(0,10)}</td>`
                                mensaje += `<td>&nbsp${unMovimiento.orden.substr(0,150)}</td>`
                                if (unMovimiento.signo===-1) {
                                    mensaje += `<td>&nbsp</td>`
                                    mensaje += `<td align="right">${unMovimiento.unidades}</td>`
                                    totalEgresos += unMovimiento.unidades
                                    totalStock -= unMovimiento.unidades
                                } else {
                                    mensaje += `<td align="right">${unMovimiento.unidades}</td>`
                                    mensaje += `<td>&nbsp</td>`
                                    totalIngresos += unMovimiento.unidades
                                    totalStock += unMovimiento.unidades
                                }
    
                                mensaje += `<td align="right">${totalStock}</td>`
                                mensaje += "</tr>"
                            }
    
                            totalStock = totalIngresos - totalEgresos
    
                            mensaje += "</table>"
                            const textoPrimario="Aceptar"
                            const textoSecundario="Descargar Excel" 
                            const movimientos={
                                titulo: `Tabla de Movimientos <br>Artículo: ${item.Nombre} ( ${item.Id} )<br>Barcode: ${item.Barcode}`,
                                mensaje: `${mensaje}`,
                                botonSecundario: textoSecundario,
                                botonPrimario: textoPrimario,
                                callback: ((respuesta) => {
                                    if (respuesta===textoSecundario) {
                                        const workbook = utils.book_new()
                           
                                        const nombreHoja="Movimientos - " + item.Barcode
                                        workbook.SheetNames.push(nombreHoja)
                                        const datosPlanilla = []
                                        datosPlanilla.push(["Fecha", "Comprobante", "Ingreso", "Egreso", "Stock"])
                                        let unRenglon = []
    
                                        response.forEach(unItem => {
    
                                            if (unItem.signo===-1) {
                                                stockExcel -= unItem.unidades
                                                unRenglon=[unItem.fecha.substr(0,10), unItem.orden.substr(0,150), '', unItem.unidades, stockExcel]
                                                
                                            } else {
                                                stockExcel += unItem.unidades
                                                unRenglon=[unItem.fecha.substr(0,10), unItem.orden.substr(0,150), unItem.unidades, '',stockExcel]
                                            }
                                            
                                            datosPlanilla.push(unRenglon)
                                        })
                                        
                                        var worksheet = utils.aoa_to_sheet(datosPlanilla);
                                        workbook.Sheets[nombreHoja] = worksheet;
                                       
                                        writeFile(workbook, "Movimientos_"+item.Nombre+".xlsx");
                                    
                                    }
                                })
                            }
                            store.dispatch("alertDialog/mostrar",  movimientos)
                        } else {
                            store.dispatch("alertDialog/mostrar", {titulo: "Artículo: "+item.Nombre + " ("+item.Id+")<br>Barcode: "+item.Barcode, mensaje: "No hay movimientos registrados"})
                        }
                    })
            }

        },
        async verOrdenesPendientes(item) {
            let detalleOrdenes=""
            let cantidadComprometido = 0
            const mensaje={titulo: "Artículo: "+item.Nombre + "<br>Barcode: "+item.Barcode}            
            if (item.StockComprometido==null) {
                mensaje.mensaje="Sin stock comprometido"
                store.dispatch("alertDialog/mostrar", mensaje)
            } else {
                //trae todas las ordenes pendientes
                let listaFiltrada = await ordenesV3.getPendientes()
                //filtra las ordenes pendientes por empresa
                if(this.idEmpresa>0){
                    listaFiltrada=listaFiltrada.filter(e=>e.Empresa.Id===this.idEmpresa)
                }else{
                    listaFiltrada=listaFiltrada.filter(e=>e.Empresa.Id===(this.idEmpresa===-1 ? e.Empresa.Id : this.idEmpresa))
                }
                //recorre las ordenes pendientes filtradas
                for(const listaOrdenes of listaFiltrada){
                    //busca el detalle de la orden
                    await ordenesV3.getDetalleOrdenAndProductoById(listaOrdenes.Id)
                    .then(response =>{
                        //revisa la cantidad que tiene ese detalle con el Barcode del producto elegido y la va sumando 
                        for(const productos of response){
                            if(productos.Barcode == item.Barcode){
                                cantidadComprometido += productos.Unidades
                            }
                        }
                        if(cantidadComprometido > 0){
                            detalleOrdenes+="Orden: "+listaOrdenes.Numero+" - Unidades: "+cantidadComprometido+"<br><br>"
                        }
                        cantidadComprometido=0
                    })
                }
                
                mensaje.mensaje=detalleOrdenes
                store.dispatch("alertDialog/mostrar", mensaje)
            }
        },

        async verOrdenesPendientesLote(item) {
            let mensaje={titulo:"SerialNumber: "+item.SerialNumber}            
            // const mensaje={}            
            if (item.StockComprometido==null) {
                mensaje.mensaje="Sin stock comprometido"
                store.dispatch("alertDialog/mostrar", mensaje)
            } else {
                // ordenes.actions.getByIdArticulo(this.idEmpresa, parseInt(item.IdProducto))
                //     .then(respuesta => {
                //         console.log(respuesta)
                //         let detalleOrdenes=""
                //         respuesta.forEach(unaOrden => {
                    //             detalleOrdenes+="Orden: "+unaOrden.Numero+" - Unidades: "+unaOrden.Unidades+"<br><br>"
                    //         })
                    //         mensaje.mensaje=detalleOrdenes
                    //         store.dispatch("alertDialog/mostrar", mensaje)
                    //     })
                    //     .catch(puteada => {
                        //         this.mostrarError(puteada)
                        //     })
                        
                await productosV3.getOnlyLoteDetalle(this.idEmpresa, item.Lote)
                        .then(async response => {
                            
                            await response.forEach(async producto => {
                                await ordenesV3.getOrdenDetalleByIdProducto(producto.IdProducto)
                                // ordenes.actions.getByIdArticulo(this.idEmpresa, parseInt(producto.IdProducto))
                                .then(async respuesta => {
                                    let detalleOrdenes=""
                                        await respuesta.forEach(unaOrden => {
                                            detalleOrdenes+="Orden: "+unaOrden.Numero+" - Unidades: "+unaOrden.Unidades+" - SerialNumber: " + unaOrden.barcode + "<br>"
                                        })
                                        
                                        if(mensaje.mensaje != null){
                                            mensaje.mensaje += detalleOrdenes
                                        } else {
                                            mensaje.mensaje = detalleOrdenes
                                        }
                                        
                                        store.dispatch("alertDialog/mostrar", mensaje)
                                    })
                                    .catch(puteada => {
                                        this.mostrarError(puteada)
                                    })
                                    
                                })
                        })
                        .catch(error => {
                            console.log(error)
                        })
                        
                        // let detalleOrdenes=""
                        // respuesta.forEach(unaOrden => {
                        //     detalleOrdenes+="Orden: "+unaOrden.Numero+" - Unidades: "+unaOrden.Unidades+"<br><br>"
                        // })
                        // mensaje.mensaje=detalleOrdenes
            }
        },

        getColorStockComprometido(item) {
            if(item.StockComprometido==null){
                item.StockComprometido=0
            }
            if (item.Stock != item.StockSinPosicionar + item.StockPosicionado ||  item.StockComprometido>item.Stock) {
                //Inconsistencia
                return "red"
            } else {
                //No hay inconsistencia
                if (item.StockComprometido==0) {
                    return "green"
                } else {
                    return "orange"
                }
            }
        },

        getColorStockComprometidoLote(item) {
            if(item.StockComprometido==null){
                item.StockComprometido=0
            }
            if (item.StockComprometido > item.Stock) {
                //Inconsistencia
                return "red"
            } else {
                //No hay inconsistencia
                if (item.StockComprometido==0) {
                    return "green"
                } else {
                    return "orange"
                }
            }
        },

        getColorStockSinPosicionar(item) {
            if (item.Stock != item.StockSinPosicionar + item.StockPosicionado ||  item.StockComprometido>item.Stock) {
                //Inconsistencia
                return "red"
            } else {
                //No hay inconsistencia
                if (item.Stock==0) {
                    return "green"
                } else {
                    if (item.StockSinPosicionar>0) {
                        return "orange"
                    } else {
                        return "green"
                    }
                }
            }
        },
        getColorStockPosicionado(item) {
            if (item.Stock != item.StockSinPosicionar + item.StockPosicionado ||  item.StockComprometido>item.Stock) {
                //Inconsistencia
                return "red"
            } else {
                //No hay inconsistencia
                if (item.Stock==0) {
                    return "green"
                } else {
                    if (item.StockSinPosicionar>0) {
                        return "orange"
                    } else {
                        return "green"
                    }
                }
            }
        },
        getColorStock(item) {
            if (!this.empresaElegida.StockPosicionado) {
                return "green"
            } else {
                if (item.Stock != item.StockSinPosicionar + item.StockPosicionado ||  item.StockComprometido>item.Stock) {
                    //Inconsistencia
                    return "red"
                } else {
                    //No hay inconsistencia
                    if (item.StockSinPosicionar>0) {
                        return "orange"
                    } else {
                        return "green"
                    }
                }
            }
        },

        actualizarLotes(item){
            const listaReboot = this.listaArticulosMostrar
            this.listaArticulosMostrar = []
            productosV3.getLote(this.idEmpresa, item.Lote)
                .then(response => {
                    const posicionListaCompleta=listaReboot.findIndex(elemento => elemento.Lote==item.Lote)
                    listaReboot[posicionListaCompleta] = response[0]
                    this.listaArticulosMostrar = listaReboot
                })
                .catch(error => {
                    console.log(error)
                })
        },

        actualizarArticulo(unArticulo){
            //Pasamos listaArticulosProductos a otra variable para dejar vacio el array, asi podemos volver a cargarlo y se refresca la vista
            const listaReboot = this.listaArticulosProductos
            this.listaArticulosProductos = []
            //productos.actions.getById(unArticulo.Id)
            if(this.tieneLOTE){
                productosV3.getLoteDetalleProducto(this.idEmpresa, unArticulo.Lote, unArticulo.IdProducto)
                    .then(respuesta => {
                        const posicionListaCompleta=listaReboot.findIndex(elemento => elemento.IdProducto==unArticulo.IdProducto)
                        listaReboot[posicionListaCompleta] = respuesta[0]
                        this.listaArticulosProductos = listaReboot
                        // this.filtrarLista()
                        // this.actualizarTotales()
                    })
                    .catch(puteada => {
                        this.mostrarError(puteada)
                    })
            } else {
                productosV3.getByIdAndEmpresa(unArticulo.Id, this.idEmpresa)
                    .then(respuesta => {
                        const posicionListaCompleta=this.listaArticulosCompleta.findIndex(elemento => elemento.Id==unArticulo.Id)
                        this.listaArticulosCompleta[posicionListaCompleta]=respuesta
                        this.filtrarLista()
                        this.actualizarTotales()
                    })
                    .catch(puteada => {
                        this.mostrarError(puteada)
                    })
            }

        },
        async verPosicionesDelArticulo(unArticulo) {
            if(this.tieneLOTE){
                let posicion = await posicionesV3.getPosicionesByIdAndEmpresaAndLote(unArticulo.IdProducto, unArticulo.IdEmpresa, unArticulo.Lote)
                let contenido='<table border="0" width="20%"><tr><td><b>Posición</b><td align="right"><b>Unidades</b></tr>'
                let totalUnidades=0
                if (posicion.length>0) {
                    posicion.forEach(unaPosicion => {
                    contenido+="<tr>"
                    contenido+='<td>'+unaPosicion.Descripcion+"</td>"
                    contenido+='<td align="right">'+Number(unaPosicion.Unidades)+"</td>"
                    contenido+="</tr>"
                    totalUnidades+=Number(unaPosicion.Unidades)    
                    })
                    contenido+=`<tr><td><b>Total</b></td><td align="right"><b>${totalUnidades}</b></td></tr></table`
                } else {
                    contenido="<b>No tiene stock posicionado</b>"
                }
    
                store.dispatch("alertDialog/mostrar", {titulo: "Artículo: "+unArticulo.Descripcion + " ("+unArticulo.IdProducto+")<br>Barcode: "+unArticulo.Barcode, mensaje: contenido, botonSecundario: 'descargar excel',
                callback: (async respuesta => {
                    //descargar excel de posiciones del articulo
                    if(respuesta==="descargar excel") {
                        const workbook=new excel.Workbook()
                        const worksheet=workbook.addWorksheet("Poscicion - " + unArticulo.IdProducto)
                        //Agrega las dos primeras filas con el nombre y el barcode del producto
                        worksheet.getRow(1).values=[`Articulo: ${unArticulo.Descripcion}`]
                        worksheet.getRow(2).values=[`Barcode: ${unArticulo.Barcode}`]
                        //le da el tamaño a las columnas
                        worksheet.columns=[
                            {width: 25}, 
                            {width: 15}
                        ]
                        //pone la cuarta fila con los encabezados deseados
                        worksheet.getRow(4).values=["Posicion", "Unidades"]
                        //marca desde donde va a iniciar a colocarse los datos
                        let unRenglon = 4
                        //carga los datos fila por fila
                        posicion.forEach(e => {
                            unRenglon++
                            worksheet.getRow(unRenglon).values=[
                            e.Descripcion,
                            e.Unidades
                            ]
                        })
                        unRenglon++
                        //agrega una ultima fila con el total
                        worksheet.getRow(unRenglon).values = ["Total ", totalUnidades]
                        //modifica la fuente de las filas
                        worksheet.eachRow ( (row, rowNumber) => {
                            row.eachCell ( (cell, colNumber) => {
                                if (rowNumber===1 || rowNumber==unRenglon) {
                                    cell.font={size: 16, bold: true}
                                } else if (rowNumber===2 || rowNumber===4) {
                                    cell.font={size: 14, bold: true}
                                } else {
                                    cell.font={size: 14}
                                }
                            })
                        })
                        //Guarda el archivo excel
                        const buf= await workbook.xlsx.writeBuffer()
                        saveAs(new Blob([buf]), "Posiciones -" + unArticulo.IdProducto +".xlsx")
                    }
                })
                })

            } else if(this.tienePART){
                let posicion = await posicionesV3.getPosicionesByIdAndEmpresa(unArticulo.Id, unArticulo.IdEmpresa)
                let contenido='<table border="0" width="20%"><tr><td><b>Posición</b><td align="right"><b>Unidades</b></tr>'
                let totalUnidades=0
                if (posicion.length>0) {
                    posicion.forEach(unaPosicion => {
                    contenido+="<tr>"
                    contenido+='<td>'+unaPosicion.Descripcion+"</td>"
                    contenido+='<td align="right">'+Number(unaPosicion.Unidades)+"</td>"
                    contenido+="</tr>"
                    totalUnidades+=Number(unaPosicion.Unidades)    
                    })
                    contenido+=`<tr><td><b>Total</b></td><td align="right"><b>${totalUnidades}</b></td></tr></table`
                } else {
                    contenido="<b>No tiene stock posicionado</b>"
                }
    
                store.dispatch("alertDialog/mostrar", {titulo: "Artículo: "+unArticulo.Nombre + " ("+unArticulo.IdProducto+")<br>Partida: "+unArticulo.Partida+" Barcode: "+unArticulo.Barcode, mensaje: contenido, botonSecundario: 'descargar excel',
                callback: (async respuesta => {
                    //descargar excel de posiciones del articulo
                    if(respuesta==="descargar excel") {
                        const workbook=new excel.Workbook()
                        const worksheet=workbook.addWorksheet("Poscicion - " + unArticulo.Id)
                        //Agrega las dos primeras filas con el nombre y el barcode del producto
                        worksheet.getRow(1).values=[`Articulo: ${unArticulo.Nombre}`]
                        worksheet.getRow(2).values=[`Barcode: ${unArticulo.Barcode} Partida: ${unArticulo.Partida}`]
                        //le da el tamaño a las columnas
                        worksheet.columns=[
                            {width: 25}, 
                            {width: 15}
                        ]
                        //pone la cuarta fila con los encabezados deseados
                        worksheet.getRow(4).values=["Posicion", "Unidades"]
                        //marca desde donde va a iniciar a colocarse los datos
                        let unRenglon = 4
                        //carga los datos fila por fila
                        posicion.forEach(e => {
                            unRenglon++
                            worksheet.getRow(unRenglon).values=[
                            e.Descripcion,
                            e.Unidades
                            ]
                        })
                        unRenglon++
                        //agrega una ultima fila con el total
                        worksheet.getRow(unRenglon).values = ["Total ", totalUnidades]
                        //modifica la fuente de las filas
                        worksheet.eachRow ( (row, rowNumber) => {
                            row.eachCell ( (cell, colNumber) => {
                                if (rowNumber===1 || rowNumber==unRenglon) {
                                    cell.font={size: 16, bold: true}
                                } else if (rowNumber===2 || rowNumber===4) {
                                    cell.font={size: 14, bold: true}
                                } else {
                                    cell.font={size: 14}
                                }
                            })
                        })
                        //Guarda el archivo excel
                        const buf= await workbook.xlsx.writeBuffer()
                        saveAs(new Blob([buf]), "Posiciones -" + unArticulo.id +".xlsx")
                    }
                })
                })

            
            }else{
                let posicion = await posicionesV3.getPosicionesByIdAndEmpresa(unArticulo.Id, unArticulo.IdEmpresa)
    
                let contenido='<table border="0" width="20%"><tr><td><b>Posición</b><td align="right"><b>Unidades</b></tr>'
                let totalUnidades=0
                if (posicion.length>0) {
                    posicion.forEach(unaPosicion => {
                    contenido+="<tr>"
                    contenido+='<td>'+unaPosicion.Descripcion+"</td>"
                    contenido+='<td align="right">'+Number(unaPosicion.Unidades)+"</td>"
                    contenido+="</tr>"
                    totalUnidades+=Number(unaPosicion.Unidades)    
                    })
                    contenido+=`<tr><td><b>Total</b></td><td align="right"><b>${totalUnidades}</b></td></tr></table`
                } else {
                    contenido="<b>No tiene stock posicionado</b>"
                }
    
                store.dispatch("alertDialog/mostrar", {titulo: "Artículo: "+unArticulo.Nombre + " ("+unArticulo.Id+")<br>Barcode: "+unArticulo.Barcode, mensaje: contenido, botonSecundario: 'descargar excel',
                callback: (async respuesta => {
                    //descargar excel de posiciones del articulo
                    if(respuesta==="descargar excel") {
                        const workbook=new excel.Workbook()
                        const worksheet=workbook.addWorksheet("Poscicion - " + unArticulo.Id)
                        //Agrega las dos primeras filas con el nombre y el barcode del producto
                        worksheet.getRow(1).values=[`Articulo: ${unArticulo.Nombre}`]
                        worksheet.getRow(2).values=[`Barcode: ${unArticulo.Barcode}`]
                        //le da el tamaño a las columnas
                        worksheet.columns=[
                            {width: 25}, 
                            {width: 15}
                        ]
                        //pone la cuarta fila con los encabezados deseados
                        worksheet.getRow(4).values=["Posicion", "Unidades"]
                        //marca desde donde va a iniciar a colocarse los datos
                        let unRenglon = 4
                        //carga los datos fila por fila
                        posicion.forEach(e => {
                            unRenglon++
                            worksheet.getRow(unRenglon).values=[
                            e.Descripcion,
                            e.Unidades
                            ]
                        })
                        unRenglon++
                        //agrega una ultima fila con el total
                        worksheet.getRow(unRenglon).values = ["Total ", totalUnidades]
                        //modifica la fuente de las filas
                        worksheet.eachRow ( (row, rowNumber) => {
                            row.eachCell ( (cell, colNumber) => {
                                if (rowNumber===1 || rowNumber==unRenglon) {
                                    cell.font={size: 16, bold: true}
                                } else if (rowNumber===2 || rowNumber===4) {
                                    cell.font={size: 14, bold: true}
                                } else {
                                    cell.font={size: 14}
                                }
                            })
                        })
                        //Guarda el archivo excel
                        const buf= await workbook.xlsx.writeBuffer()
                        saveAs(new Blob([buf]), "Posiciones -" + unArticulo.Id +".xlsx")
                    }
                })
                })

            }
        },
  


  async descargarExcelNoPosicionado() {
    const workbook  = new excel.Workbook();
    const worksheet = workbook.addWorksheet('SinPosicionar');

    worksheet.views      = [{ state: 'frozen', ySplit: 1 }];
    worksheet.autoFilter = 'A1:E1';
    worksheet.columns = [
      { header: 'Producto',   width: 100 },
      { header: 'Barcode',    width: 40 },
      { header: 'CodeEmpresa',width: 40 },
      { header: 'Unidades',   width: 25 },
      { header: 'Id',         width: 25 }
    ];

    let rowIndex = 1;
    this.listaArticulosCompleta.forEach(item => {
      if (item.StockSinPosicionar && item.StockSinPosicionar > 0) {
        rowIndex++;
        worksheet.getRow(rowIndex).values = [
          item.Nombre || item.Productos || item.NombreProducto,
          item.Barcode || item.SerialNumber || item.barcode,
          item.CodeEmpresa || item.codeEmpresa,
          item.StockSinPosicionar,
          item.Id || item.IdProducto
        ];
      }
    });

    rowIndex++;
    const sumCell = worksheet.getCell(`D${rowIndex}`);
    sumCell.value = { formula: `SUM(D2:D${rowIndex-1})` };
    sumCell.font  = { bold: true };

    worksheet.eachRow((row, idx) => {
      row.eachCell(cell => {
        cell.font = idx === 1 ? { size: 16, bold: true } : { size: 14 };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${this.empresaElegida.Nombre}_StockSinPosicionar.xlsx`);
  },

  async descargarStockTotal() {
    const workbook  = new excel.Workbook();
    const worksheet = workbook.addWorksheet('StockTotal');

    worksheet.views      = [{ state: 'frozen', ySplit: 1 }];
    worksheet.autoFilter = 'A1:E1';
    worksheet.columns = [
      { header: 'Producto',   width: 100 },
      { header: 'Barcode',    width: 40 },
      { header: 'CodeEmpresa',width: 40 },
      { header: 'Unidades',   width: 25 },
      { header: 'Id',         width: 25 }
    ];

    let rowIndex = 1;
    this.listaArticulosCompleta.forEach(item => {
      rowIndex++;
      worksheet.getRow(rowIndex).values = [
        item.Nombre || item.Productos || item.NombreProducto,
        item.Barcode || item.SerialNumber || item.barcode,
        item.CodeEmpresa || item.codeEmpresa,
        item.Stock,
        item.Id || item.IdProducto
      ];
    });

    rowIndex++;
    const sumCell = worksheet.getCell(`D${rowIndex}`);
    sumCell.value = { formula: `SUM(D2:D${rowIndex-1})` };
    sumCell.font  = { bold: true };

    worksheet.eachRow((row, idx) => {
      row.eachCell(cell => {
        cell.font = idx === 1 ? { size: 16, bold: true } : { size: 14 };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${this.empresaElegida.Nombre}_StockTotal.xlsx`);
  },

  async descargarStockPosicionado() {
    const workbook  = new excel.Workbook();
    const worksheet = workbook.addWorksheet('StockPosicionado');

    worksheet.views      = [{ state: 'frozen', ySplit: 1 }];
    worksheet.autoFilter = 'A1:E1';
    worksheet.columns = [
      { header: 'Producto',   width: 100 },
      { header: 'Barcode',    width: 40 },
      { header: 'CodeEmpresa',width: 40 },
      { header: 'Posicionado',width: 25 },
      { header: 'Id',         width: 25 }
    ];

    let rowIndex = 1;
    this.listaArticulosCompleta.forEach(item => {
      if (item.StockPosicionado && item.StockPosicionado > 0) {
        rowIndex++;
        worksheet.getRow(rowIndex).values = [
          item.Nombre || item.Productos || item.NombreProducto,
          item.Barcode || item.SerialNumber || item.barcode,
          item.CodeEmpresa || item.codeEmpresa,
          item.StockPosicionado,
          item.Id || item.IdProducto
        ];
      }
    });

    rowIndex++;
    const sumCell = worksheet.getCell(`D${rowIndex}`);
    sumCell.value = { formula: `SUM(D2:D${rowIndex-1})` };
    sumCell.font  = { bold: true };

    worksheet.eachRow((row, idx) => {
      row.eachCell(cell => {
        cell.font = idx === 1 ? { size: 16, bold: true } : { size: 14 };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${this.empresaElegida.Nombre}_StockPosicionado.xlsx`);
  },

  async descargarStockSinPosicionar() {
    await this.descargarExcelNoPosicionado();
  },

  async descargarStockComprometido() {
    const workbook  = new excel.Workbook();
    const worksheet = workbook.addWorksheet('StockComprometido');

    worksheet.views      = [{ state: 'frozen', ySplit: 1 }];
    worksheet.autoFilter = 'A1:F1';
    worksheet.columns = [
      { header: 'Producto',   width: 100 },
      { header: 'Barcode',    width: 40 },
      { header: 'CodeEmpresa',width: 40 },
      { header: 'Comprometido', width: 25 },
      { header: 'Ordenes', width: 50 },
      { header: 'Id',       width: 25 }
    ];

    let rowIndex = 1;
    for (const item of this.listaArticulosCompleta) {
      if (item.StockComprometido && item.StockComprometido > 0) {
        const detalle = await ordenesV3.getOrdenDetalleByIdProducto(item.Id || item.IdProducto);
        const ord = detalle.map(o => `${o.Numero}:${o.Unidades}`).join(', ');
        rowIndex++;
        worksheet.getRow(rowIndex).values = [
          item.Nombre || item.Productos || item.NombreProducto,
          item.Barcode || item.SerialNumber || item.barcode,
          item.CodeEmpresa || item.codeEmpresa,
          item.StockComprometido,
          ord,
          item.Id || item.IdProducto
        ];
      }
    }

    rowIndex++;
    const sumCell = worksheet.getCell(`D${rowIndex}`);
    sumCell.value = { formula: `SUM(D2:D${rowIndex-1})` };
    sumCell.font  = { bold: true };

    worksheet.eachRow((row, idx) => {
      row.eachCell(cell => {
        cell.font = idx === 1 ? { size: 16, bold: true } : { size: 14 };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${this.empresaElegida.Nombre}_StockComprometido.xlsx`);
  },

 


        repararTodosLosArticulos() {
            let cantidadAReparar=0
            for (const unArticulo of this.listaArticulosMostrar) {
                if (unArticulo.StockSinPosicionar===-1 && unArticulo.Stock===0) {
                    cantidadAReparar++
                    this.repararArticuloConfirmado(unArticulo)
                }
            }
        },

        async verificarDiferenciasStockMovimiento(){
            let stockTotal = 0
            const textoPrimario="Aceptar"
            const textoSecundario="Descargar Excel" 

            let mensaje = `<table border="0" width="100%">
                            <tr>
                                <td width="50%"><b>Producto</b></td>
                                <td width="30%"><b>Barcode</b></td>
                                <td width="20%"><b>Code Empresa</b></td>
                            </tr>`

            for(const unArticulo of this.listaArticulosMostrar){
               await productosV3.getMovimientosByPeriodoAndEmpresaAndArticulo(unArticulo.IdEmpresa, '2010-01-01', fechas.getHoy(), unArticulo.Id) 
                    .then(movimientos => {
                        stockTotal = 0
                        for(const movimiento of movimientos){
                            if(movimiento.signo == -1){
                                stockTotal -= movimiento.unidades
                            } else {
                                stockTotal += movimiento.unidades
                            }
                        }           
                    })
                    .catch(error => {
                        console.log(error)
                    })
                
                if(stockTotal != unArticulo.Stock){
                    unArticulo.stockDiferencia = true
                } else {
                    unArticulo.stockDiferencia = false
                }
            }

            for await(const unArticulo of this.listaArticulosMostrar) {
                if(unArticulo.stockDiferencia){
                    mensaje += "<tr>"
                    mensaje += `<td>${unArticulo.Nombre.substr(0,90)}</td>`
                    mensaje += `<td>${unArticulo.Barcode}</td>`
                    mensaje += `<td>${unArticulo.CodeEmpresa}</td>`
                    mensaje += "</tr>"
                }
            }

            mensaje += "</table>"
            const diferenciasPopUp={
                titulo: `Diferencias entre Stock y Movimientos`,
                mensaje: `${mensaje}`,
                botonSecundario: textoSecundario,
                botonPrimario: textoPrimario,

                callback: ((respuesta) => {
                    if (respuesta===textoSecundario) {
                        const workbook = utils.book_new()                    
                        const nombreHoja="Diferencias Stock - Movimientos"
                        workbook.SheetNames.push(nombreHoja)
                        const datosPlanilla = []
                        datosPlanilla.push(["Producto","Barcode", "Code Empresa"])
                        let unRenglon = []

                        this.listaArticulosMostrar.forEach(unItem => {
                            if(unItem.stockDiferencia){
                                unRenglon = [unItem.Nombre, unItem.Barcode, unItem.CodeEmpresa]
                                datosPlanilla.push(unRenglon)
                            }                                     
                        })
                        
                        var worksheet = utils.aoa_to_sheet(datosPlanilla);
                        workbook.Sheets[nombreHoja] = worksheet;
                        writeFile(workbook, "Diferencias_Stock_Movimientos.xlsx");
                    }
                })
            }
            store.dispatch("alertDialog/mostrar",  diferenciasPopUp)
        },

        repararArticulo(articuloAReparar) {
            if (articuloAReparar.StockSinPosicionar==0 && false) {
                this.mostrarMensaje("No se requiere reparación", "El artículo seleccionado no tiene stock sin posicionar")
            } else {
                this.repararArticuloConfirmado(articuloAReparar)

            }
        },
        async repararArticuloConfirmado(articuloAReparar) {         
                const posProd = await posicionesV3.getPosicionesByIdAndEmpresa(articuloAReparar.Id, articuloAReparar.IdEmpresa)
                try{
                    const response=await posiciones.desposicionar(articuloAReparar.Id, posProd[0].IdPosicion, posProd[0].Unidades)                 
                } catch(error) {
                    store.dispatch("snackbar/mostrar", "Error al reparar articulos")
                }  
        },
        
  actualizarTotales() {
    // 1) Reseteamos
    this.stockTotal         = 0
    this.stockPosicionado   = 0
    this.stockSinPosicionar = 0

    // 2) Sumamos de la lista
    this.listaArticulosCompleta.forEach(p => {
      this.stockTotal         += Number(p.Stock              || 0)
      this.stockPosicionado   += Number(p.StockPosicionado   || 0)
      this.stockSinPosicionar += Number(p.StockSinPosicionar || 0)
    })

    // 3) Calculamos comprometido
    this.stockComprometido = this.listaArticulosCompleta
      .reduce((sum, p) => sum + Number(p.StockComprometido || 0), 0)

    // 4) Actualizamos las tarjetas con los colores personalizados
    this.cards = [
      {
        label: 'Stock total',
        value: this.stockTotal,
        color: 'var(--stock-total)',  // Usando variable CSS
        icon: 'mdi-package-variant',
        categoria: 'total',
        download: this.descargarStockTotal,
        textColor: 'var(--stock-text)'  // Color de texto para la tarjeta
      },
      {
        label: 'Posicionado',
        value: this.stockPosicionado,
        color: 'var(--stock-posicionado)',  // Usando variable CSS
        icon: 'mdi-warehouse',
        categoria: 'posicionado',
        download: this.descargarStockPosicionado,
        textColor: 'var(--stock-text)'  // Color de texto para la tarjeta
      },
      {
        label: 'Sin posicionar',
        value: this.stockSinPosicionar,
        color: 'var(--stock-sin-posicionar)',  // Usando variable CSS
        icon: 'mdi-package-variant-closed',
        categoria: 'sinPosicionar',
        download: this.descargarStockSinPosicionar,
        textColor: 'var(--stock-text)'  // Color de texto para la tarjeta
      },
      {
        label: 'Comprometido',
        value: this.stockComprometido,
        color: 'var(--stock-comprometido)',  // Usando variable CSS
        icon: 'mdi-handshake-outline',
        categoria: 'comprometido',
        download: this.descargarStockComprometido,
        textColor: 'var(--stock-text)'  // Color de texto para la tarjeta
      }
    ]
  },

  // Actualiza las tarjetas utilizando la información resumida del backend
  actualizarCardsDesdeResumen(res) {
    this.stockTotal         = Number(res.StockTotal         || 0)
    this.stockPosicionado   = Number(res.StockPosicionado   || 0)
    this.stockSinPosicionar = Number(res.StockSinPosicionar || 0)
    this.stockComprometido  = Number(res.StockComprometido  || 0)

    this.cards = [
      {
        label: 'Stock total',
        value: this.stockTotal,
        color: 'var(--stock-total)',  // Usando variable CSS
        icon: 'mdi-package-variant',
        categoria: 'total',
        download: this.descargarStockTotal,
        textColor: 'var(--stock-text)'  // Color de texto para la tarjeta
      },
      {
        label: 'Posicionado',
        value: this.stockPosicionado,
        color: 'var(--stock-posicionado)',  // Usando variable CSS
        icon: 'mdi-warehouse',
        categoria: 'posicionado',
        download: this.descargarStockPosicionado,
        textColor: 'var(--stock-text)'  // Color de texto para la tarjeta
      },
      {
        label: 'Sin posicionar',
        value: this.stockSinPosicionar,
        color: 'var(--stock-sin-posicionar)',  // Usando variable CSS
        icon: 'mdi-package-variant-closed',
        categoria: 'sinPosicionar',
        download: this.descargarStockSinPosicionar,
        textColor: 'var(--stock-text)'  // Color de texto para la tarjeta
      },
      {
        label: 'Comprometido',
        value: this.stockComprometido,
        color: 'var(--stock-comprometido)',  // Usando variable CSS
        icon: 'mdi-handshake-outline',
        categoria: 'comprometido',
        download: this.descargarStockComprometido,
        textColor: 'var(--stock-text)'  // Color de texto para la tarjeta
      }
    ]
  },
        actualizarTotalesPartida() {
            this.stockTotal=0
            this.stockSinPosicionar=0
            this.stockPosicionado=0
            this.metrosTotales=0
            this.kilosTotales=0
            this.listaArticulosCompleta.forEach(unArticulo => {
                this.stockTotal += unArticulo.Stock
                this.stockPosicionado += parseInt(unArticulo.StockPosicionado)
                this.stockSinPosicionar += unArticulo.Stock - parseInt(unArticulo.StockPosicionado) 
            })
        },

        filtrarLista(){
            let lista = this.listaArticulosCompleta

            switch (this.categoriaSeleccionada) {
                case 'posicionado':
                    lista = lista.filter(el => el.StockPosicionado > 0)
                    break
                case 'sinPosicionar':
                    lista = lista.filter(el => el.StockSinPosicionar > 0)
                    break
                case 'comprometido':
                    lista = lista.filter(el => el.StockComprometido > 0)
                    break
                default:
                    break
            }

            if (this.verSoloConStockSinPosicionar) {
                lista = lista.filter(element => element.StockSinPosicionar > 0)
            }
            if (this.verSoloConStock) {
                lista = lista.filter(element => element.Stock > 0)
            }

            this.listaArticulosMostrar = lista
        },
        changeVerSoloStockSinPosicionar() {
            this.filtrarLista()
        },
        changeVerSoloConStock() {
            this.filtrarLista()
        },
        seleccionarCategoria(categoria) {
            this.categoriaSeleccionada = categoria
            // Si aún no cargamos los detalles, los obtenemos al seleccionar la tarjeta
            if (this.listaArticulosCompleta.length === 0) {
                this.popularListaProductos()
            } else {
                this.filtrarLista()
            }
        },
        popularListaProductos() {
            this.listaArticulosCompleta=[]
            this.listaArticulosMostrar=[]
            
            if(this.tieneLOTE){
                productosV3.getAllLotesStock(this.idEmpresa)
                .then(response => {
                    this.listaArticulosCompleta = response  
                })
                .catch(error => {
                    console.log(error)
                })
                .finally( () => {
                    this.actualizarTotales()
                    this.filtrarLista()
                })
            } else if(this.tienePART){
                productosV3.getAllPartidas(this.idEmpresa)
                .then(respuesta => {
                    const mapeados = respuesta.map(item => {
  const stock = Number(item.Unidades) || 0;
  const stockPosicionado = Number(item.StockPosicionado) || 0;
  const stockComprometido = Number(item.StockComprometido) || 0;
  return {
    ...item,
    Stock: stock,
    StockPosicionado: stockPosicionado,
    StockComprometido: stockComprometido,
    StockSinPosicionar: stock - stockPosicionado
  }
});
this.listaArticulosMostrar  = mapeados;
this.listaArticulosCompleta = mapeados;
                    this.actualizarTotalesPartida()
                })
                .catch(error => {
                    console.log(error)
                })
            }else{
                const apiCall = this.verSoloConStock
                    ? productosV3.getAllConStock(this.idEmpresa)
                    : productosV3.getAllProductosByEmpresa(this.idEmpresa)
                apiCall
                    .then(respuesta => {
                        respuesta.forEach(unProducto => {
                            if(unProducto.StockComprometido == null){
                                unProducto.StockComprometido = 0
                            }
                            if(unProducto.StockPosicionado == null){
                                unProducto.StockPosicionado=0
                            }
                        
                            unProducto.StockSinPosicionar = unProducto.Stock - parseInt(unProducto.StockPosicionado) 
                        })
                        this.listaArticulosCompleta=respuesta
                        this.actualizarTotales()
                        this.filtrarLista()
                    })
                    .catch(error => {
                        console.log("error", error)
                        this.listaArticulosCompleta=[]
                        this.listaArticulosMostrar=[]
                        this.mostrarError(error)
                    })
                }
            // productosV3.getAllByEmpresa(this.idEmpresa)
            //     .then(respuesta => {
            //         this.listaArticulosCompleta=respuesta
            //         this.actualizarTotales()
            //         this.filtrarLista()
            //     })
            //     .catch(puteada => {
            //         this.listaArticulosCompleta=[]
            //         this.listaArticulosMostrar=[]
            //         this.mostrarError(puteada)
            //     })
        },
        eligioEmpresa(idEmpresaElegida) {
            this.tieneLOTE = false
            this.tienePART = false
            this.idEmpresa=idEmpresaElegida
            this.categoriaSeleccionada = 'total'
            empresas.getOne(idEmpresaElegida)
                .then(response => {
                    this.verDetalleLote = false
                    if(response.LOTE == true){
                        this.tieneLOTE = true  
                        this.tienePART = false
                    } else if(response.PART){
                        this.tieneLOTE = false
                        this.tienePART = true
                    }else{
                        this.tieneLOTE = false   
                        this.tienePART = false     
                    }

                    this.empresaElegida=response
                    if (this.empresaElegida.ClienteTextil){
                        this.textil = true
                        this.cabeceras = this.empresaElegida.StockPosicionado ? this.cabecerasStockPosicionadoTextil :  this.cabecerasStockNoPosicionadoTextil
                    }
                    else {
                        if(this.empresaElegida.PART){
                            this.cabeceras = this.cabecerasStockPartidasPosicionado
                            this.textil = false
                        }else{
                    this.cabeceras = this.empresaElegida.StockPosicionado ? this.cabecerasStockPosicionado :  this.cabecerasStockNoPosicionado
                            this.textil = false
                            this.tienePART = false
                        }
                    }

                    // Cargamos toda la lista de productos y armamos las tarjetas
                    this.popularListaProductos()
                    /*
                    // Anteriormente se obtenía un resumen desde el backend
                    productosV3.getResumenStock(idEmpresaElegida)
                        .then(resumen => {
                            this.actualizarCardsDesdeResumen(resumen)
                            this.listaArticulosCompleta = []
                            this.listaArticulosMostrar = []
                        })
                        .catch(() => {
                            this.cards = []
                        })
                    */
                })
        },
        mostrarMensaje(titulo, mensaje){
            store.dispatch("alertDialog/mostrar", {titulo, mensaje})
        },
        mostrarError(mensaje) {
            store.dispatch("snackbar/mostrar", mensaje)
        },

    },

    computed: {
        estoyEnFuente() {
            return process.env.NODE_ENV=="development"
        }
    },

    components: {
        SelectorEmpresa,
        ComprometidoIcon,
        ExcelIcon
    },

    created() {
        store.dispatch('actualizarTituloPrincipal', 'Stock')
        // store.dispatch('empresas/cargarListaEmpresas', "SoloStockPosicionado")
        store.dispatch('empresas/cargarListaEmpresas', "SoloActivas")

        if (store.state.usuarios.usuarioActual.IdEmpresa>0) {
            this.idEmpresa=store.state.usuarios.usuarioActual.IdEmpresa
            this.eligioEmpresa(store.state.usuarios.usuarioActual.IdEmpresa)
        }
    }

}
</script>

<style>
/* Estilos para el botón de exportación */
.export-btn {
  transition: all 0.3s ease;
}

.export-btn:hover {
  background-color: var(--btn-hover-color, rgba(0, 0, 0, 0.08)) !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 
              0 4px 5px 0 rgba(0, 0, 0, 0.14), 
              0 1px 10px 0 rgba(0, 0, 0, 0.12);
}

.export-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.12), 
              0 1px 10px 0 rgba(0, 0, 0, 0.08), 
              0 4px 5px -2px rgba(0, 0, 0, 0.1);
}

/* Ajustes para el tema oscuro */
.theme--dark .export-btn {
  background-color: rgba(255, 255, 255, 0.05) !important;
}

.theme--dark .export-btn:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}
/* Cabecera de tablas Vuetify en blanco */
.v-data-table-header th {
  color: #FFFFFF !important;
}
.v-data-table-header .v-icon {
  color: #FFFFFF !important;
}

/* Etiquetas de formularios Vuetify */
.v-label {
  color: #191043 !important;
}
.theme--dark .v-label {
  color: #f4fafe !important;
}
</style>
<style scoped>
/* Estilos específicos para el diálogo de edición */
.editar-producto-dialog {
  /* Variables CSS para los colores */
  --dialog-bg: #f7f5f5;
  --row-even-bg: #f4fafe;
  --text-color: #000000;
  --border-color: #dbe1e5;
}

/* Estilos para el tema oscuro */
.theme--dark .editar-producto-dialog {
  --dialog-bg: #f7f5f5;
  --row-even-bg: #f4fafe;
  --text-color: #000000;
  --border-color: #dbe1e5;
}

/* Estilos del diálogo */
.editar-producto-dialog .v-card {
  background-color: var(--dialog-bg) !important;
}

.editar-producto-dialog .v-card .v-card__text {
  background-color: var(--dialog-bg) !important;
  padding: 16px 24px !important;
}

/* Filas intercaladas */
.editar-producto-dialog .v-card .v-card__text .v-row {
  margin: 0 -12px !important;
  padding: 8px 0 !important;
  background-color: var(--dialog-bg) !important;
}

.editar-producto-dialog .v-card .v-card__text .v-row:nth-child(even) {
  background-color: var(--row-even-bg) !important;
}

/* Columnas */
.editar-producto-dialog .v-card .v-card__text .v-col {
  padding: 0 12px !important;
  background-color: inherit !important;
}

/* Campos de entrada */
.editar-producto-dialog .v-text-field {
  margin: 0 !important;
  padding: 0 !important;
}

.editar-producto-dialog .v-text-field input,
.editar-producto-dialog .v-text-field .v-label,
.editar-producto-dialog .v-text-field .v-icon,
.editar-producto-dialog .v-text-field .v-messages {
  color: var(--text-color) !important;
  caret-color: var(--text-color) !important;
}

/* Bordes de los campos */
.editar-producto-dialog .v-text-field--outlined fieldset {
  border-color: var(--border-color) !important;
  border-width: 1px !important;
}

.editar-producto-dialog .v-text-field--outlined.v-input--is-focused fieldset {
  border-color: var(--v-primary-base) !important;
  border-width: 2px !important;
}

/* Fondo de los inputs */
.editar-producto-dialog .v-input__slot {
  background-color: #FFFFFF !important;
  margin: 0 !important;
}

/* Sobrescribir estilos del tema oscuro */
.theme--dark .editar-producto-dialog .v-card,
.theme--dark .editar-producto-dialog .v-card .v-card__text {
  background-color: var(--dialog-bg) !important;
}

.theme--dark .editar-producto-dialog .v-text-field input,
.theme--dark .editar-producto-dialog .v-text-field .v-label {
  color: var(--text-color) !important;
}

/* Estilos para las etiquetas según las preferencias del usuario */
.v-label {
  color: #191043 !important;
}

.theme--dark .v-label {
  color: #f4fafe !important;
}

/* Estilos para las cabeceras de tabla según las preferencias del usuario */
.v-data-table-header th {
  color: #FFFFFF !important;
}

.v-data-table-header .v-icon {
  color: #FFFFFF !important;
}

/* Asegurar que el fondo de los inputs sea blanco */
.v-dialog .v-card .v-card__text .v-input__slot {
  background-color: #FFFFFF !important;
  margin-bottom: 0 !important;
}

/* Asegurar que el texto sea visible */
.v-dialog .v-card .v-card__text,
.v-dialog .v-card .v-card__text .v-label,
.v-dialog .v-card .v-card__text .v-messages {
  color: #000000 !important;
}

/* Sobrescribir estilos del tema oscuro */
.theme--dark .v-dialog .v-card,
.theme--dark .v-dialog .v-card .v-card__text {
  background-color: #f7f5f5 !important;
}

.theme--dark .v-dialog .v-card .v-card__text .v-input input,
.theme--dark .v-dialog .v-card .v-card__text .v-input .v-label,
.theme--dark .v-dialog .v-card .v-card__text .v-input .v-messages {
  color: #000000 !important;
}

/* Estilos para el diálogo específico de edición */
.v-dialog[role="dialog"] .v-card {
  background-color: #f7f5f5 !important;
}

.v-dialog[role="dialog"] .v-card .v-card__text .v-row:nth-child(odd) {
  background-color: #f7f5f5 !important;
}

.v-dialog[role="dialog"] .v-card .v-card__text .v-row:nth-child(even) {
  background-color: #f4fafe !important;
}

.v-dialog[role="dialog"] .v-card .v-card__text .v-text-field--outlined fieldset {
  border-color: #dbe1e5 !important;
}

.v-dialog[role="dialog"] .v-card .v-card__text .v-input input,
.v-dialog[role="dialog"] .v-card .v-card__text .v-label {
  color: #000000 !important;
}

/* Estilos específicos para el tema oscuro */
.theme--dark .v-dialog .v-card {
  background-color: #f7f5f5 !important;
}

.theme--dark .v-dialog .v-card .v-card__text,
.theme--dark .v-dialog .v-card .v-card__text .v-input,
.theme--dark .v-dialog .v-card .v-card__text .v-input input,
.theme--dark .v-dialog .v-card .v-card__text .v-input .v-label,
.theme--dark .v-dialog .v-card .v-card__text .v-input .v-messages,
.theme--dark .v-dialog .v-card .v-card__text .v-input .v-icon {
  color: #000000 !important;
  caret-color: #000000 !important;
}

.theme--dark .v-dialog .v-card .v-card__text .v-input__slot {
  background-color: transparent !important;
}

.theme--dark .v-dialog .v-card .v-card__text .v-text-field--outlined fieldset {
  border-color: #dbe1e5 !important;
}

.theme--dark .v-dialog .v-card .v-card__text .v-text-field--outlined.v-input--is-focused fieldset {
  border-color: var(--v-primary-base) !important;
  border-width: 2px !important;
}

/* Reset de estilos de la tabla */
.v-data-table {
  border-collapse: collapse !important;
  border-spacing: 0;
  width: 100%;
}

/* Estilo para el contenedor de la tabla */
.v-data-table__wrapper {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 3px 1px -2px rgba(0,0,0,0.2), 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12);
}

/* Estilo para las celdas de la cabecera */
.v-data-table-header th {
  background-color: var(--v-menubar-base) !important;
  color: #FFFFFF !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  height: 48px !important;
  padding: 0 16px !important;
  border: none !important;
  position: relative;
}

/* Estilo para las celdas del cuerpo */
.v-data-table tbody tr {
  background-color: #FFFFFF;
  transition: background-color 0.2s;
  height: 48px !important;
}

/* Filas alternadas en tema oscuro */
.theme--dark .v-data-table tbody tr:nth-child(odd) {
  background-color: #1E1E1E;
}

.theme--dark .v-data-table tbody tr:nth-child(even) {
  background-color: #2D2D2D;
}

.v-data-table tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.theme--dark .v-data-table tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.08) !important;
}

/* Estilo para las celdas */
.v-data-table td {
  padding: 0 16px !important;
  height: 48px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
  color: rgba(0, 0, 0, 0.87) !important;
  font-size: 14px !important;
  font-weight: 400 !important;
}

.theme--dark .v-data-table td {
  color: rgba(255, 255, 255, 0.87) !important;
  border-bottom-color: #56555a !important;
}

/* Eliminar borde de la última fila */
.v-data-table tbody tr:last-child td {
  border-bottom: none !important;
}

/* Estilos para el campo de búsqueda */
.search-field.v-text-field--outlined {
  border-radius: 8px;
  overflow: hidden;
  background-color: #FFFFFF;
}

.theme--dark .search-field.v-text-field--outlined {
  background-color: #d9d9d9;
}

.search-field .v-input__slot {
  margin-bottom: 0 !important;
  min-height: 40px !important;
  background: transparent !important;
}

.search-field .v-input__slot input {
  color: rgba(0, 0, 0, 0.87) !important;
  padding: 8px 0;
  font-size: 14px !important;
}

.theme--dark .search-field .v-input__slot input {
  color: #212124 !important;
}

/* Ajustar el color del label */
.search-field .v-label {
  color: rgba(0, 0, 0, 0.6) !important;
  font-size: 14px !important;
}

.theme--dark .search-field .v-label {
  color: #212124 !important;
}

/* Ajustar el color del borde */
.search-field.v-text-field--outlined fieldset {
  border-color: rgba(0, 0, 0, 0.23) !important;
  transition: border-color 0.3s;
}

.theme--dark .search-field.v-text-field--outlined fieldset {
  border-color: rgba(255, 255, 255, 0.23) !important;
}

.search-field.v-text-field--outlined.v-input--is-focused fieldset {
  border-color: var(--v-primary-base) !important;
  border-width: 2px !important;
}

/* Estilos para la tabla */
.v-data-table {
  border-collapse: separate !important;
  border-spacing: 0;
}

.v-data-table > .v-data-table__wrapper > table > thead > tr > th,
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  padding: 0 16px !important;
}

/* Asegurar que las celdas de la cabecera estén alineadas */
.v-data-table-header th {
  background-color: var(--v-menubar-base) !important;
  color: #FFFFFF !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  height: 48px !important;
  vertical-align: middle !important;
  white-space: nowrap;
  padding: 0 16px !important;
  border-bottom: none !important;
}

/* Estilos para el campo de búsqueda */
.search-field.v-text-field--outlined {
  border-radius: 8px;
  overflow: hidden;
}

.search-field.v-text-field--outlined .v-input__control,
.search-field.v-text-field--outlined .v-input__slot {
  min-height: 40px;
  margin: 0;
  background: inherit !important;
}

.search-field.v-text-field--outlined .v-input__append-inner,
.search-field.v-text-field--outlined .v-input__prepend-inner {
  margin-top: 8px !important;
}

/* Asegurar que el texto en los campos de búsqueda sea visible */
.search-field .v-input__slot input {
  color: #333333 !important;
  padding: 8px 0;
}

/* Ajustes para el tema oscuro */
.theme--dark .search-field .v-input__slot input {
  color: #FFFFFF !important;
}

/* Asegurar que las celdas de la tabla tengan alineación vertical */
.v-data-table td {
  vertical-align: middle !important;
  padding: 0 16px !important;
  height: 48px !important;
  border-bottom: thin solid rgba(0, 0, 0, 0.12) !important;
}

/* Eliminar bordes internos de la tabla */
.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > td {
  border-bottom: thin solid rgba(0, 0, 0, 0.12) !important;
}

/* Asegurar que la tabla ocupe todo el ancho */
.v-data-table__wrapper {
  border-radius: 8px 8px 0 0;
  overflow: hidden;
}

/* Ajustar el color del fondo de la tabla */
.v-data-table {
  background-color: transparent !important;
}

/* Estilos para la cabecera de la tabla */
.v-data-table-header th {
  background-color: var(--v-menubar-base) !important;
  color: #FFFFFF !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  height: 48px;
  vertical-align: middle;
  white-space: nowrap;
}

.v-data-table-header th .v-icon {
  color: #FFFFFF !important;
  margin-left: 4px;
}

/* Estilos para el campo de búsqueda */
.search-field.v-text-field--outlined {
  background-color: white;
  border-radius: 8px;
}

.search-field.v-text-field--outlined .v-input__control,
.search-field.v-text-field--outlined .v-input__slot {
  min-height: 40px;
  margin: 0;
}

.search-field.v-text-field--outlined .v-input__append-inner,
.search-field.v-text-field--outlined .v-input__prepend-inner {
  margin-top: 8px !important;
}

/* Asegurar que el texto en los campos de búsqueda sea visible */
.search-field .v-input__slot input {
  color: #333333 !important;
  padding: 8px 0;
}

/* Ajustes para el tema oscuro */
.theme--dark .search-field.v-text-field--outlined {
  background-color: #d9d9d9;
}

.theme--dark .search-field .v-input__slot input {
  color: #212124 !important;
}

/* Asegurar que las celdas de la tabla tengan alineación vertical */
.v-data-table td {
  vertical-align: middle !important;
}

/* Estilos para la cabecera de la tabla */
.v-data-table-header {
  background-color: var(--v-menubar-base) !important;
}

.v-data-table-header th {
  color: #FFFFFF !important;
}

.v-data-table-header th .v-icon {
  color: #FFFFFF !important;
}

/* Estilos para los campos de entrada en el formulario principal */
.v-input {
  margin-top: 0 !important;
  padding-top: 0 !important;
}

.v-input--dense > .v-input__control > .v-input__slot {
  margin-bottom: 0 !important;
}

.v-text-field--outlined {
  border-radius: 8px !important;
}

.v-text-field--outlined fieldset {
  border-radius: 8px !important;
}

/* Asegurar que las etiquetas tengan el color correcto según el tema */
.v-label {
  color: #191043 !important;
}

.theme--dark .v-label {
  color: #f4fafe !important;
}

/* Estilos para los checkboxes */
.v-input--selection-controls {
  margin-top: 0 !important;
  padding-top: 0 !important;
}

.v-messages {
  min-height: 0 !important;
}

/* Asegurar que el selector de empresa tenga bordes redondeados */
.selector-empresa .v-select__selections {
  border-radius: 8px !important;
}

/* Estilos para los campos de entrada en el formulario de edición */
.v-dialog .v-text-field {
  overflow: hidden;
}

.v-dialog .v-text-field.v-input--dense > .v-input__control > .v-input__slot {
  min-height: 40px;
  border-radius: 8px !important;
}

.v-dialog .v-text-field--outlined fieldset {
  border-radius: 8px !important;
}

/* Asegurar que las etiquetas tengan el color correcto según el tema */
.v-dialog .v-label {
  color: #191043 !important;
}

.theme--dark .v-dialog .v-label {
  color: #f4fafe !important;
}

/* Estilos para el diálogo */
.v-dialog .v-card {
  border-radius: 12px !important;
  overflow: hidden;
}

.v-dialog .v-card__title {
  background-color: var(--v-primary-base);
  color: white !important;
}

/* Asegurar que los botones tengan bordes redondeados */
.v-dialog .v-btn {
  border-radius: 8px !important;
  text-transform: none;
  letter-spacing: normal;
}

/* Estilos para el campo de búsqueda */
.search-field.v-text-field {
  overflow: hidden;
  border-radius: 8px;
}

.search-field.v-text-field .v-input__slot {
  background-color: white !important;
  min-height: 40px !important;
  border-radius: 8px !important;
}

/* Estilos para el campo de búsqueda en modo oscuro */
.theme--dark .search-field.v-text-field .v-input__slot {
  background-color: #d9d9d9 !important;
  color: #212124 !important;
  border: 1px solid rgba(33, 33, 36, 0.2) !important;
}

.theme--dark .search-field.v-text-field .v-label {
  color: #212124 !important;
}

.theme--dark .search-field.v-text-field input {
  color: #212124 !important;
}

.theme--dark .search-field.v-text-field .v-icon {
  color: #212124 !important;
}

/* Asegurar que el borde del campo sea consistente */
.search-field.v-text-field--outlined fieldset {
  border-color: rgba(0, 0, 0, 0.1) !important;
}

.theme--dark .search-field.v-text-field--outlined fieldset {
  border-color: rgba(255, 255, 255, 0.2) !important;
}
/* Contenedor para iconos personalizados */
.custom-icon-container {
  width: 45%;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
}

.custom-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  /* Se eliminó el filtro para mostrar los colores originales del SVG */
}

/* Estilos para los títulos de las tarjetas */
.v-card__title {
  color: #d8ecfa !important; /* Color azul claro para las cabeceras */
  font-weight: 500;
  font-size: 1.1rem;
}

/* Estilo específico para el campo de búsqueda */
.search-field .v-input__slot {
  background-color: #fff !important;
}

/* Asegurar que el texto del placeholder sea visible */
.search-field .v-label {
  color: rgba(0, 0, 0, 0.6) !important;
}

/* Cambiar el color del ícono de búsqueda */
.search-field .v-icon {
  color: var(--v-primary-base) !important;
}
</style>