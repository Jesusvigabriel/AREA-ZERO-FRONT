<template>
    <v-container>
       <v-spacer></v-spacer>
        <v-row class="col-md">
            <v-btn class="action-button" @click="createRoles()">Crear nuevo rol</v-btn>
        </v-row>
        <v-row class="pb-0 mb-0">
            <v-col class="py-0 my-0" v-if="listaRolesCompleta.length>0" >
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
            <v-col class="py-0" v-if="listaRolesCompleta.length>0">
                <v-data-table 
                    :headers="cabecerasRoles" 
                    :items="listaRolesCompleta"  
                    :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
                    :items-per-page="-1" 
                    :search="textoBusqueda"
                    class="elevation-3" 
                >
                <template v-slot:item.Acciones="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                            <v-icon color="green"  v-bind="attrs" v-on="on" @click="getOneRol(item)">mdi-magnify-plus-outline</v-icon>
                            </template>
                            <span>Visualizar</span>
                        </v-tooltip>                           
                </template>
                </v-data-table>
            </v-col>
        </v-row>
         <!-- Dialog-->
         <v-row justify="center">
            <v-dialog v-model="rolDialog" persistent max-width="600px">
                <v-card class="rounded-card">
                    <v-card-title>
                        <span class="text-h5">Administracion de Roles</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row >
                                <v-col cols="12" sm="6" >
                                    <v-text-field
                                    v-model="rol"
                                    label ="Nombre Rol *"
                                    required
                                    >
                                    </v-text-field>
                                </v-col>
                                </v-row>
                                <v-row>
                                <v-col cols="12"  >
                                    <v-textarea
                                    label="Descripción *"
                                   v-model="descripcion"
                                    ></v-textarea>
                                </v-col>
                                <v-col class="py-0" v-if="this.action==null">
                                    <v-data-table 
                                        v-model="listaMenuSeleccionados"
                                        :headers="cabecerasMenus" 
                                        :items="listaOpcionesMenu"  
                                        :footer-props="{itemsPerPageOptions:[5,15,50,-1]}"   
                                        :items-per-page="5" 
                                        show-select
                                        item-key="Nombre"
                                        class="elevation-3" 
                                    >
                                    </v-data-table>
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
                                            @click="saveRol()"
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
        <!-- Dialog -->
    </v-container>    
</template>

<script>

import usuarios from '@/store/usuariosV3'
import roles from '@/store/roles'
import store from '@/store'

export default {
    name: "Roles",

    data() {
        return  {
            listaRolesCompleta: [],
            listaMenuSeleccionados:[],
            listaOpcionesMenu: [],
            lista: [],
            rolDialog : false,
            fecha_creacion:new Date(),
            usuario:null,
            usuarioIdRol:null,
            idUser: null,
            descripcion:null,
            idRol:null,
            rol: null,
            action: null,
            cabecerasRoles: [
                    {text: 'Id', value: 'Id'},
                    {text: 'Rol', value: 'Nombre'},
                    {text: 'Descripción',  value: 'Descripcion'},
                    {text: '', value: 'Acciones'},
            ],
            cabecerasMenus: [
                    {text: 'Id', value: 'Id'},
                    {text: 'Nombre', value: 'Nombre'},
                    {text: 'Modulo',  value: 'Modulo'},
            ],
            textoBusqueda: '',
        }
    },
    
    methods: {

        nombreUsuario() {
           this.usuario =  store.state.usuarios.usuarioActual.Nombre
           this.idUser = store.state.usuarios.usuarioActual.Id
            usuarios.getUserById(this.idUser)
            .then(response=>{
                this.usuarioIdRol = []
                this.usuarioIdRol = response[0].IdRol
            }) 
            .catch({
                
            })
        },

        getAllRoles() {
            this.nombreUsuario()
            console.log(this.usuarioIdRol)
            this.listaRolesCompleta=[]
            roles.getAll()
                .then(respuesta => {
                    // console.log("Respuesta", respuesta);
                    this.listaRolesCompleta=respuesta
                    this.nombreUsuario()
                    console.log(this.usuarioIdRol)
                    let list
                    if(this.usuarioIdRol != 1){
                            list = this.listaRolesCompleta.filter(e => e.Id != 1)
                            console.log(list)
                        this.listaRolesCompleta=[]
                        this.listaRolesCompleta=list
                    }
                })
                .catch(puteada => {
                    //console.log("Puteada", puteada)
                    this.listaRolesCompleta=[]
                    this.mostrarError(puteada)
                })
        }, 

        getAllMenu() {
            this.listaOpcionesMenu=[]
            roles.getAllMenu()
                .then(respuesta => {
                    // console.log("Respuesta", respuesta);
                    this.listaOpcionesMenu=respuesta
                    console.log(respuesta)
                    console.log(this.usuarioIdRol)
                    let list
                    const sacar = [6,15,16,19,21,22,23,24,28,29,30,31,32,34,37,39]
                    if(this.usuarioIdRol != 1){
                        sacar.forEach(r=>{
                            list = this.listaOpcionesMenu.filter(e => e.Id != r)
                            this.listaOpcionesMenu = []
                            this.listaOpcionesMenu = list
                        })
                    }
                })
                .catch(puteada => {
                    //console.log("Puteada", puteada)
                    this.listaOpcionesMenu=[]
                    this.mostrarError(puteada)
                })
        }, 

        getAllMenuRol(idRol) {
            this.listaMenuSeleccionados=[]
            roles.getAllMenuRol(idRol)
                .then(respuesta => {
                    // console.log("Respuesta", respuesta);
                    console.log(respuesta)
                    this.listaMenuSeleccionados=respuesta
                   
                    
                })
                .catch(puteada => {
                    //console.log("Puteada", puteada)
                    this.listaMenuSeleccionados=[]
                    this.mostrarError(puteada)
                })
        }, 


        deleteMenuRol(idRol) {
            roles.deleteMenuRol(idRol)
                .then(respuesta => {
                     console.log("Respuesta", respuesta); 
                    
                })
                .catch(puteada => {
                    console.log("Puteada", puteada)
                    this.mostrarError(puteada)
                })
        },

        createMenuRol(payload) {
            roles.saveMenuRol(payload)
                .then(respuesta => {
                     //console.log("Respuesta", respuesta); 
                    
                })
                .catch(puteada => {
                    //console.log("Puteada", puteada)
                    //this.mostrarError(puteada)
                })
        },

        mostrarError(mensaje) {
            store.dispatch("snackbar/mostrar", mensaje)
        },

        createRoles(){
            this.rolDialog = true
            this.nombreUsuario()
            this.action = 'isNew'
        },
        resetValue(){
            this.rol = null
            this.idRol=null
            this.descripcion = null
            this.fecha_creacion = null
            this.usuario = null
            this.rolDialog = false
            this.action = null
        },


        getOneRol(unRol){
            this.nombreUsuario()
            //Inicio el Formulario
            this.rolDialog = true
            // Cargo las Propiedades
            this.idRol = unRol.Id
            this.rol = unRol.Nombre
            this.descripcion = unRol.Descripcion 
            this.getAllMenuRol(this.idRol) 
        },

        saveRol(){
            
            if(this.action === 'isNew'){
               if(this.isValid()){
                   this.createRol({Nombre: this.rol, Descripcion: this.descripcion, Fecha_Creacion: this.fecha_creacion, Usuario: this.usuario })
               }
            }else{
                if(this.isValid()){
                   
                   this.editRol(this.idRol,{Id: this.idRol, Nombre: this.rol, Descripcion: this.descripcion, Usuario: this.usuario })
                   this.deleteMenuRol(this.idRol)

                   if(this.listaMenuSeleccionados.length > 0){
                       this.listaMenuSeleccionados.forEach(m =>{
                            this.createMenuRol({IdRol: this.idRol, IdMenu: m.Id, Fecha_Creacion: this.fecha_creacion, Usuario: this.usuario })
                       })
                   } 

               }
            }
            
        },

         createRol(payload){
             roles.saveRol(payload)
                 .then(respuesta => {
                      //console.log("Respuesta", respuesta);
                      this.resetValue()
                        
                 })
                 .catch(puteada => {
                     //console.log("Puteada", puteada)
                     //this.mostrarError(puteada)
                     this.getAllRoles()
                     this.resetValue()
                 })
                
         },

         editRol(id,payload){
             roles.editRol(id,payload)
                 .then(respuesta => {
                     // console.log("Respuesta", respuesta);
                     this.getAllRoles()
                     this.resetValue()
                 })
                 .catch(puteada => {
                     //console.log("Puteada", puteada)
                     this.mostrarError(puteada)
                 })
         },

        isValid(){
            
            if(this.rol == null || this.rol == ''){
                this.mostrarMensaje('Operación  Incorrecta', 'Debe completar el Rol')
                return false
            }else if(this.descripcion == null || this.descripcion == ''){
                this.mostrarMensaje('Operación  Incorrecta', 'Debe colocar una breve descripcion del Rol')
                return false
            }
            return true
        },

        mostrarMensaje(titulo, mensaje){
            store.dispatch("alertDialog/mostrar", {titulo, mensaje})
        },

    },


    created() {
        this.getAllRoles()
        this.getAllMenu()
       },
}

</script>