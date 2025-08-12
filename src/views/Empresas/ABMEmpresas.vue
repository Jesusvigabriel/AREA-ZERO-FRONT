<template>
    <v-container>
       <v-spacer></v-spacer>
        <v-row class="col-md">
            <v-btn class="action-button" @click="createEmpresa()">Crear nueva empresa</v-btn>
        </v-row>
        <v-row class="pb-0 mb-0">
            <v-col class="py-0 my-0" v-if="listaEmpresasCompleta.length>0" >
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
            <v-col class="py-0 my-0" v-if="listaEmpresasCompleta.length>0">
                <v-checkbox class="my-0" @change="changeVerSoloHabilitados" v-model="verSoloAvtivas" label="Ver solo empresas activas"></v-checkbox>
            </v-col>
        </v-row>  
        <v-row>
            <v-col class="py-0" v-if="listaEmpresasCompleta.length>0">
                <v-data-table 
                    :headers="cabecerasEmpresas" 
                    :items="listaEmpresasCompleta"  
                    :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
                    :items-per-page="-1" 
                    :search="textoBusqueda"
                    class="elevation-3" 
                >
                <template v-slot:item.Acciones="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                            <v-icon color="green"  v-bind="attrs" v-on="on" @click="getOneEmpresa(item)">mdi-magnify-plus-outline</v-icon>
                            </template>
                            <span>Visualizar</span>
                        </v-tooltip>                           
                </template>
                </v-data-table>
            </v-col>
        </v-row>
         <!-- Dialog de Ajuste de Ingreso -->
         <v-row justify="center">
            <v-dialog v-model="empresaDialog" persistent max-width="600px">
                <v-card class="rounded-card">
                    <v-card-title>
                        <span class="text-h5">Administración de empresa</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row >
                                <v-col cols="12" sm="6">
                                    <v-text-field
                                        v-model="idEmpresa"
                                        label ="ID"
                                        disabled
                                        
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" >
                                    <v-text-field
                                    v-model="empresa"
                                    label ="Razon Social*"
                                    
                                    >
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field
                                        v-model="nombreEmpresa"
                                        label ="Nombre Empresa*"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-combobox
                                    v-model="tipoEmpresa"
                                    :items="tipoCliente"
                                    item-text="nombre"
                                    label="Tipo*"
                                 ></v-combobox>
                                </v-col>
                                <v-col cols="12" sm="6" >
                                    <v-checkbox class="my-0"  v-model="activa" label="Activa"></v-checkbox>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-combobox
                                    v-model="tipoIva"
                                    :items="iva"
                                    item-text="nombre"
                                    label="IVA*"
                                 ></v-combobox>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-combobox
                                    v-model="tipoMoneda"
                                    :items="monedas"
                                    item-text="nombre"
                                    label="Tipo de moneda*"
                                 ></v-combobox>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field
                                        v-model="cuit"
                                        label ="Cuit / Cuil"
                                        
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" >
                                    <v-text-field
                                    v-model="ingresosBrutos"
                                    label ="Ingresos Brutos"
                                    >
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" >
                                    <v-text-field
                                    v-model="contactoOficina"
                                    label ="E-Mail Oficina"
                                    >
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field
                                        v-model="contactoDeposito"
                                        label ="E-Mail Deposito"
                                        
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" >
                                    <v-text-field
                                    v-model="direccionOficina"
                                    label ="Direccion Oficina"
                                    >
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field
                                        v-model="direccionDeposito"
                                        label ="Direccion Deposito"
                                        
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field
                                        v-model="codigoPostal"
                                        label ="CP Deposito"
                                        
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field
                                        v-model="tokenApi"
                                        label ="Token"
                                        
                                    ></v-text-field>
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
                                            @click="saveUsuario()"
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


import usuarios from '@/store/usuariosV3'
import empresas from '@/store/empresasV3'
import store from '@/store'
import {nanoid} from 'nanoid'

export default {
    name: "Usuarios",

    data() {
        return  {
            listaEmpresasCompleta: [],
            empresaDialog : false,
            activa: true,
            verSoloAvtivas: false,
            idEmpresa: null,
            empresa: null,
            nombreEmpresa: null,
            tipoEmpresa: null,
            tipoIva:null,
            tipoMoneda: null,
            monedas: ['ARS', 'USD', 'UYU'],
            cuit:null,
            direccionOficina: null,
            direccionDeposito: null,
            contactoDeposito: null,
            contactoOficina: null,
            codigoPostal: null,
            ingresosBrutos:null,
            fechaAlta: new Date(),
            action: null,
            show1: false,
            tokenApi: null,
            rules: {
            required: value => !!value || 'Required.',
            },
            cabecerasEmpresas: [
                    {text: 'Id', value: 'Id'},
                    {text: 'Razon Social', value: 'RazonSocial', width: '30%'},
                    {text: 'Nombre Empresa',  value: 'Nombre', width: '30%'},
                    {text: 'Activa', value: 'Activa'},
                    {text: '', value: 'Acciones'},
            ],
            textoBusqueda: '',
            tipoCliente: [{id:0,nombre:'Administrador'},{id:1,nombre:'Integral'},{id:3,nombre:'Cross Docking'}],
            iva: [{id:0,nombre:'Respnsable Inscripto'},{id:1,nombre:'Monotributista'},{id:2,nombre:'Excento'}],
        }
    },
    
    methods: {

        modificoHabilitado(){
            this.listaEmpresasCompleta.forEach(e => {
                
                if (e.Activa === true){
                    e.Activa = 'SI'
                }else{
                    e.Activa = 'NO'
                }
            })
        },

        changeVerSoloHabilitados(){
            if(this.verSoloAvtivas == true){
                this.getAllEmpresasActivas()
            }else{
                this.getAllEmpresas()
            }
        },

        getAllEmpresasActivas() {
            this.listaEmpresasCompleta=[]
            empresas.getAll(false,true)
                .then(respuesta => {
                    // console.log("Respuesta", respuesta);
                    this.listaEmpresasCompleta=respuesta
                    this.modificoHabilitado()

                })
                .catch(puteada => {
                    //console.log("Puteada", puteada)
                    this.listaUsuariosCompleta=[]
                    this.mostrarError(puteada)
                })
        },

        mostrarError(mensaje) {
            store.dispatch("snackbar/mostrar", mensaje)
        },

        createEmpresa(){
            this.empresaDialog = true
            this.action = 'isNew'
        },
        resetValue(){

            this.empresa = ''
            this.nombreEmpresa = ''
            this.tipoEmpresa =  null 
            this.tipoIva =  null
            this.tipoMoneda = null
            this.idEmpresa = null
            this.cuit = ''
            this.ingresosBrutos = ''
            this.activa = false
            this.empresaDialog = false
            this.action = null
            this.direccionOficina= null
            this.direccionDeposito= null
            this.contactoDeposito= null
            this.contactoOficina= null
            this.codigoPostal= null,
            this.tokenApi = null
        },

        getAllEmpresas() {
            this.listaEmpresasCompleta=[]
             empresas.getAll(false,false)
                .then(respuesta => {
                    // console.log("Respuesta", respuesta);
                    this.listaEmpresasCompleta=respuesta
                    this.listaEmpresasCompleta.sort((a,b)=>{
                        if(a.Id<b.Id){
                            return -1;
                        }else{
                            return 1;
                        }

                        return 0;

                    })
                    this.modificoHabilitado()    
                })
                .catch(puteada => {
                    //console.log("Puteada", puteada)
                    this.listaEmpresasCompleta=[]
                    this.mostrarError(puteada)
                })
        },

        getOneEmpresa(unaEmpresa){
            
            //Inicio el Formulario
            this.empresaDialog = true
            // Cargo las Propiedades
            this.empresa = unaEmpresa.RazonSocial
            this.nombreEmpresa = unaEmpresa.Nombre
            this.tipoEmpresa =  this.tipoCliente.find(c => c.id == unaEmpresa.Tipo) 
            this.tipoIva =  this.iva.find(i => i.id == unaEmpresa.Iva)
            this.tipoMoneda = unaEmpresa.TipoMoneda
            this.idEmpresa = unaEmpresa.Id
            this.cuit = unaEmpresa.Cuit
            this.ingresosBrutos = unaEmpresa.IngresosBrutos
            this.direccionOficina= unaEmpresa.DireccionOficina
            this.direccionDeposito= unaEmpresa.DireccionDeposito
            this.contactoDeposito= unaEmpresa.ContactoDeposito
            this.contactoOficina= unaEmpresa.ContactoOficina
            this.codigoPostal= unaEmpresa.CodigoPostal
            this.tokenApi = unaEmpresa.TokenApi


            if(unaEmpresa.Activa=='SI'){
                this.activa=true
            }else{
                this.activa=false
            }
            

        },

     

        saveUsuario(){
            let habilitado = 0
            if(this.action === 'isNew'){
                
               if(this.isValid()){ 
                 this.saveEmpresa(
                    {RazonSocial: this.empresa,
                     Nombre: this.nombreEmpresa,
                     Activa: this.activa,
                     Tipo: this.tipoEmpresa.id,
                     Estado: this.activa == 1 ? this.activa : 0,
                     Iva:this.tipoIva.id,
                     TipoMoneda: this.tipoMoneda,
                     Cuit:this.cuit, 
                     IngresosBrutos: this.ingresosBrutos,
                     DireccionOficina: this.direccionOficina,
                     DireccionDeposito: this.direccionDeposito,
                     ContactoOficina: this.contactoOficina,
                     ContactoDeposito: this.contactoDeposito,
                     CodigoPostal: this.codigoPostal, 
                     FechaAlta: this.fechaAlta,
                     TokenApi: nanoid() })
                 this.resetValue()
                }
            }else{
                if(this.isValid()){
                   this.editEmpresa(this.idEmpresa,
                   {Id: this.idEmpresa, 
                    RazonSocial: this.empresa,
                    Nombre: this.nombreEmpresa, 
                    Activa: this.activa, 
                    Tipo: this.tipoEmpresa.id, 
                    Iva:this.tipoIva.id, 
                    Cuit:this.cuit, 
                    IngresosBrutos: this.ingresosBrutos,
                    DireccionOficina: this.direccionOficina,
                    DireccionDeposito: this.direccionDeposito,
                    ContactoOficina: this.contactoOficina,
                    ContactoDeposito: this.contactoDeposito,
                    CodigoPostal: this.codigoPostal,} )
                   this.resetValue()
                }
            }
            
        },

        saveEmpresa(payload){
            empresas.createEmpresa(payload)
                .then(respuesta => {
                     //console.log("Respuesta", respuesta);
                        this.empresaDialog = false
                        
                        
                })
                .catch(puteada => {
                    //console.log("Puteada", puteada)
                    //this.mostrarError(puteada)
                    this.getAllEmpresas()
                })
                
        },

        editEmpresa(idEmpresa,payload){
            empresas.saveEmpresa(idEmpresa,payload)
                .then(respuesta => {
                     //console.log("Respuesta", respuesta);
                        this.empresaDialog = false
                        this.getAllEmpresas()
                        
                })
                .catch(puteada => {
                    //console.log("Puteada", puteada)
                    //this.mostrarError(puteada)
                    this.getAllEmpresas()
                })
                
        },

        editUsuario(id,payload){
            usuarios.editUsuario(id,payload)
                .then(respuesta => {
                    // console.log("Respuesta", respuesta);
                    this.getAllUsuarios()
                })
                .catch(puteada => {
                    //console.log("Puteada", puteada)
                    this.mostrarError(puteada)
                })
        },

        isValid(){
            
            if(this.empresa == null || this.empresa == undefined){
                this.mostrarMensaje('Operación  Incorrecta', 'Debe completar la Razon Social de la empresa')
                return false
            }else if(this.nombreEmpresa == null || this.nombreEmpresa == undefined){
                this.mostrarMensaje('Operación  Incorrecta', 'Debe completar el Nombre de la empresa')
                return false
            }else if (this.tipoEmpresa == null){
                this.mostrarMensaje('Operación  Incorrecta', 'Debe completar el tipo de cliente')
                return false
            }else if (this.tipoIva == null){
                this.mostrarMensaje('Operación  Incorrecta', 'Debe completar el regimen del cliente')
                return false
            } else if (this.tipoMoneda == null){
                this.mostrarMensaje('Operación  Incorrecta', 'Debe completar el tipo de moneda del cliente')
                return false
            }
            return true
        },

        mostrarMensaje(titulo, mensaje){
            store.dispatch("alertDialog/mostrar", {titulo, mensaje})
        },

    },


    created() {
        this.getAllEmpresas()
         
       },
}

</script>