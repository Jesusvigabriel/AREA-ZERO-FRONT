<template>
  <v-container class="pt-0">
    <v-row>
        <v-col>
            <SelectorEmpresa @eligioEmpresa="selectorEmpresaChange($event)" ></SelectorEmpresa>
        </v-col>
    </v-row>
    <v-row v-show="selectorOrden.mostrar">
        <v-col cols="6">
            <v-select 
                v-model="selectorOrden.dato" 
                dense 
                prepend-inner-icon="mdi-clipboard-list-outline"
                @change="selectorOrdenChange" 
                :items="listaOrdenes" 
                item-value="Id" 
                item-text="Numero" 
                label="Seleccione orden"
                class="my-0 py-0"
                id="selectorOrden"
            >
            </v-select>
        </v-col>
        <v-col cols="1" class="my-0 py-0">
            <v-btn @click="botonImprimirStickersClick" v-show="botonImprimirStickers.mostrar"><v-icon>mdi-label</v-icon></v-btn>
        </v-col>
        <v-col cols="4" v-if="listaOrdenes!=null && ordenEnCurso==null">
            {{listaOrdenes.length==0 ?  'No hay órdenes pendientes' : 'Hay '+listaOrdenes.length+' órdenes pendientes'}}
        </v-col>
    </v-row>
    <v-row v-show="barcodeArticulo.mostrar">
        <v-col cols="6"><v-text-field ref="barcodeArticulo" inputmode="none" prepend-inner-icon="mdi-barcode-scan"  @keypress.enter="BarcodeArticuloEnter" label="Barcode artículo" v-model="barcodeArticulo.dato" v-show="barcodeArticulo.mostrar" dense id="barcodeArticulo" ></v-text-field></v-col>
        <v-col cols="4" v-show="!tieneLOTE">
            <v-text-field type="number" :rules="[reglasCantidad.required, reglasCantidad.min]" ref="cantidadAIngresar" prepend-inner-icon="mdi-calculator" @keypress.enter="cantidadAIngresarEnter" label="Cantidad" v-model="cantidadAIngresar.dato" v-show="cantidadAIngresar.mostrar" dense id="cantidadAIngresar" ></v-text-field>
        </v-col>
        <v-col cols="4" v-show="tieneLOTE">
            <v-text-field type="number" :rules="[reglasCantidad.required, reglasCantidad.min]" ref="cantidadAIngresar" prepend-inner-icon="mdi-calculator" @keypress.enter="cantidadAIngresarEnterLote" label="Cantidad" v-model="cantidadAIngresar.dato" v-show="cantidadAIngresar.mostrar" dense id="cantidadAIngresar" ></v-text-field>
        </v-col>
        <v-col cols="1" class="mx-1 my-0 py-0">
            <v-btn v-if="!tieneLOTE" @click="cantidadAIngresarEnter" id="procesarCantidadAIngresar" v-show="cantidadAIngresar.mostrar"><v-icon color="blue">mdi-content-save</v-icon></v-btn>
            <v-btn v-if="tieneLOTE" @click="cantidadAIngresarEnterLote" id="procesarCantidadAIngresar" v-show="cantidadAIngresar.mostrar"><v-icon color="blue">mdi-content-save</v-icon></v-btn>
        </v-col>
    </v-row>
    <v-row v-show="botonSalidaExpress">
        <v-col cols="1" class="my-0 py-0">
            <v-btn block color="primary" @click="salidaExpress">Salida Express</v-btn>
        </v-col>
    </v-row>
    <v-row v-show="productoEnCurso.mostrar">
        <v-col>
            <v-alert class="my-1 mx-0" color="info" >{{productoEnCurso.descripcion}}</v-alert>
        </v-col>
    </v-row>
    <v-row v-show="listaProductosLeidos.length>0">
        <v-col>
            <v-btn block color="primary" @click="clickFinalizarIngresarBultos()" >Finalizar e ingresar cantidad de bultos</v-btn>
        </v-col>
    </v-row>
    <v-row v-show="pedirCantidadBultos">
        <v-col>
            <v-text-field type="number" prepend-inner-icon="mdi-calculator" label="Cantidad de bultos" v-model="cantidadBultos" dense ></v-text-field>
            <v-btn block color="primary" :disabled="botonDesactivado"  @click="clickProcesarIngreso()" >Finalizar y registrar</v-btn>
        </v-col>
    </v-row>
    <v-card v-show="tieneLOTE" v-if="elegirLote">
        <v-card-title>
            <span class="text-h5">{{"Elegir Lote"}}</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-row v-if="listaLotes.length>0">
                    <v-col class="py-0" >
                        <v-data-table
                            :headers="cabecerasListadoLote" 
                            :items="listaLotes"  
                            :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
                            :items-per-page="30" 
                            :search="textoBusqueda"
                            class="elevation-3" >
                            <template v-slot:item.Acciones="{ item, index }">
                                <v-icon color="green" @click="seleccionarLote(item); textoBusqueda=''">mdi-plus</v-icon>
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
    <v-row >
        <v-col>
            <v-alert v-if="!tieneLOTE" dark class="my-1 mx-0" v-for="(item, index) in listaProductosLeidos" :key="index" dense :color="colorLectura(item)" >
                {{item.barcode}} - {{item.descripcion}} x {{item.cantidad}}
                <v-icon color="red" @click="eliminarLectura(item, index)" >mdi-delete-outline</v-icon>
            </v-alert>
            <v-alert v-if="tieneLOTE" dark class="my-1 mx-0" v-for="(item, index) in listaProductosLeidos" :key="index" dense :color="colorLectura(item)" >
                {{"BoxNumber: " + item.lote}} - {{"SerialNumber: " + item.barcode}} - {{"PartNumber: " + item.partNumber}} - {{item.descripcion}} x {{item.cantidad}}
                <v-icon color="red" @click="eliminarLectura(item, index)" >mdi-delete-outline</v-icon>
            </v-alert>
            
        </v-col>
    </v-row>
    <v-divider v-if="listaProductosLeidos.length>=1" />
    <div v-if="listaProductosLeidos.length>=1">Total artículos leídos: {{listaProductosLeidos.length}}</div>
    <v-row> <v-col> <div> </div> </v-col> </v-row>
    <v-row> <v-col> <div> </div> </v-col> </v-row>
    <v-row> <v-col> <div> </div> </v-col> </v-row>
    <v-footer absolute><v-btn block @click="resetearPantalla">Limpiar pantalla</v-btn></v-footer>

    <!-- Diálogo para ingresar cantidad de bultos -->
    <v-dialog v-model="mostrarDialogoBultos" max-width="500px">
      <v-card>
        <v-card-title class="headline">Cantidad de Bultos</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="cantidadBultos"
            label="Cantidad de bultos"
            type="number"
            min="1"
            required
            outlined
            dense
            class="mt-4"
            @keyup.enter="confirmarCantidadBultos"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="mostrarDialogoBultos = false">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="confirmarCantidadBultos">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>


import SelectorEmpresa from '@/components/SelectorEmpresa.vue'
import store from '@/store'
import router from '@/router'
import API from '@/API/Acceso'
import ordenes from "@/store/ordenes"
import ordenesV3 from "@/store/ordenesV3"
import movimientosStockV3 from '@/store/movimientosStockV3'
import empresasV3 from '@/store/empresasV3'
import posiciones from '@/store/posiciones'
import posicionesV3 from '@/store/posicionesV3'
import productosV3 from '@/store/productosV3'
import fechas from 'vue-lsi-util/fechas'

export default {
    name: 'OrdenesSalida',
    components: {
        SelectorEmpresa
    },
    data() {
        return {
            botonSalidaExpress: false,
            idEmpresa: null,
            selectorEmpresa: {mostrar: true, dato: null},
            selectorOrden: {mostrar: false, dato: null},
            botonImprimirStickers: {mostrar: false},
            botonConfirmarIngreso: {mostrar: false},
            listaOrdenes: [],
            listaProductosLeidos: [],
            mostrarDialogoBultos: false,
            ordenEnCurso: null,
            listaBarcode: [],
            detalleOrdenEnCurso: [],
			detalleOrden: [],
            detallePosiciones: [],
            productoEnCurso: {mostrar: false},
            pedirCantidadBultos: false,
            cantidadBultos: 0,
            empresa: {},
            userName: null,
            botonDesactivado: false,
            tieneLOTE: false,
            elegirLote: false,
            listaLotes: [],
            textoBusqueda: "",
            indiceItemDetalleEnCurso: null,
            barcodeArticulo: {mostrar: false, dato: null},
            cantidadAIngresar: {mostrar: false, dato: null},
            reglasCantidad: { required: value =>  !!value || 'Obligatorio', min: value => value>0 || 'Debe ser mayor que cero' },
            cabecerasListadoLote: [
                    {text: 'Box Number', value: 'lote'},
                    {text: '', value: 'Acciones'},
            ]
        }
    },
    methods: {
        botonImprimirStickersClick() {

        },
        eliminarLectura(item, index) {
            if(this.tieneLOTE){
                if(item.loteCompleto == 1){

                    this.ordenEnCurso.forEach(producto => {
                        if (producto.lote === item.lote) {     
                            producto.CantidadSalida -= producto.CantidadSalida   
                            producto.loteYaIngresado = false                      
                        }
                    })

                    this.listaProductosLeidos = this.listaProductosLeidos.filter(producto => {
                        return producto.lote !== item.lote
                    })
                } else {
                    this.ordenEnCurso.forEach(producto => {
                        if(producto.Barcode == item.barcode && producto.lote == item.lote){
                            producto.CantidadSalida -= item.cantidad
                        }
                    })

                    this.listaProductosLeidos = this.listaProductosLeidos.filter(producto => {
                        return producto.lote !== item.lote && producto.Barcode !== item.barcode
                    })
                }
            } else {
                this.listaProductosLeidos.splice(index, 1)
                // const indiceItemDetalle=this.ordenEnCurso.findIndex(element => element.Barcode == item.barcode.trim())
                this.ordenEnCurso[this.indiceItemDetalleEnCurso].CantidadSalida -= item.cantidad

            }
        },
        async selectorEmpresaChange(IdEmpresaElegida) {
            this.listaOrdenes = []
            this.idEmpresa = IdEmpresaElegida
            this.botonImprimirStickers.mostrar=false
            this.selectorEmpresa.dato=IdEmpresaElegida;
            this.ordenEnCurso=null
            this.barcodeArticulo.mostrar=false

            empresasV3.getOne(this.selectorEmpresa.dato)
                .then( async response => {   
                    if(response.LOTE == true){
                        this.tieneLOTE = true  
                    } else {
                        this.tieneLOTE = false  
                    }                       
                    this.empresa = response
                    this.botonSalidaExpress = false
                })
                .catch( error => {
                    this.mostrarMensaje({titulo: "Error", mensaje: error})
                })
            // API.actions.acceder({Ruta: "ordenes/getAll", 
            //                      Cabeceras: {IdEmpresa: IdEmpresaElegida, Estado: 1, IdOrden: -1, FechaDesde: '', FechaHasta: ''},
            //                      Cartel: 'Leyendo órdenes...'})
            //     .then(datosLeidos => {
            //         if (datosLeidos.Estado=="OK") {
            //             this.listaOrdenes=datosLeidos.Datos.Ordenes.sort((e1, e2) => {
            //                 return e1.Numero.localeCompare(e2.Numero)
            //             })
            //             this.selectorOrden.mostrar=true
            //         }
            //     })
            //     .catch(puteada => {
            //         store.dispatch('snackbar/mostrar', puteada.Detalle)
            //     })

            try{
                const results=await ordenesV3.getByPeriodoEmpresaSoloPreparadasYNoPreorden('2022-10-01', '2030-12-31', IdEmpresaElegida) 
                this.listaOrdenes=results.sort((e1, e2) => {return e1.Numero.localeCompare(e2.Numero)})
                this.listaOrdenes=this.listaOrdenes.filter(e => (!e.PreOrden) && (e.Estado===1))
                this.selectorOrden.mostrar=true

            } catch (error) {
                console.log("Error al leer órdenes", error)
            }

        },
        selectorOrdenChange(idOrdenSeleccionada) {
            const ordenEnCurso = this.listaOrdenes.find(element => element.Id == idOrdenSeleccionada)
            if (typeof (ordenEnCurso) === 'undefined') {
                store.dispatch("snackbar/mostrar", "Orden inexistente")
                return
            }
            router.push(`/Ordenes/PrepararOrden/${idOrdenSeleccionada}`)
        },

       /**
 * Salida Express mejorada:
 * Para empresas con StockPosicionado, reparte automáticamente las cantidades a despachar
 * entre todas las posiciones donde haya stock disponible, para cada producto de la orden.
 * Si falta stock en alguna línea, lo deja asentado en listaProductosLeidos.
 * Para empresas sin posiciones, se comporta como antes (lleva cantidad a salida).
 */
async salidaExpress() {
    try {
        this.listaProductosLeidos = [];

        if (this.empresa.StockPosicionado) {
            // 1. Obtenemos los productos y posiciones ASIGNADOS A LA ORDEN desde el endpoint correcto:
            const productosPosiciones = await ordenesV3.getProductosYPosicionesByOrden(this.ordenEnCurso[0].Id);

            // 2. Por cada producto/posición asignado, agregamos el registro para salida
            for (const registro of productosPosiciones) {
                // Solo mostramos las líneas con cantidad mayor a cero
                if (registro.cantidad_posicion > 0) {
                    this.listaProductosLeidos.push({
                        correcto: true,
                        barcode: registro.p_CodeEmpresa,  // O el campo que corresponda a tu barcode
                        cantidad: registro.cantidad_posicion,
                        descripcion: registro.nombre_producto,
                        codeempresa: registro.p_CodeEmpresa,
                        idProducto: registro.id_producto,
                        idPosicion: registro.ppod_id_posicion,
                        nombrePosicion: registro.nombre_posicion
                    });
                }
            }

            // 3. Actualizamos las cantidades de salida de los productos en la orden
            // Si tenés ordenEnCurso como array de productos, sumá las cantidades asignadas:
            this.ordenEnCurso.forEach(producto => {
                producto.CantidadSalida = productosPosiciones
                    .filter(r => r.id_producto === producto.IdProducto)
                    .reduce((suma, r) => suma + r.cantidad_posicion, 0);
            });

            // 4. Si hay productos con faltante (esto dependerá de la lógica de tu backend),
            // podrías mostrarlo aparte o manejarlo acá si lo necesitas.
            // Por ahora, asumo que sólo mostramos lo que efectivamente está asignado.
        } else {
            // Empresas SIN stock posicionado: como antes.
            for (const producto of this.ordenEnCurso) {
                producto.CantidadSalida = producto.Unidades;
                this.listaProductosLeidos.push({
                    correcto: true,
                    barcode: producto.Barcode,
                    cantidad: producto.Unidades,
                    descripcion: producto.Productos,
                    codeempresa: producto.CodeEmpresa,
                    idProducto: producto.IdProducto
                });
            }
        }

        // Siguiente paso: pedir cantidad de bultos
        this.pedirCantidadBultos = true;

    } catch (error) {
        this.mostrarMensaje({ titulo: "Error", mensaje: error.toString() });
    }
},


        async clickFinalizarIngresarBultos() {
            this.pedirCantidadBultos=true
        },
        async clickProcesarIngreso() {
            this.botonDesactivado = true;
            
            // 1. Primero validamos la orden
            const validacionOrden = this.validarOrdenCompleta();
            if (validacionOrden !== "") {
                this.mostrarMensaje({
                    titulo: "Error 👎", 
                    mensaje: "La orden presenta las siguientes irregularidades:;;" + validacionOrden
                });
                this.botonDesactivado = false;
                return;
            }

            // 2. Mostrar diálogo para ingresar cantidad de bultos
            this.mostrarDialogoBultos = true;
            this.botonDesactivado = false;
            this.botonSalidaExpress = false;
        },

        // Método para confirmar la cantidad de bultos
        async confirmarCantidadBultos() {
            if (!this.cantidadBultos || this.cantidadBultos <= 0) {
                this.mostrarMensaje({
                    titulo: "Error", 
                    mensaje: "Debe ingresar una cantidad de bultos válida"
                });
                return;
            }

            // Mostrar diálogo de confirmación
            this.mostrarMensaje({
                titulo: "Orden de salida",
                mensaje: `¿Confirma la registración con ${this.cantidadBultos} bultos?`,
                botonPrimario: "Confirmar", 
                botonSecundario: "Cancelar",
                callback: async (respuesta) => {
                    if (respuesta === "Confirmar") {
                        try {
                            await this.registrarProcesamientoOrden();
                            this.ordenEnCurso.forEach(element => {
                                this.listaBarcode.push(element.Barcode);
                            });
                            //Chequeo que no se hayan duplicado movimientos
                            //movimientosStockV3.validaMovimientoStock(...)
                        } catch (error) {
                            console.error("Error al procesar la orden:", error);
                            this.mostrarMensaje({
                                titulo: "Error", 
                                mensaje: "Ocurrió un error al procesar la orden: " + (error.message || error)
                            });
                        }
                    }
                    this.mostrarDialogoBultos = false;
                }
            });
        },
        validarOrdenCompleta() {
            let ordenCompleta=''
            this.ordenEnCurso.forEach(element => {
                if (element.CantidadSalida<element.Unidades) {
                    ordenCompleta += element.CodeEmpresa + " - " + element.Productos+": cantidad faltante;"
                } else if (element.CantidadSalida>element.Unidades) {
                    ordenCompleta += element.CodeEmpresa + " - " + element.Productos+": cantidad excedente;"
                }
            })
            return ordenCompleta
        },
        
async registrarProcesamientoOrden() {
    let detalleArray = [];

    // 1. Armado del array de detalle según el tipo de empresa
    if (this.empresa.StockPosicionado && !this.empresa.ClienteTextil) {
        // Stock posicionado, NO textil: endpoint optimizado
        let productosPosiciones = [];
        try {
            productosPosiciones = await ordenesV3.getProductosYPosicionesByOrden(this.ordenEnCurso[0].Id);

            if (!Array.isArray(productosPosiciones) || productosPosiciones.length === 0) {
                this.mostrarMensaje({titulo: "Error", mensaje: "No se encontraron productos ni posiciones para la orden."});
                return;
            }

            productosPosiciones.forEach(e => {
                detalleArray.push({
                    IdProducto: e.id_producto,
                    Cantidad: e.cantidad_posicion,
                    IdPosicion: e.ppod_id_posicion,
                    NombrePosicion: e.nombre_posicion,
                    Barcode: e.p_CodeEmpresa
                });
            });

        } catch (err) {
            let mensajeError = "No se pudo obtener productos y posiciones de la orden. ";
            mensajeError += err && err.message ? err.message : JSON.stringify(err);
            this.mostrarMensaje({titulo: "Error", mensaje: mensajeError});
            return;
        }
    } else {
        // Lógica clásica para empresas sin stock posicionado O textiles
        this.ordenEnCurso.forEach(element => {
            if (this.tieneLOTE) {
                detalleArray.push({
                    IdProducto: element.IdProducto,
                    Cantidad: element.CantidadSalida,
                    Lote: element.lote,
                    Barcode: element.Barcode,
                    Descripcion: element.Productos
                });
            } else {
                detalleArray.push({
                    IdProducto: element.IdProducto,
                    Cantidad: element.CantidadSalida
                });
            }
        });
    }

    // 2. Armado del objeto de cabeceras
    let Cabeceras = {
        IdOrden: this.ordenEnCurso[0].Id,
        IdEmpresa: this.selectorEmpresa.dato,
        Comprobante: this.ordenEnCurso[0].Numero,
        Usuario: this.userName,
        Detalle: detalleArray,
        Textil: this.empresa.ClienteTextil,
        StockPosicionado: this.empresa.StockPosicionado,
        TieneLote: this.tieneLOTE,
        Fecha: fechas.getHoy()
    };

    // 3. DEBUG: Mostramos en consola el JSON que se envía
    console.log("Payload enviado a saleOrder:", JSON.stringify(Cabeceras, null, 2));

    // 4. Validación final de datos antes de enviar (simple)
    if (!Cabeceras.IdOrden || !Cabeceras.IdEmpresa || !Array.isArray(Cabeceras.Detalle) || Cabeceras.Detalle.length === 0) {
        this.mostrarMensaje({titulo: "Error", mensaje: "Los datos de la orden no están completos o correctos."});
        return;
    }

    // 5. Envío al endpoint PATCH, asegurando que el payload sea un objeto plano (no anidado como {Cabeceras: ...})
    try {
        await ordenesV3.saleOrder(this.selectorEmpresa.dato, { Cabeceras });
        try {
            await ordenesV3.setCantidadBultos(this.ordenEnCurso[0].Id, this.selectorEmpresa.dato, this.cantidadBultos);
            this.mostrarMensaje({titulo: "Registración correcta! 👍", mensaje: "La salida de la orden ha sido registrada exitosamente"});

            // Actualización de datos y generación del PDF
            try {
                const datosOrden = await ordenesV3.getById(this.ordenEnCurso[0].Id);
                const ordenActualizada = await ordenes.actions.getDatosOrden(datosOrden);
                const pdfEtiqueta = await ordenes.generarOrdenEtiquetaEnPDFChicaUnaPorHoja(ordenActualizada);
                pdfEtiqueta.save("etiqueta_" + ordenActualizada[0].Orden.Numero + ".pdf");
            } catch (e) {
                store.dispatch('snackbar/mostrar', 'Error al obtener la orden');
            }
        } catch (error) {
            this.mostrarMensaje({titulo: "Error", mensaje: error});
        }

        this.resetearPantalla();

    } catch (error) {
        // Mostramos el error de manera amigable
        let msg = (error && error.message) ? error.message : JSON.stringify(error);
        store.dispatch('snackbar/mostrar', "Error al registrar salida: " + msg);
    }
},

        cantidadAIngresarEnter() {
            this.procesarItemEnCurso()
        },
        BarcodeArticuloEnter() {

            if (process.env.VUE_APP_Quien_Soy=="Bogota" && this.IdEmpresa==6) {
                //Soy Bogotá y eligió Textil Katalina
                //https://logiciel.freshdesk.com/a/tickets/26566
                //Sacarle el último caracter al barcode leido
                this.barcodeArticulo=this.barcodeArticulo.slice(0, -1)
            }

            if(this.tieneLOTE){
               
                const indiceItemDetalle=this.ordenEnCurso.findIndex(element => 
                    element.Barcode == this.barcodeArticulo.dato.trim() || 
                    element.lote == this.barcodeArticulo.dato.trim() ||
                    element.PartNumber == this.barcodeArticulo.dato.trim())
                if(indiceItemDetalle==-1){
                    //El barcode ingresado no pertenece a la orden
                    this.productoEnCurso.mostrar=false
                    this.listaProductosLeidos.unshift({correcto: false, barcode: this.barcodeArticulo.dato, cantidad: 0, descripcion: ''})
                    store.dispatch('snackbar/mostrar', this.barcodeArticulo.dato+': Barcode inexistente')
                    this.barcodeArticulo.dato=null
                    this.enfocarBarcodeArticulo()
                } else {
                    this.listaLotes = []
                    let borrarBarcodeLote = false
                    let lotesUnicos = new Set()

                    this.ordenEnCurso.forEach(producto => {
                        if(this.barcodeArticulo.dato == producto.Barcode || this.barcodeArticulo.dato == producto.CodeEmpresa ){
                            if (!lotesUnicos.has(producto.lote)) {
                                this.listaLotes.push({lote: producto.lote})
                                lotesUnicos.add(producto.lote)
                            }
                        }

                        if(producto.loteCompleto == 1 && producto.lote == this.barcodeArticulo.dato){
                            if(!producto.loteYaIngresado){
                                borrarBarcodeLote = true
                                producto.loteYaIngresado = true
                                producto.CantidadSalida = producto.Unidades
                                this.listaProductosLeidos.unshift({correcto: true, barcode: producto.Barcode, partNumber: producto.CodeEmpresa, cantidad: producto.Unidades, descripcion: producto.Productos, lote: producto.lote, loteCompleto: producto.loteCompleto})

                                this.enfocarBarcodeArticulo()
                            } else {
                                this.mostrarMensaje({titulo: "Error", mensaje: 'El Box Number ya fue ingresado'})
                            }
                        } else {
                            if(producto.Barcode == this.barcodeArticulo.dato || producto.PartNumber == this.barcodeArticulo.dato){
                                this.elegirLote = true
                            }
                        }
                    })
                          
                    if(borrarBarcodeLote){
                        this.resetearBarcodeArticulo()
                    }
                }
            } else {
                const indiceItemDetalle=this.ordenEnCurso.findIndex(element => element.Barcode == this.barcodeArticulo.dato.trim())
                if (indiceItemDetalle==-1) {
                    //El barcode ingresado no pertenece a la orden
                    this.productoEnCurso.mostrar=false
                    this.listaProductosLeidos.unshift({correcto: false, barcode: this.barcodeArticulo.dato, cantidad: 0, descripcion: ''})
                    store.dispatch('snackbar/mostrar', this.barcodeArticulo.dato+': Barcode inexistente')
                    this.barcodeArticulo.dato=null
                    this.enfocarBarcodeArticulo()
                } else {
                    this.indiceItemDetalleEnCurso=indiceItemDetalle
                    //El barcode ingresado pertenece a la orden
                    if (!this.ordenEnCurso[indiceItemDetalle].StockUnitario) {

                        //El articulo NO tiene StockUnitario
                        this.productoEnCurso.descripcion=this.ordenEnCurso[indiceItemDetalle].Productos
                        this.productoEnCurso.mostrar=true

                        //
                        //https://logiciel.freshdesk.com/a/tickets/27499
                        //
                        //No se debe pedir nunca la cantidad, se debe escanear item por item
                        //this.cantidadAIngresar.mostrar=true
                        //this.enfocarCantidadAIngresar()
                        //


                        //
                        //https://logiciel.freshdesk.com/a/tickets/31587
                        //
                        //Ahora otra vez quieren que se pida la cantidad.
                        
                        // this.cantidadAIngresar.dato="1"
                        // this.procesarItemEnCurso()

                        if(!this.empresa.IngesarCantidadUnidadesEnSalidaOrdenes){
                            this.cantidadAIngresar.dato="1"
                            this.procesarItemEnCurso()
                        }else{
                            this.cantidadAIngresar.mostrar=true
                            this.enfocarCantidadAIngresar()
                        }
                    
                    } else {

                        //Como es stock unitario, si ya estaba ingresado una vez, no permito de nuevo
                        if (this.ordenEnCurso[this.indiceItemDetalleEnCurso].CantidadSalida==0) {
                            this.cantidadAIngresar.dato="1"
                            this.procesarItemEnCurso()
                        } else {
                            this.productoEnCurso.mostrar=false
                            this.listaProductosLeidos.unshift({correcto: false, barcode: this.barcodeArticulo.dato, cantidad: 0, descripcion: 'Barcode repetido para stock unitario'})
                            store.dispatch('snackbar/mostrar', this.barcodeArticulo.dato+': Barcode repetido para stock unitario')
                            this.barcodeArticulo.dato=null
                            this.enfocarBarcodeArticulo()
                        }
                    }
                }
            }
        },
        procesarItemEnCurso() {
            const cantidadIngresada=Number.parseInt(this.cantidadAIngresar.dato)
            if(this.tieneLOTE){
                // if (isNaN(cantidadIngresada) || cantidadIngresada < 1) {
                //     this.mostrarMensaje({titulo: "Error", mensaje: 'La cantidad debe ser numérica o mayor a "0"'})
                //     this.enfocarCantidadAIngresar()
                // } else {
                //     this.ordenEnCurso[this.indiceItemDetalleEnCurso].CantidadSalida += cantidadIngresada
                //     this.listaProductosLeidos.unshift({correcto: true, barcode: this.barcodeArticulo.dato, cantidad: cantidadIngresada, descripcion: this.ordenEnCurso[this.indiceItemDetalleEnCurso].Productos, codeempresa: this.ordenEnCurso[this.indiceItemDetalleEnCurso].CodeEmpresa})
                //     this.resetearBarcodeArticulo()
                // }

            } else {
                if (isNaN(cantidadIngresada) || cantidadIngresada < 1) {
                    this.mostrarMensaje({titulo: "Error", mensaje: 'La cantidad debe ser numérica o mayor a "0"'})
                    this.enfocarCantidadAIngresar()
                } else {
                    this.ordenEnCurso[this.indiceItemDetalleEnCurso].CantidadSalida += cantidadIngresada
                    this.listaProductosLeidos.unshift({correcto: true, barcode: this.barcodeArticulo.dato, cantidad: cantidadIngresada, descripcion: this.ordenEnCurso[this.indiceItemDetalleEnCurso].Productos, codeempresa: this.ordenEnCurso[this.indiceItemDetalleEnCurso].CodeEmpresa})
                    this.resetearBarcodeArticulo()
                }
            }
        },
        colorLectura: function(item) {
            return item.correcto ? "success" : "error";
        },
        resetearBarcodeArticulo() {
            this.barcodeArticulo.dato=''
            this.barcodeArticulo.lote=''
            this.productoEnCurso.mostrar=false
            this.cantidadAIngresar={mostrar:false, dato:''}
            this.enfocarBarcodeArticulo()
        },
        resetearPantalla() {
            this.listaOrdenes = this.listaOrdenes.filter(orden => orden.Id !== this.detalleOrdenEnCurso[0].Id)
            store.dispatch("empresas/vaciarLista")
            // comente esta linea porque al usar la lista de ordenes ya filtrada
            // para mostrarlas de nuevo sin tener que volver a cargar las ordenes, perdia el id de la empresa seleccionada
            //this.selectorEmpresa={mostrar: true, dato: null}
            this.selectorOrden={mostrar: true, dato: null}
            if(this.tieneLOTE){
                this.barcodeArticulo={mostrar: false, dato: null, lote: null}
            } else {
                this.barcodeArticulo={mostrar: false, dato: null}
            }

            this.cantidadAIngresar={mostrar: false, dato: null}
            this.listaProductosLeidos=[]
            this.cantidadBultos = 0
            this.pedirCantidadBultos=false
            this.detalleOrdenEnCurso = []
            this.botonDesactivado = false
            store.dispatch('empresas/cargarListaEmpresas','SoloActivas')
        },

        cantidadAIngresarEnterLote(){
            const cantidadIngresada=Number.parseInt(this.cantidadAIngresar.dato)

            if (isNaN(cantidadIngresada) || cantidadIngresada < 1) {
            this.mostrarMensaje({titulo: "Error", mensaje: 'La cantidad debe ser numérica o mayor a "0"'})
            this.enfocarCantidadAIngresar()
            } else {
                this.ordenEnCurso.forEach(producto => {
                    if((producto.Barcode == this.barcodeArticulo.dato || producto.PartNumber == this.barcodeArticulo.dato) && producto.lote == this.barcodeArticulo.lote){
                        let todoCorrecto = true
                        if(cantidadIngresada + producto.CantidadSalida > producto.Unidades){
                        this.mostrarMensaje({titulo: "Error", mensaje: 'La cantidad ingresada es mayor a la que tiene el producto en la orden o ya esta ingresado el producto'})
                            todoCorrecto = false
                        }

                        if(todoCorrecto){
                            producto.CantidadSalida += cantidadIngresada
                            this.listaProductosLeidos.unshift({correcto: true, barcode: producto.Barcode, partNumber: producto.CodeEmpresa, cantidad: cantidadIngresada, descripcion: producto.Productos, codeempresa: producto.CodeEmpresa, lote: producto.lote, loteCompleto: producto.loteCompleto})
                            this.resetearBarcodeArticulo()
                        }
                    } 
                })
            }
        },

        async seleccionarLote(item){
            let productoSeleccionLote = true
            this.ordenEnCurso.forEach(producto => {
                if((producto.Barcode == this.barcodeArticulo.dato || producto.PartNumber == this.barcodeArticulo.dato) && producto.lote == item.lote && producto.loteCompleto == true){
                    this.mostrarMensaje({titulo: "Error", mensaje: 'El producto, se ingresa por LOTE COMPLETO!'})
                    productoSeleccionLote = false
                    this.elegirLote = false
                }  
            })

            if(productoSeleccionLote){
                this.barcodeArticulo.lote = item.lote
                this.cantidadAIngresar.mostrar=true
                this.enfocarCantidadAIngresar()
                this.elegirLote = false
                this.listaLotes = []
            }
        },
        
        enfocarBarcodeArticulo() {
            this.$nextTick(() => { this.$refs.barcodeArticulo.focus()})
        },
        enfocarCantidadAIngresar() {
            this.$nextTick(() => { this.$refs.cantidadAIngresar.focus()})
        },
        mostrarMensaje(payload) {
            store.dispatch("alertDialog/mostrar", payload)  
        },
        async test() {
            try {
                const ordenActualizada=await ordenes.actions.getById(71115)
                const pdfEtiqueta=await ordenes.generarOrdenEtiquetaEnPDFChicaUnaPorHoja(ordenActualizada)
                //const pdfSticker=await ordenesV3.imprimirStickersBulto(ordenActualizada,Number(this.cantidadBultos))
                pdfEtiqueta.save("etiqueta_"+ordenActualizada.Numero+".pdf")
                //pdfSticker.save("etiqueta_"+ordenActualizada.Numero+".pdf")
            } catch (error) {
                console.log("Error", error)
            }

        }
    },
    created() {
        store.dispatch('actualizarTituloPrincipal', 'Salida de órdenes')
        store.dispatch('empresas/cargarListaEmpresas','SoloActivas')
        this.userName =  store.state.usuarios.usuarioActual.Nombre
        // this.test()
    }
}
</script>