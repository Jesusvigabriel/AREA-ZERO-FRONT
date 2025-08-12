<template>
    <v-container>
        <v-row>
            <v-col>
                <SelectorEmpresa @eligioEmpresa="eligioEmpresa($event)" ></SelectorEmpresa>
            </v-col>
        </v-row>
        <v-row v-if="listaOrdenes.length>0">
            <v-col cols="4">
                <v-select 
                    v-model="listaOrdenesSeleccionadas" 
                    dense 
                    prepend-inner-icon="mdi-factory"
                    chips
                    :items="listaOrdenes" 
                    multiple
                    item-value="Id" 
                    item-text="Numero" 
                    label="Seleccione orden"
                    class="my-0 py-0"
                >
                </v-select>
            </v-col>
            <v-col cols="1"><v-icon color="green" @click="clickSeleccionarTodasLasOrdenes()">mdi-check-all</v-icon></v-col>
            <v-col cols="4" v-if="listaOrdenes!=null">
                {{listaOrdenes.length==0 ?  'No hay órdenes pendientes' : 'Hay '+listaOrdenes.length+' órdenes pendientes'}}
            <!-- </v-col>
            <v-col cols="4" v-if="listaOrdenes!=null"> -->
                <v-checkbox v-if="!empresaPorLote" label="Impresion Horizontal" v-model="orientacionHojaPdf" class="py-0 my-0"></v-checkbox>
            </v-col>
            <v-col cols="4" v-if="listaOrdenesSeleccionadas.length>0">
                <v-btn color="primary" :disabled="imprimiendoOrdenes" @click="clickGenerarPDFDeTodas" block>
                    Imprimir las ordenes seleccionadas
                </v-btn>
            </v-col>
        </v-row>
        <v-col cols="4" v-if="listaOrdenesSeleccionadas.length>0">
            <v-btn color="primary" @click="quitarMarcaDePreOrden()" block>
                Quitar marca de preorden
            </v-btn>
        </v-col>
        <v-row v-if="listaOrdenes.length==0">
            <v-col cols="4" v-if="listaOrdenes!=null">
                No hay órdenes pendientes
            </v-col>
        </v-row>
        <!-- 
        <v-row v-if="idOrdenSeleccionada>0">
            <v-col>
                <v-btn color="primary" @click="clickGenerarPDF" block>Generar PDF</v-btn>
            </v-col>
        </v-row>
        -->

    </v-container>
</template>

<script>

import ordenes from '@/store/ordenes'
import ordenesV3 from "@/store/ordenesV3"
import empresasV3 from '@/store/empresasV3'
import SelectorEmpresa from '@/components/SelectorEmpresa.vue'
import store from '@/store'
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default {
    name: "ImprimirOrdenes",

    data() {
        return {
            idEmpresa: -1,
            listaOrdenes: [],
            listaOrdenesSeleccionadas: [],
            idOrdenSeleccionada: -1,
            imprimiendoOrdenes: false,
            orientacionHojaPdf: false,
            empresaPorLote: false,
        }
    },

    methods: {
        async quitarMarcaDePreOrden() {
            for (const unaOrden of this.listaOrdenesSeleccionadas) {
                const result=await ordenesV3.setearPreOrden(unaOrden, "F")
            }
        },
        clickSeleccionarTodasLasOrdenes() {
            this.listaOrdenesSeleccionadas=this.listaOrdenes.map( unaOrden => {
                return unaOrden.Id
            })
        },
        async clickGenerarPDFDeTodas() {
            store.dispatch('loading/mostrar', { titulo: 'Generando listado de ordenes', color: 'blue' });
            this.imprimiendoOrdenes = true;
          
            this.listaOrdenesSeleccionadas.map(async idOrden => {
                //await ordenes.actions.getById(idOrden)
                const datosOrden =  await ordenesV3.getById(idOrden)
                await ordenes.actions.getDatosOrden(datosOrden)
                    .then( async orden => {
                        const pdfCreado = await ordenes.generarOrdenEnPDF(orden,this.orientacionHojaPdf)
                        pdfCreado.save("orden_"+orden[0].Orden.Numero+".pdf")
                    })
            })           
            store.dispatch('loading/ocultar');
            this.imprimiendoOrdenes = false;
            this.listaOrdenesSeleccionadas="";
        },

        clickGenerarPDF() {
            const datosOrden =   ordenesV3.getById(this.idOrdenSeleccionada)
                 ordenes.actions.getDatosOrden(datosOrden)
                .then(respuesta => {
                    this.generarOrdenEnPDF(respuesta)
                })
                .catch(puteada => {
                    this.mostrarError(puteada)
                })
        },
        async eligioEmpresa(idEmpresaElegida) {
            empresasV3.getOneById(idEmpresaElegida)
            .then(response =>{
                this.empresaPorLote = response.LOTE
            })
            this.idEmpresa=idEmpresaElegida
            this.idOrdenSeleccionada=-1
            // ordenes.actions.getAll(this.idEmpresa, 1, -1)
            //     .then(respuesta => {
            //         console.log("OK", respuesta);
            //         respuesta.sort((a,b) => { return a.Numero>b.Numero ? 1 :  -1})
            //         this.listaOrdenes=respuesta
            //     })
            //     .catch(puteada => {
            //         console.log("Error", puteada);
            //         this.mostrarError(puteada)
            //     })

            try{
                const results=await ordenesV3.getByPeriodoEmpresaSoloPreparadasYNoPreorden('2022-10-01', '2030-12-31', idEmpresaElegida) 
                this.listaOrdenes=results.sort((e1, e2) => {return e1.Numero.localeCompare(e2.Numero)})
            } catch (error) {
                console.log("Error al leer órdenes", error)
            }
        },
        async generarOrdenEnPDF(orden){            
            const pdf = await ordenes.generarOrdenEnPDF(orden,orientacionHojaPdf)
            pdf.save("orden_"+orden[0].Orden.Numero+".pdf")
        },
        mostrarError(mensaje) {
            store.dispatch("snackbar/mostrar", mensaje)
        },
    },

    components: {
        SelectorEmpresa
    },

    created() {
        store.dispatch('actualizarTituloPrincipal', 'Imprimir órdenes')
        store.dispatch('empresas/cargarListaEmpresas', "SoloActivas")
    }

}
</script>