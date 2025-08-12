<template>
    <v-container>
        <v-row justify="center" class="my-2 py-2">
            <v-col cols="12" md="6">
                <v-select 
                    v-model="idEmpresa" 
                    dense 
                    prepend-inner-icon="mdi-factory"
                    @change="eligioEmpresa" 
                    :chips="false" 
                    :items="listaEmpresas" 
                    item-value="Id" 
                    item-text="Nombre" 
                    label="Seleccione empresa"
                    class="my-0 py-0"
                    id="SelectorEmpresa">
                </v-select>
            </v-col>
        </v-row>
        <v-row justify="center" v-if="idEmpresa>0" class="my-4 py-4">
            <v-col cols="12" md="6" class="my-0 py-0">
                <v-text-field 
                    ref="barcodeArticulo" 
                    inputmode="none" 
                    prepend-inner-icon="mdi-barcode-scan" 
                    @keypress.enter="procesarBarcodeArticulo" 
                    label="Barcode artículo" 
                    v-model="barcodeArticulo" 
                    dense 
                    class="my-0 py-0"
                    >
                </v-text-field>
            </v-col>
        </v-row>
        <v-row justify="center" v-if="listaBarcodesArticulos">
            <v-col cols="12" md="6" class="py-0 my-0" align="center">
                <v-alert color="yellow" class="py-0 my-0">Posición Actual: {{listaBarcodesArticulos}}</v-alert>
            </v-col>
        </v-row>

        <v-row justify="center" v-if="idEmpresa" class="my-4 py-4">
            <v-col class="py-0" v-if="listaPosicionesMostrar.length>0">
                <v-data-table 
                    :headers="cabeceraPosiciones" 
                    :items="listaPosicionesMostrar"  
                    :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
                    :items-per-page="30" 
                    class="elevation-3" 
                >
               
                </v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>


<script>

import empresas from "@/store/empresasV3"
import productos from "@/store/productosV3"
import posiciones from "@/store/posiciones"
import store from "@/store"
import router from '../router'
import posicionesV3 from "@/store/posicionesV3"

export default {
    name: "HistoricoPosiciones",

    data() {
        return {
            alertaMensajePresentacion: true,
            idEmpresa: null,
            listaEmpresas: [],
            listaPosicionesMostrar:[],
            listaBarcodesArticulos: '',
            barcodeArticulo: process.env.NODE_ENV=='development' ? 'T01' : '',
            cabeceraPosiciones: [
                {text: 'Posiciones Anteriores',align: 'center', value: 'Nombre'},
                {text: 'Unidades',align: 'center', value: 'Unidades'},
                {text: 'Fecha',align: 'center', value: 'Fecha'},
            ],
            stockPosicionado:-1,
           
        }
    },

    methods: {
    
        //Aca
        procesarBarcodeArticulo() {
            productos.getByBarcodeAndEmpresa(this.barcodeArticulo,this.idEmpresa)
            .then(respuesta => {
                    //console.log("Articulo", respuesta)
                    this.stockPosicionado = respuesta.StockPosicionado
                    this.obtengoPosicion(respuesta)
                })
                .catch(error => {
                    this.mostrarSnackbar(error)
                    console.log("Error", error)
                    this.barcodeArticulo=""
                })

           // this.listaBarcodesArticulos.push(this.barcodeArticulo)
            
        },
        eligioEmpresa() {
            empresas.getOneById(this.idEmpresa)
            .then(respuesta => {
                    if(respuesta.StockPosicionado==false){
                        this.idEmpresa=0
                        this.mostrarError("La Empresa seleccionada no maneja Stock Posicionado, no se mostraran posiciones historicas de sus articulos")
                    }
                    //this.listaBarcodesArticulos = respuesta.Nombre
                    //this.obtengoPosicionesAnteriores(articulo)
                    
                })
                .catch(error => {
                    this.mostrarSnackbar(error)
                    console.log("Error", error)
                })
            // this.barcodePosicionOrigen.mostrar=true
            // this.enfocarBarcodePosicionOrigen()
        },



        obtengoPosicion(articulo){
            posicionesV3.getPosicionByIdAndEmpresa(articulo.Id,this.idEmpresa)
            .then(respuesta => {
                    if(this.stockPosicionado == 0){
                        this.listaBarcodesArticulos = "Sin Posicionar"
                    }else{
                        this.listaBarcodesArticulos = ""
                        for (const posicion of articulo.Posiciones){
                            this.listaBarcodesArticulos = this.listaBarcodesArticulos == "" ? `(${posicion.Nombre}) unidades:${posicion.Unidades}`: `${this.listaBarcodesArticulos} / (${posicion.Nombre}) unidades:(${posicion.Unidades})`
                        }                       
                    }   
                    this.obtengoPosicionesAnteriores(articulo)
                    this.stockPosicionado = -1
                })
                .catch(error => {
                    this.mostrarSnackbar(error)
                    console.log("Error", error)
                })

        },
        
        obtengoPosicionesAnteriores(articulo)
        {
            posicionesV3.getPosicionAnterioresByIdAndEmpresa(articulo.Id,this.idEmpresa)
            .then(respuesta => {
                    this.listaPosicionesMostrar = respuesta
                    this.listaPosicionesMostrar = respuesta
                    
                    
                    this.listaPosicionesMostrar = respuesta                 
                    
                    
                })
                .catch(error => {
                    this.mostrarSnackbar(error)
                    console.log("Error", error)
                })
        },

        enfocarBarcodeArticulo() {
            this.$nextTick(() => {
                this.$refs.barcodeArticulo.focus()
            })
        },
        mostrarError(mensaje) {
            store.dispatch("alertDialog/mostrar", {titulo: "Se ha producido un error", mensaje})
        },

        mostrarSnackbar(mensaje) {
        store.dispatch("snackbar/mostrar", mensaje)
    },
    },

    mounted() {
        store.dispatch('actualizarTituloPrincipal', 'Historico de Posiciones')
        empresas.getAll(true)
            .then(respuesta => {
                this.listaEmpresas=respuesta
            })
            .catch(puteada => {
                console.error(puteada)
            })
    },
}
</script>