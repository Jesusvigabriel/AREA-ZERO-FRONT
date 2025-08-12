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
            <v-col>
                <SelectorEmpresa v-show="mostrarSelectorEmpresas" @eligioEmpresa="eligioEmpresa($event)" ></SelectorEmpresa>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="6">
                <v-file-input 
                label="Planilla a procesar" 
                @change="fileOnChange" 
                accept=".xlsx"
                filled
                prepend-icon="mdi-microsoft-excel"
                >Importar planilla excel</v-file-input>
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
        
        <v-row >
            <v-col>
                <v-alert dark class="my-1 mx-0" v-for="(item, index) in listaCodigosLeidos" :key="index" dense :color="colorLectura(item)" >{{item.Barcode}} - {{item.Descripcion}}</v-alert>
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
import posiciones from '@/store/posiciones'
import productosV3 from '@/store/productosV3'
import {xlsx, read, utils} from 'xlsx'
import empresas from "@/store/empresasV3"


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
            mostrarSelectorEmpresas: true,
            articulosPosibles: [],
            posicionActual: {},
            IdEmpresa: null,
            manejaStockUnitario: false,
            tienePART: false
        }
    },
    methods: {    
        async procesarPlanilla(planilla) {

            for (const unaFila of planilla) {
                //console.log("Una fila", unaFila)

                try {
                    const posicion=await posiciones.getByNombre(unaFila.Posicion)
                    //console.log("Posicion", posicion)

                    try {
                        if(this.tienePART){
                            //const articulo=await productosV3.getByBarcodeAndEmpresa(unaFila['Barcode Producto'], this.IdEmpresa)
                            const partida=await productosV3.getProductoByPartidaAndEmpresaAndProducto(this.IdEmpresa, unaFila['Partida'],unaFila['Barcode Producto'])
                            const articulo = partida[0]
                            console.log("Articulo", articulo)
                        
                            try {
                                const cantidad = this.manejaStockUnitario ? 1 : unaFila.Cantidad
                                if(articulo.IdEmpresa === this.IdEmpresa){
                                    const response=await productosV3.registrarPosicionamientoPartida(this.IdEmpresa,articulo.Partida, articulo.Barcode, posicion.Id, cantidad)
                                    console.log("Response de posicion", response)
                                    this.listaCodigosLeidos.unshift({Barcode: unaFila['Partida'] + " Barcode: " + unaFila['Barcode Producto'], Correcto: true, Descripcion: articulo.Nombre})
                                }else{
                                    this.listaCodigosLeidos.unshift({Barcode: unaFila['Partida'] + " Barcode: " + unaFila['Barcode Producto'], Correcto: false, Descripcion: "El articulo pertenece a otro cliente"})
                                }
                                

                            } catch (error) {
                                console.log("Error al reposicionar", error)
                                this.listaCodigosLeidos.unshift({Barcode: unaFila['Partida'] + " Barcode: " + unaFila['Barcode Producto'], Correcto: false, Descripcion: error})
                            }
                        }else{ 
                            const articulo=await productosV3.getByBarcodeAndEmpresa(unaFila['Barcode Producto'], this.IdEmpresa)
                        
                            try {
                                const cantidad = this.manejaStockUnitario ? 1 : unaFila.Cantidad
                                if(articulo.IdEmpresa === this.IdEmpresa){
                                    const response=await productosV3.registrarPosicionamiento(this.IdEmpresa,articulo.Id, posicion.Id, cantidad)
                                    this.listaCodigosLeidos.unshift({Barcode: unaFila['Barcode Producto'], Correcto: true, Descripcion: articulo.Nombre})
                                }else{
                                    this.listaCodigosLeidos.unshift({Barcode: unaFila['Barcode Producto'], Correcto: false, Descripcion: "El articulo pertenece a otro cliente"})
                                }
                                

                            } catch (error) {
                                console.log("Error al reposicionar", error)
                                this.listaCodigosLeidos.unshift({Barcode: unaFila['Barcode Producto'], Correcto: false, Descripcion: error})
                            }
                        }
                    } catch (error) {
                        console.log("Error en articulo", error)
                        this.listaCodigosLeidos.unshift({Barcode: unaFila['Barcode Producto'], Correcto: false, Descripcion: error})
                    }
                } catch (error) {
                    console.log("Error en posicion", error)
                    this.listaCodigosLeidos.unshift({Barcode: unaFila['Posicion'], Correcto: false, Descripcion: error})
                }
                
                    

            }
        },

        verificarColumnasExcel(planilla) {
            let columnasObligatorias=[]
            if(this.tienePART){
                columnasObligatorias=['Posicion', 'Partida', 'Barcode Producto', 'Cantidad']
            }else{
                columnasObligatorias=['Posicion', 'Barcode Producto', 'Cantidad']
            }
            
            let columnasFaltantes=[]
            let filaActual=1
            let tituloMostrado=false
            let mensaje=''
            planilla.forEach(unaFila => {
                filaActual++
                columnasObligatorias.forEach(unaColumnaObligatoria => {
                    if (!Object.keys(unaFila).includes(unaColumnaObligatoria)) {
                        if (!columnasFaltantes.includes(unaColumnaObligatoria)) {                      
                            if (!tituloMostrado) {
                                mensaje = "Faltan las siguientes columnas:"
                                tituloMostrado=true
                                }
                        mensaje += ";Fila: "+filaActual+" - Columna: "+unaColumnaObligatoria
                    }
                }
                })
            })
            if (tituloMostrado) {
                this.mostrarMensaje("No se puede procesar", mensaje)
            } else {
                this.procesarPlanilla(planilla)
            }
        },

        fileOnChange(archivoLeido) {

            if(this.IdEmpresa==null){
                    store.dispatch('snackbar/mostrar', 'Debe seleccionar una empresa')
                    store.dispatch('sonidos/error')
                    return false
            }

            if (archivoLeido!=null) {
                const lector=new FileReader()
                lector.onload = ev => {
                    const datosCrudos = ev.target.result;
                    const planillaCruda = read(datosCrudos, {type: "binary", cellDates: true, cellNF: true, cellText:true})
                    const nombreHoja1=planillaCruda.SheetNames[0]
                    const datosPlanilla=utils.sheet_to_json(planillaCruda.Sheets[nombreHoja1])
                    this.verificarColumnasExcel(datosPlanilla)
                }

                lector.readAsBinaryString(archivoLeido)            
            }
        },

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
            this.mostrarSelectorEmpresas=true
            this.barcodePosicion=process.env.NODE_ENV=='development' ? '001-01-01' : '',
            this.enfocarBarcodePosicion(),
            this.manejaStockUnitario=false;
        },
        eligioEmpresa(IdEmpresaElegida) {
            this.IdEmpresa = IdEmpresaElegida
            this.manejaStockUnitario=false

            empresas.getOneById(this.IdEmpresa)
                .then(respuesta => {
                        if(respuesta.PART){
                            this.tienePART = true
                        }else{
                            this.tienePART = false
                        }
                        if(respuesta.StockUnitario){
                            this.manejaStockUnitario=true
                        }
                })
                .catch(error => {
                    this.mostrarSnackbar(error)
                    console.log("Error", error)
                })

            const posicionArticuloPosible=this.articulosPosibles.findIndex((element) => (element.IdEmpresa==IdEmpresaElegida))
            this.articulo=this.articulosPosibles[posicionArticuloPosible]
           
            
            // if (this.manejaStockUnitario) {
            //     //  Tiene stock unitario, así que no pido cantidad
            //     this.cantidadAIngresar=1
            //     this.cantidadAIngresarMostrar=false
            //     this.registrarPosicionamientoStock()
            // } else {
            //     // NO tiene stock unitario, así que pido que ingresen la cantidad.
            //     this.cantidadAIngresar=1
            //     this.cantidadAIngresarMostrar=true
            //     //this.cantidadAIngresarMostrar=true
            //     this.enfocarCantidadAIngresar()
            // }
        },
        colorLectura: function(item) {
            return item.Correcto ? "green" : "red";
        },
        async registrarPosicionamientoStock() {

            try {
                const response=await productosV3.registrarPosicionamiento(this.IdEmpresa,this.articulo.Id, this.posicionActual.Id, this.cantidadAIngresar)

                this.listaCodigosLeidos.unshift({Barcode: this.barcodeArticulo, Correcto: true, Descripcion: this.articulo.Nombre})
            } catch (error) {
                console.log("Error al reposicionar", error)
                this.listaCodigosLeidos.unshift({Barcode: this.barcodeArticulo, Correcto: false, Descripcion: " - "+error})
            }
            this.cantidadAIngresar=0
            this.cantidadAIngresarMostrar=false
            this.articulo=null
            this.mostrarSelectorEmpresas=true
            this.barcodeArticulo=process.env.NODE_ENV=='development' ? 'T01' : ''
            this.enfocarBarcodeArticulo()


            // store.dispatch('loading/mostrar', {titulo: 'Registrando posicionamiento'})
            // const cabeceraDatos = {'IdArticulo': this.articulo.Id, 'NombrePosicion': this.barcodePosicion, 'CantidadPosicionada': this.cantidadAIngresar}

            // const APICredenciales=store.state.usuarios.API.Credenciales
            // await axios.get('IngresosStock/posicionamientoStock', {auth: APICredenciales, headers: cabeceraDatos})
            //     .then(datos => {                    
            //         store.dispatch('loading/ocultar')
            //         if (datos.data.Estado=="OK") {
            //             this.listaCodigosLeidos.unshift({Barcode: this.barcodeArticulo, Correcto: true, Descripcion: this.articulo.Descripcion})
            //         } else {
            //             this.listaCodigosLeidos.unshift({Barcode: this.barcodeArticulo, Correcto: false, Descripcion: "Cant: "+this.cantidadAIngresar+" - "+datos.data.Detalle})
            //         }
            //         this.cantidadAIngresar=0
            //         this.cantidadAIngresarMostrar=false
            //         this.articulo=null
            //         this.mostrarSelectorEmpresas=false
            //         this.barcodeArticulo=process.env.NODE_ENV=='development' ? 'T01' : ''
            //         this.enfocarBarcodeArticulo()
            //     })
            //     .catch(() => {
            //         store.dispatch('loading/ocultar') 
            //         store.dispatch('snackbar/mostrar', 'Se ha producido un error en la lectura')
            //     })
            //     .finally(() => {
            //         store.dispatch('loading/ocultar') 
            //     })
        },
        async procesarBarcodeArticulo() {

            try {
                const response=await productosV3.getByBarcodeAndEmpresa(this.barcodeArticulo, this.IdEmpresa)
                // console.log("Response del articulo", response)
                this.articulo=response

                if (this.manejaStockUnitario) {
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

            } catch (error) {
                console.log("Error en articulo", error)
            }
            // store.dispatch('loading/mostrar', {titulo: 'Verificando artículo'})
            // const APICredenciales=store.state.usuarios.API.Credenciales
            // const cabeceraDatos = {'Barcode': this.barcodeArticulo, 'IdEmpresa': -1}
            // await axios.get('IngresosStock/getArticuloByBarcode', {auth: APICredenciales, headers: cabeceraDatos})
            //     .then(datos => {
            //         store.dispatch('loading/ocultar')
            //         if (datos.data.Estado=="OK") {
            //             if (datos.data.Datos.Productos.length==1) {
            //                 //El barcode leído no es ambiguo
            //                 this.articulo=datos.data.Datos.Productos[0]
            //                 if (this.articulo.StockUnitario) {
            //                     //  Tiene stock unitario, así que no pido cantidad
            //                     this.cantidadAIngresar=1
            //                     this.cantidadAIngresarMostrar=false
            //                     this.registrarPosicionamientoStock()
            //                 } else {
            //                     // NO tiene stock unitario, así que pido que ingresen la cantidad.
            //                     this.cantidadAIngresar=1
            //                     this.cantidadAIngresarMostrar=true
            //                     this.enfocarCantidadAIngresar()
            //                 }
            //             } else {
            //                 //El barcode leído ES ambiguo
            //                 const EmpresasLeidas=[]
            //                 const articulosPosibles=[]
            //                 datos.data.Datos.Productos.forEach(element => {
            //                     articulosPosibles.push({Id: element.Id, IdEmpresa: element.IdEmpresa, StockUnitario: element.StockUnitario, Descripcion: element.Descripcion})
            //                     EmpresasLeidas.push({Id: element.Empresa.Id, Nombre: element.Empresa.Nombre})
            //                 })
            //                 store.commit('empresas/actualizarListaEmpresas', EmpresasLeidas)
            //                 this.mostrarSelectorEmpresas=true
            //                 this.articulosPosibles=articulosPosibles
            //             }
            //         } else {
            //             this.articulo=null
            //             this.listaCodigosLeidos.unshift({Barcode: this.barcodeArticulo, Correcto: false, Descripcion: datos.data.Detalle})
            //             this.barcodeArticulo=process.env.NODE_ENV=='development' ? '0099496066' : ''
            //             this.enfocarBarcodeArticulo()
            //         }
            //     })
            //     .finally( () => {
            //         store.dispatch('loading/ocultar')
            //     })
        },
        procesarCantidadAIngresar() {
            if (this.cantidadAIngresar<=0) {
                store.dispatch('snackbar/mostrar', 'La cantidad debe ser positiva')
            } else {
                this.registrarPosicionamientoStock()
            }
        },
        async procesarBarcodePosicion() {
            try {
                if(this.IdEmpresa==null){
                    store.dispatch('snackbar/mostrar', 'Debe seleccionar una empresa')
                    store.dispatch('sonidos/error')
                    return false
                }
                const response=await posiciones.getByNombre(this.barcodePosicion)
                console.log("La response", response)
                store.dispatch('sonidos/exito')
                this.mostrarPosicionCorrecta=true
                this.mostrarPosicionIncorrecta=false
                this.barcodeArticuloMostrar=true
                this.posicionActual=response
                this.enfocarBarcodeArticulo()
                
            } catch (error) {
                console.log("Error", error)
                store.dispatch('sonidos/error')
                store.dispatch('snackbar/mostrar', 'Posición inexistente')
                this.barcodePosicion=''
                this.mostrarPosicionCorrecta=false
                this.mostrarPosicionIncorrecta=true
                this.posicionActual={}
                this.enfocarBarcodePosicion()
            }

            // const APICredenciales=store.state.usuarios.API.Credenciales
            // const cabeceraDatos={'Posicion': this.barcodePosicion}
            // await axios.get('Posiciones/getExiste', {auth: APICredenciales, headers: cabeceraDatos})
            //     .then(datos => {
            //         store.dispatch('loading/ocultar') 
            //         if (datos.data.Estado=="OK") {
            //             store.dispatch('sonidos/exito')
            //             this.mostrarPosicionCorrecta=true
            //             this.mostrarPosicionIncorrecta=false
            //             this.barcodeArticuloMostrar=true
            //             this.enfocarBarcodeArticulo()
            //         } else {
            //             store.dispatch('sonidos/error')
            //             store.dispatch('snackbar/mostrar', 'Posición inexistente')
            //             this.barcodePosicion=''
            //             this.mostrarPosicionCorrecta=false
            //             this.mostrarPosicionIncorrecta=true
            //             this.enfocarBarcodePosicion()
            //         }
            //     })
            //     .catch(() => {
            //         store.dispatch('loading/ocultar') 
            //         store.dispatch('snackbar/mostrar', 'Se ha producido un error en la lectura')
            //     })
        },
        mostrarMensaje(titulo, mensaje){
            store.dispatch("alertDialog/mostrar", {titulo, mensaje})
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
        store.dispatch('empresas/cargarListaEmpresas', "SoloStockPosicionado")
        this.enfocarBarcodePosicion()
    }
}
</script>