<template>
    <v-container>
        <v-row>
            <v-col>
<SelectorEmpresa @eligioEmpresa="eligioEmpresa($event)" :idEmpresaInicialmenteSeleccionada="idEmpresa"></SelectorEmpresa>            </v-col>
        </v-row>
        <v-row v-show="idEmpresa">
            <v-col cols="12">
                <v-checkbox v-model="crearDesdePosicion" label="Crear orden desde posición"></v-checkbox>
            </v-col>
            
            <v-col cols="12" v-if="crearDesdePosicion">
                <v-autocomplete
                    v-model="posicionSeleccionada"
                    :items="posiciones"
                    item-text="Nombre"
                    item-value="Id"
                    label="Seleccionar posición"
                    :loading="cargandoPosiciones"
                    :search-input.sync="busquedaPosicion"
                     @update:search-input="buscarPosiciones"
                    @change="cargarProductosDesdePosicion"
                    >
    <!-- Plantilla personalizada para mostrar mejor los datos -->
    <template v-slot:item="{ item }">
        {{ item.Id }} - {{ item.Nombre }}
    </template>
    
    <template v-slot:selection="{ item }">
        {{ item.Nombre }} (ID: {{ item.Id }})
    </template>
                ></v-autocomplete>
            </v-col>
        </v-row>
        <v-form v-model="datosValidos" ref="form">
            <v-row v-show="idEmpresa" >
              <v-row >
                <v-col cols="4" md="2">
                    <v-checkbox  @click="autocompletadoCheckBox()" v-model="EnvioArea54" :label= "retiraDe" ></v-checkbox>
                </v-col>
                <v-col cols="4" md="2" v-if="!EnvioArea54">
                <v-checkbox  v-model="nuevoDestino" label="Nuevo Destino"></v-checkbox>
              </v-col>
              </v-row>
                <v-col>
                    <v-text-field class="my-0 py-0" label="Comprobante" v-model="comprobante" v-show="idEmpresa" dense :rules="[reglas.required]"></v-text-field>
                </v-col>
                <v-col>
                    <v-text-field prepend-inner-icon="mdi-calendar" type="date" label="Fecha" v-model="fecha" v-show="idEmpresa" dense :rules="[reglas.required]"></v-text-field>
                </v-col>
                <v-col>
                    <v-text-field class="my-0 py-0" label="Observaciones" v-model="observaciones" v-show="idEmpresa" dense></v-text-field>
                </v-col>
                <v-col>
                    <v-text-field class="my-0 py-0" label="Valor declarado" v-model="valorDeclarado" v-show="idEmpresa" dense :rules="[reglasCantidad.required, reglasCantidad.min]"></v-text-field>
                </v-col>
                <v-col>
                    <v-checkbox class="my-0 py-0" label="PreOrden" v-model="preOrden" v-show="idEmpresa" dense></v-checkbox>
                </v-col>
            </v-row>
            <v-row v-show="idEmpresa" >
                <v-col v-if="EnvioArea54 && !nuevoDestino">
                    <v-text-field class="my-0 py-0" label="Nombre destinatario" v-model="cliente" dense :rules="[reglas.required]" ></v-text-field>
                </v-col>
                <v-col v-if="EnvioArea54 && !nuevoDestino">
                    <v-text-field class="my-0 py-0" label="Domicilio" v-model="domicilio" dense :rules="[reglas.required]" readonly></v-text-field>
                </v-col>
                <v-col v-if="EnvioArea54 && !nuevoDestino">
                    <v-text-field class="my-0 py-0" label="Código Postal" v-model="codigoPostal" dense :rules="[reglas.required]" readonly></v-text-field>
                </v-col>
                <v-col v-if="EnvioArea54 && !nuevoDestino">
                    <v-text-field class="my-0 py-0" label="Email destinatario" v-model="emailDestinatario" dense  ></v-text-field>
                </v-col>
              <v-col v-if="!EnvioArea54 && !nuevoDestino"> 
                <v-autocomplete v-model="cliente" :items="destinos" label="Nombre destinatario" persistent-hint item-text="Nombre" item-value="Nombre" return-object v-on:change="eligioDestinatario($event)"> 
                </v-autocomplete>  
              </v-col>
              <v-col v-if="!EnvioArea54 && !nuevoDestino"> 
                    <v-autocomplete v-model="domicilio" :items="destinos" label="Domicilio" persistent-hint item-text="Domicilio" ></v-autocomplete>
              </v-col>
              <v-col v-if="!EnvioArea54 && !nuevoDestino"> 
                    <v-autocomplete v-model="codigoPostal" :items="destinos" label="Código Postal" persistent-hint  item-text="CodigoPostal"></v-autocomplete>
              </v-col>
              <v-col v-if="!EnvioArea54 && !nuevoDestino">
                    <v-autocomplete v-model="emailDestinatario"  label="Email Destinatario" persistent-hint></v-autocomplete>
            </v-col>
           
            <v-col v-if="nuevoDestino">
                    <v-text-field class="my-0 py-0" label="Nombre destinatario" v-model="cliente" dense :rules="[reglas.required]" ></v-text-field>
                </v-col>
                <v-col v-if="nuevoDestino">
                    <v-text-field class="my-0 py-0" label="Domicilio" v-model="domicilio" dense :rules="[reglas.required]" ></v-text-field>
                </v-col>
                <v-col v-if="nuevoDestino">
                    <v-text-field class="my-0 py-0" label="Código Postal" v-model="codigoPostal" dense :rules="[reglas.required]" ></v-text-field>
                </v-col>
                <v-col v-if="nuevoDestino">
                    <v-text-field class="my-0 py-0" label="Email destinatario" v-model="emailDestinatario" dense  ></v-text-field>
                </v-col>
            </v-row>
        </v-form>

        <v-row v-show="idEmpresa" >
            <v-col>
                <v-text-field ref="LecturaBarcode" inputmode="none" prepend-inner-icon="mdi-barcode-scan" @keypress.enter="procesarBarcode" label="Código de barras artículo" v-model="BarcodeLeido" dense id="BarcodeLeido" ></v-text-field>
            </v-col>
            <v-col>
                <v-btn class="mx-1" fab dark color="indigo" @click="mostrarListaArticulos=true; reinicioVar()"><v-icon dark class="mdi-18px">mdi-plus</v-icon></v-btn>
            </v-col>
            <v-col v-if="!this.textil">
                <v-text-field type="number" :rules="[reglasCantidad.required, reglasCantidad.min, reglasCantidad.max]" ref="CantidadAIngresar" prepend-inner-icon="mdi-calculator" @keypress.enter="procesarCantidad" label="Cantidad" v-model="CantidadAIngresar" dense id="CantidadAIngresar" ></v-text-field>
            </v-col>
        </v-row>
        <v-row v-if="articuloAProcesar && !this.textil">
            <v-col>
                Id: <b>{{articuloAProcesar.Id}}</b>
            </v-col>
            <v-col>
                Nombre: <b>{{articuloAProcesar.Nombre}}</b>
            </v-col>
            <v-col>
                Barcode: <b>{{articuloAProcesar.Barcode}}</b>
            </v-col>
        </v-row>
        <v-row v-if="articuloAProcesar && CantidadAIngresar>0 && !this.textil">
            <v-col><v-btn @click="procesarCantidad(); textoBusqueda=''" id="procesarCantidad" block color="green" dark>Procesar ingreso</v-btn></v-col>
        </v-row>

        <v-row v-show="items.length>0" class="pb-0 mb-0">
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
        <v-row v-show="!tieneLOTE">
            <v-col class="py-0" v-if="items.length>0">
                <v-data-table v-if="!this.textil"
                    :headers="cabeceras" 
                    :items="items"  
                    :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
                    :items-per-page="30" 
                    :search="textoBusqueda"
                    class="elevation-3" 
                >
                    <template v-slot:item.Acciones="{ item, index }">
                        <v-icon color="red" @click="eliminarItem(index)">mdi-delete</v-icon>
                    </template>
                </v-data-table>
                 <v-data-table v-if="this.textil"
                    :headers="cabecerasTextil" 
                    :items="items"  
                    :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
                    :items-per-page="30" 
                    :search="textoBusqueda"
                    class="elevation-3" 
                >
                    <template v-slot:item.Acciones="{ item, index }">
                        <v-icon color="red" @click="eliminarItem(index)">mdi-delete</v-icon>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
        <v-row v-show="tieneLOTE">
            <v-col class="py-0" v-if="items.length>0">
                <v-data-table v-if="!this.textil"
                    :headers="cabecerasLoteFinal" 
                    :items="items"  
                    :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
                    :items-per-page="30" 
                    :search="textoBusqueda"
                    class="elevation-3" 
                >
                    <template v-slot:item.Acciones="{ item, index }">
                        <v-icon color="red" @click="eliminarItem(index)">mdi-delete</v-icon>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>

        <v-row>
            <v-col> </v-col>
        </v-row>
        <v-row>
            <v-col class="py-0" v-if="totalizadorDeArticulos.length>0"> TOTALES
                <v-data-table 
                    :headers="cabecerasTotales"
                    :items="totalizadorDeArticulos"
                    :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
                    :items-per-page="30" 
                    :search="textoBusqueda"
                    class="elevation-3" >
                    <template v-slot:item.Acciones="{ item, index }">
                        <v-icon color="green" @click="actualizarTotales">mdi-plus</v-icon>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>

        <v-row v-if="items.length>0">
            <v-col><v-alert color="green" dark>Total unidades: {{totalUnidades}}</v-alert></v-col>
            <v-col><v-alert color="green" dark>Total Kilos: {{totalKilos}}</v-alert></v-col>
            <v-col v-if="!this.textil"><v-alert color="green" dark>Total M3: {{totalM3}}</v-alert></v-col>
            <v-col v-if="this.textil"><v-alert color="green" dark>Total Metros: {{totalM3}}</v-alert></v-col>
        </v-row>
        <v-row v-if="items.length>0">
            <v-col><v-btn class="action-button" block @click="crearOrden">Crear orden</v-btn></v-col>
        </v-row>

        <v-dialog
            v-model="mostrarListaArticulos"
            persistent
        >
            <v-card v-show="!tieneLOTE" class="rounded-card">
                <v-card-title>
                    <span class="text-h5">Productos</span>
                    <v-col> </v-col> <v-col> </v-col> <v-col> </v-col>
                    <v-col> <v-btn v-if="this.textil" @click="procesarIngresos()" block color="green" dark>Procesar ingresos</v-btn> </v-col>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row v-if="listaArticulos.length>0" class="pb-0 mb-0">
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
                        <v-row v-if="listaArticulos.length>0">
                            <v-col class="py-0" >
                                <v-data-table v-if="!this.textil"
                                    :headers="cabecerasListado" 
                                    :items="listaArticulos"  
                                    :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
                                    :items-per-page="30" 
                                    :search="textoBusqueda"
                                    class="elevation-3" >
                                    <template v-slot:item.Acciones="{ item, index }">
                                        <v-icon color="green" @click="seleccionarItem(item)">mdi-plus</v-icon>
                                    </template>
    
                                </v-data-table>
                                <v-data-table v-if="this.textil"
                                    v-model="seleccionados"
                                    :headers="cabecerasListadoTextil" 
                                    :items="listaArticulos"  
                                    :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
                                    :items-per-page="30" 
                                    :search="textoBusqueda"
                                    show-select
                                    item-key="Id"
                                    class="elevation-3" >
                                    <template v-slot:item.Acciones="{ item, index }">
                                        <v-icon color="green" @click="procesarProducto(item)">mdi-plus</v-icon>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="mostrarListaArticulos=false; textoBusqueda=''">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
            <v-card v-show="tieneLOTE" class="rounded-card">
                <v-card-title>
                    <span class="text-h5">{{productosLote ? "Productos" : "Lote"}}</span>
                </v-card-title>
                <v-card-text>
                    <v-container v-show="!productosLote">
                        <v-row v-if="listaArticulos.length>0" class="pb-0 mb-0">
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
                        <v-row v-if="listaArticulos.length>0">
                            <v-col class="py-0" >
                                <v-data-table v-if="!this.textil"
                                    :headers="cabecerasListado" 
                                    :items="listaArticulos"  
                                    :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
                                    :items-per-page="30" 
                                    :search="textoBusqueda"
                                    class="elevation-3" >
                                    <template v-slot:item.Acciones="{ item, index }">
                                        <v-icon color="green" @click="seleccionarItemCompleto(item)">mdi-plus</v-icon>
                                        <!-- <v-icon></v-icon> -->
                                        <v-icon color="blue" @click="seleccionarProductosItems(item)">mdi-magnify</v-icon>
                                    </template>
    
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-container v-show="productosLote">
                        <v-row v-if="listaArticulos.length>0" class="pb-0 mb-0">
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
                        <v-row v-if="listaArticulosProductos.length>0">
                            <v-col class="py-0" >
                                <v-data-table v-if="!this.textil"
                                    :headers="cabeceraListadoLote" 
                                    :items="listaArticulosProductos"  
                                    item-key="Id"
                                    :singleSelect=false
                                    show-select   
                                    v-model="productoSeleccionado"
                                    :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
                                    :items-per-page="30" 
                                    :search="textoBusqueda"
                                    class="elevation-3" >
                                    <template v-slot:item.Acciones="{ item, index }">
                                        <v-col>
                                            <v-icon v-show="productoSeleccionado.length == 0" justify="center" color="green" @click="seleccionarItem(item)">mdi-plus</v-icon>
                                            <v-text-field  v-show="item.StockDisponible > 1 && productoSeleccionado.length > 0" v-model="item.cantidad"  type="number" label="Cantidad"></v-text-field>
                                        </v-col>    
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn v-if="productoSeleccionado.length>0" @click="procesarProductosSeleccionados()" color="success" >Procesar productos</v-btn>
                    <v-btn color="blue darken-1" text @click="mostrarListaArticulos=false; textoBusqueda=''; productosLote=false; productoSeleccionado=[]">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>



    </v-container>
</template>

<script>

import SelectorEmpresa from '@/components/SelectorEmpresa.vue'
import store from '@/store'
import ordenes from '@/store/ordenesV3'
import posicionesV3 from '@/store/posicionesV3'
import productos from '@/store/productosV3'
import fechas from 'vue-lsi-util/fechas'
import empresa from '@/store/empresasV3.js'

export default {
    name: "OrdenesCreacionManual",

    data() {
        return {
            EnvioArea54: false,
            retiraDe: "Retira de " + process.env.VUE_APP_Nombre,
            totalUnidades: 0,
            totalKilos: 0,
            totalM3: 0,
            mostrarListaArticulos: false,
            datosValidos: false,
            BarcodeLeido: '',
            CantidadAIngresar: 0,
            ImporteAIngresar: 0,
            valorDeclarado: 0,
            articuloAProcesar: null,
            idEmpresa: null,
            listaArticulos: [],
            productoSeleccionado: [],
            comprobante: '',
            preOrden: false,
            fecha: '',
            cliente: '',
            domicilio: '',
            localidad: '',
            codigoPostal: '',
            observaciones: '',
            emailDestinatario: '',
            textoBusqueda: '',
            tieneLOTE: false,
            productosLote: false,
            listaArticulosProductos: [],
            loteCompleto: false,
            kilos:0,
            metros:0,
            unidadesTotalesEnBase:0,
            usuario: null,
            crearDesdePosicion: false,
            posiciones: [],
            posicionSeleccionada: null,
            cargandoPosiciones: false,
            productosCompletos: [],
            busquedaPosicion: '', 
            // items: [
            //     {Id: 38281, Barcode: 'M01', Nombre: 'Mesa', Cantidad: 1, Precio: 900, Stock: 100, StockComprometido: 30},
            //     {Id: 38282, Barcode: 'S01', Nombre: 'Silla', Cantidad: 6, Precio: 125, Stock: 1000, StockComprometido: 750},
            //     {Id: 38283, Barcode: 'H01', Nombre: 'Heladera', Cantidad: 1, Precio: 1500, Stock: 20, StockComprometido: 8},
            // ],
            items: [],
            cabeceras: [
                    {text: 'Id', value: 'Id'},
                    {text: 'Nombre', value: 'Nombre'},
                    {text: 'Barcode', value: 'Barcode'},
                    {text: 'Cantidad', align: 'end', value: 'Cantidad'},
                    {text: '', value: 'Acciones'},
            ],
            cabecerasLoteFinal: [
                    {text: 'IdProducto', value: 'Id'},
                    {text: 'Nombre', value: 'Nombre'},
                    {text: 'PartNumber', value: 'PartNumber'},
                    {text: 'Barcode', value: 'Barcode'},
                    {text: 'BoxNumber', value: 'Lote'},
                    {text: 'Cantidad', align: 'end', value: 'Cantidad'},
                    {text: 'Stock', align: 'end', value: 'Unidades'},
                    {text: 'StockDisponible', align: 'end', value: 'StockDisponible'},
                    {text: '', value: 'Acciones'},
            ],
            cabecerasTextil: [
                    {text: 'Id', value: 'Id'},
                    {text: 'Nombre', value: 'Nombre'},
                    {text: 'CodeEmpresa', value: 'CodeEmpresa'},
                    {text: 'Calidad', align: 'end', value: 'Precio'},
                    {text: 'Cantidad', align: 'end', value: 'Cantidad'},
                    {text: 'Kilos', align: 'end', value: 'Peso'},
                    {text: 'Metros', align: 'end', value: 'Ancho'},
                    {text: '', value: 'Acciones'},
            ],
            cabecerasListado: [
                    {text: 'Id', value: 'Id'},
                    {text: 'Nombre', value: 'Nombre'},
                    {text: 'Barcode', value: 'Barcode'},
                    {text: 'CodeEmpresa', value: 'CodeEmpresa'},
                    {text: 'Un.Xcaja', value: 'UnXCaja'},
                    {text: 'Stock', value: 'Stock'},
                    {text: 'Alto', value: 'Alto'},
                    {text: 'Ancho', value: 'Ancho'},
                    {text: 'Largo', value: 'Largo'},
                    {text: 'Peso', value: 'Peso'},
                    {text: 'Precio', value: 'Precio'},
                    {text: 'Disponible', value: 'StockDisponible'},
                    {text: '', value: 'Acciones'},
            ],
            cabecerasListadoTextil: [
                    {text: 'Id', value: 'Id'},
                    {text: 'Nombre', value: 'Nombre'},
                    {text: 'CodeEmpresa', value: 'CodeEmpresa'},
                    {text: 'Stock', value: 'Stock'},
                    {text: 'Alto', value: 'Alto'},
                    {text: 'Ancho', value: 'Ancho'},
                    {text: 'Largo', value: 'Largo'},
                    {text: 'Kilos', value: 'Peso'},
                    {text: 'Calidad', value: 'Precio'},
                    {text: 'Disponible', value: 'StockDisponible'},
                    {text: '', value: 'Acciones'},
            ],
            cabeceraListadoLote: [
                {text: 'Id', value: 'IdProducto'},
                {text: 'Nombre', value: 'Descripcion'},
                {text: 'PartNumber', value: 'PartNumber'},
                {text: 'SerialNumber', value: 'Barcode'},
                {text: 'BoxNumber', value: 'Lote'},
                {text: 'Stock', value: 'Unidades'},
                {text: 'Disponible', value: 'StockDisponible'},
                {text: '', value: 'Acciones', width: '15%'},
            ],
            textoBusqueda: '',
            reglasCantidad: { 
                required: value =>  !!value || 'Obligatorio', 
                max: value => value<100000 || 'Debe ser menor que 100K',
                min: value => value>0 || 'Debe ser mayor que cero',
            },
            reglas: { 
                required: value =>  !!value || 'Obligatorio', 
            },
            destinos: [],
            ordenNueva: [],
            bultos: 0,
            nuevoDestino:false,
            textil: false,
            seleccionados: [],
            mostrar: true,
            estaEmpresa: [],
            totalizadorDeArticulos: [],
            cabecerasTotales: [
                    {text: 'Nombre', value: 'Nombre'},
                    {text: 'Calidad', value: 'Precio'},
                    {text: 'Metros', value: 'Ancho'},
                    {text: 'Kilos', value: 'Peso'},
            ],
        }
    },

    watch: {
        crearDesdePosicion(nuevoValor) {
            if (nuevoValor && this.idEmpresa) {
                this.cargarPosiciones();
            }
        },
        idEmpresa() {
            // Resetear posiciones al cambiar empresa
            this.posiciones = [];
            this.posicionSeleccionada = null;
        }
    },
    methods: {
        actualizarTotales() {
            this.totalUnidades=0
            this.totalKilos=0
            this.totalM3=0

            for (const unItem of this.items) {
                if(this.tieneLOTE){
                    if(unItem.hasOwnProperty('Producto')){
                        this.totalUnidades += Number(unItem.Cantidad)
                        this.totalKilos += Number(unItem.Producto.Peso) * Number(unItem.Cantidad)
                        this.totalM3 += Number(unItem.Producto.Volumen) * Number(unItem.Cantidad)
                        
                    } else {
                        this.totalUnidades += Number(unItem.Cantidad)
                        this.totalKilos += Number(unItem.Peso) * Number(unItem.Cantidad)
                        this.totalM3 += Number(unItem.Volumen) * Number(unItem.Cantidad)
                    }                  
                } else {
                    this.totalUnidades += Number(unItem.Cantidad)
                    this.totalKilos += Number(unItem.Peso) * Number(unItem.Cantidad)
                     if (this.textil) {
                        this.totalM3 += Number(unItem.Ancho) * Number(unItem.Cantidad)
                    } else {
                        this.totalM3 += Number(unItem.Alto) * Number(unItem.Ancho) * Number(unItem.Largo) * Number(unItem.Cantidad)
                    }
                }
            }
        },
        
        
        
        destino(){
            ordenes.getAllDestino(this.idEmpresa)
            .then(response => {
                this.destinos=response
                
                })
                .catch(error => {
                    console.log(error);
                    this.mostrarError(error)
                })
        },

        autocompletadoCheckBox(){   
 
            if(this.EnvioArea54){
                this.codigoPostal = '1839'
                this.cliente = process.env.VUE_APP_Nombre 
                this.domicilio = 'LAGOS GARCÍA 4470, CLESA, Esteban Echeverría' 
                this.emailDestinatario = 'info@area54sa.com.ar'
            }else{
                this.codigoPostal = null
                this.cliente = null 
                this.domicilio = null
                this.emailDestinatario = null 
            }
        },

        seleccionarItem(item) {
            this.mostrarListaArticulos=false
            this.productosLote=false
            this.BarcodeLeido=item.Barcode
            this.procesarBarcode()
            this.textoBusqueda=''
        },

        seleccionarItemCompleto(item) {
            if(item.StockDisponible == 0 ){
                this.mostrarError("El Lote no tiene stock disponible")
                return false
            }
            
            if(item.loteCompleto){
                this.mostrarError("Ya se ingreso el Lote completo")
            }else if(item.StockComprometido>0){
                this.mostrarError("No se puede cargar lote completo, el lote tiene stock comprometido")
            }else {
                const titulo="Lote Completo?"
                const mensaje="Desea agregar el Lote Completo?"
                const botonPrimario="Agregar"
                const botonSecundario="No Agregar"
                store.dispatch(
                    "alertDialog/mostrar", 
                    {
                        titulo, 
                        mensaje, 
                        botonPrimario, 
                        botonSecundario, 
                        callback: respuesta => {
                            if (respuesta==botonPrimario) {
                                this.mostrarListaArticulos=false
                                this.productosLote=false
                                this.BarcodeLeido=item.Lote
                                this.loteCompleto = true
                                item.loteCompleto = true
                                this.procesarBarcode()
                                this.textoBusqueda=''
                            }
                        }
                    }
                )
            }
        },
       
    
   async cargarPosiciones() {
            this.cargandoPosiciones = true;
            try {
                const response = await posicionesV3.getAllByEmpresa(this.idEmpresa);
                                console.log("Respuesta completa de posicionesV3.getAllByEmpresa():", response);


                
                // Mapear a la estructura correcta usando "descripcion" en lugar de "Nombre"
                this.posiciones = response;
                
                if (this.posiciones.length === 0) {
                    this.mostrarMensaje("Información", "No se encontraron posiciones para esta empresa");
                }
            } catch (error) {
                this.mostrarError("Error al cargar posiciones: " + error.message);
            } finally {
                this.cargandoPosiciones = false;
            }
        },
        async buscarPosiciones(busqueda) {
        if (busqueda && busqueda.length > 2) {
            this.cargandoPosiciones = true;
            try {
                // Implementar API de búsqueda
                const response = await posicionesV3.buscarPorNombre(this.idEmpresa, busqueda);
                this.posiciones = response;
            } catch (error) {
                this.mostrarError("Error buscando posiciones: " + error.message);
            } finally {
                this.cargandoPosiciones = false;
            }
        } else if (!busqueda || busqueda === '') {
            // Recargar todas las posiciones si la búsqueda está vacía
            this.cargarPosiciones();
        }
    },
        
       async cargarProductosDesdePosicion() {
    if (!this.posicionSeleccionada) {
    console.log("No hay posición seleccionada");
    return;
    }
    // Mostrar advertencia importante
    const confirmar = await this.mostrarAdvertenciaPosicion();
    if (!confirmar) return;
    
    try {
        // 1. Obtener productos de la posición (primeros 500)
        const productosPosicion = await posicionesV3.getContent(this.posicionSeleccionada);
        const productosLimitados = productosPosicion.slice(0, 500);
        
        // 2. Agregar todos los productos a la orden
       productosLimitados.forEach(productoAPI => {
    // Transformar a estructura compatible
    const producto = {
        Id: productoAPI.IdProducto,
        Nombre: productoAPI.NombreProducto,
        Barcode: productoAPI.BarcodeProducto,
        Cantidad: productoAPI.Unidades,
        DesdePosicion: true,
        PosicionId: this.posicionSeleccionada
    };

    const itemExistente = this.items.find(item => item.Id === producto.Id);
    
    if (itemExistente) {
        itemExistente.Cantidad += producto.Cantidad;
    } else {
        this.items.push(producto);
    }
});
        
        // 3. Actualizar totales
        this.actualizarTotales();
        
        this.mostrarMensaje(
            "Productos cargados", 
            `Se agregaron ${productosLimitados.length} productos de la posición`
        );
        
    } catch (error) {
        console.error("Error al cargar productos:", error);
        this.mostrarError("Error al cargar productos: " + (error.message || "Contacte al administrador"));
    }
},

async mostrarAdvertenciaPosicion() {
    return new Promise(resolve => {
        store.dispatch("alertDialog/mostrar", {
            titulo: "¡Atención importante!",
            mensaje: `
                <div>
                    <p><strong>Para generar la orden correctamente:</strong></p>
                    <ol>
                        <li>Debe validar que no existan otras órdenes que comprometan productos de esta posición</li>
                        <li>Para crear otra orden con la misma posición, primero debe liberar esta orden</li>
                        <li>Verifique que los productos no estén siendo usados en otros procesos</li>
                    </ol>
                    <p>¿Confirma que desea continuar?</p>
                </div>
            `,
            botonPrimario: "Sí, continuar",
            botonSecundario: "Cancelar",
            html: true, // Permite HTML en el mensaje
            callback: respuesta => {
                resolve(respuesta === "Sí, continuar");
            }
        });
    });
},

        async seleccionarProductosItems(item) {
            if(item.loteCompleto){
                this.mostrarError("Ya se ingreso el Lote completo")
                return false
            }
            
            if(item.StockDisponible == 0 ){
                this.mostrarError("El Producto no tiene stock disponible")
                return false
            }

            this.loteCompleto = false
            this.productosLote = true
            
            if(this.listaArticulosProductos.length <= 0 || this.listaArticulosProductos[0].Lote != item.Lote){
                this.listaArticulosProductos = []
                // Consulta nueva para obtener el stock de una forma mas agil
                await productos.getLotesDetalleV2(this.idEmpresa, item.Lote)
                .then(response => {
                    response.forEach(itemResponse => {
                        if(itemResponse.StockDisponible != 0){
                            itemResponse.Lote = item.Lote
                            this.listaArticulosProductos.push(itemResponse)
                        }
                    })
                })
                .catch(error => {
                    this.listaArticulos=[]
                    this.mostrarError(error)
                })
                // await productos.getLotesDetalle(this.idEmpresa, item.Lote)
                // .then(response => {
                //     response.forEach(itemResponse => {
                //         if(itemResponse.StockDisponible != 0){
                //             itemResponse.Lote = item.Lote
                //             this.listaArticulosProductos.push(itemResponse)
                //         }
                //     })
                // })
                // .catch(error => {
                //     this.listaArticulos=[]
                //     this.mostrarError(error)
                // })
            }
        },

      procesarIngresos() {
            if (this.seleccionados.length===0) {
                this.mostrarError("Debe seleccionar al menos un producto.")
            } else {
                this.seleccionados.forEach(item => {
                    this.seleccionarItem(item)
                    this.articuloAProcesar=item
                    this.procesarCantidad()
                   
                    this.textoBusqueda=''
                });
            }
        },

        procesarProductosSeleccionados(){
            let mensajeError = ""

            // iteramos los productos seleccionados para pasar las cantidades 
            // que coloca el usuario o 1 si el stock disponible es 1
            this.productoSeleccionado = this.productoSeleccionado.filter(producto => {
                if(producto.StockDisponible == 1){
                    producto.cantidad = 1
                } else {
                    if (producto.cantidad !== null) {
                        if (typeof producto.cantidad === 'string') {
                            let cantidadNumero = parseInt(producto.cantidad);
                            if (!isNaN(cantidadNumero)) {
                                producto.cantidad = cantidadNumero;
                            } else {
                                producto.cantidad = null;
                            }
                        } else {
                            producto.cantidad = null;
                        }
                    }
                }
                
                if(producto.StockDisponible < producto.cantidad){
                    mensajeError += `\nLa cantidad ingresada para el articulo: ${producto.Barcode} / ${producto.PartNumber} es mayor a la cantidad que tiene disponible`
                    return false
                }
                
                if(producto.cantidad <= 0 || producto.cantidad == null){
                    mensajeError += `\nLa cantidad ingresada para el articulo: ${producto.Barcode} / ${producto.PartNumber} no puede ser 0, negativo o nulo`
                    return false
                }
                return true
            })
            
            this.procesarListaSeleccionada()    
            this.mostrarListaArticulos=false
            this.productosLote=false
            this.textoBusqueda = '' 
            this.productoSeleccionado = []
            if(mensajeError != ""){
                this.mostrarError(mensajeError)
            }
        },

        reinicioVar() {
            this.seleccionados=[]
        },

        async popularListaProductos() {
            if(this.tieneLOTE){
                this.listaArticulos = []
                
                // Consulta vieja, que es lenta pero funciona
                // await productos.getAllLotes(this.idEmpresa)

                // Consulta nueva, es mas rapida. Esta a prueba y hay que revisar que funcione todo bien.
                await productos.getAllLotesV2(this.idEmpresa)
                .then(response => {
                    response.forEach( articulo => {
                        if(articulo.StockDisponible != 0){                          
                           articulo.loteCompleto = false
                           this.listaArticulos.push(articulo)
                        }
                    })
                })
                .catch(error => {
                    this.listaArticulos=[]
                    this.mostrarError(error)
                })    
            
            } else {
                this.listaArticulos = []
                productos.getAllProductosByEmpresa(this.idEmpresa)
                    .then(respuesta => {
                        respuesta.forEach(e => {
                            if(e.StockComprometido == null){
                                e.StockComprometido = 0
                            }

                            if(e.StockPosicionado == null){
                                e.StockPosicionado=0
                            }
                            
                            e.StockDisponible = e.Stock - parseInt(e.StockComprometido) 
        
                            if (e.Stock != e.StockComprometido && e.Stock>0) {
                                this.listaArticulos.push(e)
                            }  
                        })
                    })
                    .catch(puteada => {
                        this.listaArticulos=[]
                        this.mostrarError(puteada)
                    })
                }
        },

        crearOrden() {
            this.$refs.form.validate()
            if (this.datosValidos) {
                const titulo="Confirma?"
                const mensaje="Confirma la creación de la orden?"
                const botonPrimario="Comenzar el procesamiento"
                const botonSecundario="No procesar"
                store.dispatch(
                    "alertDialog/mostrar", 
                    {
                        titulo, 
                        mensaje, 
                        botonPrimario, 
                        botonSecundario, 
                        callback: respuesta => {
                            if (respuesta==botonPrimario) {
                                const limite = parseInt(this.unidadesTotalesEnBase) + parseInt(this.totalUnidades)
                                if(this.estaEmpresa.ClienteTextil === true){
                                    if(this.preOrden){
                                        this.crearOrdenConfirmado()
                                    }
                                    else{
                                        if(limite < 401){
                                            this.crearOrdenConfirmado()
                                        }else{
                                            this.mostrarError("No se creo la orden porque superaria el maximo de 400 unidades diarias")
                                        }
                                    }
                                }else{
                                    this.crearOrdenConfirmado()
                                }
                            }
                        }
                    }
                )
            } else {
                this.mostrarError("Datos inválidos o incompletos")
            }
        },
        crearOrdenConfirmado() {

            let detalleDeLaOrden=[]
            this.items.forEach(unItem => {
                if(this.tieneLOTE){
                    detalleDeLaOrden.push({cantidad: unItem.Cantidad, importe: unItem.Importe, barcode: unItem.Barcode, lote: unItem.Lote, loteCompleto: unItem.loteCompleto})
                } else {
                    detalleDeLaOrden.push({cantidad: unItem.Cantidad, importe: unItem.Importe, barcode: unItem.Barcode})
                }
            })

            let payload={}

            if(this.valorDeclarado.indexOf(",")){
                this.valorDeclarado = this.valorDeclarado.replace(',', '.')                
            }

            if(typeof this.cliente == 'string'){

                 payload={
                    comprobante: this.comprobante,
                    idEmpresa: this.idEmpresa,
                    fecha: this.fecha,
                    cliente: this.cliente, 
                    codigoPostal: this.codigoPostal.trim(),
                    domicilio: this.domicilio, 
                    observaciones: this.observaciones,
                    detalle: detalleDeLaOrden,
                    emailDestinatario: this.emailDestinatario,
                    valorDeclarado: parseFloat(this.valorDeclarado),
                    preOrden: this.preOrden,
                    kilos:  this.totalKilos ,
                    metros: this.totalM3,
                    usuario: this.usuario

                }

            }else{
                
                payload={
                    comprobante: this.comprobante,
                    idEmpresa: this.idEmpresa,
                    fecha: this.fecha,
                    cliente: this.cliente.Nombre, 
                    codigoPostal: this.codigoPostal.trim(),
                    domicilio: this.domicilio, 
                    observaciones: this.observaciones,
                    detalle: detalleDeLaOrden,
                    emailDestinatario: this.emailDestinatario,
                    valorDeclarado: this.valorDeclarado,
                    preOrden: this.preOrden,
                    kilos: this.totalKilos,
                    metros: this.totalM3,
                    usuario: this.usuario,
                     desdePosicion: this.crearDesdePosicion,
            posicionId: this.posicionSeleccionada
                }
            }
            if(this.tieneLOTE){
                payload.tieneLote = true
            }
            console.log("Payload a enviar al backend:", JSON.stringify(payload, null, 2));
            ordenes.registrarAltaMasiva(payload)
                .then(response => {
                    this.mostrarMensaje(`Se ha creado exitosamente la orden número ${response.Id}`, "Nueva orden creada exitosamente")
                    if(this.estaEmpresa.ClienteTextil === true){
                        ordenes.contadorBultosDia(this.idEmpresa,this.fecha)
                        .then(response => {
                            this.unidadesTotalesEnBase = response
                        })
                    }
                        
                    if(this.EnvioArea54){

                        let ordenNueva = []   
                        ordenNueva[0]=response
                        
                         ordenes.getCantidadBultos(ordenNueva[0].Id)
                            .then(response =>{
                                response.forEach(e => {
                                        this.bultos += e.Unidades  
                                    })
                            ordenes.imprimirStickers(ordenNueva, this.bultos)

                            })
                            .catch(error => {
                                console.log(error);
                                this.mostrarError(error)
                            })
                    }

                    this.BarcodeLeido=''
                    this.CantidadAIngresar=0
                    this.ImporteAIngresar=0
                    this.valorDeclarado=0
                    this.articuloAProcesar=null
                    this.comprobante=''
                    this.cliente=''
                    this.domicilio=''
                    this.localidad=''
                    this.codigoPostal=''
                    this.observaciones=''
                    this.emailDestinatario=''
                    this.items=[]
                    this.totalizadorDeArticulos=[]
                    this.EnvioArea54 = false
                    this.ordenNueva=[]
                    this.bultos=0

                })
                .catch(error => {
                    console.log(error);
                    this.mostrarError(error)
                })

        },

        eligioDestinatario(item){
            if(item){
                this.codigoPostal = item.CodigoPostal.trim() 
                this.domicilio = item.Domicilio
                // this.emailDestinatario
            }
        },

        eliminarItem(index) {

            // console.log(this.totalizadorDeArticulos)
            this.totalizadorDeArticulos.forEach ( item => {
                if ( this.items[index].Nombre === item.Nombre && this.items[index].Precio === item.Precio ) {
                    if ( this.items[index].Peso === item.Peso && this.items[index].Ancho === item.Ancho ) {
                        this.totalizadorDeArticulos.splice(index,1)
                    } else {
                        let metros = Number(item.Ancho)
                        let kilos = Number(item.Peso)
                        metros -= Number(this.items[index].Ancho)
                        kilos -= Number(this.items[index].Peso)
                        item.Ancho = metros
                        item.Peso = kilos.toFixed(3)
                    }
                }
            })

            if(this.tieneLOTE){
                let articuloEliminado = this.items.splice(index,1)
            
                if(articuloEliminado[0].loteCompleto == true){
                    for (let i = this.items.length - 1; i >= 0; i--) {
                        if (this.items[i].Lote == articuloEliminado[0].Lote) {
                            articuloEliminado = articuloEliminado.concat(this.items.splice(i, 1));
                        }
                    }
                }
                // this.listaArticulos.forEach(articulo => {
                    //     if(articulo.Lote == articuloEliminado[0].Lote && articulo.loteCompleto == true){
                        //         this.items.forEach((item, index) => {
                            //             if(item.Lote == articulo.Lote && item.Embarque == articulo.Embarque ){
                                //                 articuloEliminado = articuloEliminado.concat(this.items.splice(index,1))
                //             }
                //         })
                //     }                 
                // })
                
                articuloEliminado.forEach(articulo => {
                    if(articulo.hasOwnProperty('Producto')){
                        this.totalUnidades -= Number(articulo.Cantidad)
                        this.totalKilos -= Number(articulo.Producto.Peso) * Number(articulo.Cantidad)
                        this.totalM3 -= Number(articulo.Producto.Volumen) * Number(articulo.Cantidad)
                    } else {
                        this.totalUnidades -= Number(articulo.Cantidad)
                        this.totalKilos -= Number(articulo.Peso) * Number(articulo.Cantidad)
                        this.totalM3 -= Number(articulo.Volumen) * Number(articulo.Cantidad)
                    }
                })

                this.listaArticulos.forEach(articulo => {
                    if(articulo.Lote == articuloEliminado[0].Lote && articulo.loteCompleto == true){
                        articulo.loteCompleto = false
                    }
                })
            } else {
                this.items.splice(index,1)
                this.actualizarTotales()
            }
        },
        procesarBarcode() {
            if(this.loteCompleto){
                productos.getLotesDetalle( this.idEmpresa, this.BarcodeLeido)
                .then(response => {
                    // Eliminar elementos existentes en this.items que coinciden con response
                    this.items = this.items.filter(item => {
                        return !response.some(unArticulo => item.Lote === unArticulo.Lote && item.Barcode === unArticulo.Barcode);
                    })
                    
                    response.forEach((item,index) => {
                        item.loteCompleto = this.loteCompleto
                            if(item.StockDisponible == 0){
                                response.splice(index, 1)
                            }
                        })
                        this.articuloAProcesar = response
                        this.procesarCantidad()
                    })
                    .catch(error => {
                        console.log(error)
                    })
            } else {
                if(this.tieneLOTE){
                    this.loteCompleto = false
                    productos.getByBarcodeAndEmpresa(this.BarcodeLeido, this.idEmpresa)
                        .then( response => {
                            this.articuloAProcesar=response
                            this.listaArticulosProductos.forEach(producto => {
                                if(producto.Barcode == this.articuloAProcesar.Barcode){
                                    this.articuloAProcesar.Unidades = producto.Unidades
                                    this.articuloAProcesar.StockComprometido = producto.StockComprometido
                                    this.articuloAProcesar.StockDisponible = producto.StockDisponible
                                    this.articuloAProcesar.Embarque = producto.Embarque
                                    this.articuloAProcesar.PartNumber = this.articuloAProcesar.CodeEmpresa
                                }
                            })
                         
                            if (!this.textil) {
                                this.$nextTick(() => {this.$refs.CantidadAIngresar.focus()})
                            }
                        })
                        .catch( error => {
                            this.mostrarError(error)
                        })
                } else {
                    productos.getByBarcodeAndEmpresa(this.BarcodeLeido, this.idEmpresa)
                        .then( response => {
                            this.articuloAProcesar=response                 
                            if (!this.textil) {
                                this.$nextTick(() => {this.$refs.CantidadAIngresar.focus()})
                            }
                            
                        })
                        .catch( error => {
                            this.mostrarError(error)
                        })
                }
            }
        },

        procesarListaSeleccionada(){     
            if (this.productoSeleccionado.length===0) {
                this.mostrarError("Debe seleccionar al menos un producto.")
            } else {
                this.productoSeleccionado.forEach(item => {
                    this.articuloAProcesar=item
                    this.articuloAProcesar.Nombre = item.Descripcion
                    this.articuloAProcesar.Id = item.IdProducto
                    this.CantidadAIngresar = item.cantidad
                    this.procesarCantidad()
                    this.textoBusqueda=''
                });
            }    
        },

        procesarCantidad() {
            if(this.tieneLOTE){
                if (this.articuloAProcesar===null) { 
                    this.mostrarError("Debe procesar el barcode ingresado")
                    return
                }

                if(this.loteCompleto){
                    this.articuloAProcesar.forEach(articulo => {
                        this.CantidadAIngresar += articulo.StockDisponible
                    })
                }

                if (this.CantidadAIngresar>0) {
                    let noExisteDuplicado = false
                    let sumaCantidad = 0
                    let barcode = this.articuloAProcesar.Barcode
                    let embarque = this.articuloAProcesar.Embarque
                    let cantidad = this.CantidadAIngresar
                    
                    this.items.forEach ( item => {
                        if ( barcode === item.Barcode && embarque == item.Embarque) {
                            sumaCantidad = parseInt(item.Cantidad) + parseInt(cantidad)
                            if(sumaCantidad <= item.StockDisponible){
                                item.Cantidad += parseInt(cantidad)
                                item.Importe += parseFloat(this.ImporteAIngresar)
                                noExisteDuplicado = true
                            }else {
                                this.mostrarError("No hay stock para la cantidad ingresada!")
                                noExisteDuplicado = true   
                            }
                        }
                    })
                    
                    if ( noExisteDuplicado === false ) {
                        if(this.loteCompleto){
                            this.articuloAProcesar.forEach(articulo => {
                                articulo.Id = articulo.IdProducto
                                articulo.Nombre = articulo.Descripcion
                                this.items.push({...articulo, Cantidad: parseInt(articulo.StockDisponible), Importe: parseFloat(this.ImporteAIngresar)})
                            })
                        } else {
                            this.items.push({...this.articuloAProcesar, Cantidad: parseInt(this.CantidadAIngresar), Importe: parseFloat(this.ImporteAIngresar), Lote: this.listaArticulosProductos[0].Lote })

                        }
                        noExisteDuplicado = true
                    }

                    this.actualizarTotales()
                    this.BarcodeLeido=''
                    this.CantidadAIngresar=0
                    this.articuloAProcesar=null
                } else {
                    if(this.CantidadAIngresar <= 0  || this.CantidadAIngresar == null){
                        this.mostrarError(`La cantidad ingresada en el barcode: ${this.articuloAProcesar.Barcode} no puede ser 0, negativo o nulo`)
                    } else {
                        this.mostrarError("Debe ingresar cantidad")
                    }
                }
            } else {
                if (this.articuloAProcesar===null) { 
                    this.mostrarError("Debe procesar el barcode ingresado")
                    return
                }
    
                if (this.textil) {
                    this.CantidadAIngresar=1
                }
                
                if (this.CantidadAIngresar>0) {
                    let noExisteDuplicado = false
                    let sumaCantidad = 0
                    let barcode = this.articuloAProcesar.Barcode
                    let cantidad = this.CantidadAIngresar
    
                    this.items.forEach ( item => {
                        if ( barcode === item.Barcode) {
                            sumaCantidad = parseInt(item.Cantidad) + parseInt(cantidad)
                            if(sumaCantidad <= item.StockDisponible){
                                item.Cantidad += parseInt(cantidad)
                                item.Importe += parseFloat(this.ImporteAIngresar)
                                noExisteDuplicado = true
                            }else {
                                this.mostrarError("No hay stock para la cantidad ingresada!")
                                noExisteDuplicado = true   
                            }
                        }
                    })
    
                    if ( noExisteDuplicado === false ) {
                        this.items.push({...this.articuloAProcesar, Cantidad: parseInt(this.CantidadAIngresar), Importe: parseFloat(this.ImporteAIngresar) })
                        noExisteDuplicado = true
                    }
         
                    let procesado = false
                    if ( this.estaEmpresa.ClienteTextil === true ) {
                        let nombre = this.articuloAProcesar.Nombre
                        let calidad = this.articuloAProcesar.Precio
                        this.totalizadorDeArticulos.forEach ( item => {
                            if ( nombre === item.Nombre && calidad === item.Precio ) {
                                let metros = Number(item.Ancho)
                                let kilos = Number(item.Peso)
                                metros += Number(this.articuloAProcesar.Ancho)
                                kilos += Number(this.articuloAProcesar.Peso)
                                item.Ancho = metros
                                item.Peso = kilos.toFixed(3)
                                procesado = true
                            }
                        })
                        if ( procesado === false ) {
                            this.totalizadorDeArticulos.push({...this.articuloAProcesar})
                            procesado = true
                        }
                    }
    
                    this.actualizarTotales()
                    this.BarcodeLeido=''
                    this.CantidadAIngresar=0
                    this.articuloAProcesar=null
                } else {
                    this.mostrarError("Debe ingresar cantidad")
                }
            }
        },

        eligioEmpresa(idEmpresaElegida) {
            this.tieneLOTE = false        
            this.items = []
            this.articuloAProcesar=null
            this.listaArticulos=[]
            this.totalizadorDeArticulos=[]
            this.idEmpresa=idEmpresaElegida;
			empresa.getOne(idEmpresaElegida)
                .then(response => {
                    if(response.LOTE == true){
                        this.tieneLOTE = true  
                        this.cabecerasListado = [
                            {text: 'DeliveryBatch', value: 'Embarque'},
                            {text: 'BoxNumber', value: 'Lote'},
                            {text: 'SerialNumber', value: 'SerialNumber'},
                            {text: 'PartNumber', value: 'PartNumber'},
                            {text: 'Stock', value: 'Unidades'},
                            {text: 'Disponible', value: 'StockDisponible'},
                            {text: '', value: 'Acciones'},
                        ]  
                    } else {
                        this.tieneLOTE = false  
                        this.cabecerasListado = [
                            {text: 'Id', value: 'Id'},
                            {text: 'Nombre', value: 'Nombre'},
                            {text: 'Barcode', value: 'Barcode'},
                            {text: 'CodeEmpresa', value: 'CodeEmpresa'},
                            {text: 'Un.Xcaja', value: 'UnXCaja'},
                            {text: 'Stock', value: 'Stock'},
                            {text: 'Alto', value: 'Alto'},
                            {text: 'Ancho', value: 'Ancho'},
                            {text: 'Largo', value: 'Largo'},
                            {text: 'Peso', value: 'Peso'},
                            {text: 'Precio', value: 'Precio'},
                            {text: 'Disponible', value: 'StockDisponible'},
                            {text: '', value: 'Acciones'},
                        ]
                    }

                    this.empresaElegida=response
                    if (this.empresaElegida.ClienteTextil){
                        this.textil = true
                    }
                    else {
                        this.textil = false
                        this.CantidadAIngresar=0
                    }
                    //trae la cantidad de unidades en las ordenes si es empresa textil
                    if(this.estaEmpresa.ClienteTextil === true){
                        ordenes.contadorBultosDia(idEmpresaElegida,this.fecha)
                        .then(response => {
                            this.unidadesTotalesEnBase = response
                        })
                    }
                })
                .catch(error => {
                    this.mostrarError(error)
                })
                .finally(() => {
                    this.popularListaProductos()
                    this.destino()
                })
                
                empresa.getOneById(this.idEmpresa)
                .then( response => {
                    this.estaEmpresa = response
                })
                .catch( error => {
                    this.mostrarError(error)
                })
        },
        mostrarError(mensaje) {
            store.dispatch("snackbar/mostrar", mensaje)
        },
        mostrarMensaje(mensaje, titulo){
            store.dispatch("alertDialog/mostrar", {titulo, mensaje})
        },

        procesarProducto(item){
            this.seleccionarItem(item)
            this.articuloAProcesar=item
            this.procesarCantidad()
            this.textoBusqueda=''
        }

    },

    components: {
        SelectorEmpresa
    },

    created() {
        store.dispatch('actualizarTituloPrincipal', 'Creación manual de órdenes')
        store.dispatch('empresas/cargarListaEmpresas','SoloActivas')
        this.fecha=fechas.getHoy()

        if (store.state.usuarios.usuarioActual.IdEmpresa>0) {
            this.idEmpresa=store.state.usuarios.usuarioActual.IdEmpresa
            this.eligioEmpresa(store.state.usuarios.usuarioActual.IdEmpresa)
        }

        this.usuario = store.state.usuarios.usuarioActual.Nombre
    }

}
</script>