<template>
    <v-container>
       <v-spacer></v-spacer>
        <v-row v-show="listaChoferesCompleta.length>0" class="col-md">
            <v-btn class="action-button" @click="createChofer()">Crear nuevo chofer</v-btn>
        </v-row>
        <v-row class="pb-0 mb-0">
            <v-col class="py-0 my-0" v-if="listaChoferesCompleta.length>0" >
                <v-card-title class="py-1 my-0">
                    <v-text-field class="search-field"
                        v-model="textoBusqueda"
                        append-icon="mdi-magnify"
                        label="Búsqueda"
                        single-line
                        dense
                        hide-details
                    ></v-text-field>
                    </v-card-title>
                </v-col>
        </v-row>
        <v-row>
            <v-col class="py-0 my-0" v-if="listaChoferesCompleta.length>0">
                <v-checkbox class="my-0" @change="changeVerSoloHabilitados" v-model="verSoloHabilitados" label="Ver solo choferes activos"></v-checkbox>
            </v-col>
        </v-row>    
        <v-row>
            <v-col class="py-0" v-if="listaChoferesCompleta.length>0">
                <v-data-table 
                    :headers="cabecerasChoferes" 
                    :items="listaChoferesCompleta"  
                    :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
                    :items-per-page="-1" 
                    :search="textoBusqueda"
                    class="elevation-3" 
                >
                <template v-slot:item.Acciones="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                            <v-icon color="green"  v-bind="attrs" v-on="on" @click="getOneChofer(item)">mdi-magnify-plus-outline</v-icon>
                            </template>
                            <span>Visualizar</span>
                        </v-tooltip>                           
                </template>
                </v-data-table>
            </v-col>
        </v-row>
         <!-- Dialog de Ajuste de Ingreso -->
         <v-row justify="center">
            <v-dialog v-model="choferDialog" persistent max-width="600px">
                <v-card class="rounded-card">
                    <v-card-title>
                        <span class="text-h5">Administración de Chofer</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row >
                                <v-col cols="12" sm="6" >
                                    <v-text-field
                                    required
                                    type="number"
                                    v-model="idChofer"
                                    label ="Número*"
                                    >
                                    </v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field
                                        type="number"
                                        v-model="categoria"
                                        label ="Categoria"                                        
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" >
                                    <v-text-field
                                    v-model="nombre"
                                    label ="Nombre"
                                    >
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-combobox
                                        v-model="disponible"
                                        :items="listaDisponible"
                                        label ="Disponible"
                                    ></v-combobox>
                                </v-col>
                                <v-col cols="12" sm="6" >
                                    <v-text-field
                                    type="number"
                                    v-model="tarifa"
                                    label ="Tarifa"
                                    >
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field
                                        type="number"
                                        v-model="peso"
                                        label ="Peso"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" >
                                    <v-text-field
                                    type="number"
                                    v-model="volumen"
                                    label ="Volumen"
                                    >
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field
                                        v-model="gps"
                                        label ="GPS"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" >
                                    <v-text-field
                                    v-model="patente"
                                    label ="Patente"
                                    >
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-checkbox
                                        v-model="activo"
                                        label ="Activo"
                                    ></v-checkbox>
                                </v-col>
                                <small>* Campos Requeridos</small>
                                <v-card-actions>
                                <v-spacer></v-spacer>
                                        <v-btn
                                            color="blue darken-1"
                                            text
                                            @click="resetValue()"
                                        >
                                            Cerrar
                                        </v-btn>
                                        <v-btn
                                            color="blue darken-1"
                                            text
                                            @click="saveChofer()"
                                        >
                                            Guardar
                                        </v-btn>
                                </v-card-actions>
                            </v-row>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-row>
        <!-- Dialog de Ajuste de Ingreso -->
    </v-container>    
</template>

<script>


import choferes from '@/store/choferes'
import empresas from '@/store/empresasV3'
import store from '@/store'

export default {
    name: "Choferes",

    data() {
        return  {
            listaChoferesCompleta: [],
            choferDialog : false,
            verSoloHabilitados: false,
            idChofer: null,
            categoria: null,
            nombre: null,
            disponible: null,
            tarifa: null,
            peso: null,
            volumen: null,
            estado: null,
            activo: false,
            gps: null,
            patente: null,
            action: null,
            rules: {
            required: value => !!value || 'Required.',
            },
            cabecerasChoferes: [
                {text: 'Número', value: 'Id'},
                {text: 'Categoria', value: 'Categoria'},
                {text: 'Nombre',  value: 'Nombre'},
                {text: 'Disponible', value: 'Disponible'},
                {text: 'Tarifa', value: 'Tarifa'},
                {text: 'Peso', value: 'Peso'},
                {text: 'Volumen', value: 'Volumen'},
                {text: 'Estado', value: 'Estado'},
                {text: 'GPS', value: 'GPS'},
                {text: 'Patente', value: 'Patente'},
                {text: '', value: 'Acciones'},
            ],
            textoBusqueda: '',
            listaDisponible: ["Si","No"],
        }
    },
    
    methods: {

        getAllChoferes() {
            this.listaChoferesCompleta=[]
            choferes.getAll()
                .then(respuesta => {
                    //console.log("Respuesta", respuesta);
                    this.listaChoferesCompleta=respuesta
                    
                })
                .catch(puteada => {
                    //console.log("Puteada", puteada)
                    this.listaChoferesCompleta=[]
                    this.mostrarError(puteada)
                })
        },

        getAllSoloChoferesHabilitados() {
            this.listaChoferesCompleta=[]
            choferes.getAll()
                .then(respuesta => {
                    // console.log("Respuesta", respuesta);
                    this.listaChoferesCompleta=respuesta.filter(c => c.Estado == "Activo")

                })
                .catch(puteada => {
                    //console.log("Puteada", puteada)
                    this.listaChoferesCompleta=[]
                    this.mostrarError(puteada)
                })
        },

        mostrarError(mensaje) {
            store.dispatch("snackbar/mostrar", mensaje)
        },

        createChofer(){
            //console.log("createChofer")
            this.choferDialog = true
            this.action = 'isNew'
            this.activo = true
        },
        resetValue(){
            this.choferDialog = false            
            this.idChofer = null
            this.categoria = null
            this.nombre = null
            this.disponible = null
            this.tarifa = null
            this.peso = null
            this.volumen = null
            this.estado = null
            this.gps = null
            this.patente = null
            this.activo = false
        },

        getOneChofer(unChofer){
            this.choferDialog = true
            this.idChofer = unChofer.Id
            this.categoria = unChofer.Categoria
            this.nombre = unChofer.Nombre
            this.disponible = unChofer.Disponible
            this.tarifa = unChofer.Tarifa
            this.peso = unChofer.Peso
            this.volumen = unChofer.Volumen
            this.estado = unChofer.Estado
            this.gps = unChofer.Gps
            this.patente = unChofer.Patente
            if ( unChofer.Estado == 'Activo' ) {
                this.activo = true
            } else {
                this.activo = false
            }
        },

        changeVerSoloHabilitados(){
            if(this.verSoloHabilitados == true){
                this.getAllSoloChoferesHabilitados()
            }else{
                this.getAllChoferes()
            }
        },

        saveChofer(){
            this.estado = (this.activo) ? 'Activo' : 'Inactivo'
            if(this.action === 'isNew'){
                if(this.isValid()){
                    this.createChoferAPI ( { Id: this.idChofer, Categoria: this.categoria, Nombre: this.nombre, Disponible: this.disponible, Tarifa: this.tarifa, Peso: this.peso, Volumen: this.volumen, Estado: this.estado, GPS: this.gps, Patente: this.patente } )
                }
            } else {
                if(this.isValid()){
                   this.editChofer ( this.idChofer, { Id: this.idChofer, Categoria: this.categoria, Nombre: this.nombre, Disponible: this.disponible, Tarifa: this.tarifa, Peso: this.peso, Volumen: this.volumen, Estado: this.estado, GPS: this.gps, Patente: this.patente } )
               }
            }
            this.resetValue()
        },

        createChoferAPI(payload){
            choferes.saveChofer(payload)
                .then(respuesta => {
                     //console.log("Respuesta", respuesta);
                        this.choferDialog = false
                        
                })
                .catch(puteada => {
                    //console.log("Puteada", puteada)
                    //this.mostrarError(puteada)
                    this.getAllChoferes()
                })
                
        },

        editChofer(id,payload){
            choferes.editChofer(id,payload)
                .then(respuesta => {
                    // console.log("Respuesta", respuesta);
                    this.getAllChoferes()
                })
                .catch(puteada => {
                    //console.log("Puteada", puteada)
                    this.mostrarError(puteada)
                })
        },

        isValid(){
            if(this.idChofer == null){
                this.mostrarMensaje('Operación  Incorrecta', 'Debe completar el número.')
                return false
            }
            return true
        },

        mostrarMensaje(titulo, mensaje){
            store.dispatch("alertDialog/mostrar", {titulo, mensaje})
        },

    },

    created() {
        this.getAllChoferes()
    }
}

</script>