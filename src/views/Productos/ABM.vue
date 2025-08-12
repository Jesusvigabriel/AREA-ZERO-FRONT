<template>
    <v-container>
        <v-row v-show="empresaLoggeada()<=0">
            <v-col class="pt-1 pb-0">
                <SelectorEmpresa @eligioEmpresa="eligioEmpresa($event)"  :idEmpresaInicialmenteSeleccionada="idEmpresa"  ></SelectorEmpresa>
            </v-col>
        </v-row>
        <v-row class="py-0" v-if="idEmpresa>0">
            <v-col class="py-0">
                <v-btn v-if="!tieneLOTE" @click="popularListaProductos" color="success" block>Actualizar información <v-icon>mdi-refresh</v-icon></v-btn>
            </v-col>
        </v-row>
        <v-row v-if="idEmpresa>0">
            <v-col>
                <v-file-input 
                    label="Planilla a procesar" 
                    @change="fileOnChange" 
                    accept=".xls"
                    filled
                    prepend-icon="mdi-microsoft-excel"
                >Importar planilla excel</v-file-input>
            </v-col>
        </v-row>
        <v-row >
            <v-col>
                <v-alert  class="my-1 mx-0 white--text" v-for="(item, index) in productosError" :key="index" dense :color="colorLectura(item)" >{{item.Barcode}} - {{item.Descripcion}}</v-alert>
            </v-col>
        </v-row>
        <v-row v-if="empresaElegida" class="pb-0 mb-0">
            <v-col class="py-0 my-0"  >
                <v-card-title >
                    <v-text-field class="search-field"
                        v-model="textoBusqueda"
                        append-icon="mdi-magnify"
                        @keypress.enter = "buscarLote"
                        label="Búsqueda"
                        single-line
                        dense
                        hide-details
                    ></v-text-field>
                    </v-card-title>
                </v-col>
        </v-row>
        <v-row v-if="empresaLoggeada()<=0 && idEmpresa>0"  > 
            <v-col class="col-sm-12 col-md-6">
                <v-btn class="action-button" v-if="!tieneLOTE" @click="crearArticulo()">Crear nuevo artículo</v-btn>
                <v-btn color="blue v-btn--block" v-if="tieneLOTE" dark @click="popularListaProductos()">Cargar Lista</v-btn>
            </v-col>
            <v-col class="col-sm-12 col-md-6">
                <v-btn color="blue v-btn--block" dark @click="descargarExcelEjemplo()">Descargar excel de ejemplo<v-icon>mdi-microsoft-excel</v-icon></v-btn>
            </v-col>
        </v-row>
        <v-row v-if="listaArticulos.length>0 && !this.textil">
            <v-col class="py-0" >
                <v-data-table 
                    :headers="cabeceras" 
                    :items="listaArticulos"  
                    :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
                    :items-per-page="30" 
                    :search="textoBusqueda"
                    class="elevation-3" 
                >
                    <template v-slot:item.Acciones="{ item }">
                        <v-icon v-if="!tieneLOTE" color="blue" @click="editarArticulo(item)" >mdi-file-edit-outline</v-icon>
                        <v-icon v-if="!tieneLOTE" color="green" @click="imprimirSticker(item)" >mdi-sticker-text-outline</v-icon>
                        <!-- <v-icon color="red" @click="eliminarArticulo(item)" v-bind="attrs" v-on="on">mdi-delete-outline</v-icon> -->
                    </template>

                </v-data-table>
            </v-col>
        </v-row>
        <v-row v-if="listaArticulos.length>0 && this.textil && this.idEmpresa != '258'">
            <v-col class="py-0" >
                <v-data-table 
                    :headers="cabecerasTextil" 
                    :items="listaArticulos"  
                    :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
                    :items-per-page="30" 
                    :search="textoBusqueda"
                    class="elevation-3" 
                >
                    <template v-slot:item.Acciones="{ item }">
                        <v-icon color="blue" @click="editarArticulo(item)" >mdi-file-edit-outline</v-icon>
                        <!-- <v-icon color="red" @click="eliminarArticulo(item)" v-bind="attrs" v-on="on">mdi-delete-outline</v-icon> -->
                    </template>

                </v-data-table>
            </v-col>
        </v-row>

        <v-row v-if="listaArticulos.length>0 && this.textil && this.idEmpresa == '258'">
            <v-col class="py-0" >
                <v-data-table 
                    :headers="cabecerasTextilClue" 
                    :items="listaArticulos"  
                    :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
                    :items-per-page="30" 
                    :search="textoBusqueda"
                    class="elevation-3" 
                >
                    <template v-slot:item.Acciones="{ item }">
                        <v-icon color="blue" @click="editarArticulo(item)" >mdi-file-edit-outline</v-icon>
                        <!-- <v-icon color="red" @click="eliminarArticulo(item)" v-bind="attrs" v-on="on">mdi-delete-outline</v-icon> -->
                    </template>

                </v-data-table>
            </v-col>
        </v-row>

        <v-dialog
            v-model="mostrarVentanaEdicion"
            persistent
            max-width="800px"
        >
        <v-card class="rounded-card">
            <v-card-title>
                <span v-if="modoEdicion==='E'" class="text-h5">Producto: {{itemEnEdicion.Id}} - Barcode: {{itemEnEdicion.Barcode}}</span>
                <span v-else class="text-h5">Creación de nuevo producto</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="form" v-model="formValido">
                    <v-container>
                        <v-row>
                            <v-col>
                                <v-text-field class="rounded-input" :disabled="empresaLoggeada()>0" label="Nombre" :rules="[v => !!v || 'Requerido']" v-model="itemEnEdicion.Nombre"></v-text-field>
                            </v-col>
                            <v-col>
                                <v-text-field class="rounded-input" :disabled="empresaLoggeada()>0" label="CodeEmpresa" :rules="[v => !!v || 'Requerido']" v-model="itemEnEdicion.CodeEmpresa"></v-text-field>
                            </v-col>
                            <v-col v-if="modoEdicion==='N'" >
                                <v-text-field class="rounded-input" :disabled="empresaLoggeada()>0" label="Barcode" :rules="[v => !!v || 'Requerido']" v-model="itemEnEdicion.Barcode"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row v-if="!this.textil">
                            <v-col>
                                <v-text-field class="rounded-input" type="number" :disabled="empresaLoggeada()>0" label="Ancho" required v-model="itemEnEdicion.Ancho"></v-text-field>
                            </v-col>
                            <v-col>
                                <v-text-field class="rounded-input" type="number" :disabled="empresaLoggeada()>0" label="Alto" required v-model="itemEnEdicion.Alto"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row v-if="!this.textil">
                            <v-col>
                                <v-text-field class="rounded-input" type="number" :disabled="empresaLoggeada()>0" label="Largo" required v-model="itemEnEdicion.Largo"></v-text-field>
                            </v-col>
                            <v-col>
                                <v-text-field class="rounded-input" type="number" :disabled="empresaLoggeada()>0" label="Peso" required v-model="itemEnEdicion.Peso"></v-text-field>
                            </v-col>
                            <v-col>
                                <v-text-field class="rounded-input" type="number" :disabled="empresaLoggeada()>0" label="Precio" required v-model="itemEnEdicion.Precio"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row v-if="this.textil">
                            <v-col>
                                <v-text-field class="rounded-input" type="number" :disabled="empresaLoggeada()>0" label="Metros" required v-model="itemEnEdicion.Ancho"></v-text-field>
                            </v-col>
                            <v-col>
                                <v-text-field class="rounded-input" type="number" :disabled="empresaLoggeada()>0" label="Alto" required v-model="itemEnEdicion.Alto"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row v-if="this.textil">
                            <v-col>
                                <v-text-field class="rounded-input" type="number" :disabled="empresaLoggeada()>0" label="Ancho" required v-model="itemEnEdicion.Largo"></v-text-field>
                            </v-col>
                            <v-col>
                                <v-text-field class="rounded-input" type="number" :disabled="empresaLoggeada()>0" label="Peso" required v-model="itemEnEdicion.Peso"></v-text-field>
                            </v-col>
                            <v-col>
                                <v-text-field class="rounded-input" type="number" :disabled="empresaLoggeada()>0" label="Calidad" required v-model="itemEnEdicion.Precio"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn  color="blue darken-1" text @click="cancelarEdicionItem()">{{empresaLoggeada()<1 ? 'Cancelar' : 'Cerrar'}}</v-btn>
                <v-btn color="blue darken-1" text @click="modoEdicion==='N' ? confirmarCreacionItem() : confirmarEdicionItem()" v-if="empresaLoggeada()<1 ">Guardar</v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>


    </v-container>
</template>

<script>

import SelectorEmpresa from '@/components/SelectorEmpresa.vue'
import store from '@/store'
import productos from '@/store/productos'
import productosV3 from '@/store/productosV3'
import {xlsx, read, utils} from 'xlsx'
import ordenes from "@/store/ordenes"
import empresas from "@/store/empresasV3"
import excel from "exceljs"
import {saveAs} from "file-saver"
import fechas from 'vue-lsi-util/fechas'
import jspdf from 'jspdf'
import "jspdf-barcode"

export default {
    name: "Stock",

    data() {
        return  {
            itemEnEdicion: {}, 
            modoEdicion: '',
            mostrarVentanaEdicion: false,
            idEmpresa: -1,
            empresaElegida: null,
            listaArticulos: [],
            formValido: false,
            productosError: [],
            tieneLOTE: false,
            tienePART: false,
            cabeceras: [
                {text: 'Id', value: 'Id'},
                {text: 'Nombre', value: 'Nombre'},
                {text: 'Barcode', value: 'Barcode'},
                {text: 'Largo', value: 'Ancho'},
                {text: 'Ancho', value: 'Largo'},
                {text: 'Alto', value: 'Alto'},
                {text: 'Peso', value: 'Peso'},
                {text: 'Precio', value: 'Precio'},
                {text: '', value: 'Acciones'},
            ],
            cabecerasTextil: [
                {text: 'Id', value: 'Id'},
                {text: 'Nombre', value: 'Nombre'},
                {text: 'Barcode', value: 'Barcode'},
                {text: 'Largo', value: 'Ancho'},
                {text: 'Ancho', value: 'Largo'},
                {text: 'Alto', value: 'Alto'},
                {text: 'Peso', value: 'Peso'},
                {text: 'Calidad', value: 'Precio'},
                {text: '', value: 'Acciones'},
            ],
            cabecerasTextilClue: [
                {text: 'Id', value: 'Id'},
                {text: 'Nombre', value: 'Nombre'},
                {text: 'Barcode', value: 'Barcode'},
                {text: 'Largo', value: 'Largo'},
                {text: 'Ancho', value: 'Ancho'},
                {text: 'Alto', value: 'Alto'},
                {text: 'Peso', value: 'Peso'},
                {text: 'Calidad', value: 'Precio'},
                {text: '', value: 'Acciones'},
            ],
            textoBusqueda: '',
            textil: false,
        }
    },

    methods: { 
        colorLectura: function(item) {
            return item.Correcto ? "green" : "red";
        },
        async procesarPlanilla(planilla) {
            
            if(this.tieneLOTE){
                for await(const unaFila of planilla) {
                    if(unaFila.Volumen <= 1){
                        unaFila.Volumen = unaFila.Alto * unaFila.Ancho * unaFila.Largo
                    }
                    const payload={
                        DeliveryBatch: unaFila['DeliveryBatch'],
                        BoxNumber: unaFila['BoxNumber'].toString().trim(),
                        Barcode: unaFila['SerialNumber/Barcode'].toString().trim(),
                        CodeEmpresa: unaFila['Product-Number'],
                        Nombre: unaFila.Descripcion,
                        Bultos: unaFila.Bultos,
                        UnXCaja: unaFila.UnXCaja,
                        Alto: unaFila.Alto,
                        Largo: unaFila.Ancho,
                        Ancho: unaFila.Largo,
                        Volumen: unaFila.Volumen,
                        Peso: unaFila.Peso,
                        Precio: unaFila['Calidad/Precio'],
                        StockUnitario: this.textil ? true : false,
                        IdEmpresa: this.idEmpresa,
                        UsuarioAlta: store.state.usuarios.usuarioActual.Nombre,
                    }
                    try {
                        const result=await productosV3.newOne(payload)
                        this.productosError.unshift({Barcode: "Barcode: " + result.Barcode, Correcto: true, Descripcion: "Lote: " + result.BoxNumber + " Se ingreso con exito"})
                    } catch (error) {
                        this.productosError.unshift({Barcode: "Barcode: " + payload.Barcode, Correcto: false, Descripcion: error})
                    }               
                }
            } else if(this.tienePART){
                const fechaHoy = new Date()
                const horaHoy = fechaHoy.getHours()
                const minHoy = fechaHoy.getMinutes()
                const segHoy =fechaHoy.getSeconds()
                const hora = (horaHoy<10 ? "0" : "")+horaHoy+":"+(minHoy<10 ? "0" : "")+minHoy+":"+(segHoy<10 ? "0" : "")+segHoy
                let fechaGuardar = fechas.getHoy() + " " + hora
                for await(const unaFila of planilla) {
                    const payload={
                        Barcode: unaFila['Barcode'].toString().trim(),
                        CodeEmpresa: unaFila['Barcode'].toString().trim(),
                        Partida: unaFila['Partida'].toString().trim(),
                        Nombre: unaFila.Descripcion,
                        UnXCaja: unaFila.UnXCaja,
                        Alto: unaFila['Alto'],
                        Largo: unaFila.Ancho,
                        Ancho: unaFila['Largo'],
                        Peso: unaFila.Peso,
                        Precio: unaFila['Calidad/Precio'],
                        StockUnitario: this.textil ? true : false,
                        IdEmpresa: this.idEmpresa,
                        Fecha: fechaGuardar,
                        UsuarioAlta: store.state.usuarios.usuarioActual.Nombre,
                    }
                    console.log( payload)
                    try {
                        const result=await productosV3.newOne(payload)
                        console.log(result)
                        this.productosError.unshift({Barcode: "Partida: " + result.Partida + ", Barcode: " + payload.Barcode, Correcto: true, Descripcion: "Se ingreso con extio"})
                    } catch (error) {
                        console.log(error)
                        error.replace("Barcode","Partida")
                        this.productosError.unshift({Barcode: "Partida: " + payload.Partida, Correcto: false, Descripcion: error})
                    }               
                }
            } else {
                for await(const unaFila of planilla) {
                    const payload={
                        Barcode: unaFila['Etiqueta/Barcode'].toString().trim(),
                        CodeEmpresa: unaFila['Pieza/Codempresa'],
                        Nombre: unaFila.Descripcion,
                        UnXCaja: unaFila.UnXCaja,
                        Alto: unaFila['Alto'],
                        Largo: unaFila.Ancho,
                        Ancho: unaFila['Largo'],
                        Peso: unaFila.Peso,
                        Precio: unaFila['Calidad/Precio'],
                        StockUnitario: this.textil ? true : false,
                        IdEmpresa: this.idEmpresa,
                        UsuarioAlta: store.state.usuarios.usuarioActual.Nombre,
                    }
                    console.log( payload)
                    try {
                        const result=await productosV3.newOne(payload)
                        this.productosError.unshift({Barcode: "Barcode: " + result.Barcode, Correcto: true, Descripcion: "Se ingreso con extio"})
                    } catch (error) {
                        this.productosError.unshift({Barcode: "Barcode: " + payload.Barcode, Correcto: false, Descripcion: error})
                    }               
                }
            }

            this.popularListaProductos()
        },
        verificarColumnasExcel(planilla) {
            let columnasObligatorias = []
            if(this.tieneLOTE){
                columnasObligatorias=['DeliveryBatch','BoxNumber', 'SerialNumber/Barcode', 'Product-Number', 'Descripcion','Bultos', 'UnXCaja', 'Largo', 'Ancho', 'Alto', 'Volumen', 'Peso', 'Calidad/Precio']
            } else {
                if(this.tienePART){
                    columnasObligatorias=['Partida', 'Barcode', 'Descripcion', 'UnXCaja', 'Largo', 'Ancho', 'Alto', 'Peso', 'Calidad/Precio']
                }else{
                    columnasObligatorias=['Etiqueta/Barcode', 'Pieza/Codempresa', 'Descripcion', 'UnXCaja', 'Largo', 'Ancho', 'Alto', 'Peso', 'Calidad/Precio']
                }
            }

            let columnasFaltantes=[]
            let filaActual=1
            let errores=''
            planilla.forEach(unaFila => {
                filaActual++
                columnasObligatorias.forEach(unaColumnaObligatoria => {
                    if (!Object.keys(unaFila).includes(unaColumnaObligatoria)) {
                        if (!columnasFaltantes.includes(unaColumnaObligatoria)) {
                            const unError="Fila: "+filaActual+" - Columna: "+unaColumnaObligatoria
                            errores += unError+";"
                        }
                    }
                })
            })
            if (errores==='') {
                this.procesarPlanilla(planilla)
            } else {
                this.mostrarMensaje("Errores en Excel a procesar", errores)
            }
        },
        fileOnChange(archivoLeido) {
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
        cancelarEdicionItem() {
            this.mostrarVentanaEdicion=false
        },
        confirmarCreacionItem() {
            this.$refs.form.validate()
            if (this.formValido) {
                this.itemEnEdicion.IdEmpresa=this.idEmpresa
                this.itemEnEdicion.UsuarioAlta = store.state.usuarios.usuarioActual.Nombre
                delete this.itemEnEdicion.Id
                this.itemEnEdicion.Barcode = this.itemEnEdicion.Barcode.trim()
                this.itemEnEdicion.CodeEmpresa = this.itemEnEdicion.CodeEmpresa.trim()
                if(this.itemEnEdicion.Ancho.toString() == ""){
                    this.productosError.unshift({Barcode: "Barcode: " + this.itemEnEdicion.Barcode.trim(), Correcto: false, Descripcion: "El revise que ningun campo este vacio"})
                    this.mostrarVentanaEdicion=false
                }
                else if(this.itemEnEdicion.Alto.toString() == ""){
                    this.productosError.unshift({Barcode: "Barcode: " + this.itemEnEdicion.Barcode.trim(), Correcto: false, Descripcion: "Revise que ningun campo este vacio"})
                    this.mostrarVentanaEdicion=false
                }
                else if(this.itemEnEdicion.Peso.toString() == ""){
                    this.productosError.unshift({Barcode: "Barcode: " + this.itemEnEdicion.Barcode.trim(), Correcto: false, Descripcion: "Revise que ningun campo este vacio"})
                    this.mostrarVentanaEdicion=false
                }
                else if(this.itemEnEdicion.Precio.toString() == ""){
                    this.productosError.unshift({Barcode: "Barcode: " + this.itemEnEdicion.Barcode.trim(), Correcto: false, Descripcion: "Revise que ningun campo este vacio"})
                    this.mostrarVentanaEdicion=false
                }
                else if(this.itemEnEdicion.Largo.toString() == ""){
                    this.productosError.unshift({Barcode: "Barcode: " + this.itemEnEdicion.Barcode.trim(), Correcto: false, Descripcion: "Revise que ningun campo este vacio"})
                    this.mostrarVentanaEdicion=false
                }else{
                    productosV3.newOne(this.itemEnEdicion)
                    .then( response => {
                            this.productosError.unshift({Barcode: "Barcode: " + response.Barcode, Correcto: true, Descripcion: "Se ingreso con extio"})
                            this.popularListaProductos()
                    })
                    .catch( error => {
                        console.log(error)
                        this.productosError.unshift({Barcode: "Barcode: " + this.itemEnEdicion.Barcode.trim(), Correcto: false, Descripcion: error})
                    })
                    .finally( () => {
                        this.mostrarVentanaEdicion=false
                    })
                }
            }
        },
        confirmarEdicionItem() {

            this.$refs.form.validate()
            if (this.formValido) {
                if(this.itemEnEdicion.Ancho.toString() == ""){
                    this.productosError.unshift({Barcode: "Barcode: " + this.itemEnEdicion.Barcode.trim(), Correcto: false, Descripcion: "El revise que ningun campo este vacio"})
                    this.mostrarVentanaEdicion=false
                }
                else if(this.itemEnEdicion.Alto.toString() == ""){
                    this.productosError.unshift({Barcode: "Barcode: " + this.itemEnEdicion.Barcode.trim(), Correcto: false, Descripcion: "Revise que ningun campo este vacio"})
                    this.mostrarVentanaEdicion=false
                }
                else if(this.itemEnEdicion.Peso.toString() == ""){
                    this.productosError.unshift({Barcode: "Barcode: " + this.itemEnEdicion.Barcode.trim(), Correcto: false, Descripcion: "Revise que ningun campo este vacio"})
                    this.mostrarVentanaEdicion=false
                }
                else if(this.itemEnEdicion.Precio.toString() == ""){
                    this.productosError.unshift({Barcode: "Barcode: " + this.itemEnEdicion.Barcode.trim(), Correcto: false, Descripcion: "Revise que ningun campo este vacio"})
                    this.mostrarVentanaEdicion=false
                }
                else if(this.itemEnEdicion.Largo.toString() == ""){
                    this.productosError.unshift({Barcode: "Barcode: " + this.itemEnEdicion.Barcode.trim(), Correcto: false, Descripcion: "Revise que ningun campo este vacio"})
                    this.mostrarVentanaEdicion=false
                }else{
                    delete this.itemEnEdicion.Stock
                    delete this.itemEnEdicion.StockComprometido
                    delete this.itemEnEdicion.StockPosicionado
                    delete this.itemEnEdicion.StockDisponible
                    delete this.itemEnEdicion.StockUnitario
                    delete this.itemEnEdicion.StockSinPosicionar
                    delete this.itemEnEdicion.Posiciones
                    delete this.itemEnEdicion.Barcode
                    this.itemEnEdicion.UsuarioModificacion = store.state.usuarios.usuarioActual.Nombre
                    productosV3.editOne(this.itemEnEdicion)
                    .then( response => {
                        const posicionListaCompleta=this.listaArticulos.findIndex(elemento => elemento.Id==response.Id)
                        this.listaArticulos[posicionListaCompleta]=response
                        this.listaArticulos = this.listaArticulos.filter(element => true)
                        this.productosError.unshift({Barcode: "Barcode: " + response.Barcode, Correcto: true, Descripcion: "Se modifico con extio"})
                    })
                    .catch( error => {
                        console.log(error)
                        this.productosError.unshift({Barcode: "Barcode: " + this.itemEnEdicion.Barcode.trim(), Correcto: false, Descripcion: error})
                    })
                    .finally( () => {
                        this.mostrarVentanaEdicion=false
                    })
                }
            }
        },
        editarArticulo(item){
            this.modoEdicion='E'
            if(this.tieneLOTE){
                item.Id = item.IdProducto
                item.Nombre = item.Descripcion
                item.CodeEmpresa = item.Producto.CodeEmpresa
                item.Ancho = item.Producto.Largo
                item.Largo = item.Producto.Ancho
                item.Alto = item.Producto.Alto
                item.Peso = item.Producto.Peso
                item.Precio = item.Producto.Precio
            }
            this.itemEnEdicion={...item}
            this.mostrarVentanaEdicion=true
        },
        crearArticulo(){
            this.modoEdicion='N'
            if(this.tienePART){
                this.itemEnEdicion={Id: -1, Partida: '', Nombre: '', Barcode: '', Ancho: 0, Alto: 0, Largo: 0, Peso: 0, Precio: 0}
            }else{
                this.itemEnEdicion={Id: -1, Barcode: '', Nombre: '', CodeEmpresa: '', Ancho: 0, Alto: 0, Largo: 0, Peso: 0, Precio: 0}    
            }
            this.mostrarVentanaEdicion=true
        },
        eliminarArticulo(item) {
            const pregunta={titulo: "Confirma la eliminación del producto seleccionado?", 
                            mensaje: "Esta acción <b>no puede deshacerse</b>",
                            botonPrimario: "Confirmar",
                            botonSecundario: "Cancelar",
                            callback: respuesta => {
                                if (respuesta=="Confirmar") {
                                    this.eliminarArticuloConfirmado(item)
                                }
                            }}
            store.dispatch("alertDialog/mostrar", pregunta)
        },
        eliminarArticuloConfirmado(item) {
            productosV3.deleteProducto(item.Id)
                .then(response => {
                    this.popularListaProductos()
                })
                .catch(error => {
                    console.log(error)
                    this.mostrarError(error)
                })
        },
        empresaLoggeada() {
            if (!store.state.usuarios.usuarioActual.IdEmpresa) { 
                return -1
            } else {
                return store.state.usuarios.usuarioActual.IdEmpresa

            }
        },
        async popularListaProductos() {
            console.log(this.tienePART)
            console.log(this.tienePART&&!this.tieneLOTE)
            if(!this.tieneLOTE&&!this.tienePART){
                productosV3.getAllProductosByEmpresa(this.idEmpresa)
                .then(respuesta => {
                    this.listaArticulos=respuesta
                })
                .catch(puteada => {
                    //console.log("Puteada", puteada)
                    this.listaArticulos=[]
                    this.mostrarError(puteada)
                })
            }else if(this.tienePART&&!this.tieneLOTE){
                console.log("tienepart")
                productosV3.getAllPartidasByIdEmpresa(this.idEmpresa)
                .then(respuesta => {
                    this.listaArticulos=respuesta
                    console.log(respuesta)
                })
                .catch(puteada => {
                    this.listaArticulos=[]
                    this.mostrarError(puteada)
                })
            }else{
                productosV3.getAllLotesSoloDetalle(this.idEmpresa)
                .then(respuesta => {
                    this.listaArticulos=respuesta
                })
                .catch(puteada => {
                    //console.log("Puteada", puteada)
                    this.listaArticulos=[]
                    this.mostrarError(puteada)
                })
            }
        },

        buscarLote(){   
            productosV3.getLote(this.empresaElegida.Id,this.textoBusqueda)
            .then(respuesta => {
                this.listaArticulos=[]
                this.listaArticulos = respuesta
            })
            .catch(error =>{
                this.listaArticulos=[]
            })
        },

        eligioEmpresa(idEmpresaElegida) {
            this.listaArticulos = []
            this.tieneLOTE = false
            this.productosError = []
            this.idEmpresa=idEmpresaElegida
            empresas.getOne(idEmpresaElegida)
                .then(response => {
                    console.log(response)
                    if(response.LOTE == true){
                        this.tieneLOTE = true
                        this.tienePART = false
                        this.cabeceras =  [
                            {text: 'DeliveryBatch', value: 'Embarque'},
                            {text: 'BoxNumber', value: 'Lote'},
                            {text: 'SerialNumber', value: 'SerialNumber'},
                            {text: 'PartNumber', value: 'PartNumber'},
                            {text: '', value: 'Acciones'},
                        ]
                        
                    } else {
                        this.tieneLOTE = false
                        if(response.PART){
                            this.tienePART = true
                            this.cabeceras = [
                                {text: 'Id', value: 'Id'},
                                {text: 'Nombre', value: 'Nombre'},
                                {text: 'Partida', value: 'Partida'},
                                {text: 'Barcode', value: 'Barcode'},
                                {text: 'Largo', value: 'Largo'},
                                {text: 'Ancho', value: 'Alto'},
                                {text: 'Alto', value: 'Ancho'},
                                {text: 'Peso', value: 'Peso'},
                                {text: 'Precio', value: 'Precio'},
                                {text: '', value: 'Acciones'},
                            ]
                        }else{
                            this.tienePART = false
                            this.cabeceras = [
                                {text: 'Id', value: 'Id'},
                                {text: 'Nombre', value: 'Nombre'},
                                {text: 'Barcode', value: 'Barcode'},
                                {text: 'Largo', value: 'Largo'},
                                {text: 'Ancho', value: 'Alto'},
                                {text: 'Alto', value: 'Ancho'},
                                {text: 'Peso', value: 'Peso'},
                                {text: 'Precio', value: 'Precio'},
                                {text: '', value: 'Acciones'},
                            ]
                        }
                    }
                    this.empresaElegida=response
                    if (this.empresaElegida.ClienteTextil){
                        this.textil = true
                    }
                    else {
                        this.textil = false
                    }
                    if(!this.tieneLOTE){
                        this.popularListaProductos()
                    }
                })
        },
        mostrarMensaje(titulo, mensaje){
            store.dispatch("alertDialog/mostrar", {titulo, mensaje})
        },
        mostrarError(mensaje) {
            store.dispatch("snackbar/mostrar", mensaje)
        },

        verProductos(){

        },

    async  descargarExcelEjemplo(){

        if(this.tieneLOTE){
            const workbook=new excel.Workbook()
            const worksheet=workbook.addWorksheet("Productos")

            let renglon=1
            ['', '', '', '', '', '', '', '', '']
            worksheet.views = [{state: 'frozen', ySplit: 1}]
            worksheet.autoFilter = 'A1:X1'
            //Nombres de las columnas excel
            const cabeceras=[
                {header: 'DeliveryBatch', width: 30},
                {header: 'BoxNumber', width: 30},
                {header: 'SerialNumber/Barcode', width: 30}, 
                {header: 'Product-Number', width: 30},
                {header: 'Descripcion', width: 30},
                {header: 'Bultos', width: 30},
                {header: 'UnXCaja', width: 15},
                {header: 'Largo', width: 20}, 
                {header: 'Ancho', width: 20},
                {header: 'Alto', width: 15},
                {header: 'Volumen', width: 15},
                {header: 'Peso', width: 15},
                {header: 'Calidad/Precio', width: 25},
                
            
            ]
            worksheet.columns=[...cabeceras]
            renglon++
                        

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
            saveAs(new Blob([buf]), `Importación_de_productosLOTE.xlsx`)
        } else if(this.tienePART){
            const workbook=new excel.Workbook()
            const worksheet=workbook.addWorksheet("Productos")

            let renglon=1
            ['', '', '', '', '', '', '', '', '']
            worksheet.views = [{state: 'frozen', ySplit: 1}]
            worksheet.autoFilter = 'A1:X1'
            //Nombres de las columnas excel
            const cabeceras=[
                {header: 'Partida', width: 30}, 
                {header: 'Barcode', width: 30},
                {header: 'Descripcion', width: 30},
                {header: 'UnXCaja', width: 15},
                {header: 'Largo', width: 20}, 
                {header: 'Ancho', width: 20},
                {header: 'Alto', width: 15},
                {header: 'Peso', width: 15},
                {header: 'Calidad/Precio', width: 25},
                
            
            ]
            worksheet.columns=[...cabeceras]
            renglon++
                        

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
            saveAs(new Blob([buf]), `Importación_de_productos.xlsx`)
      
        } else {
            const workbook=new excel.Workbook()
            const worksheet=workbook.addWorksheet("Productos")

            let renglon=1
            ['', '', '', '', '', '', '', '', '']
            worksheet.views = [{state: 'frozen', ySplit: 1}]
            worksheet.autoFilter = 'A1:X1'
            //Nombres de las columnas excel
            const cabeceras=[
                {header: 'Etiqueta/Barcode', width: 30}, 
                {header: 'Pieza/Codempresa', width: 30},
                {header: 'Descripcion', width: 30},
                {header: 'UnXCaja', width: 15},
                {header: 'Largo', width: 20}, 
                {header: 'Ancho', width: 20},
                {header: 'Alto', width: 15},
                {header: 'Peso', width: 15},
                {header: 'Calidad/Precio', width: 25},
                
            
            ]
            worksheet.columns=[...cabeceras]
            renglon++
                        

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
            saveAs(new Blob([buf]), `Importación_de_productos.xlsx`)
        }          
    },

        async imprimirSticker(item) {
            if(this.tieneLOTE){
                item.Nombre = item.Descripcion
                productosV3.imprimirSticker(item)
            } else {
                productosV3.imprimirSticker(item)
            }
        }
    },

    components: {
        SelectorEmpresa
    },

    created() {
        store.dispatch('actualizarTituloPrincipal', 'Catálogo de productos')
        store.dispatch('empresas/cargarListaEmpresas', "SoloActivas")

        if (store.state.usuarios.usuarioActual.IdEmpresa>0) {
            this.idEmpresa=store.state.usuarios.usuarioActual.IdEmpresa
            this.eligioEmpresa(store.state.usuarios.usuarioActual.IdEmpresa)
        }
    }

}
</script>