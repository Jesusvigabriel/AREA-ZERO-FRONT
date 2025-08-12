<template>
    <v-container class="pt-0">

        <v-row>
            <v-col> <SelectorEmpresa @eligioEmpresa="eligioEmpresa($event)"> </SelectorEmpresa> </v-col>
            <v-col><v-text-field prepend-inner-icon="mdi-calendar"  type="date" label="Desde" v-model="fechaDesde" dense></v-text-field></v-col>
            <v-col><v-text-field prepend-inner-icon="mdi-calendar"  type="date" label="Hasta" v-model="fechaHasta" dense></v-text-field></v-col>
            <v-col><v-btn color="green" @click="clickProcesar" block dark>Procesar</v-btn></v-col>
        </v-row>

        <v-row class="py-0">
            <v-col class="pb-0">
                <v-alert class="mb-0" color="blue" align="center" dark><h3>Informe de ingresos</h3></v-alert>
            </v-col>
            <v-col cols="3">
                <v-row><v-col><v-btn color="success" block @click="excelCompleto()">Descargar Excel <v-icon>mdi-microsoft-excel</v-icon></v-btn></v-col></v-row>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="py-0" v-if="inDiario.length>0">
                <v-data-table 
                    :headers="cabecerasInDiario" 
                    :items="inDiario"  
                    :footer-props="{itemsPerPageOptions:[5,30,-1]}"   
                    :items-per-page="-1" 
                    class="elevation-3" 
                >
                    <template v-slot:item.acciones="{item}">
                        <v-chip dark color="blue" @click="verDetalleMovimiento(item)"><v-icon>mdi-magnify</v-icon></v-chip>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>

    </v-container>
</template>


<script>

import store from '../../store'
import SelectorEmpresa from '../../components/SelectorEmpresa.vue'
import empresas from '../../store/empresasV3'
import fechas from 'vue-lsi-util/fechas'
import cadenas from 'vue-lsi-util/cadenas'

import excel from "exceljs"
import {saveAs} from "file-saver"
import {nanoid} from 'nanoid'

export default {
    name: "Estadisticas",

    components: {
        SelectorEmpresa
    },
    data() {
        return {
            itemAExportarAExcel: null,
            movimientosAExportarAExcel: null,
            idEmpresa: -1,
            configuracionEmpresa: {},
            hashExcel: '',
            datosEmpresa: {},
            fechaDesde: '',
            fechaHasta: '',
            infoPrevia: {},
            almacenajeDiario: [],
            importeTotalDiario: 0,
            importeTotalIn: 0,
            importeSeguro: 0,
            importePrepago: 0,
            inDiario: [],
            cabecerasAlmacenajeDiario: [],
            cabecerasInDiario: [
                {text: 'Fecha', value: 'fecha'},
                {text: 'Orden', value: 'orden'},
                {text: 'Empresa', value: 'nombreEmpresa'},
                {text: 'Unidades', align: 'end', value: 'totalUnidades'},
                {text: 'Kilos', align: 'end', value: 'totalKilos'},
                {text: 'M3', align: 'end', value: 'totalM3'},
            ],
            ventanaVisible: 1,
            nombreEmpresa:""
        }
    },

    methods: {

        async excelCompleto() {

            const workbook=new excel.Workbook()

            const worksheet=workbook.addWorksheet("Ingresos")

            worksheet.getRow(1).values=[`Ingresos - Período: ${this.fechaDesde} al ${this.fechaHasta}`]

            worksheet.columns=[
                {width: 15}, 
                {width: 50},
                {width: 50},
                {width: 15},
                {width: 15},
                {width: 15},
            ]
            worksheet.getRow(3).values=['Fecha', 'Orden', 'Empresa', 'Unidades', 'Kilos', 'M3']
            
            worksheet.views = [{state: 'frozen', ySplit: 5}]
            worksheet.autoFilter = 'A3:C3'

            let renglon=3

            this.inDiario.forEach(e => {
                renglon++
                worksheet.getRow(renglon).values=[
                    e.fecha,
                    e.orden,
                    e.nombreEmpresa,
                    e.totalUnidades,
                    e.totalKilos,
                    e.totalM3
                ]
            })

            renglon++
            const columnasASumar=["D", "E", "F"]
            for (const unaColumna of columnasASumar) {
                const celdaSuma=worksheet.getCell(`${unaColumna}${renglon}`)
                celdaSuma.value={formula: `SUM(${unaColumna}1:${unaColumna}${renglon-1})`}
                celdaSuma.font={bold: true}
            }

            worksheet.eachRow ( (row, rowNumber) => {
                row.eachCell ( (cell, colNumber) => {
                    if (rowNumber===1 || rowNumber==renglon) {
                        cell.font={size: 16, bold: true}
                    } else if (rowNumber===3) {
                        cell.font={size: 14, bold: true}
                    } else {
                        cell.font={size: 14}
                    }
                })
            } )

            const buf=await workbook.xlsx.writeBuffer()

            if (this.idEmpresa == -1) {
                saveAs(new Blob([buf]), `Ingresos_desde_${this.fechaDesde}-al-${this.fechaHasta}.xlsx`)
            } else {
                saveAs(new Blob([buf]), `Ingresos_${this.nombreEmpresa}_desde_${this.fechaDesde}-al-${this.fechaHasta}.xlsx`)
            }

            

        },

        estoyEnFuente() {
            return process.env.NODE_ENV=="development"
        },
        async clickProcesar() {
            this.inDiario=[]
            let detalleIn=[]
            if (this.idEmpresa == -1) {
                detalleIn = await empresas.getInPeriodo(this.fechaDesde, this.fechaHasta,  "Obteniendo In...")
            } else {
                detalleIn = await empresas.getInPeriodoEmpresa(this.idEmpresa,this.fechaDesde, this.fechaHasta, "Obteniendo In...")
            }
            if(detalleIn.length>1){
                detalleIn.forEach(e =>{e.fecha=e.fecha.substr(0,10)  
                    this.nombreEmpresa = e.nombreEmpresa} )
            }
            
            console.log("DetalleIn", detalleIn)
            this.inDiario=detalleIn
        },

        setearFechaInicialDesde() {
            const fechaHoy = new Date()
            const anioHoy=fechaHoy.getFullYear()
            let mesHoy=fechaHoy.getMonth()+1
            mesHoy--
            if (mesHoy===0) {
                mesHoy=12
                anioHoy--
            }
            const diaHoy=1

            const devolver=anioHoy+"-"+(mesHoy<10 ? "0" : "")+mesHoy+"-"+(diaHoy<10 ? "0" : "")+diaHoy

            this.fechaDesde=devolver   
            
            if (process.env.NODE_ENV==="development") {
                this.fechaDesde="2022-10-01"
            }

        },
        setearFechaInicialHasta() {
            this.fechaHasta=fechas.getHoy()

            if (process.env.NODE_ENV==="development") {
                this.fechaHasta="2022-10-31"
            }
        },

        mostrarError(payload) {
            store.dispatch("snackbar/mostrar", payload)
        },
        mostrarLoading(texto) {
            store.dispatch("loading/mostrar", texto)
        },
        ocultarLoading() {
            store.dispatch("loading/ocultar")
        },

        eligioEmpresa(idEmpresaElegida) {
            this.idEmpresa = idEmpresaElegida
            console.log ("Empresa id:",Number(this.idEmpresa))
        },
    },

    created() {
        store.dispatch('actualizarTituloPrincipal', 'Informe de ingresos')
        store.dispatch('empresas/cargarListaEmpresas','SoloActivas')
        this.setearFechaInicialDesde()
        this.setearFechaInicialHasta()
 
         if (store.state.usuarios.usuarioActual.IdEmpresa > 0) {
             this.idEmpresa = store.state.usuarios.usuarioActual.IdEmpresa
             this.eligioEmpresa(store.state.usuarios.usuarioActual.IdEmpresa)
         }
    },
}   
 
</script>