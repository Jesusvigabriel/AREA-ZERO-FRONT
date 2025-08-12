<template>
    <v-container class="pt-0">
        <v-row>
            <v-col><SelectorEmpresa @eligioEmpresa="eligioEmpresa($event)" class="pt-2" ></SelectorEmpresa></v-col>
            <v-col><v-text-field prepend-inner-icon="mdi-calendar"  type="date" label="Desde" v-model="fechaDesde" dense></v-text-field></v-col>
            <v-col><v-text-field prepend-inner-icon="mdi-calendar"  type="date" label="Hasta" v-model="fechaHasta" dense></v-text-field></v-col>
            <v-col><v-btn color="green" @click="clickProcesar" block dark>Procesar</v-btn></v-col>
        </v-row>

        <v-row>
            <v-col class="pb-0" v-if="infoPrevia.Piezas != null">
                <v-row>
                    <v-col class="pb-0">
                        <v-alert class="mb-0" color="info" align="center" dark>Piezas previas</v-alert>
                    </v-col>
                    <v-col class="pb-0">
                        <v-alert class="mb-0" color="info" align="end" dark><b>{{infoPrevia.Piezas}}</b></v-alert>
                    </v-col>
                </v-row>
            </v-col>
            <v-col class="pb-0" v-if="infoPrevia.Peso != null">
                <v-row>
                    <v-col class="pb-0">
                        <v-alert class="mb-0" color="info" align="center" dark>Peso previo</v-alert>
                    </v-col>
                    <v-col class="pb-0">
                        <v-alert class="mb-0" color="info" align="end" dark><b>{{infoPrevia.Peso}}</b></v-alert>
                    </v-col>
                </v-row>
            </v-col>
            <v-col class="pb-0" v-if="infoPrevia.Metros != null">
                <v-row>
                    <v-col class="pb-0">
                        <v-alert class="mb-0" color="info" align="center" dark>Metros previos</v-alert>
                    </v-col>
                    <v-col class="pb-0">
                        <v-alert class="mb-0" color="info" align="end" dark><b>{{infoPrevia.Metros}}</b></v-alert>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-row>
            <v-col class="py-0" v-if="piezasDiarias.length>0">
                <v-data-table 
                    :headers="cabecerasPiezas" 
                    :items="piezasDiarias"  
                    :footer-props="{itemsPerPageOptions:[5,30,-1]}"   
                    :items-per-page="-1" 
                    class="elevation-3" 
                />
            </v-col>
            <v-col class="py-0"  v-if="pesoDiario.length>0">
                <v-data-table 
                    :headers="cabecerasPeso" 
                    :items="pesoDiario" 
                    :footer-props="{itemsPerPageOptions:[5,30,-1]}"   
                    :items-per-page="-1" 
                    class="elevation-3" 
                />
            </v-col>
            <v-col class="py-0"  v-if="metrosDiarios.length>0">
                <v-data-table 
                    :headers="cabecerasMetros" 
                    :items="metrosDiarios" 
                    :footer-props="{itemsPerPageOptions:[5,30,-1]}"   
                    :items-per-page="-1" 
                    class="elevation-3" 
                />
            </v-col>
        </v-row>

    </v-container>
</template>


<script>

import store from '../store'
import SelectorEmpresa from '../components/SelectorEmpresa.vue'
import empresas from '../store/empresas'

export default {
    name: "Estadisticas",

    components: {
        SelectorEmpresa
    },

    data() {
        return {
            IdEmpresa: -1,
            fechaDesde: '',
            fechaHasta: '',
            infoPrevia: {},
            metrosDiarios: [],
            pesoDiario: [],
            piezasDiarias: [],
            cabecerasPiezas: [
                    {text: 'Fecha', align: 'start', value: 'Fecha', sortable: false},
                    {text: 'Cantidad', align: 'end', value: 'Valor', sortable: false},
                    {text: 'Acumulado', align: 'end', value: 'Acumulado', sortable: false},
                ],
            cabecerasPeso: [
                {text: 'Fecha', align: 'start', value: 'Fecha', sortable: false},
                {text: 'Peso', align: 'end', value: 'Valor', sortable: false},
                {text: 'Acumulado', align: 'end', value: 'Acumulado', sortable: false},
            ],
            cabecerasMetros: [
                {text: 'Fecha', align: 'start', value: 'Fecha', sortable: false},
                {text: 'Metros', align: 'end', value: 'Valor', sortable: false},
                {text: 'Acumulado', align: 'end', value: 'Acumulado', sortable: false},
            ],
        }
    },

    methods: {
        clickProcesar() {
            if (this.IdEmpresa>0) {
                empresas.actions.getEstadisticas(
                    this.IdEmpresa, 
                    this.fechaDesde.replaceAll("-", ""),
                    this.fechaHasta.replaceAll("-", "")
                )
                .then(respuesta => {
                    this.infoPrevia={
                        Piezas: respuesta.PiezasTotalesPrevias,
                        Peso: respuesta.PesoTotalPrevio,
                        Metros: respuesta.MetrosTotalesPrevios,
                    }
                    this.piezasDiarias=respuesta.PiezasDiarias
                    this.pesoDiario=respuesta.PesoDiario
                    this.metrosDiarios=respuesta.MetrosDiarios

                    
                    let acumulado=this.infoPrevia.Piezas
                    this.piezasDiarias.forEach(unaPieza => {
                        acumulado += unaPieza.Valor
                        unaPieza.Acumulado=acumulado.toFixed(0)
                    })

                    acumulado=this.infoPrevia.Peso
                    this.pesoDiario.forEach(unaPeso => {
                        acumulado += unaPeso.Valor
                        unaPeso.Acumulado=acumulado.toFixed(2)
                    })

                    acumulado=this.infoPrevia.Metros
                    this.metrosDiarios.forEach(unMetro => {
                        acumulado += unMetro.Valor
                        unMetro.Acumulado=acumulado.toFixed(2)
                    })

                })
                .catch(puteada => {
                    this.mostrarError(puteada)

                })
            } else {
                this.mostrarError("Debe seleccionar empresa")
            }
        },

        eligioEmpresa(IdEmpresaElegida) {
            this.IdEmpresa=IdEmpresaElegida;
        },

        setearFechaInicialDesde() {
            const fechaHoy = new Date()
            const anioHoy=fechaHoy.getFullYear()
            const mesHoy=fechaHoy.getMonth()+1
            const diaHoy=1

            const devolver=anioHoy+"-"+(mesHoy<10 ? "0" : "")+mesHoy+"-"+(diaHoy<10 ? "0" : "")+diaHoy

            this.fechaDesde=devolver    
        },
        setearFechaInicialHasta() {
            const fechaHoy = new Date()
            const anioHoy=fechaHoy.getFullYear()
            const mesHoy=fechaHoy.getMonth()+1
            const diaHoy=fechaHoy.getDate()

            const devolver=anioHoy+"-"+(mesHoy<10 ? "0" : "")+mesHoy+"-"+(diaHoy<10 ? "0" : "")+diaHoy

            this.fechaHasta=devolver    
        },

        mostrarError(payload) {
            store.dispatch("snackbar/mostrar", payload)
        }

    },

    created() {
        store.dispatch('empresas/cargarListaEmpresas','SoloActivas')
        this.setearFechaInicialDesde()
        this.setearFechaInicialHasta()
    }
}
</script>