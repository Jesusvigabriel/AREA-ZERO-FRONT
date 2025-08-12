<template>
    <v-container>
        <v-row>
            <v-col class="pt-1 pb-0">
                <SelectorEmpresa @eligioEmpresa="eligioEmpresa($event)" ></SelectorEmpresa>
            </v-col>
        </v-row>
        <v-row v-if="idEmpresa>0" class="py-0">
            <v-col class="py-0 my-0">
                <v-checkbox class="my-0" @change="changeVerSoloConStock" v-model="verSoloConStock" label="Ver solo artículos con stock"></v-checkbox>
            </v-col>           
        </v-row>
        <v-row v-show="listaArticulosMostrar.length>0" class="pb-0 mb-0">
            <v-btn @click="ajusteMasivo(listaArticulosMostrar)" color="success">Generar Ingreso/Egreso Masivo</v-btn>
        </v-row>
        <v-row v-show="listaArticulosMostrar.length>0" class="pb-0 mb-0">
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
            <v-col class="py-0" v-if="listaArticulosMostrar.length>0">
                <v-data-table 
                    :headers="cabeceras" 
                    :items="listaArticulosMostrar"  
                    :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
                    :items-per-page="30" 
                    :search="textoBusqueda"
                    class="elevation-3" 
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
                         <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs"  v-on="on"  color="green"  @click="AjusteDeIngreso(item,'Ingreso')">mdi-location-enter</v-icon>
                            </template>
                            <span>Registrar ingreso de stock</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                            <v-icon  v-bind="attrs" color="red"  v-on="on" @click="AjusteDeIngreso(item,'Egreso')">mdi-location-exit</v-icon>
                            </template>
                            <span>Registrar egreso de stock</span>
                        </v-tooltip>
                         <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                            <v-icon  v-bind="attrs"  v-on="on"  color="blue"  @click="actualizarArticulo(item)">mdi-refresh</v-icon> 
                            </template>
                            <span>Actualizar</span>
                        </v-tooltip>                                
                         
                    
                </template>
                </v-data-table>
            </v-col>
        </v-row>

        <!-- Dialog de Ajuste de Ingreso -->
        <v-row justify="center">
            <v-dialog v-model="AjusteIngresoDialog" persistent max-width="600px">
                <v-card class="rounded-card">
                    <v-card-title>
                        <span class="text-h5">Registración de ingreso de stock</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row v-if="idEmpresa>0">
                                <v-col cols="12">
                                   <strong>Empresa</strong> 
                                    <v-text-field
                                    label v-model="nombreEmpresa"
                                    disabled>                                   
                                    </v-text-field>       
                                </v-col>
                                <v-col cols="12" sm="6" >
                                    <strong>Codigo de barras</strong>
                                    <v-text-field
                                    label v-model="barcode" 
                                    disabled>
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <strong>Descripción</strong>
                                    <v-text-field
                                    label v-model="descripcionArt"
                                    disabled>                             
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <strong>Comprobante *</strong>
                                    <v-text-field
                                    required
                                    value v-model="comprobante"
                                    
                                    >                                        
                                    </v-text-field>
                                </v-col>
                                <v-col>
                                    <strong>Unidades a ingresar *</strong>
                                    <v-text-field
                                    required
                                    value v-model="unidades"
                                    type="number">

                                    </v-text-field>
                                </v-col>
                                <small>*campo obligatorio</small>
                                <v-card-actions>
                                <v-spacer></v-spacer>
                                        <v-btn
                                            color="blue darken-1"
                                            text
                                            @click="resetValue('Ingreso')"
                                        >
                                            Cerrar
                                        </v-btn>
                                        <v-btn
                                            color="blue darken-1"
                                            text
                                            @click="updateStockProd(comprobante,unidades,'Ingreso')"
                                        >
                                            Guardar
                                        </v-btn>
                                </v-card-actions>
                            </v-row>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-row>
        <!-- Dialog de Ajuste de Ingreso -->
        <!-- Dialog de Ajuste de Egreso -->
        <v-row justify="center">
            <v-dialog v-model="AjusteEgresoDialog" persistent max-width="600px">
                <v-card class="rounded-card">
                    <v-card-title>
                        <span class="text-h5">Registración de egreso de stock</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row v-if="idEmpresa>0">
                                <v-col cols="12">
                                   <strong>Empresa</strong> 
                                    <v-text-field
                                    label v-model="nombreEmpresa"
                                    disabled>                                   
                                    </v-text-field>       
                                </v-col>
                                <v-col cols="12" sm="6" >
                                    <strong>Codigo de barras</strong>
                                    <v-text-field
                                    label v-model="barcode" 
                                    disabled>
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <strong>Descripcion</strong>
                                    <v-text-field
                                    label v-model="descripcionArt"
                                    disabled>                             
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <strong>Comprobante *</strong>
                                    <v-text-field
                                    required
                                    value v-model="comprobante"
                                    
                                    >                                        
                                    </v-text-field>
                                </v-col>
                                <v-col>
                                    <strong>Unidades a egresar *</strong>
                                    <v-text-field
                                    required
                                    value v-model="unidades"
                                    type="number">

                                    </v-text-field>
                                </v-col>
                                <small>*campo obligatorio</small>
                                <v-card-actions>
                                <v-spacer></v-spacer>
                                        <v-btn
                                            color="blue darken-1"
                                            text
                                            @click="resetValue('Egreso')"
                                        >
                                            Cerrar
                                        </v-btn>
                                        <v-btn
                                            color="blue darken-1"
                                            text
                                            @click="updateStockProd(comprobante,unidades,'Egreso')"
                                        >
                                            Guardar
                                        </v-btn>
                                </v-card-actions>
                            </v-row>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-row>
        <!-- Dialog de Ajuste de Egreso -->
        <!-- Dialog de Ajuste Masivo -->
        <v-row justify="center">
            <v-dialog v-model="AjusteMasivoDialog" persistent max-width="650px">
               <v-card class="rounded-card">
                    <v-card-title >
                        <span class="text-h5">Ajuste Masivo</span>
                    </v-card-title>
                    <v-row>
                        <v-col cols="12" sm="6">
                        <v-radio-group
                            v-model="radioIngreso"
                            row
                            >
                            <v-radio
                                label="Ingreso"
                                value="Ingreso"
                            ></v-radio>
                            <v-radio
                                label="Egreso"
                                value="Egreso"
                            ></v-radio>
                            </v-radio-group>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                         <v-text-field
                            label="Comprobante*"
                            required
                            value v-model="comprobante"
                                    
                                >                                        
                             </v-text-field>
                       </v-col>
                </v-row>
                    <v-card-title class="py-1 my-0">
                    <v-text-field class="search-field"
                        v-model="textoBusqueda"
                        append-icon="mdi-magnify"
                        label="Búsqueda"
                        single-line
                        dense
                        hide-details
                        outlined
                    ></v-text-field>
                    </v-card-title>
                
                    <v-col class="py-0">
                <v-data-table 
                    v-model="selected"
                    :headers="cabecerasAjusteMasivo" 
                    :items="listaArticulosMostrar"  
                    :footer-props="{itemsPerPageOptions:[4,15,50,-1]}"   
                    :items-per-page="4" 
                    :search="textoBusqueda"
                    show-select
                    item-key="Nombre"
                    class="elevation-3" 
                >

                </v-data-table>
                </v-col>
                <br>
                <v-col class="py-0">
                    <span class="text-h5">Articulos a Ajustar</span>
                </v-col>
                
                <v-col class="py-0">
                <v-data-table 
                    
                    :headers="cabecerasAjusteArticulo" 
                    :items="selected"  
                    :footer-props="{itemsPerPageOptions:[4,15,50,-1]}"   
                    :items-per-page="4" 
                    class="elevation-3" 
                >
        <template v-slot:item.unidades="{item}">
          <v-edit-dialog
            :return-value.sync="item.unidades"
            large
            persistent
            @save="save"
            @cancel="cancel"
            @open="open"
            @close="close"
          >
            <div>{{ item.unidades }}</div>
            
            <template v-slot:input>
              <v-text-field
                v-model="item.unidades"
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
                                
                <v-card-actions>
                     <v-spacer></v-spacer>
                                        <v-btn
                                            color="blue darken-1"
                                            text
                                            @click="resetValue('Ingreso')"
                                        >
                                            Cerrar
                                        </v-btn>
                                        <v-btn
                                            color="blue darken-1"
                                            text
                                            @click="validateAjusteMasivo()"
                                        >
                                            Guardar
                                        </v-btn>
                 </v-card-actions>
                        
              </v-card>
            </v-dialog>
        </v-row>
        <!-- Dialog de Ajuste Masivo -->
    </v-container>
</template>        

<script>

import SelectorEmpresa from '@/components/SelectorEmpresa.vue'
import store from '@/store'
import productosV3 from '@/store/productosV3'
import empresas from "@/store/empresasV3"
import movimientosStockV3 from '@/store/movimientosStockV3'


export default {
    name: "Ajustes",

    data() {
        return  {
            selected:[],
            idEmpresa: -1,
            empresaElegida: null,
            nombreEmpresa: null,
            barcode: null,
            descripcionArt:null,
            listaArticulosCompleta: [],
            listaArticulosMostrar: [],
            verSoloConStockSinPosicionar: false,
            verSoloConStock: false,
            stockTotal: 0,
            stockSinPosicionar: 0,
            stockPosicionado: 0,
            cabecerasStockPosicionado: [
                {text: 'Id', value: 'Id'},
                {text: 'Nombre', value: 'Nombre'},
                {text: 'Barcode', value: 'Barcode'},
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
                {text: 'Stock', align: 'end', value: 'Stock'},
                {text: 'Comprometido', align: 'end', value: 'StockComprometido'},
                {text: '', value: 'Acciones'},
            ],
            cabecerasAjusteMasivo: [
                {text: 'Id', value: 'Id'},
                {text: 'Nombre', value: 'Nombre'},
                {text: 'Barcode', value: 'Barcode'},
            ],
            cabecerasAjusteArticulo: [
                {text: 'Id', value: 'Id'},
                {text: 'Nombre', value: 'Nombre'},
                {text: 'Barcode', value: 'Barcode'},
                {text: 'Stock', align: 'end', value: 'Stock'},
                {text: 'Comprometido', align: 'end', value: 'StockComprometido'},
                {text: 'Unidades',align: 'end', value: 'unidades'}
            ],
            textoBusqueda: '',
            AjusteIngresoDialog: false,
            AjusteEgresoDialog: false,
            AjusteMasivoDialog: false,
            comprobante: null,
            unidades:0,
            idProducto:0,
            unidadesTotales:0,
            fechaDeHoy: new Date(),
            tipoIngreso:4,
            tipoEgreso:3,
            userName:null,
            variacion:0,
            snack: false,
            radioIngreso:null,
            flag:0,
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
            // console.log('Dialog closed')
        },

        actualizarArticulo(unArticulo){
            //productos.actions.getById(unArticulo.Id)
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

        },

        actualizarTotales() {
            this.stockTotal=0
            this.stockSinPosicionar=0
            this.stockPosicionado=0
            this.listaArticulosCompleta.forEach(unArticulo => {
                this.stockTotal += unArticulo.Stock
                this.stockPosicionado += unArticulo.StockPosicionado
                this.stockSinPosicionar += unArticulo.StockSinPosicionar
            });
            
        },

        popularListaProductos() {
            this.listaArticulosCompleta=[]
            this.listaArticulosMostrar=[]
            //productos.actions.getAllByIdEmpresa(this.idEmpresa)
            //productosV3.getAllByEmpresa(this.idEmpresa)
            productosV3.getAllProductosByEmpresa(this.idEmpresa)
                .then(respuesta => {
                    // console.log("Respuesta", respuesta);
                    respuesta.forEach(unProducto => {
                        if(unProducto.StockComprometido == null){
                            unProducto.StockComprometido = 0
                        }
                        if(unProducto.StockPosicionado == null){
                            unProducto.StockPosicionado=0
                        }
                       
                        unProducto.StockSinPosicionar = unProducto.Stock - parseInt(unProducto.StockPosicionado) })
                    this.listaArticulosCompleta=respuesta
                    //this.actualizarTotales()
                    this.filtrarLista()
                    
                })
                .catch(puteada => {
                    //console.log("Puteada", puteada)
                    this.listaArticulosCompleta=[]
                    this.listaArticulosMostrar=[]
                    this.mostrarError(puteada)
                })
        },       

        eligioEmpresa(idEmpresaElegida) {
        this.idEmpresa=idEmpresaElegida
        empresas.getOne(idEmpresaElegida)
            .then(response => {
                this.empresaElegida=response
                this.cabeceras = this.empresaElegida.StockPosicionado ? this.cabecerasStockPosicionado :  this.cabecerasStockNoPosicionado
                this.nombreEmpresa = this.empresaElegida.Nombre
                this.popularListaProductos()
                
                
            })
        },

        filtrarLista(){
            if (this.verSoloConStockSinPosicionar) {
                this.listaArticulosMostrar = this.listaArticulosCompleta.filter(element => element.StockSinPosicionar>0)
            } else {
                this.listaArticulosMostrar = this.listaArticulosCompleta.filter(element => true)
            }
            if (this.verSoloConStock) {
                this.listaArticulosMostrar = this.listaArticulosMostrar.filter(element => element.Stock>0)
            }
        },
        
        changeVerSoloStockSinPosicionar() {
            this.filtrarLista()
        },

        changeVerSoloConStock() {
            this.filtrarLista()
        },

         mostrarError(mensaje) {
            store.dispatch("snackbar/mostrar", mensaje)
        },

        mostrarMensaje(titulo, mensaje){
            store.dispatch("alertDialog/mostrar", {titulo, mensaje})
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

        getColorStockComprometido(item) {
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

        estaLoggeado() {
            return store.state.usuarios.usuarioActual.Loggeado
        },

        nombreUsuario() {
           this.userName =  store.state.usuarios.usuarioActual.Nombre
           
        },

        ajusteMasivo(listaArticulos)
        {
            this.AjusteMasivoDialog = true
            this.nombreUsuario()
            this.cabecerasAjuste = this.cabecerasAjusteMasivo 

        },

        validateAjusteMasivo()
        {
            this.flag =0
            if(this.selected.length>0)
            {
                if (!this.radioIngreso) 
                {                    
                    this.mostrarMensaje('Operación incorrecta', 'Debe marcar el tipo de operación que desea realizar INGRESO/EGRESO')
                    this.flag = 1
                } 
                else if (!this.comprobante)
                {
                     this.mostrarMensaje('Operación incorrecta', 'Falta completar el campo Comprobante')
                    this.flag  = 1
                }
                else
                {
                    this.selected.forEach( unArticulo => 
                        {
                            if( typeof unArticulo.unidades==='undefined')
                                {
                
                                this.mostrarMensaje('Operación  Incorrecta', 'Falta Completar las unidades de alguno de los Articulos a Ajustar')
                                this.flag  = 1
                                }
                            else if(unArticulo.unidades<0) 
                                {
                                    
                                    this.mostrarMensaje('Operación  Incorrecta', 'Las unidades de un Articulo no pueden ser menores a 0')
                                    this.flag  = 1
                                }
                            else 
                            {
                                let stock = unArticulo.Stock
                                let stockComprometido = unArticulo.StockComprometido
                                stock -= stockComprometido
                                stock -= unArticulo.unidades

                                if(stock < 0)
                                {
                                    this.mostrarMensaje('Operación  Incorrecta', 'Las unidades de un Articulo no pueden ser menores a 0. / Articulo: ' + unArticulo.Id)
                                    this.flag  = 1
                                }
                            }
                    
                        }
                    )
                } 
            }
            else
            {
                this.mostrarMensaje('Operación  Incorrecta', 'Debe Seleccionar al menos un articulo a Ajustar')
                this.flag=1
            }
           
            if(this.flag===0)
            {
                this.createAjusteMasivo()
            }
        },

        createAjusteMasivo()
        {
            this.selected.forEach(articulo => {this.updateStockMaviso(this.radioIngreso,articulo.unidades,articulo.Stock,articulo.Id,articulo.Barcode)})
        },

        createMoviemientoStockMasivo(unidades,tipo, barcode)
        {
            movimientosStockV3.createMovimientoStock({Orden: this.comprobante, IdProducto: this.variacion, Unidades: parseInt(unidades), Tipo: tipo, IdEmpresa: parseInt(this.idEmpresa), Fecha:  this.fechaDeHoy , codprod: barcode, Usuario: this.userName })
            .then(response => {
                this.resetValue()               

            })
            .catch(puteada => {
                        this.mostrarError(puteada)
                        console.log(puteada)

                })
        
        },

        AjusteDeIngreso(unArticulo, ingresoEgreso)
        {
            if(ingresoEgreso=='Ingreso')
            {
                this.nombreUsuario()
                this.barcode = unArticulo.Barcode
                this.descripcionArt = unArticulo.Nombre
                this.Stock = unArticulo.Stock
                
                this.idProducto = unArticulo.Id
                this.AjusteIngresoDialog = true
            }else
            {
                this.nombreUsuario()
                this.barcode = unArticulo.Barcode
                this.descripcionArt = unArticulo.Nombre
                this.Stock = unArticulo.Stock
                this.StockComprometido = unArticulo.StockComprometido
                this.idProducto = unArticulo.Id
                this.AjusteEgresoDialog = true     
            }
        },

        resetValue(ingresoEgreso)
        {
            this.comprobante=null,
            this.unidades = 0,
            this.AjusteEgresoDialog = false
            this.AjusteIngresoDialog = false
            this.AjusteMasivoDialog = false
            this.selected = []
            this.radioIngreso=null
        },

        createMoviemientoStock(unidades,tipo)
        {
            movimientosStockV3.createMovimientoStock({Orden: this.comprobante, IdProducto: this.variacion, Unidades: parseInt(unidades), Tipo: tipo, IdEmpresa: parseInt(this.idEmpresa), Fecha: this.fechaDeHoy , codprod: this.barcode, Usuario: this.userName })
                .then(response => {
                    this.resetValue()               
                })
                .catch(puteada => {
                    this.mostrarError(puteada)
                    console.log(puteada)

                 })
        },

        updateStockMaviso(ingresoEgreso,unidades,stock,idProducto,barcode)
        {
            if(ingresoEgreso=='Ingreso') {
                this.unidadesTotales = parseInt(unidades) + parseInt(stock)
                productosV3.updateStockArt( parseInt(idProducto), { Unidades: parseInt(this.unidadesTotales) })
                .then(response => {
                    this.createMoviemientoStockMasivo(parseInt(unidades),this.tipoIngreso,barcode) 
                    
                        
                    })
                        .catch(puteada => {
                        this.mostrarError(puteada)
                    })
            }
            else
            {       
                this.unidadesTotales = parseInt(stock) - parseInt(unidades) 
                if(this.unidadesTotales<0)
                {
                    this.mostrarMensaje('Unidades Incorrectas', 'La cantidad de Unidades a Restar es Mayor al Stock actual del Producto')
                
                }
                else
                {
                    productosV3.updateStockArt( parseInt(idProducto), { Unidades: parseInt(this.unidadesTotales) })
                        .then(response => {
                                this.createMoviemientoStockMasivo(parseInt(unidades),this.tipoEgreso,barcode)  
                            })
                        .catch(puteada => {
                            this.mostrarError(puteada)
                        })
                }
            }
        },

        updateStockProd(comprobante, unidades,ingresoEgreso)
        {
            // console.log(comprobante,unidades,ingresoEgreso)
            if(ingresoEgreso=='Ingreso')
            {
                if(unidades<=0) {
                    this.mostrarMensaje('Unidades Incorrectas', 'La cantidad de Unidades debe ser mayor a 0')
                } 
                else if (comprobante == null)
                {
                    this.mostrarMensaje('Comprobante Incorrecto', 'Debe ingresar un comprobante para generar un ingreso de Stock')
                } else
                {
                    this.unidadesTotales = parseInt(this.unidades) + parseInt(this.Stock)

                    productosV3.updateStockArt( parseInt(this.idProducto), { Unidades: parseInt(this.unidadesTotales) })
                    .then(response => {
                        this.createMoviemientoStock(parseInt(this.unidades),this.tipoIngreso) 
                        
                            
                        })
                            .catch(puteada => {
                            this.mostrarError(puteada)
                        })
                }
            }
            else
            {
                if(unidades<=0)
                {
                    this.mostrarMensaje('Unidades Incorrectas', 'La cantidad de Unidades debe ser mayor a 0')
                } 
                else if (comprobante == null)
                {
                    this.mostrarMensaje('Comprobante Incorrecto', 'Debe ingresar un comprobante para generar un ingreso de Stock')
                } else {        
                    const stock = this.Stock - this.StockComprometido - this.unidades                        
                    if(stock<0)
                    {
                        this.mostrarMensaje('Unidades incorrectas', 'La cantidad de unidades a egresar es mayor al stock actual del producto')                    
                    }
                    else
                    {

                        this.unidadesTotales = parseInt(this.Stock) - parseInt(this.unidades)

                        productosV3.updateStockArt( parseInt(this.idProducto), { Unidades: parseInt(this.unidadesTotales) })
                            .then(response => {
                                this.createMoviemientoStock(parseInt(this.Stock-this.unidadesTotales),this.tipoEgreso)  
                                    
                                })
                                    .catch(puteada => {
                                    this.mostrarError(puteada)
                                })
                    }
                }
            }                        
        },
    },

    components: {
        SelectorEmpresa
    },

    created() {
        //store.dispatch('actualizarTituloPrincipal', 'Stock')
        // store.dispatch('empresas/cargarListaEmpresas', "SoloStockPosicionado")
        store.dispatch('empresas/cargarListaEmpresas', "SoloActivas")
    }
}

</script>

