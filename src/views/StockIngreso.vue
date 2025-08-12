<template>
  <v-container class="pt-0">
    <v-row>
        <v-col>
            <SelectorEmpresa @eligioEmpresa="eligioEmpresa($event)" ></SelectorEmpresa>
        </v-col>
    </v-row>
    <v-row>
        <v-col><v-text-field class="my-0 py-0" prepend-inner-icon="mdi-receipt" label="Comprobante" v-model="Comprobante" v-show="ComprobanteMostrar" dense></v-text-field></v-col>
        <v-col><v-text-field prepend-inner-icon="mdi-calendar"  @input="eligioFecha" type="date" label="Fecha" v-model="Fecha" v-show="FechaMostrar" dense></v-text-field></v-col>
    </v-row>
    <v-row v-show="!ingresoPorBarcode">
        <v-col cols="6">
            <v-text-field 
                ref="LecturaBarcode" 
                inputmode="none" 
                prepend-inner-icon="mdi-barcode-scan"  
                @keypress.enter="procesarBarcode" 
                label="Código de barras artículo" 
                v-model="BarcodeLeido" 
                v-show="BarcodeMostrar" 
                dense 
                id="BarcodeLeido" >
            </v-text-field>
        </v-col>
        <v-col cols="4"><v-text-field type="number" :rules="[reglasCantidad.required, reglasCantidad.min, reglasCantidad.max]" ref="CantidadAIngresar" prepend-inner-icon="mdi-calculator" @keypress.enter="procesarCantidad" label="Cantidad" v-model="CantidadAIngresar" v-show="CantidadMostrar" dense id="CantidadAIngresar" ></v-text-field></v-col>
        <v-col cols="1"><v-btn @click="procesarCantidad" v-show="CantidadMostrar" id="procesarCantidad"><v-icon color="blue">mdi-content-save</v-icon></v-btn></v-col>
    </v-row>
    <!-- <v-row v-if="IdEmpresa != null" v-show="!ingresoPorBarcode"> -->
    <v-row v-if="IdEmpresa != null"> 
        <v-col>
            <v-file-input 
                label="Planilla a procesar" 
                @change="fileOnChange" 
                accept=".xlsx, .xls"
                filled
                prepend-icon="mdi-microsoft-excel"
            >Importar planilla excel</v-file-input>
        </v-col>
    </v-row>
    <v-row >
      <v-col>
           <v-alert  class="my-1 mx-0 white--text" v-for="(item, index) in listaCodigosLeidos" :key="index" dense :color="colorLectura(item)" >{{item.Barcode}} - {{item.Descripcion}}</v-alert>
      </v-col>
    </v-row>
    <v-row >
      <v-col>
           <v-alert  class="my-1 mx-0 white--text" v-show="ingresoPorBarcode" v-for="(item, index) in loteTitulo" :key="index" dense :color="colorTitulo(item)" >{{item.Lote}} - {{item.Embarque}}</v-alert>
      </v-col>
    </v-row>
    <v-row v-show="ingresoPorBarcode">
        <v-col cols="6">
            <v-text-field 
                ref="LecturaBarcode" 
                inputmode="none" 
                prepend-inner-icon="mdi-barcode-scan"  
                @keypress.enter="guardarBarcodes" 
                label="Código de barras artículo" 
                v-model="BarcodeLeido" 
                v-show="BarcodeMostrar" 
                dense 
                id="BarcodeLeido" >
            </v-text-field>
        </v-col>
        <v-col cols="4"><v-text-field type="number" :rules="[reglasCantidad.required, reglasCantidad.min, reglasCantidad.max]" ref="CantidadAIngresar" prepend-inner-icon="mdi-calculator" @keypress.enter="procesarCantidad" label="Cantidad" v-model="CantidadAIngresar" v-show="CantidadMostrar" dense id="CantidadAIngresar" ></v-text-field></v-col>
        <v-col cols="1"><v-btn @click="procesarCantidad" v-show="CantidadMostrar" id="procesarCantidad"><v-icon color="blue">mdi-content-save</v-icon></v-btn></v-col>
    </v-row>
    <v-row >
      <v-col>
           <v-alert  class="my-1 mx-0 white--text" v-show="ingresoPorBarcode" v-for="(item, index) in escanearUnidadLote" :key="index" dense :color="colorLectura(item)" >
            Barcode: {{item.Lote}} - 
            <v-icon color="red" @click="eliminarLectura(item, index)" >mdi-delete-outline</v-icon>
        </v-alert>
      </v-col>
    </v-row>
    <v-row justify="center">
        <div class="d-flex justify-end">
            <v-col cols="12" md="6"  class="mb-10"  v-if="escanearUnidadLote.length > 0"><v-btn color="primary" @click="clickProcesar" block dark>Procesar</v-btn></v-col>
        </div>
    </v-row>
    <v-footer ><v-btn :block="true" @click="resetearPantalla">Limpiar pantalla</v-btn></v-footer>
  </v-container>
</template>

<script>

import axios from 'axios'
import SelectorEmpresa from '../components/SelectorEmpresa.vue'
import store from '../store'
import {xlsx, read, utils} from 'xlsx'
import movimientos from '../store/movimientosStockV3'
import empresas from "@/store/empresasV3"
import productosV3 from '@/store/productosV3'
import movimientosStockV3 from '@/store/movimientosStockV3'
import fechas from 'vue-lsi-util/fechas'

export default {
    name: 'StockIngresos',
    components: {
        SelectorEmpresa
    },
    data() {
        return {
            IdEmpresa: null,
            ComprobanteMostrar: false,
            FechaMostrar: false,
            BarcodeMostrar: false,
            botonProcesarUnidadesLote: false,
            CantidadMostrar: false,
            escanearUnidadLote: [],
            loteTitulo: [],
            loteDelBarcode: null,
            Fecha: '',
            fechaDeHoy: new Date(),
            BarcodeLeido: process.env.NODE_ENV=='development' ? '0099496066' : null,
            Comprobante: '',
            ManejaStockUnitario:false,
            ingresoPorBarcode: false,
            NoExisteProducto: true,
            userName: null,
            CantidadAIngresar: 0,
            loteLeido: null,
            loteMostrar: null,
            listaEnvioMail: [],
            listaBarcodeLeidos: [],
            listaCodigosLeidos: [],
            Producto:[],
            productosExistentes: [],
            tieneLOTE: false,
            tienePART: false,
            reglasCantidad: { 
                required: value =>  !!value || 'Obligatorio', 
                max: value => value<100000 || 'Debe ser menor que 100K',
                min: value => value>0 || 'Debe ser mayor que cero',
                }
        }
    },
    computed: {      
        APICredenciales() {
            return store.state.usuarios.API.Credenciales
        }
    },
    methods: {
        async procesarExcelLeido(planilla) {
            if(this.tieneLOTE){
                this.NoExisteLote = true
                if(this.Comprobante === '' || this.Comprobante == null) {
                    store.dispatch('snackbar/mostrar', 'El comprobante no puede estar vacio')
                    return false
                }

                //Controlamos que en el excel no alla lote repetidos
                let contador = 0
                for(const registros of planilla){
                    for(const comparar of planilla){
                        if(registros.BoxNumber == comparar.BoxNumber){
                            contador ++
                        }
                        if(contador > 1){
                            contador = 0
                            store.dispatch('snackbar/mostrar', 'EL BoxNumber: ' + comparar.BoxNumber + ' esta duplicado en el excel')
                            this.NoExisteLote = false
                            this.productosExistentes = []
                            return false
                        }
                    }
                    contador = 0
                }

                if(this.NoExisteLote){
                    for await (const unaLinea of planilla) {

                        const existeLote = await productosV3.getOnlyLote(this.IdEmpresa ,unaLinea.BoxNumber)

                        if(existeLote.length <= 0){
                            this.listaCodigosLeidos.unshift({Barcode: "Lote: " + unaLinea.BoxNumber, Correcto: false, Descripcion: "No Existe!" })
                            continue
                        }
                        
                        this.listaBarcodeLeidos = unaLinea.BoxNumber.toString().trim()  
                        await productosV3.putLoteByBarcodeAndEmpresa(this.listaBarcodeLeidos, this.IdEmpresa, this.loteDelBarcode, this.userName, this.Comprobante, this.Fecha)
                            .then(response => {
                                for ( const unaRespuesta of response){
                                    if(unaRespuesta.status == "OK"){
                                        for(const ingreso of unaRespuesta.data){
                                            this.listaCodigosLeidos.unshift({Barcode: "Barcode: " + ingreso.Barcode, Correcto: true, Descripcion: "Lote: " + ingreso.Lote + " - "  + unaRespuesta.mensaje})
                                        }
                                    } else {                                                   
                                        for(const noIngreso of unaRespuesta.data){
                                            this.listaCodigosLeidos.unshift({Barcode: "Barcode: " + noIngreso.Barcode, Correcto: false, Descripcion: "Lote: " + noIngreso.Lote + " - " + unaRespuesta.mensaje })
                                        }                                                    
                                    }
                                }
                            })
                            .catch(error => {
                                this.listaCodigosLeidos.unshift({Barcode: this.BarcodeLeido, Correcto: false, Descripcion: error})
                                console.log(error)
                            })
                    }
                    store.dispatch("alertDialog/mostrar", {titulo: "Proceso finalizado", mensaje: "Finalizo el proceso de ingreso"})
                }
            } else if(this.tienePART){
                this.NoExisteProducto = true
                //controla que el comprobante no este vacio
                if(this.Comprobante === '' || this.Comprobante == null) {
                    store.dispatch('snackbar/mostrar', 'El comprobante no puede estar vacio')
                    return false
                }

                //Controlamos que en el excel no alla barcodes con partidas repetidos
                let contador = 0
                for(const registros of planilla){
                    for(const comparar of planilla){
                        if(registros.BarcodeProducto == comparar.BarcodeProducto && registros.Partida == comparar.Partida){
                            contador ++
                        }
                        if(contador > 1){
                            contador = 0
                            store.dispatch('snackbar/mostrar', 'EL barcode: ' + comparar.BarcodeProducto + ' esta duplicado en el excel')
                            this.NoExisteProducto = false
                            this.productosExistentes = []
                            return false
                        }
                    }
                    contador = 0
                }
                
                let contadorVueltas = 0
                for await(const unRegistro of planilla) {
                    contadorVueltas ++
                    this.BarcodeLeido=unRegistro.BarcodeProducto.toString().trim()
                    //Obtengo la configuracion de la empresa para saber si maneja stock Unitario.
                    await productosV3.getProductoByPartidaAndEmpresaAndProducto(this.IdEmpresa, unRegistro.NumeroPartida, this.BarcodeLeido)
                    .then(respuesta =>{
                        // Combinar datos del backend con datos del Excel
                        this.Producto = {
                            ...respuesta,  // Datos del backend (Id, Descripcion, etc.)
                            // Datos originales del Excel que necesitamos preservar
                            NumeroPartida: unRegistro.NumeroPartida,
                            BarcodeProducto: unRegistro.BarcodeProducto,
                            Cantidad: unRegistro.Unidades,
                            Comprobante: this.Comprobante
                        }
                        console.log('📋 Producto procesado del Excel:', this.Producto);
                        this.productosExistentes.push(this.Producto)
                    })
                    .catch(error => {
                        this.NoExisteProducto = false
                        this.productosExistentes = []
                        this.listaCodigosLeidos.unshift({Partida: this.BarcodeLeido, Correcto: false, Descripcion: `${error} ${this.BarcodeLeido}`})
                    })

                    //validamos que la cantidad que pasan por excel no sea "0"
                    if(unRegistro.Unidades < 1){
                        this.NoExisteProducto = false
                        this.productosExistentes = []
                        this.listaCodigosLeidos.unshift({Partida: this.Producto.Barcode, Correcto: false, Descripcion: 'Esta intentando ingresar 0 unidades'})
                    }else{
                        this.NoExisteProducto = true
                    }

                    //Revisamos que en unidades halla solo numeros
                    if(unRegistro.Unidades.toString().match("[0-9]") == null){
                        this.NoExisteProducto = false
                        this.productosExistentes = []
                        this.listaCodigosLeidos.unshift({Barcode: this.Producto.Barcode, Correcto: false, Descripcion: 'La columna Unidades no puede contener letras'})
                    }else{
                        this.NoExisteProducto = true
                    }
                    //validamos que no se ingresen cifras de mas de 4 dijitos
                    if(unRegistro.Unidades.toString().length > 4){
                        this.NoExisteProducto = false
                        this.productosExistentes = []
                        this.listaCodigosLeidos.unshift({Barcode: this.Producto.Barcode, Correcto: false, Descripcion: 'No se pueden ingresar unidades mayores a 9999'})
                    }else{
                        this.NoExisteProducto = true
                    }
                    if(this.NoExisteProducto != false){
                        //revisamos si la empresa maneja stock unitario
                        if(this.ManejaStockUnitario){
                            //validamos que la cantidad que pasan por excel en empresas de stock unitario no sea mayor a "1"
                            if(unRegistro.Unidades == 1){
                                //validamos que el stock del producto en la base de datos sea cero 
                                if(this.Producto.Stock == 0){
                                    let contadorIngresos = 0
                                    let contadorEgresos = 0
                                    let resultadoResta = 0
                                    //Busco todos los movimientos de este producto 
                                    await productosV3.getMovimientosByPeriodoAndEmpresaAndArticuloAndPartida(this.IdEmpresa, '2010-01-01', fechas.getHoy(), unRegistro.IdProducto, unRegistro.Id)
                                    .then (response => {
                                        for(const revisar of response){
                                            //revisa cuantos movimientos son ingresos y cuantos egresos
                                            if(revisar.tipo == 0 || revisar.tipo == 4){
                                                contadorIngresos++
                                            }else{
                                                contadorEgresos++
                                            }
                                        }
                                        resultadoResta = contadorIngresos - contadorEgresos
                                        //verifico que halla la misma cantidad de ingresos que egresos
                                        if(resultadoResta == 0){
                                            
                                            this.registrarIngresoStockPartida()
                                        }else{
                                            this.productosExistentes = [] 
                                            this.listaCodigosLeidos.unshift({Parcode: this.Producto.Partida, Correcto: false, Descripcion: "En la tabla movimientos el stock es " + resultadoResta})
                                        }
                                    })
                                }else{   
                                    this.productosExistentes = []
                                    this.listaCodigosLeidos.unshift({Parcode: this.Producto.Partida, Correcto: false, Descripcion: 'El artículo esta categorizado como stock_unitario y ya tiene stock'})                           
                                }
                            }else{
                                this.productosExistentes = []
                                this.listaCodigosLeidos.unshift({Parcode: this.Producto.Partida, Correcto: false, Descripcion: 'Esta intentando ingresar ' + unRegistro.Unidades + ' a un articulo de stockunitario'})
                            }
                        }else{
                            this.registrarIngresoStockPartida()
                        }
                        if(this.listaEnvioMail.length>0){
                            movimientos.informarIngresoStock(this.listaEnvioMail)
                            .then(respuesta => {
                                this.listaEnvioMail=[]
                            })
                            .catch(error => {
                                this.listaEnvioMail=[]
                                console.log("Error al enviar E-Mail", error)
                            })
                        }
                    }else{
                        this.NoExisteProducto = true
                    }
                }
            } else{
                this.NoExisteProducto = true
                if(this.Comprobante === '' || this.Comprobante == null) {
                    store.dispatch('snackbar/mostrar', 'El comprobante no puede estar vacio')
                    return false
                }

                //Controlamos que en el excel no alla barcodes repetidos
                let contador = 0
                for(const registros of planilla){
                    for(const comparar of planilla){
                        if(registros.BarcodeProducto == comparar.BarcodeProducto){
                            contador ++
                        }
                        if(contador > 1){
                            contador = 0
                            store.dispatch('snackbar/mostrar', 'EL barcode: ' + comparar.BarcodeProducto + ' esta duplicado en el excel')
                            this.NoExisteProducto = false
                            this.productosExistentes = []
                            return false
                        }
                    }
                    contador = 0
                }
                
                let contadorVueltas = 0
                for await(const unRegistro of planilla) {
                    contadorVueltas ++
                    this.BarcodeLeido=unRegistro.BarcodeProducto.toString().trim()
                    //Obtengo la configuracion de la empresa para saber si maneja stock Unitario.
                    await productosV3.getByBarcodeAndEmpresa(this.BarcodeLeido,this.IdEmpresa)
                        .then(respuesta => {
                            this.Producto = respuesta
                            this.Producto.Cantidad = unRegistro.Unidades 
                            this.Producto.Comprobante = this.Comprobante
                            this.productosExistentes.push(this.Producto)
                        })
                    .catch(error => {
                        this.NoExisteProducto = false
                        this.productosExistentes = []
                        this.listaCodigosLeidos.unshift({Barcode: this.BarcodeLeido, Correcto: false, Descripcion: `${error} ${this.BarcodeLeido}`})
                    })

                    //validamos que la cantidad que pasan por excel no sea "0"
                    if(unRegistro.Unidades < 1){
                        this.NoExisteProducto = false
                        this.productosExistentes = []
                        this.listaCodigosLeidos.unshift({Barcode: this.Producto.Barcode, Correcto: false, Descripcion: 'Esta intentando ingresar 0 unidades'})
                    }else{
                        this.NoExisteProducto = true
                    }

                    //Revisamos que en unidades halla solo numeros
                    if(unRegistro.Unidades.toString().match("[0-9]") == null){
                        this.NoExisteProducto = false
                        this.productosExistentes = []
                        this.listaCodigosLeidos.unshift({Barcode: this.Producto.Barcode, Correcto: false, Descripcion: 'La columna Unidades no puede contener letras'})
                    }else{
                        this.NoExisteProducto = true
                    }
                    //validamos que no se ingresen cifras de mas de 4 dijitos
                    if(unRegistro.Unidades.toString().length > 4){
                        this.NoExisteProducto = false
                        this.productosExistentes = []
                        this.listaCodigosLeidos.unshift({Barcode: this.Producto.Barcode, Correcto: false, Descripcion: 'No se pueden ingresar unidades mayores a 9999'})
                    }else{
                        this.NoExisteProducto = true
                    }
                    if(this.NoExisteProducto != false){
                        //revisamos si la empresa maneja stock unitario
                        if(this.ManejaStockUnitario){
                            //validamos que la cantidad que pasan por excel en empresas de stock unitario no sea mayor a "1"
                            if(unRegistro.Unidades == 1){
                                //validamos que el stock del producto en la base de datos sea cero 
                                if(this.Producto.Stock == 0){
                                    let contadorIngresos = 0
                                    let contadorEgresos = 0
                                    let resultadoResta = 0
                                    //Busco todos los movimientos de este producto 
                                    await productosV3.getMovimientosByPeriodoAndEmpresaAndArticulo(this.Producto.IdEmpresa, '2010-01-01', fechas.getHoy(), this.Producto.Id)
                                    .then (response => {
                                        for(const revisar of response){
                                            //revisa cuantos movimientos son ingresos y cuantos egresos
                                            if(revisar.tipo == 0 || revisar.tipo == 4){
                                                contadorIngresos++
                                            }else{
                                                contadorEgresos++
                                            }
                                        }
                                        resultadoResta = contadorIngresos - contadorEgresos
                                        //verifico que halla la misma cantidad de ingresos que egresos
                                        if(resultadoResta == 0){
                                            
                                            this.registrarIngresoStock()
                                        }else{
                                            this.productosExistentes = [] 
                                            this.listaCodigosLeidos.unshift({Barcode: this.Producto.Barcode, Correcto: false, Descripcion: "En la tabla movimientos el stock es " + resultadoResta})
                                        }
                                    })
                                }else{   
                                    this.productosExistentes = []
                                    this.listaCodigosLeidos.unshift({Barcode: this.Producto.Barcode, Correcto: false, Descripcion: 'El artículo esta categorizado como stock_unitario y ya tiene stock'})                           
                                }
                            }else{
                                this.productosExistentes = []
                                this.listaCodigosLeidos.unshift({Barcode: this.Producto.Barcode, Correcto: false, Descripcion: 'Esta intentando ingresar ' + unRegistro.Unidades + ' a un articulo de stockunitario'})
                            }
                        }else{
                            this.registrarIngresoStock()
                        }
                        if(this.listaEnvioMail.length>0){
                            movimientos.informarIngresoStock(this.listaEnvioMail)
                            .then(respuesta => {
                                this.listaEnvioMail=[]
                            })
                            .catch(error => {
                                this.listaEnvioMail=[]
                                console.log("Error al enviar E-Mail", error)
                            })
                        }
                    }else{
                        this.NoExisteProducto = true
                    }
                }
            }
        },

        verificarColumnasExcel(planilla) {
            let columnasObligatorias
            if(this.tienePART){
                columnasObligatorias=['NumeroPartida','BarcodeProducto', 'Unidades']
            }else{
                columnasObligatorias=['BarcodeProducto', 'Unidades']
            }
            let columnasFaltantes=[]
            let filaActual=1
            let tituloMostrado=false
            planilla.forEach(unaFila => {
                filaActual++
                columnasObligatorias.forEach(unaColumnaObligatoria => {
                    unaColumnaObligatoria=unaColumnaObligatoria.toUpperCase()
                    const atributosDeLaFila=Object.keys(unaFila).map(e => e.toUpperCase())
                    if (!atributosDeLaFila.includes(unaColumnaObligatoria)) {
                        if (!columnasFaltantes.includes(unaColumnaObligatoria)) {
                            columnasFaltantes.push(unaColumnaObligatoria)
                        }
                    }
                })
            })
            if (columnasFaltantes.length==0) {
                const titulo="Confirma?"
                const mensaje="Confirma el procesamiento del Excel seleccionado?"
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
                                this.procesarExcelLeido(planilla)
                            }
                        }
                    }
                )
            } else {
                this.mostrarMensaje("No se han detectado las siguientes columnas: "+columnasFaltantes, "Error")
            }
        },

        verificarColumnasExcelPartida(planilla) {
            let columnasObligatorias = ['NumeroPartida', 'BarcodeProducto', 'Unidades']
            let columnasFaltantes = []
            let filaActual = 1
            
            planilla.forEach(unaFila => {
                filaActual++
                columnasObligatorias.forEach(unaColumnaObligatoria => {
                    unaColumnaObligatoria = unaColumnaObligatoria.toUpperCase()
                    const atributosDeLaFila = Object.keys(unaFila).map(e => e.toUpperCase())
                    if (!atributosDeLaFila.includes(unaColumnaObligatoria)) {
                        if (!columnasFaltantes.includes(unaColumnaObligatoria)) {
                            columnasFaltantes.push(unaColumnaObligatoria)
                        }
                    }
                })
            })
            
            if (columnasFaltantes.length == 0) {
                const titulo = "Confirma?"
                const mensaje = "Confirma el procesamiento del Excel de partidas seleccionado?"
                const botonPrimario = "Comenzar el procesamiento"
                const botonSecundario = "No procesar"
                store.dispatch(
                    "alertDialog/mostrar", 
                    {
                        titulo, 
                        mensaje, 
                        botonPrimario, 
                        botonSecundario, 
                        callback: respuesta => {
                            if (respuesta == botonPrimario) {
                                this.procesarExcelLeido(planilla)
                            }
                        }
                    }
                )
            } else {
                this.mostrarMensaje("No se han detectado las siguientes columnas requeridas para partidas: " + columnasFaltantes, "Error")
            }
        },

        verificarColumnasExcelLote(planilla) {
            let columnasObligatorias=['BoxNumber']
            let columnasFaltantes=[]
            let filaActual=1
            planilla.forEach(unaFila => {
                filaActual++
                columnasObligatorias.forEach(unaColumnaObligatoria => {
                    unaColumnaObligatoria=unaColumnaObligatoria.toUpperCase()
                    const atributosDeLaFila=Object.keys(unaFila).map(e => e.toUpperCase())
                    if (!atributosDeLaFila.includes(unaColumnaObligatoria)) {
                        if (!columnasFaltantes.includes(unaColumnaObligatoria)) {
                            columnasFaltantes.push(unaColumnaObligatoria)
                        }
                    }
                })
            })

            if (columnasFaltantes.length==0) {
                const titulo="Confirma?"
                const mensaje="Confirma el procesamiento del Excel seleccionado?"
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
                                this.procesarExcelLeido(planilla)
                            }
                        }
                    }
                )
            } else {
                this.mostrarMensaje("No se han detectado las siguientes columnas: "+columnasFaltantes, "Error")
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
                    if(this.tieneLOTE){
                        this.verificarColumnasExcelLote(datosPlanilla)
                    } else if(this.tienePART) {
                        this.verificarColumnasExcelPartida(datosPlanilla)
                    } else {
                        this.verificarColumnasExcel(datosPlanilla)
                    }
                }    
                lector.readAsBinaryString(archivoLeido)            
            } else {
                this.listaCodigosLeidos=[]
            }
        },
        setearFechaInicial() {
            const fechaHoy = new Date()
            const anioHoy=fechaHoy.getFullYear()
            const mesHoy=fechaHoy.getMonth()+1
            const diaHoy=fechaHoy.getDate()

            const devolver=anioHoy+"-"+(mesHoy<10 ? "0" : "")+mesHoy+"-"+(diaHoy<10 ? "0" : "")+diaHoy
            this.Fecha=devolver
        },
        procesarCantidad() {
            if (this.CantidadAIngresar<=0) {
                store.dispatch('snackbar/mostrar', 'La cantidad debe ser positiva')
                return false
            }else if
                (this.Comprobante == '') {
                store.dispatch('snackbar/mostrar', 'El comprobante no puede estar vacio')
                return false
            }else if
                (this.CantidadAIngresar.length>4){
                    //si intenta cargar mas de 10000 unidades tira error
                    store.dispatch('snackbar/mostrar', 'El barcode ' + this.BarcodeLeido + ' excede las 9999 unidades')
                    return false
            } else {
                this.productosExistentes[0].Cantidad = this.CantidadAIngresar
                this.registrarIngresoStock()
                //Llamo a esta funcion para avisarle al cliente mediante un Mail que se ingreso Stock
                if(this.listaEnvioMail.length>0)
                     {
                         movimientos.informarIngresoStock(this.listaEnvioMail)
                            .then(respuesta => {
                                this.listaEnvioMail=[]
                            })
                            .catch(error => {
                                this.listaEnvioMail=[]
                                console.log("Error al enviar E-Mail", error)
                            })
                     }
            }
        },

        colorLectura: function(item) {   
            return item.Correcto ? "green" : "red"
        },

        colorTitulo: function(item) {      
            return item.Correcto ? "blue" : ""
        },

        eliminarLectura(item, index) {
            this.escanearUnidadLote.splice(index, 1)
        },

        actualizaStock(barcode, cantidadIngresar,idMovimiento){
            productosV3.updateStockProdByIdEmpresa(barcode, this.IdEmpresa,{Unidades: cantidadIngresar})
                .then(respuesta => {
                    if(respuesta.affected == 1){
                        this.listaCodigosLeidos.unshift({Barcode: barcode, Correcto: true, Descripcion: 'Ingreso Exitoso'})
                    }else{
                        //si el stock no fue guardado correctamente se elimina el movimiento asignado
                        movimientosStockV3.eliminarMovimientoStock(idMovimiento)
                        this.listaCodigosLeidos.unshift({Barcode: barcode, Correcto: false, Descripcion: 'Ingreso Fallido'})
                    }
                })
                .catch(error => {
                    //si hubo algun error al actualizar el stock se elimina el movimiento asignado
                    movimientosStockV3.eliminarMovimientoStock(idMovimiento)
                    this.listaCodigosLeidos.unshift({Barcode: barcode, Correcto: false, Descripcion: 'Ingreso Fallido'})
                })                         
        },

        actualizaStockPart(part, barcode, cantidadIngresar,idMovimiento){
            productosV3.updateStockProdByIdEmpresaAndPart(part, barcode, this.IdEmpresa,{Stock: cantidadIngresar})
                .then(respuesta => {
                    if(respuesta.affected == 1){
                        this.listaCodigosLeidos.unshift({Barcode: part + " Barcode: " + barcode, Correcto: true, Descripcion: 'Ingreso Exitoso'})
                    }else{
                        //si el stock no fue guardado correctamente se elimina el movimiento asignado
                        movimientosStockV3.eliminarMovimientoStock(idMovimiento)
                        this.listaCodigosLeidos.unshift({Barcode: part + " Barcode: " + barcode, Correcto: false, Descripcion: 'Ingreso Fallido'})
                    }
                })
                .catch(error => {
                    //si hubo algun error al actualizar el stock se elimina el movimiento asignado
                    movimientosStockV3.eliminarMovimientoStock(idMovimiento)
                    this.listaCodigosLeidos.unshift({Barcode: part + " Barcode: " + barcode, Correcto: false, Descripcion: 'Ingreso Fallido'})
                })
        },

        registrarIngresoStockPartida(){
            store.dispatch('loading/mostrar', {titulo: 'Registrando...'})

            for (const unProducto of this.productosExistentes){
                const cabeceraDatos = {'Barcode': unProducto.BarcodeProducto, 
                                       'IdEmpresa': this.IdEmpresa, 
                                       'Cantidad': unProducto.Cantidad,
                                       'Comprobante': unProducto.Comprobante,
                                       'Fecha': this.Fecha,
                                       'Partida': unProducto.NumeroPartida  
                }

                this.listaEnvioMail.push({
                    Barcode: unProducto.BarcodeProducto, 
                    Cantidad: unProducto.Cantidad, 
                    Fecha: this.Fecha, 
                    IdEmpresa: this.IdEmpresa, 
                    Comprobante: unProducto.Comprobante,
                    Partida: unProducto.NumeroPartida})
                    
                    //obtiene la hora en la que se hizo el movimiento
                    const fechaHoy = new Date()
                    const horaHoy = fechaHoy.getHours()
                    const minHoy = fechaHoy.getMinutes()
                    const segHoy =fechaHoy.getSeconds()
                    const hora = (horaHoy<10 ? "0" : "")+horaHoy+":"+(minHoy<10 ? "0" : "")+minHoy+":"+(segHoy<10 ? "0" : "")+segHoy
                    this.fechaGuardar = this.Fecha + " " + hora
                    
                    let fechaGuardar = this.fechaToString(fechas.getSumarDiasFecha(0, new Date(this.fechaGuardar)))

                    movimientosStockV3.createMovimientoStockPartida({
                        IdEmpresa: parseInt(cabeceraDatos.IdEmpresa),
                        Barcode: cabeceraDatos.Barcode.toString().trim(),
                        NumeroPartida: cabeceraDatos.Partida.toString().trim(),
                        Cantidad: parseInt(cabeceraDatos.Cantidad),
                        Usuario: this.userName,
                        Fecha: fechaGuardar.toString()
                    })
                    .then(response => {
                        // NUEVO CONTRATO: response es directamente response.data del backend
                        console.log(`📝 THEN ejecutado para ${cabeceraDatos.Barcode} - ${cabeceraDatos.Partida}`);
                        console.log('Respuesta recibida (response.data):', response);
                        
                        // El helper ya maneja los errores, si llegamos aquí es éxito
                        console.log(`✅ Producto ${cabeceraDatos.Barcode} - Partida ${cabeceraDatos.Partida} ingresado exitosamente`);
                        
                        // Obtener mensaje de éxito del backend
                        const mensajeExito = response?.mensaje || `Ingreso exitoso: ${cabeceraDatos.Cantidad} unidades`;
                        console.log('💬 Mensaje de éxito:', mensajeExito);
                        
                        // Mostrar mensaje de éxito en la UI
                        this.listaCodigosLeidos.unshift({
                            Barcode: `${cabeceraDatos.Partida} - ${cabeceraDatos.Barcode}`, 
                            Correcto: true, 
                            Descripcion: mensajeExito
                        });
                        console.log('📋 Lista actualizada:', this.listaCodigosLeidos.length, 'elementos');
                        
                        // Mostrar snackbar de éxito
                        console.log('📢 Enviando snackbar:', `✅ ${mensajeExito}`);
                        store.dispatch('snackbar/mostrar', `✅ ${mensajeExito}`);
                        
                        // ✅ El backend ya actualizó el stock automáticamente
                        // No necesitamos llamar a actualizaStock() aquí
                        console.log('✅ Stock actualizado por el backend automáticamente');
                        console.log('📊 Nuevo stock:', response?.data?.partida?.Stock);
                        console.log('🆔 Movimiento creado con ID:', response?.data?.movimiento?.Id);
                    })
                    .catch(error => { 
                        console.log(`🔴 CATCH ejecutado para ${cabeceraDatos.Barcode} - ${cabeceraDatos.Partida}`);
                        console.log('Error recibido:', error);
                        
                        let errorMsg = 'Error desconocido';
                        let descripcionError = 'Error en ingreso';
                        
                        // NUEVO CONTRATO: Diferenciar tipos de error
                        if (error?.type === 'BUSINESS_ERROR') {
                            // Error de negocio del backend (ej: PRODUCTO_NO_EXISTE)
                            errorMsg = error.message;
                            descripcionError = errorMsg;
                            console.log(`❌ Error de negocio: ${error.error} - ${errorMsg}`);
                        } else if (error?.type === 'TECHNICAL_ERROR') {
                            // Error técnico (HTTP, red, etc.)
                            errorMsg = 'Error técnico en la comunicación';
                            descripcionError = 'Error de conexión';
                            console.log(`❌ Error técnico: Status ${error.status}`);
                        } else {
                            // Error legacy o desconocido
                            errorMsg = error?.message || 'Error desconocido';
                            descripcionError = errorMsg;
                            console.log(`❌ Error legacy: ${errorMsg}`);
                        }

                        console.log('📢 Enviando snackbar de error:', `❌ ${descripcionError}`);
                        store.dispatch('snackbar/mostrar', `❌ ${descripcionError}`);
                        
                        console.log('📋 Agregando a lista de errores');
                        this.listaCodigosLeidos.unshift({
                            Barcode: `${cabeceraDatos.Partida} - ${cabeceraDatos.Barcode}`, 
                            Correcto: false, 
                            Descripcion: descripcionError
                        });
                        console.log('📋 Lista actualizada con error:', this.listaCodigosLeidos.length, 'elementos');
                    }) 
                     fechaGuardar = "";
            }

            this.productosExistentes = []
            this.BarcodeLeido=""
            this.CantidadAIngresar=0
            this.CantidadMostrar=false
            this.enfocarLecturaBarcode()
            store.dispatch('loading/ocultar')
        },

        registrarIngresoStock() {
            store.dispatch('loading/mostrar', {titulo: 'Registrando...'})

            for (const unProducto of this.productosExistentes){
                const cabeceraDatos = {'Barcode': unProducto.Barcode, 
                                       'IdEmpresa': unProducto.IdEmpresa, 
                                       'Cantidad': unProducto.Cantidad,
                                       'Comprobante': unProducto.Comprobante,
                                       'Fecha': this.Fecha,
                }

                this.listaEnvioMail.push({
                    Barcode: unProducto.Barcode, 
                    Cantidad: unProducto.Cantidad, 
                    Fecha: this.Fecha, 
                    IdEmpresa: unProducto.IdEmpresa, 
                    Comprobante: unProducto.Comprobante})
                    
                    //obtiene la hora en la que se hizo el movimiento
                    const fechaHoy = new Date()
                    const horaHoy = fechaHoy.getHours()
                    const minHoy = fechaHoy.getMinutes()
                    const segHoy =fechaHoy.getSeconds()
                    const hora = (horaHoy<10 ? "0" : "")+horaHoy+":"+(minHoy<10 ? "0" : "")+minHoy+":"+(segHoy<10 ? "0" : "")+segHoy
                    this.fechaGuardar = this.Fecha + " " + hora
                    
                    let fechaGuardar = this.fechaToString(fechas.getSumarDiasFecha(0, new Date(this.fechaGuardar)))

                    movimientosStockV3.createMovimientoStock({
                        Orden: cabeceraDatos.Comprobante,
                        IdProducto: unProducto.Id, 
                        Unidades: cabeceraDatos.Cantidad,
                        Tipo: 0,
                        IdEmpresa: parseInt(cabeceraDatos.IdEmpresa),
                        Fecha: fechaGuardar.toString(), 
                        codprod: cabeceraDatos.Barcode.trim(), 
                        Usuario: this.userName })
                    .then(response => {
                        this.actualizaStock(cabeceraDatos.Barcode, cabeceraDatos.Cantidad,response.Id)
                     })
                     .catch(error => { 
                        store.dispatch('snackbar/mostrar', error)
                        this.listaCodigosLeidos.unshift({Barcode: unProducto.Barcode, Correcto: false, Descripcion: 'Comprobante duplicado'})
                     }) 
                     fechaGuardar =""
            }

            this.productosExistentes = []
            this.BarcodeLeido=""
            this.CantidadAIngresar=0
            this.CantidadMostrar=false
            this.enfocarLecturaBarcode()
            store.dispatch('loading/ocultar')
        },

        guardarBarcodes(){
            this.escanearUnidadLote.unshift({Lote: this.BarcodeLeido.toString().trim(), Correcto: true})
            //this.escanearUnidadLote.push(this.BarcodeLeido.toString().trim())
            this.BarcodeLeido = ""
            this.botonProcesarUnidadesLote = true
        },

        async clickProcesar(){
            for(const unidad of this.escanearUnidadLote){
                this.listaBarcodeLeidos.push(unidad.Lote)
            }
            await productosV3.putLoteByBarcodeAndEmpresa(this.listaBarcodeLeidos, this.IdEmpresa, this.loteDelBarcode, this.userName, this.Comprobante, this.Fecha)
                .then(response => {
                    for ( const unaRespuesta of response){
                        if(unaRespuesta.status == "OK"){

                            for(const ingreso of unaRespuesta.data){
                                this.listaCodigosLeidos.unshift({Barcode: "Barcode: " + ingreso.Barcode, Correcto: true, Descripcion: "Lote: " + ingreso.Lote + " - " +  unaRespuesta.mensaje})
                            }

                        } else {

                            if(unaRespuesta.data != false){
                                for(const noIngreso of unaRespuesta.data){
                                    this.listaCodigosLeidos.unshift({Barcode: "Barcode: " + noIngreso.Barcode, Correcto: false, Descripcion: "Lote: " + noIngreso.Lote + " - " + unaRespuesta.mensaje})  
                                }

                            } else {                             
                                this.listaCodigosLeidos.unshift({Barcode: "Barcode: " + unaRespuesta.barcodeNoExiste , Correcto: false, Descripcion: "Lote: " + unaRespuesta.loteNoExiste + " - " + unaRespuesta.mensaje})
                            }     
                        }
                    }        
                })
                .catch(error => {
                    this.listaCodigosLeidos.unshift({Barcode: this.BarcodeLeido, Correcto: false, Descripcion: error})
                    console.log(error)
                })

            this.ingresoPorBarcode = false
            this.loteTitulo = []
            this.escanearUnidadLote = []
            this.botonProcesarUnidadesLote = false
            this.loteDelBarcode = null
        },

        async procesarBarcode() {
            //Verificamos que coloque un comprobante
            if(this.Comprobante == '') {
                store.dispatch('snackbar/mostrar', 'El comprobante no puede estar vacio')
                return false
            }
            store.dispatch('loading/mostrar', {titulo: 'Verificando artículo...'})

            if (process.env.VUE_APP_Quien_Soy=="Bogota" && this.IdEmpresa==6) {
                //Soy Bogotá y eligió Textil Katalina
                //https://logiciel.freshdesk.com/a/tickets/26566
                //Sacarle el último caracter al barcode leido
                this.BarcodeLeido=this.BarcodeLeido.slice(0, -1)
            }

            if(this.tieneLOTE){
                this.listaBarcodeLeidos = []
                productosV3.getLoteByBarcodeAndEmpresa(this.BarcodeLeido.toString().trim(), this.IdEmpresa)
                .then(responseLote => {  
                    const titulo="¿Ingresa Lote completo?"
                    const mensaje='si se ingresa por unidades dentro del Lote, seleccionar "NO, POR BARCODE"' 
                    const botonPrimario="Completo"
                    const botonSecundario="NO, Por Barcode"
                    store.dispatch(
                        "alertDialog/mostrar", 
                        {
                            titulo, 
                            mensaje, 
                            botonPrimario, 
                            botonSecundario, 
                            callback: respuesta => {
                                if (respuesta==botonPrimario) {
                                    this.listaBarcodeLeidos.push(this.BarcodeLeido.toString().trim())  
                                    productosV3.putLoteByBarcodeAndEmpresa(this.listaBarcodeLeidos, this.IdEmpresa, this.loteDelBarcode, this.userName, this.Comprobante, this.Fecha)
                                        .then(response => {
                                            for ( const unaRespuesta of response){
                                                if(unaRespuesta.status == "OK"){
                                                    for(const ingreso of unaRespuesta.data){
                                                        this.listaCodigosLeidos.unshift({Barcode: "Barcode: " + ingreso.Barcode, Correcto: true, Descripcion: "Lote: " + ingreso.Lote + " - "  + unaRespuesta.mensaje})
                                                    }
                                                } else {                                                   
                                                    for(const noIngreso of unaRespuesta.data){
                                                        this.listaCodigosLeidos.unshift({Barcode: "Barcode: " + noIngreso.Barcode, Correcto: false, Descripcion: "Lote: " + noIngreso.Lote + " - " + unaRespuesta.mensaje })
                                                    }                                                    
                                                }
                                            }
                                        })
                                        .catch(error => {
                                            this.listaCodigosLeidos.unshift({Barcode: this.BarcodeLeido, Correcto: false, Descripcion: error})
                                            console.log(error)
                                        })
                                }
                                
                                if (respuesta==botonSecundario) {
                                    this.loteDelBarcode=responseLote.Lote
                                    this.BarcodeLeido=""
                                    this.ingresoPorBarcode = true
                                    this.loteTitulo.unshift({Lote: "Box Number: " + responseLote.Lote, Correcto: true, Embarque: "Delivery Batch " + responseLote.Embarque})
                                    //this.listaBarcodeLeidos.push(this.BarcodeLeido.toString().trim())  
                                    this.clickProcesar
                                }
                            }
                        }
                    )
                })
                .catch(error => {
                    console.log(error)
                })
            } else {
                const cabeceraDatos = {'Barcode': this.BarcodeLeido, 'IdEmpresa': this.IdEmpresa}
                //await axios.get('IngresosStock/getArticuloByBarcode', {auth: this.APICredenciales, headers: cabeceraDatos})
                 productosV3.getByBarcodeAndEmpresa(this.BarcodeLeido.toString().trim(), this.IdEmpresa)
                    .then(data => {
                        store.dispatch('loading/ocultar')
                        this.productosExistentes.push(data)
                        this.productosExistentes[0].Comprobante = this.Comprobante
                        //Verifico si la empresa maneja Stock Unitario
                        if (this.ManejaStockUnitario) {
                            //  Tiene stock unitario, así que no pido cantidad
                            this.CantidadAIngresar=1
                            this.productosExistentes[0].Cantidad = this.CantidadAIngresar
                            //Verifico si el producto tiene mas de una unidad
                            if(data.Stock == 0){
                                let contadorIngresos = 0
                                let contadorEgresos = 0
                                let resultadoResta = 0
                                //Busco todos los movimientos de este producto 
                                productosV3.getMovimientosByPeriodoAndEmpresaAndArticulo(data.IdEmpresa, '2010-01-01', fechas.getHoy(), data.Id)
                                    .then (response => {
                                        for(const revisar of response){
                                        //revisa cuantos movimientos son ingresos y cuantos egresos
                                            if(revisar.tipo == 0 || revisar.tipo == 4){
                                                contadorIngresos++
                                            }
                                            else{
                                                contadorEgresos++
                                            }
                                        }
                                        resultadoResta = contadorIngresos - contadorEgresos
                                        //verifico que alla la misma cantidad de ingresos que egresos
                                        if(resultadoResta == 0){
                                            this.productosExistentes[0].Cantidad = this.CantidadAIngresar
                                            this.registrarIngresoStock()
    
                                            //Llamo a esta funcion para avisarle al cliente mediante un Mail que se ingreso Stock
                                            if(this.listaEnvioMail.length>0){
                                                movimientos.informarIngresoStock(this.listaEnvioMail)
                                                .then(respuesta => {
                                                    this.listaEnvioMail=[]
                                                })
                                                .catch(error => {
                                                    this.listaEnvioMail=[]
                                                    console.log("Error al enviar E-Mail", error)
                                                })
                                            }
                                        }else{
                                            this.productosExistentes = []
                                            this.listaCodigosLeidos.unshift({Barcode: this.BarcodeLeido, Correcto: false, Descripcion: "En la tabla movimientos el stock es " + resultadoResta})
                                        }
                                        this.productosExistentes = []
                                    })
                                    .catch(error => {
                                        console.log(error)
                                    })
                            }else{
                                this.productosExistentes = []
                                this.listaCodigosLeidos.unshift({Barcode: this.BarcodeLeido, Correcto: false, Descripcion: 'El artículo esta categorizado como stock_unitario y ya tiene stock'})
                            }
                        } else {
                            // NO tiene stock unitario, así que pido que ingresen la cantidad.
                            this.CantidadMostrar=true
                            this.CantidadAIngresar=1
                            this.enfocarCantidadAIngresar()
                        }    
                    })
                    .catch(puteada => {
                        this.productosExistentes = []
                        //this.mostrarError(puteada)
                        this.listaCodigosLeidos.unshift({Barcode: this.BarcodeLeido, Correcto: false, Descripcion: 'Producto inexistente'})
                        this.BarcodeLeido=''
                        this.enfocarLecturaBarcode()
                        //console.log(puteada)
                    })
                    .finally( () => {
                        store.dispatch('loading/ocultar')
                    })
            }
        },

        async procesarLote() {
            //Verificamos que coloque un comprobante
            if(this.Comprobante == '') {
                store.dispatch('snackbar/mostrar', 'El comprobante no puede estar vacio')
                return false
            }
            store.dispatch('loading/mostrar', {titulo: 'Verificando artículo...'})            

            const cabeceraDatos = {'Lote': this.loteLeido, 'IdEmpresa': this.IdEmpresa}

            //await axios.get('IngresosStock/getArticuloByBarcode', {auth: this.APICredenciales, headers: cabeceraDatos})
             productosV3.getByBarcodeAndEmpresa(this.BarcodeLeido.toString().trim(), this.IdEmpresa)
                .then(data => {
                    store.dispatch('loading/ocultar')
                    this.productosExistentes.push(data)
                    this.productosExistentes[0].Comprobante = this.Comprobante
                    //Verifico si la empresa maneja Stock Unitario
                    if (this.ManejaStockUnitario) {
                        //  Tiene stock unitario, así que no pido cantidad
                        this.CantidadAIngresar=1
                        this.productosExistentes[0].Cantidad = this.CantidadAIngresar
                        //Verifico si el producto tiene mas de una unidad
                        if(data.Stock == 0){
                            let contadorIngresos = 0
                            let contadorEgresos = 0
                            let resultadoResta = 0
                            //Busco todos los movimientos de este producto 
                            productosV3.getMovimientosByPeriodoAndEmpresaAndArticulo(data.IdEmpresa, '2010-01-01', fechas.getHoy(), data.Id)
                                .then (response => {
                                    for(const revisar of response){
                                    //revisa cuantos movimientos son ingresos y cuantos egresos
                                        if(revisar.tipo == 0 || revisar.tipo == 4){
                                            contadorIngresos++
                                        }
                                        else{
                                            contadorEgresos++
                                        }
                                    }
                                    resultadoResta = contadorIngresos - contadorEgresos
                                    //verifico que alla la misma cantidad de ingresos que egresos
                                    if(resultadoResta == 0){
                                        this.productosExistentes[0].Cantidad = this.CantidadAIngresar
                                        this.registrarIngresoStock()

                                        //Llamo a esta funcion para avisarle al cliente mediante un Mail que se ingreso Stock
                                        if(this.listaEnvioMail.length>0){
                                            movimientos.informarIngresoStock(this.listaEnvioMail)
                                            .then(respuesta => {
                                                this.listaEnvioMail=[]
                                            })
                                            .catch(error => {
                                                this.listaEnvioMail=[]
                                                console.log("Error al enviar E-Mail", error)
                                            })
                                        }
                                    }else{
                                        this.productosExistentes = []
                                        this.listaCodigosLeidos.unshift({Barcode: this.BarcodeLeido, Correcto: false, Descripcion: "En la tabla movimientos el stock es " + resultadoResta})
                                    }
                                    this.productosExistentes = []
                                })
                                .catch(error => {
                                    console.log(error)
                                })
                        }else{
                            this.productosExistentes = []
                            this.listaCodigosLeidos.unshift({Barcode: this.BarcodeLeido, Correcto: false, Descripcion: 'El artículo esta categorizado como stock_unitario y ya tiene stock'})
                        }
                    } else {
                        // NO tiene stock unitario, así que pido que ingresen la cantidad.
                        this.CantidadMostrar=true
                        this.CantidadAIngresar=1
                        this.enfocarCantidadAIngresar()
                    }
                       
                    
                })
                .catch(puteada => {
                    this.productosExistentes = []
                    //this.mostrarError(puteada)
                    this.listaCodigosLeidos.unshift({Barcode: this.BarcodeLeido, Correcto: false, Descripcion: 'Producto inexistente'})
                    this.BarcodeLeido=''
                    this.enfocarLecturaBarcode()
                    //console.log(puteada)

             })
                .finally( () => {
                    store.dispatch('loading/ocultar')
                })
        },

        eligioEmpresa(IdEmpresaElegida) {
            this.tieneLOTE = false
            this.IdEmpresa=IdEmpresaElegida;
            this.ComprobanteMostrar=true;
            this.FechaMostrar=true;
            this.BarcodeMostrar=true;
            this.ManejaStockUnitario = false;
            this.enfocarLecturaBarcode();

            //Obtengo la configuracion de la empresa para saber simaneja stock Unitario.
            empresas.getOneById(this.IdEmpresa)
                .then(respuesta => {
                    if(respuesta.LOTE == true){
                        this.tieneLOTE = true        
                        this.tienePART = false
                    }else if(respuesta.PART){
                        this.tieneLOTE = false
                        this.tienePART = true
                    }else{
                        this.tienePART = false
                        this.tieneLOTE = false        
                    }

                    if(respuesta.StockUnitario){
                        this.ManejaStockUnitario=true
                    }
                })
                .catch(error => {
                    console.log("Error", error)
                })          
        },
        eligioFecha() {
            this.BarcodeMostrar=true;
            this.enfocarLecturaBarcode();
        },
        enfocarLecturaBarcode() {
            this.$nextTick(() => {
                this.$refs.LecturaBarcode.focus();
            });      
        },
        enfocarCantidadAIngresar() {
            this.$nextTick(() => {
                this.$refs.CantidadAIngresar.focus();
            });      
        },
        resetearPantalla() {
            this.ingresoPorBarcode = false
            this.loteTitulo = []
            this.escanearUnidadLote = []
            this.listaCodigosLeidos=[]
            this.botonProcesarUnidadesLote = false
        },
        mostrarMensaje(mensaje, titulo) {
            store.dispatch("alertDialog/mostrar", {titulo, mensaje, botonPrimario: "Entendido"})
        },
        fechaToString (fecha)  {
        //deja el string de la fecha en el formato correcto para guardar
        const result=String(fecha.getFullYear())+"-"+String(fecha.getMonth()+1).padStart(2, "0")+"-"+String(fecha.getDate()).padStart(2, "0")+" "+String(fecha.getHours()).padStart(2, "0")+":"+String(fecha.getMinutes()).padStart(2, "0")+":"+String(fecha.getSeconds()).padStart(2, "0")
        return result
        }
    },
    mounted() {
        this.setearFechaInicial()
        store.dispatch('actualizarTituloPrincipal', 'Ingreso de stock')
        store.dispatch('empresas/cargarListaEmpresas','SoloActivas')
        this.userName =  store.state.usuarios.usuarioActual.Nombre
    }
}
</script>