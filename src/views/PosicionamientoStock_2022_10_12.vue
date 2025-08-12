<template>
    <v-container>
        <v-row>
            <v-col>
                <v-alert
                    v-model="alertaMensajePresentacion"
                    color="deep-purple accent-4"
                    dark
                    dismissible
                >
                    <h3 class='capitalize-words'>Posicionamiento de stock</h3>
                    Esta opción debe ser utilizada <b><u>únicamente</u></b> para posicionar unidades que se encontraban sin ubicación asignada.<br>
                    <b><u>No debe ser utilizada para reacomodar unidades</u></b>, es decir, para sacar unidades que ya estaban posicionadas y cambiarles la ubicación.<br>
                    Si desea <b><u>mover unidades de una posición previamente asignada a otra</u></b> <v-btn color="green" @click="clickEnReposicionamiento" >haga click aquí para ir a <b>👉 Reposicionamiento 👈</b></v-btn>
                </v-alert>            
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="6">
                <v-text-field ref="barcodePosicion" inputmode="none" prepend-inner-icon="mdi-bookshelf" @keypress.enter="procesarBarcodePosicion" label="Barcode posicicion" v-model="barcodePosicion" dense>
                </v-text-field>
            </v-col>
            <v-col cols="1" class="mx-1">
                <v-icon color="green" v-show="mostrarPosicionCorrecta">mdi-checkbox-marked-circle-outline</v-icon>
                <v-icon color="red" v-show="mostrarPosicionIncorrecta">mdi-alert-circle-outline</v-icon>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="6"><v-text-field ref="barcodeArticulo" inputmode="none" prepend-inner-icon="mdi-barcode-scan" @keypress.enter="procesarBarcodeArticulo" label="Barcode artículo" v-model="barcodeArticulo" v-show="barcodeArticuloMostrar" dense ></v-text-field></v-col>
            <v-col cols="4"><v-text-field type="number" :rules="[reglasCantidad.required, reglasCantidad.min]" ref="cantidadAIngresar" prepend-inner-icon="mdi-calculator" @keypress.enter="procesarCantidadAIngresar" label="Cantidad" v-model="cantidadAIngresar" v-show="cantidadAIngresarMostrar" dense ></v-text-field></v-col>
            <v-col cols="2"  class="mx-0 px-0"><v-btn @click="procesarCantidadAIngresar" v-show="cantidadAIngresarMostrar"><v-icon color="blue">mdi-content-save</v-icon></v-btn></v-col>
        </v-row>
        <v-row>
            <v-col>
                <SelectorEmpresa v-show="mostrarSelectorEmpresas" @eligioEmpresa="eligioEmpresa($event)" ></SelectorEmpresa>
            </v-col>
        </v-row>
        <v-row >
            <v-col>
                <v-alert class="my-1 mx-0" v-for="(item, index) in listaCodigosLeidos" :key="index" dense :color="colorLectura(item)" >{{item.Barcode}} - {{item.Descripcion}}</v-alert>
            </v-col>
        </v-row>
        <v-footer><v-btn :block=true @click="resetearPantalla">Limpiar pantalla</v-btn></v-footer>

    </v-container>
</template>

<script>

import axios from 'axios'
import store from '../store'
import SelectorEmpresa from '../components/SelectorEmpresa'
import router from '../router'

export default {
    name: 'PosicionamientoStock',
    components: {
        SelectorEmpresa
    },
    data() {
        return  {
            alertaMensajePresentacion: true,
            listaCodigosLeidos: [],
            barcodePosicion: process.env.NODE_ENV=='development' ? '001-01-01' : '',
            mostrarPosicionCorrecta: false,
            mostrarPosicionIncorrecta: false,
            barcodeArticulo: process.env.NODE_ENV=='development' ? 'T01' : '',
            barcodeArticuloMostrar: false,
            reglasCantidad: { required: value =>  !!value || 'Obligatorio', min: value => value>0 || 'Debe ser mayor que cero' },
            cantidadAIngresar: 0,
            cantidadAIngresarMostrar: false,
            articulo: null,
            mostrarSelectorEmpresas: false,
            articulosPosibles: []
        }
    },
    methods: {        
        clickEnReposicionamiento() {
            router.push("/Reposicionamiento")
        },
        resetearPantalla() {
            this.listaCodigosLeidos=[]
            this.cantidadAIngresar=0
            this.cantidadAIngresarMostrar=false
            this.articulo=null
            this.barcodeArticulo=process.env.NODE_ENV=='development' ? 'T01' : ''
            this.barcodeArticuloMostrar=false
            this.mostrarPosicionCorrecta=false
            this.mostrarPosicionIncorrecta=false
            this.mostrarSelectorEmpresas=false
            this.barcodePosicion=process.env.NODE_ENV=='development' ? '001-01-01' : '',
            this.enfocarBarcodePosicion()
        },
        eligioEmpresa(IdEmpresaElegida) {
            const posicionArticuloPosible=this.articulosPosibles.findIndex((element) => (element.IdEmpresa==IdEmpresaElegida))
            this.articulo=this.articulosPosibles[posicionArticuloPosible]
            if (this.articulo.StockUnitario) {
                //  Tiene stock unitario, así que no pido cantidad
                this.cantidadAIngresar=1
                this.cantidadAIngresarMostrar=false
                this.registrarPosicionamientoStock()
            } else {
                // NO tiene stock unitario, así que pido que ingresen la cantidad.
                this.cantidadAIngresar=1
                this.cantidadAIngresarMostrar=true
                this.enfocarCantidadAIngresar()
            }
        },
        colorLectura: function(item) {
            return item.Correcto ? "green" : "red";
        },
        async registrarPosicionamientoStock() {
            store.dispatch('loading/mostrar', {titulo: 'Registrando posicionamiento'})
            const cabeceraDatos = {'IdArticulo': this.articulo.Id, 'NombrePosicion': this.barcodePosicion, 'CantidadPosicionada': this.cantidadAIngresar}

            const APICredenciales=store.state.usuarios.API.Credenciales
            await axios.get('IngresosStock/posicionamientoStock', {auth: APICredenciales, headers: cabeceraDatos})
                .then(datos => {                    
                    store.dispatch('loading/ocultar')
                    if (datos.data.Estado=="OK") {
                        this.listaCodigosLeidos.unshift({Barcode: this.barcodeArticulo, Correcto: true, Descripcion: this.articulo.Descripcion})
                    } else {
                        this.listaCodigosLeidos.unshift({Barcode: this.barcodeArticulo, Correcto: false, Descripcion: "Cant: "+this.cantidadAIngresar+" - "+datos.data.Detalle})
                    }
                    this.cantidadAIngresar=0
                    this.cantidadAIngresarMostrar=false
                    this.articulo=null
                    this.mostrarSelectorEmpresas=false
                    this.barcodeArticulo=process.env.NODE_ENV=='development' ? 'T01' : ''
                    this.enfocarBarcodeArticulo()
                })
                .catch(() => {
                    store.dispatch('loading/ocultar') 
                    store.dispatch('snackbar/mostrar', 'Se ha producido un error en la lectura')
                })
                .finally(() => {
                    store.dispatch('loading/ocultar') 
                })
        },
        async procesarBarcodeArticulo() {
            store.dispatch('loading/mostrar', {titulo: 'Verificando artículo'})

            const APICredenciales=store.state.usuarios.API.Credenciales
            const cabeceraDatos = {'Barcode': this.barcodeArticulo, 'IdEmpresa': -1}
            await axios.get('IngresosStock/getArticuloByBarcode', {auth: APICredenciales, headers: cabeceraDatos})
                .then(datos => {
                    store.dispatch('loading/ocultar')
                    if (datos.data.Estado=="OK") {
                        if (datos.data.Datos.Productos.length==1) {
                            //El barcode leído no es ambiguo
                            this.articulo=datos.data.Datos.Productos[0]
                            if (this.articulo.StockUnitario) {
                                //  Tiene stock unitario, así que no pido cantidad
                                this.cantidadAIngresar=1
                                this.cantidadAIngresarMostrar=false
                                this.registrarPosicionamientoStock()
                            } else {
                                // NO tiene stock unitario, así que pido que ingresen la cantidad.
                                this.cantidadAIngresar=1
                                this.cantidadAIngresarMostrar=true
                                this.enfocarCantidadAIngresar()
                            }
                        } else {
                            //El barcode leído ES ambiguo
                            const EmpresasLeidas=[]
                            const articulosPosibles=[]
                            datos.data.Datos.Productos.forEach(element => {
                                articulosPosibles.push({Id: element.Id, IdEmpresa: element.IdEmpresa, StockUnitario: element.StockUnitario, Descripcion: element.Descripcion})
                                EmpresasLeidas.push({Id: element.Empresa.Id, Nombre: element.Empresa.Nombre})
                            })
                            store.commit('empresas/actualizarListaEmpresas', EmpresasLeidas)
                            this.mostrarSelectorEmpresas=true
                            this.articulosPosibles=articulosPosibles
                        }
                    } else {
                        this.articulo=null
                        this.listaCodigosLeidos.unshift({Barcode: this.barcodeArticulo, Correcto: false, Descripcion: datos.data.Detalle})
                        this.barcodeArticulo=process.env.NODE_ENV=='development' ? '0099496066' : ''
                        this.enfocarBarcodeArticulo()
                    }
                })
                .finally( () => {
                    store.dispatch('loading/ocultar')
                })
        },
        procesarCantidadAIngresar() {
            if (this.cantidadAIngresar<=0) {
                store.dispatch('snackbar/mostrar', 'La cantidad debe ser positiva')
            } else {
                this.registrarPosicionamientoStock()
            }
        },
        async procesarBarcodePosicion() {
            store.dispatch('loading/mostrar', {titulo: 'Verificando posición'})
            const APICredenciales=store.state.usuarios.API.Credenciales
            const cabeceraDatos={'Posicion': this.barcodePosicion}
            await axios.get('Posiciones/getExiste', {auth: APICredenciales, headers: cabeceraDatos})
                .then(datos => {
                    store.dispatch('loading/ocultar') 
                    if (datos.data.Estado=="OK") {
                        store.dispatch('sonidos/exito')
                        this.mostrarPosicionCorrecta=true
                        this.mostrarPosicionIncorrecta=false
                        this.barcodeArticuloMostrar=true
                        this.enfocarBarcodeArticulo()
                    } else {
                        store.dispatch('sonidos/error')
                        store.dispatch('snackbar/mostrar', 'Posición inexistente')
                        this.barcodePosicion=''
                        this.mostrarPosicionCorrecta=false
                        this.mostrarPosicionIncorrecta=true
                        this.enfocarBarcodePosicion()
                    }
                })
                .catch(() => {
                    store.dispatch('loading/ocultar') 
                    store.dispatch('snackbar/mostrar', 'Se ha producido un error en la lectura')
                })
        },
        enfocarBarcodePosicion() {
            this.$nextTick(() => {
                this.$refs.barcodePosicion.focus()
            })
        },
        enfocarBarcodeArticulo() {
            this.$nextTick(() => {
                this.$refs.barcodeArticulo.focus()
            })
        },
        enfocarCantidadAIngresar() {
            this.$nextTick(() => {
                this.$refs.cantidadAIngresar.focus();
            });      
        },

    },
    created() {
        store.dispatch('actualizarTituloPrincipal', 'Posicionamiento de stock')
        this.enfocarBarcodePosicion()
    }
}
</script>