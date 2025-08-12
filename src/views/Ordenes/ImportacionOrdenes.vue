<template>
    <v-container>
        <v-row>
            <v-col>
                <SelectorEmpresa @eligioEmpresa="eligioEmpresa($event)" :idEmpresaInicialmenteSeleccionada="idEmpresa" ></SelectorEmpresa>
            </v-col>
        </v-row>
        <v-row v-if="idEmpresa != null">
            <v-col>
                <v-file-input 
                    label="Planilla a procesar" 
                    @change="fileOnChange" 
                    accept=".xlsx"
                    filled
                    prepend-icon="mdi-microsoft-excel"
                >Importar planilla excel</v-file-input>
            </v-col>
        </v-row>
        <v-row v-if="idEmpresa != null" >
            <v-col >
                <v-btn color="blue v-btn--block" dark @click="descargarExcelEjemplo()">Descargar excel de ejemplo<v-icon>mdi-microsoft-excel</v-icon></v-btn>
            </v-col>
        </v-row>
        <v-row v-for="(item, index) in mensajes" :key="index" class="py-0">
            <v-col class="py-0">
                <v-alert :color="item.color ?  item.color : 'success'" class="py-0 my-1">{{item.texto}}</v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import {xlsx, read, utils} from 'xlsx'
import excel from "exceljs"
import {saveAs} from "file-saver"
import SelectorEmpresa from '@/components/SelectorEmpresa.vue'
import store from '@/store'
import productos from '@/store/productosV3'
// import ordenes from '../store/ordenes'
import ordenes from '@/store/ordenesV3'
import empresa from '@/store/empresasV3.js'
import fechas from 'vue-lsi-util/fechas'
import movimientosStockV3 from '@/store/movimientosStockV3'

export default {
    name: "ImportacionOrdenes",

    data() {
        return {
            mensajes: [],
            idEmpresa: null,
            idOrdenesCreadas: [],
            listaBarcode: [],
            usuario: 0,
            textil:null,
            fecha: [],
            tienePART: false,
            empresa: {},
        }
    },

    methods: {
        procesarPlanilla(planilla) {
            this.mensajes.push({texto: "Procesando planilla ..."})

            //Obtengo los comprobantes distintos
            let comprobantes=[]
            planilla.forEach(element => {
                if (!comprobantes.includes(element.Comprobante)) {
                    comprobantes.push(element.Comprobante)
                }
            });
            this.procesarTodosLosComprobantes(planilla, comprobantes)
        },
        async  descargarExcelEjemplo(){
            const workbook=new excel.Workbook()
            const worksheet=workbook.addWorksheet("Pedidos")
            let cabeceras = []
            let renglon=1
            ['']
            worksheet.views = [{state: 'frozen', ySplit: 1}]
            console.log(this.tienePART)
            if(this.tienePART){
                cabeceras=[
                {header: 'Fecha', width: 11}, 
                {header: 'Comprobante', width: 20}, 
                {header: 'Cliente', width: 30}, 
                {header: 'Partida', width: 20}, 
                {header: 'Barcode Producto', width: 20}, 
                {header: 'Cantidad', width: 15}, 
                {header: 'Importe', width: 30}, 
                {header: 'Depósito origen', width: 30}, 
                {header: 'Empresa', width: 10}, 
                {header: 'Codigo Postal', width: 15}, 
                {header: 'Domicilio', width: 30}, 
                {header: 'Nota del cliente', width: 20}, 
                {header: 'Método de envío', width: 20}, 
                {header: 'Orden de retiro OCA', width: 20}, 
                {header: 'Observaciones', width: 30}, 
                {header: 'Email Destinatario', width: 20}, 
                {header: 'PreOrden', width: 10}, 
            ]
            }else{
                cabeceras=[
                    {header: 'Fecha', width: 11}, 
                    {header: 'Comprobante', width: 20}, 
                    {header: 'Cliente', width: 30}, 
                    {header: 'Producto', width: 20}, 
                    {header: 'Cantidad', width: 15}, 
                    {header: 'Importe', width: 30}, 
                    {header: 'Depósito origen', width: 30}, 
                    {header: 'Empresa', width: 10}, 
                    {header: 'Barcode Producto', width: 20}, 
                    {header: 'Codigo Postal', width: 15}, 
                    {header: 'Domicilio', width: 30}, 
                    {header: 'Nota del cliente', width: 20}, 
                    {header: 'Método de envío', width: 20}, 
                    {header: 'Orden de retiro OCA', width: 20}, 
                    {header: 'Observaciones', width: 30}, 
                    {header: 'Email Destinatario', width: 20}, 
                    {header: 'PreOrden', width: 10}, 
                ]
            }

            worksheet.columns=[...cabeceras]
            renglon++
                                

            worksheet.eachRow ( (row, rowNumber) => {
            row.eachCell ( (cell, colNumber) => {
                if (rowNumber==1) {
                    cell.font={size: 12, bold: true}
                } else {
                    if (rowNumber==renglon) {
                        cell.font={size: 12, bold: false}
                    } else {
                        cell.font={size: 10}
                    }
                }
                })
            } )

            const buf=await workbook.xlsx.writeBuffer()
            saveAs(new Blob([buf]), `Creacion_Ordenes_gestion.xlsx`)
        },

        async procesarTodosLosComprobantes(planilla, comprobantes) {
            
            for (const element of comprobantes) {
                // console.log("Empiezo con ", element)
                let productoFallido=false
                this.mensajes.push({texto: "Procesando comprobante "+element+"..."})

                const items=planilla.filter(unItem => unItem.Comprobante == element)
                let totalUnOrden=0
                let detalleDeLaOrden=[]
                let promises = [] 
                let codes =[]
                let repetidos=0
                let tipoError=[]

                //comprueba que no halla codigos de barra duplicados
                items.forEach(item =>{
                    for(const codigo of items){
                        if(item['Barcode Producto'].toString().trim() == codigo['Barcode Producto'].toString().trim()){
                            repetidos = repetidos + 1
                            if(repetidos == 2){
                                tipoError.push("barcode duplicado")
                                productoFallido = true
                                codes.push({codeEmpresa: item.Producto.toString(), barcode: item["Barcode Producto"]})
                            }
                        }
                    }
                    repetidos= 0
                })
                if(!this.tienePART){
                    if(this.idEmpresa==268){
                        //comparador de codeempresa y barcode
                        for(const unItem of items){
                            const promise = productos.getByBarcodeAndEmpresa(unItem["Barcode Producto"].toString().trim(), this.idEmpresa)
                            .then(response =>{
                                console.log(response)
                                if(response.Nombre.toString().trim() == unItem.Producto.toString().trim()){
                                    detalleDeLaOrden.push({cantidad: unItem.Cantidad, importe: unItem.Importe, barcode: unItem["Barcode Producto"]})
                                    if(this.textil){
                                        totalUnOrden = parseInt(totalUnOrden) + parseInt(unItem.Cantidad)
                                    }
                                    this.listaBarcode.push(unItem["Barcode Producto"])
                                }else{
                                    productoFallido=true
                                    codes.push({Nombre: unItem.Producto.toString(), barcode: unItem["Barcode Producto"]})
                                }
                            })
                            .catch(error =>{
                                console.log(error)
                                productoFallido=true
                                this.mensajes.push({texto: unItem["Barcode Producto"] + " " + error, color: "red"})
                            })
                            promises.push(promise) // Agregar la promesa al array
                        }
                    }else{
                        //comparador de codeempresa y barcode
                        for(const unItem of items){
                            const promise = productos.getByBarcodeAndEmpresa(unItem["Barcode Producto"].toString().trim(), this.idEmpresa)
                            .then(response =>{
                                if(response.CodeEmpresa.toString().trim() == unItem.Producto.toString().trim()){
                                    detalleDeLaOrden.push({cantidad: unItem.Cantidad, importe: unItem.Importe, barcode: unItem["Barcode Producto"]})
                                    if(this.textil){
                                        totalUnOrden = parseInt(totalUnOrden) + parseInt(unItem.Cantidad)
                                    }
                                    this.listaBarcode.push(unItem["Barcode Producto"])
                                }else{
                                    productoFallido=true
                                    codes.push({codeEmpresa: unItem.Producto.toString(), barcode: unItem["Barcode Producto"]})
                                }
                            })
                            .catch(error =>{
                                console.log(error)
                                productoFallido=true
                                this.mensajes.push({texto: unItem["Barcode Producto"] + " " + error, color: "red"})
                            })
                            promises.push(promise) // Agregar la promesa al array
                        }
                    }
                }else{
                    for(const unItem of items){
                        const promise = productos.getProductoByPartidaAndEmpresaAndBarcode(this.idEmpresa,unItem["Partida"].toString().trim(), unItem["Barcode Producto"].toString().trim())
                        .then(response =>{
                            console.log(response)
                            detalleDeLaOrden.push({cantidad: unItem.Cantidad, importe: unItem.Importe, partida: unItem["Partida"]})
                        })
                    }
                }

                // Esperar a que todas las promesas se resuelvan
                await Promise.all(promises)

                //revisa si fallo algun producto
                if(productoFallido == false){
                    let FechaFormateada=new Date(items[0].Fecha)
                    FechaFormateada=""+FechaFormateada.getFullYear()+ String(FechaFormateada.getMonth()+1).padStart(2, '0')+String(FechaFormateada.getDate()).padStart(2, '0')

                    const payload={
                        comprobante: items[0].Comprobante,
                        idEmpresa: this.idEmpresa,
                        fecha: FechaFormateada,
                        cliente: items[0].Cliente, 
                        codigoPostal: items[0]["Codigo Postal"].toString().trim(), 
                        domicilio: items[0].Domicilio, 
                        observaciones: items[0].Observaciones,
                        detalle: detalleDeLaOrden,
                        emailDestinatario: items[0]["Email Destinatario"], 
                        preOrden: items[0].PreOrden,
                        usuario: this.usuario
                    }
                    if(this.tienePART){
                        payload.tienePART = true
                    }
                    const totalNuevo = parseInt(this.unidadesTotalesEnBase) + parseInt(totalUnOrden)
                    //registra la orden
                    if(!this.textil){
                        await ordenes.registrarAltaMasiva(payload)
                        .then(response => {
                            this.idOrdenesCreadas.push(response.Id)
                            this.mensajes.push({texto: `Orden ${response.Id} sobre el comprobante ${response.Numero} creada exitosamente`})
                            //Chequeo que no se hayan duplicado movimientos en la tabla de movimientos, si es asi, los elimino.
                            movimientosStockV3.validaMovimientoStock(payload.comprobante, payload.idEmpresa,String(this.listaBarcode))
                            this.listaBarcode=[]
                        })
                        .catch(error => {
                            console.log(error);
                            this.mensajes.push({texto: error[0], color: "red"})
                        })
                    }
                    else{
                        if(totalNuevo < 401){
                            await ordenes.registrarAltaMasiva(payload)
                            .then(response => {
                                this.idOrdenesCreadas.push(response.Id)
                                this.mensajes.push({texto: `Orden ${response.Id} sobre el comprobante ${response.Numero} creada exitosamente`})
                                //Chequeo que no se hayan duplicado movimientos en la tabla de movimientos, si es asi, los elimino.
                                movimientosStockV3.validaMovimientoStock(payload.comprobante, payload.idEmpresa,String(this.listaBarcode))
                                this.listaBarcode=[]
                                ordenes.contadorBultosDia(this.idEmpresa,this.fecha)
                                .then(response => {
                                    this.unidadesTotalesEnBase = response
                                })
                            })
                            .catch(error => {
                                console.log(error);
                                this.mensajes.push({texto: error[0], color: "red"})
                            })
                        }
                        else{
                            const error = "No se creo la orden " + items[0].Comprobante + " porque supera el maximo de 400 unidades diarias"
                            this.mensajes.push({texto: error, color: "red"})
                        }
                    }
                }else{
                    console.log(tipoError[0])
                    if(tipoError[0] == "barcode duplicado"){
                        for(const code of codes){
                            const error="El Barcode " + code.barcode + " esta duplicado "
                            this.mensajes.push({texto: error, color: "red"})
                        }
                    }else{
                        for(const code of codes){
                            const error="El codeEmpresa " + code.codeEmpresa + " no corresponde al producto " + code.barcode
                            this.mensajes.push({texto: error, color: "red"})
                        }
                    }
                }
            }
        },
        verificarColumnasExcel(planilla) {
            let columnasObligatorias=[]
            if(!this.tienePART){
                columnasObligatorias=['Fecha', 'Comprobante', 'Producto', 'Cliente', 'Cantidad', 'Importe', 'Empresa', 'Barcode Producto', 'Codigo Postal', 'Domicilio', 'Observaciones', 'Email Destinatario', 'PreOrden']
            }else{
                columnasObligatorias=['Fecha', 'Comprobante', 'Partida', 'Cliente', 'Cantidad', 'Importe', 'Empresa', 'Barcode Producto', 'Codigo Postal', 'Domicilio', 'Observaciones', 'Email Destinatario', 'PreOrden']
            }
            this.mensajes.push({texto: "Verificando columnas ..."})
            let columnasFaltantes=[]
            let filaActual=1
            let tituloMostrado=false
            planilla.forEach(unaFila => {
                filaActual++
                columnasObligatorias.forEach(unaColumnaObligatoria => {
                    if (!Object.keys(unaFila).includes(unaColumnaObligatoria)) {
                        if (!columnasFaltantes.includes(unaColumnaObligatoria)) {
                            if (!tituloMostrado) {
                                this.mensajes.push({texto: "Faltan las siguientes columnas:", color:"red"})
                                tituloMostrado=true
                            }
                            this.mensajes.push({texto: "Fila: "+filaActual+" - Columna: "+unaColumnaObligatoria, color:"yellow"})
                        }
                    }
                })
            })
            if (tituloMostrado) {
                this.mensajes.push({texto: "La planilla no puede ser procesada", color: "red"})
            } else {
                this.mensajes.push({texto: "La planilla tiene las columnas correctas"})
                this.procesarPlanilla(planilla)
            }
        },
        fileOnChange(archivoLeido) {
            if (archivoLeido!=null) {
                this.mensajes.push({texto: "Leyendo archivo ..."})
                const lector=new FileReader()
                lector.onload = ev => {
                    const datosCrudos = ev.target.result;
                    const planillaCruda = read(datosCrudos, {type: "binary", cellDates: true, cellNF: true, cellText:true})
                    const nombreHoja1=planillaCruda.SheetNames[0]
                    const datosPlanilla= utils.sheet_to_json(planillaCruda.Sheets[nombreHoja1])
                    this.verificarColumnasExcel(datosPlanilla)
                }
    
                lector.readAsBinaryString(archivoLeido)            
            } else {
                this.mensajes=[]
            }
        },

        eligioEmpresa(idEmpresaElegida) {
            this.idEmpresa=idEmpresaElegida
            empresa.getOne(idEmpresaElegida)
            .then(response => {
                this.empresa = response
                if (response.ClienteTextil){
                    this.textil = true
                }
                else {
                    this.textil = false
                    this.CantidadAIngresar=0
                }
                if(response.PART){
                    this.tienePART=true
                }else{
                    this.tienePART=false
                }
                if(this.textil == true){
                    ordenes.contadorBultosDia(idEmpresaElegida,this.fecha)
                    .then(response => {
                        this.unidadesTotalesEnBase = response
                    })
                }
            })
            
        },
        mostrarError(mensaje) {
            store.dispatch("snackbar/mostrar", mensaje)
        }
    },

    components: {
        SelectorEmpresa
    },

    created() {
        store.dispatch('actualizarTituloPrincipal', 'Importación de órdenes')

        /*
        https://logiciel.freshdesk.com/a/tickets/30620
        */
        // store.dispatch('empresas/cargarListaEmpresas', "SoloStockPosicionado")
        store.dispatch('empresas/cargarListaEmpresas')
        this.fecha=fechas.getHoy()

        if (store.state.usuarios.usuarioActual.IdEmpresa>0) {
            this.idEmpresa=store.state.usuarios.usuarioActual.IdEmpresa
            this.eligioEmpresa(store.state.usuarios.usuarioActual.IdEmpresa)
        }
        this.usuario = store.state.usuarios.usuarioActual.Nombre
    }

}
</script>