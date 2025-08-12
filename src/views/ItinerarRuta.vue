<template>
    <v-container>
        <v-row class="my-0 py-0">
            <v-col class="my-0 py-0">
                <v-alert color="info" dark>Itinerar ruta</v-alert>
            </v-col>
        </v-row>
        <v-row class="my-0 py-0">
            <v-col class="my-0 py-0" cols="4">
                <v-alert color="success" dark>Chofer: {{numeroChofer}} - {{choferActual.Nombre}}</v-alert>
            </v-col>
            <v-col class="my-0 py-0" align="center">
                <v-alert color="success" dark>Fecha: <b>{{fecha}}</b></v-alert>
            </v-col>
            <v-col class="my-0 py-0" align="center">
                <v-alert color="success" dark>Entregas: <b>{{entregas.length}}</b></v-alert>
            </v-col>
        </v-row>

        <v-row>
            <v-col class="py-0" cols="4" v-if="entregaSeleccionada.length>0" >
                <v-btn @click="clickDescargarExcel" color="info" block>Descargar Excel <v-icon>mdi-microsoft-excel</v-icon></v-btn>
            </v-col>
            <v-col class="py-0" cols="4" v-if="excelR4MeDescargado" >
                <v-btn @click="clickAbrirRoute4Me" color="info" block>Abrir Route4Me <v-icon>mdi-map-marker-path</v-icon></v-btn>
            </v-col>
            <v-col class="py-0" cols="4" v-if="excelR4MeDescargado">
                <v-file-input 
                    label="Archivo itinerado" 
                    @change="fileOnChange" 
                    accept=".csv"
                    filled
                    prepend-icon="mdi-auto-upload">
                Importar itineradas
                </v-file-input>

            </v-col>
        </v-row>

        <v-row class="pb-0 mb-0" v-if="entregasItineradas.length>0">
            <v-col class="py-0 my-0">  
                <v-alert class="mb-1" color="info" dark>Entregas itineradas</v-alert>
                <table class="mt-0 table table-striped">
                    <thead style="background-color: #2296f3; color: white;">
                        <th></th>
                        <th></th>
                        <th class="py-2 px-2">Cliente</th>
                        <th class="py-2 px-2">Destino</th>
                        <th class="py-2 px-2">Domicilio</th>
                        <th class="py-2 px-2">Localidad</th>
                        <th class="py-2 px-2">Observaciones</th>
                    </thead>
                    <draggable @change="cambiosEnOrdenDeItinerancia" v-model="entregasItineradas" v-bind="dragOptions" tag="tbody">
                        <tr color="green" v-for="(item, index) in entregasItineradas" :key="index">
                            <td><v-icon>mdi-drag-vertical</v-icon></td>
                            <td>{{item.OrdenEntrega}}</td>
                            <td>{{item.NombreCliente}}</td>
                            <td>{{item.NombreDestino}}</td>
                            <td>{{item.Domicilio}}</td>
                            <td>{{item.Localidad}}</td>
                            <td>{{item.Observaciones}}</td>
                        </tr>
                    </draggable>
                </table>
            </v-col>
        </v-row>


        <v-row v-if="entregasItineradas.length>0">
            <v-col>
                <v-btn class="py-5 mt-0 mb-3" @click="aplicarItinerancia" block color="success">Aplicar itinerancia</v-btn>
            </v-col>
        </v-row>

        <v-row class="pb-0 mb-0"  v-if="entregas.length>0">
            <v-col class="py-0 my-0"  >  
                <v-card>
                    <v-card-title class="py-1 my-0">
                        Entregas sin itinerar
                    </v-card-title>
                    <v-card-title class="py-1 my-0">
                        <v-text-field class="search-field"
                            v-model="textoBusqueda"
                            append-icon="mdi-magnify"
                            label="Búsqueda"
                            single-line
                            dense
                            hide-details>
                        </v-text-field>
                    </v-card-title>
                    <v-data-table 
                        :headers="cabeceras" 
                        :items="entregas"  
                        :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
                        :items-per-page="30" 
                        :search="textoBusqueda"
                        item-key="Remitos"
                        show-select
                        single-select
                        v-model="entregaSeleccionada"
                        class="elevation-3">
                    </v-data-table>
                </v-card>          
            </v-col>
        </v-row>

    </v-container>
</template>

<script>

import choferes from '@/store/choferes'
import {xlsx, read, utils, writeFile} from 'xlsx'
import store from "@/store"
import draggable from 'vuedraggable'


export default {
    name: "ItinerarRuta",

    components: {
        draggable
    },

    data() {
        return {
            numeroChofer: '',
            fecha: '',
            choferActual: {},
            entregas: [],
            entregasItineradas: [],
            entregaSeleccionada: [],
            excelR4MeDescargado: (process.env.NODE_ENV=="development" && false),
            cabeceras: [
                {text: 'Comprobante', value: 'Comprobante'},
                {text: 'Cliente', value: 'NombreCliente'},
                {text: 'Remitos', value: 'Remitos'},
                {text: 'Destino', value: 'NombreDestino'},
                {text: 'Domicilio', value: 'Domicilio'},
                {text: 'C.P.', value: 'CodigoPostal'},
                {text: 'Localidad', value: 'Localidad'},
                {text: 'Bultos', value: 'Bultos'},
                {text: 'Observaciones', value: 'Observaciones'},
            ],
            cabecerasItineradas: [
                {text: 'Orden', value: 'OrdenEntrega', sortable: true},
                {text: "", value: "Acciones", sortable: false},
                {text: 'Comprobante', value: 'Comprobante'},
                {text: 'Cliente', value: 'NombreCliente'},
                {text: 'Remitos', value: 'Remitos'},
                {text: 'Destino', value: 'NombreDestino'},
                {text: 'Domicilio', value: 'Domicilio'},
                {text: 'Localidad', value: 'Localidad'},
                {text: 'Observaciones', value: 'Observaciones'},
            ],
            textoBusqueda: '',
            textoBusquedaItineradas: '',
        }
    },

    computed: {
        dragOptions() {
            return {
                animation: 200,
                group: "description",
                disabled: false,
                ghostClass: "ghost"
            }
        }
    },

    methods: {
        cambiosEnOrdenDeItinerancia() {
            this.renumerarEntregasItineradas()
        },
        renumerarEntregasItineradas() {
            this.entregasItineradas.forEach((item, index) => {
                item.OrdenEntrega=(index+1).toString().padStart(3, "0")
            })
        },
        aplicarItinerancia() {
            let detalle="["
            this.entregasItineradas.forEach(element => {
                detalle += "{"
                detalle += "Guia: "+element.Guia
                detalle += ", "
                detalle += "OrdenEntrega: '"+element.OrdenEntrega+"'"
                detalle += "}, "
            })
            detalle= detalle.slice(0, -2)
            detalle += "]"

            console.log(detalle)

            choferes.actions.registrarEntregasItineradas(this.numeroChofer, this.fecha, detalle)
                .then(respuesta => {
                    //console.log("Respuesta", respuesta)
                    store.dispatch("alertDialog/mostrar", {titulo: "Registración exitosa", mensaje: "Las entregas itineradas han sido registradas exitosamente"})
                })
                .catch(puteada => {
                    console.log(puteada)
                })
            
        },
        fileOnChange(archivoLeido) {
            if (archivoLeido!=null) {
                const lector=new FileReader()
                lector.onload = lectura => {
                    const datos=lectura.target.result.split("\n")

                    //Remuevo la cabecera
                    datos.splice(0, 1)

                    //Remuevo el último el renglón vacío
                    datos.splice(datos.length-1, 1)

                    //Me fijo si el último elemento es un Home, y en tal caso, lo remuevo
                    if (datos.slice(-1)[0].toLowerCase()=="home") {
                        datos.splice(datos.length-1, 1)
                    }

                    this.entregasItineradas=[]
                    const entregaHome=this.entregaSeleccionada[0]
                    entregaHome.OrdenEntrega="1"
                    this.entregasItineradas.push(entregaHome)
                    datos.forEach((unDato, index) => {
                        if (index>0) {
                            const unaEntrega=this.entregas[parseInt(unDato-1)]
                            if (unaEntrega!=entregaHome) {
                                this.entregasItineradas.push(unaEntrega)
                            }
                        }
                    })
                    this.renumerarEntregasItineradas()
                }
                lector.readAsText(archivoLeido)
            }
        },
        clickAbrirRoute4Me() {
            window.open("https://route4me.com/routes", "_blank").focus()

        },
        clickDescargarExcel() {
            const workbook = utils.book_new()
            workbook.Props = {Title: process.env.VUE_APP_Nombre, Subject: "Excel de entregas", Author: "Leo Lob", CreatedDate: new Date()}

            const nombreHoja="Entregas"
            workbook.SheetNames.push(nombreHoja)
            let datosPlanilla = [["Address", "City", "Alias"]]

            const unRenglon=[this.entregaSeleccionada[0].Domicilio, this.entregaSeleccionada[0].Localidad, "Home"]
            datosPlanilla.push(unRenglon)

            this.entregas.forEach((unaEntrega, index) => {
                if (unaEntrega!=this.entregaSeleccionada[0]) {
                    const unRenglon=[unaEntrega.Domicilio, unaEntrega.Localidad, (index+1)]
                    datosPlanilla.push(unRenglon)
                }          
            });

            var worksheet = utils.aoa_to_sheet(datosPlanilla);
            workbook.Sheets[nombreHoja] = worksheet;
            writeFile(workbook, 'Entregas_Chofer_'+this.choferActual.Numero+'.xlsx');

            this.excelR4MeDescargado=true

        },
        getDataChofer() {
            choferes.actions.getByNumero(this.numeroChofer) 
                .then(respuesta => {
                    //console.log(respuesta)
                    this.choferActual=respuesta
                    this.getEntregas()
                })
                .catch(puteada => {
                    console.log(puteada)
                })
        },
        getEntregas() {
            choferes.actions.getEntregasPendientes(this.numeroChofer, this.fecha) 
                .then(respuesta => {
                    //console.log(respuesta)
                   this.entregas=respuesta
                })
                .catch(puteada => {
                    console.log(puteada)
                })
        },
        mostrarError(mensaje) {
            store.dispatch("snackbar/mostrar", mensaje)
        }
    },

    created() {
        this.numeroChofer=this.$route.params.numeroChofer
        this.fecha=this.$route.params.fecha

        this.getDataChofer()
    },
}
</script>