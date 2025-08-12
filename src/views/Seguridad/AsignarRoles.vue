<template>
    <v-container>
       <v-spacer></v-spacer>
    
        <v-row class="pb-0 mb-0">
            <v-col class="py-0 my-0" v-if="listaUsuariosCompleta.length>0" >
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
            <v-col class="py-0" v-if="listaUsuariosCompleta.length>0">
                <v-data-table 
                    :headers="cabecerasUsuarios" 
                    :items="listaUsuariosCompleta"  
                    :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
                    :items-per-page="-1" 
                    :search="textoBusqueda"
                    class="elevation-3" 
                >
                <template v-slot:item.Acciones="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                            <v-icon color="green" v-bind="attrs" v-on="on" @click="getOneUsuario(item)">mdi-magnify-plus-outline</v-icon>
                            </template>
                            <span>Asignar Roles</span>
                        </v-tooltip>                           
                </template>
                </v-data-table>
            </v-col>
        </v-row>
         <!-- Dialog  -->
         <v-row justify="center">
            <v-dialog v-model="rolDialog" persistent max-width="600px">
                <v-card class="rounded-card">
                    <v-card-title>
                        <span class="text-h5">Asignacion de Roles por Usuario</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row >
                                <v-col cols="12" >
                                    <v-text-field
                                    v-model="usuario"
                                    label ="Usuario"
                                    disabled
                                    >
                                    </v-text-field>
                                </v-col>
                             
                                <v-col cols="12" sm="6" >
                                  <v-combobox
                                    v-model="rol"
                                    :items="listaRolesCompleta"
                                    item-text="Nombre"
                                    label="Roles"
                                 ></v-combobox>
                                </v-col>
                                 <v-col cols="12" sm="6" >
                                    <v-btn @click="asignarRol()" color="success" block>
                                        Asignar Rol
                                        </v-btn>
                                </v-col>
                                <v-row>
                                    <v-col class="py-0" v-if="rolesAsignados.length>=0">
                                        <v-spacer></v-spacer>
                                        <span class="text-h5">Roles asignados</span>
                                        <v-data-table 
                                            :headers="cabecerasRoles" 
                                            :items="roles"  
                                            :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
                                            :items-per-page="-1" 
                                            class="elevation-3" 
                                        >
                                        <template v-slot:item.Acciones="{ item }">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                    <v-icon color="red" v-bind="attrs" v-on="on" @click="deleteRol(item.Id)">mdi-close-outline</v-icon>
                                                    </template>
                                                    <span>Eliminar Rol</span>
                                                </v-tooltip>                           
                                        </template>
                                        </v-data-table>
                                    </v-col>
                                </v-row>
                                <v-card-actions>
                                
                                        <v-btn
                                            color="blue darken-1"
                                            text
                                            @click="resetValue()"
                                        >
                                            Cerrar
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
    name: "AsignaciónDeRoles",

    data() {
        return  {
            listaUsuariosCompleta: [],
            listaRolesCompleta: [],
            lista: [],
            roles:[],
            rolesAsignados:[],
            rolDialog : false,
            idRol:null,
            idUsuario: null,
            fecha_creacion: new Date(),
            rol: null,
            objectRol: null,
            usuario: null,
            usuarioActual: null,
            usuarioIdRol: null,
            action: null,
            rules: {
            required: value => !!value || 'Required.',
            },
            cabecerasUsuarios: [
                    {text: 'Id', value: 'Id'},
                    {text: 'Usuario', value: 'Usuario'},
                    {text: 'Nombre Empresa',  value: 'Nombre_Empresa'},
                    {text: '', value: 'Acciones'},
            ],
            cabecerasRoles: [
                    {text: 'Id', value: 'Id'},
                    {text: 'Nombre', value: 'Nombre'},
                    {text: '', value: 'Acciones'},
            ],
            textoBusqueda: '',
        }
    },
    
    methods: {

        nombreUsuario() {
           this.usuarioActual =  store.state.usuarios.usuarioActual.Nombre
        },

        asignarRol(){

            this.nombreUsuario()
            
            if(this.rol !=null){
                if(this.isValid(this.rol.Id)){
                    this.createUserRol({IdUsuario: this.idUsuario, IdRole: this.rol.Id, Fecha_Creacion: this.fecha_creacion, Usuario: this.usuarioActual})
                    
                }
            }
           
        },



         deleteRol(idRol){
             roles.deleteRol(this.idUsuario,idRol)
             .then(respuesta => {
                 // console.log("Respuesta", respuesta);
                 this.rolesAsignados=[]
                 this.roles = []
                 this.getUserRolesById(this.idUsuario)    
                        
                 })
                 .catch(puteada => {
                    //console.log("Puteada", puteada)
                   this.mostrarError(puteada)
                 })
         },

        getAllUsuarios() {
            this.listaUsuariosCompleta=[]
            usuarios.getAll()
                .then(respuesta => {
                    // console.log("Respuesta", respuesta);
                    this.listaUsuariosCompleta=respuesta.filter(u => u.Deshabilitado == 0)
                    
                    
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

        resetValue(){

            this.usuario = null  
            this.idUsuario = null
            this.rolDialog = false
            this.action = null

            this.rolesAsignados=[]
            this.roles=[]
        },

        getAllRoles() {
            this.listaRolesCompleta=[]
             roles.getAll()
                .then(respuesta => {
                    // console.log("Respuesta", respuesta);
                    this.listaRolesCompleta=respuesta
                        
                })
                .catch(puteada => {
                    //console.log("Puteada", puteada)
                    this.listaRolesCompleta=[]
                    this.mostrarError(puteada)
                })
        },

        getOneUsuario(unUsuario){
            //Inicio el Formulario
            this.rolDialog = true
            // Cargo las Propiedades
            this.usuario = unUsuario.Usuario
            this.password = unUsuario.Password
            this.idUsuario = unUsuario.Id

            this.getUserRolesById(this.idUsuario)

        },


        createUserRol(payload){
            console.log(payload)
            roles.saveUserRol(payload)
            
                .then(respuesta => {
                     //console.log("Respuesta", respuesta);
                     this.rolesAsignados=[]
                    this.roles=[]
                    this.getUserRolesById(this.idUsuario)
                                
                })
                .catch(puteada => {
                    //console.log("Puteada", puteada)
                    //this.mostrarError(puteada)
                    this.rolesAsignados=[]
                    this.roles=[]
                    this.getUserRolesById(this.idUsuario)
                   
                })
                
        },


        getUserRolesById(id){
            let idUser = store.state.usuarios.usuarioActual.Id
            usuarios.getUserById(idUser)
            .then(response=>{
                this.usuarioIdRol = []
                this.usuarioIdRol = response[0].IdRol
                roles.getUserRolesById(id)
                .then(respuesta => {
                    // console.log("Respuesta", respuesta);
                    this.rolesAsignados=respuesta
                    this.filtrarRoles()
                })
                .catch(puteada => {
                    //console.log("Puteada", puteada)
                    this.mostrarError(puteada)
                })
            }) 
            .catch({
                
            })
            
        },

        filtrarRoles(){
            this.lista = []
            this.rolesAsignados.forEach(r => {
                this.roles.push(this.listaRolesCompleta.find(e => e.Id == r.IdRole))
            })
            console.log(this.usuarioIdRol)
            if(this.usuarioIdRol != 1){

                this.listaRolesCompleta.forEach(r => {
                    if(r.Id != 1){
                        this.lista.push(r)
                    }
                })
                this.listaRolesCompleta = []
                this.listaRolesCompleta = this.lista
                
            }
            
        },

        isValid(idRol){
            let flag = 0
            if(this.rol == null || this.rol == ''){
                this.mostrarMensaje('Operación  Incorrecta', 'Debe completar el rol a asignar')
                return false
            }

            for(const rol of this.roles){
                if(rol.Id == idRol){
                    this.mostrarMensaje('Operación  Incorrecta', 'El usuario ya tiene este Rol asignado')
                    flag = 1
                    break
                   
                }
            }
            if(flag == 1){
                return false
            }
            return true
        },

        mostrarMensaje(titulo, mensaje){
            store.dispatch("alertDialog/mostrar", {titulo, mensaje})
        },

    },


    created() {
        this.getAllUsuarios()
        this.getAllRoles()
       },
}

</script>