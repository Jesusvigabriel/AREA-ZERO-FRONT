<template>
    <v-container>
       <v-spacer></v-spacer>
        <v-row v-show="listaUsuariosCompleta.length>0" class="col-md">
            <v-btn class="action-button" @click="createUser()">Crear nuevo usuario</v-btn>
        </v-row>
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
            <v-col class="py-0 my-0" v-if="listaUsuariosCompleta.length>0">
                <v-checkbox class="my-0" @change="changeVerSoloHabilitados" v-model="verSoloHabilitados" label="Ver solo usuarios habilitados"></v-checkbox>
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
                            <v-icon color="green"  v-bind="attrs" v-on="on" @click="getOneUsuario(item)">mdi-magnify-plus-outline</v-icon>
                            </template>
                            <span>Visualizar</span>
                        </v-tooltip>                           
                </template>
                </v-data-table>
            </v-col>
        </v-row>
         <!-- Dialog de Ajuste de Ingreso -->
         <v-row justify="center">
            <v-dialog v-model="usuarioDialog" persistent max-width="600px">
                <v-card class="rounded-card">
                    <v-card-title>
                        <span class="text-h5">Administración de Usuario</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row >
                                <v-col cols="12" sm="6" >
                                    <v-text-field
                                    v-model="usuario"
                                    label ="Usuario*"
                                    >
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field
                                        v-model="password"
                                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                        :type="show1 ? 'text' : 'password'"
                                        name="input-10-1"
                                        label ="Contraseña*"
                                        counter
                                        @click:append="show1 = !show1"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" >
                                  <v-combobox
                                    v-model="empresa"
                                    :items="listaEmpresasCompleta"
                                    item-text="Nombre"
                                    label="Empresa*"
                                 ></v-combobox>
                                </v-col>

                                <v-col cols="12" sm="6" >
                                  <v-combobox
                                    v-model="permiso"
                                    :items="listaPermisos"
                                    item-text="Nombre"
                                    label="Permiso"
                                 ></v-combobox>
                                </v-col>

                                 <v-col cols="12" sm="6" >
                                 <v-checkbox
                                    v-model="deshabilitado"
                                    label="Deshabilitado"
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

export default {
    name: "Usuarios",

    data() {
        return  {
            listaUsuariosCompleta: [],
            listaEmpresasCompleta: [],
            usuarioDialog : false,
            deshabilitado: false,
            verSoloHabilitados: false,
            idUsuario: null,
            empresa: null,
            password: null,
            usuario: null,
            idEmpresa:null,
            nombre_Empresa:null,
            action: null,
            show1: false,
            rules: {
            required: value => !!value || 'Required.',
            },
            cabecerasUsuarios: [
                    {text: 'Id', value: 'Id'},
                    {text: 'Usuario', value: 'Usuario'},
                    {text: 'Nombre Empresa',  value: 'Nombre_Empresa'},
                    {text: 'Habilitado', value: 'Deshabilitado'},
                    {text: '', value: 'Acciones'},
            ],
            textoBusqueda: '',
            listaPermisos: [1,2,3,4,5,6,7,8,9,10],
            permiso: null,
        }
    },
    
    methods: {

        getAllUsuarios() {
            this.listaUsuariosCompleta=[]
            usuarios.getAll()
                .then(respuesta => {
                    // console.log("Respuesta", respuesta);
                    this.listaUsuariosCompleta=respuesta
                    this.modificoHabilitado()
                    
                })
                .catch(puteada => {
                    //console.log("Puteada", puteada)
                    this.listaUsuariosCompleta=[]
                    this.mostrarError(puteada)
                })
        }, 

        modificoHabilitado(){
            this.listaUsuariosCompleta.forEach(u => {
                
                if (u.Deshabilitado == 0){
                    u.Deshabilitado = 'SI'
                }else{
                    u.Deshabilitado = 'NO'
                }
            })
        },

        getAllSoloUsuariosHabilitados() {
            this.listaUsuariosCompleta=[]
            usuarios.getAll()
                .then(respuesta => {
                    // console.log("Respuesta", respuesta);
                    this.listaUsuariosCompleta=respuesta.filter(u => u.Deshabilitado == 0)
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

        createUser(){
            this.usuarioDialog = true
            this.action = 'isNew'
        },
        resetValue(){

            this.usuario = null
            this.empresa = null
            this.password = null
            this.idUsuario = null
            this.idEmpresa = null
            this.nombre_Empresa = null
            this.deshabilitado = false
            this.usuarioDialog = false
            this.action = null
        },

        getAllEmpresas() {
            this.listaEmpresasCompleta=[]
             empresas.getAll()
                .then(respuesta => {
                    // console.log("Respuesta", respuesta);
                    this.listaEmpresasCompleta=respuesta
                    this.listaEmpresasCompleta.unshift(process.env.VUE_APP_Nombre.toUpperCase())
                })
                .catch(puteada => {
                    //console.log("Puteada", puteada)
                    this.listaEmpresasCompleta=[]
                    this.mostrarError(puteada)
                })
        },

        getOneUsuario(unUsuario){
            
            //Inicio el Formulario
            this.usuarioDialog = true
            // Cargo las Propiedades
            this.usuario = unUsuario.Usuario
            this.password = unUsuario.Password
            this.idEmpresa = unUsuario.IdEmpresa
            this.nombre_Empresa = unUsuario.Nombre_Empresa
            this.empresa =  this.listaEmpresasCompleta.find(e => e.Nombre = String(unUsuario.Nombre_Empresa))
            this.permiso = unUsuario.Permiso 
            this.idUsuario = unUsuario.Id
            // Valido si el usuario esta Deshabilitado
            if(unUsuario.Deshabilitado == 'SI'){
                this.deshabilitado = false
            }else{
                this.deshabilitado = true
            }

        },

        changeVerSoloHabilitados(){
            if(this.verSoloHabilitados == true){
                this.getAllSoloUsuariosHabilitados()
            }else{
                this.getAllUsuarios()
            }
        },

        saveUsuario(){
            let habilitado = 0
            if(this.action === 'isNew'){
               if(this.isValid()){
                   if(this.deshabilitado == true){
                       habilitado = 1
                   }
                   if(this.empresa.Id == 96){
                    this.idEmpresa = 0
                   }
                   if(this.empresa==process.env.VUE_APP_Nombre){
                    this.idEmpresa=0
                    this.nombre_Empresa=process.env.VUE_APP_Nombre+' S.A.'
                   }else{
                    this.idEmpresa=this.empresa.Id
                    this.nombre_Empresa=this.empresa.Nombre
                   }
                   this.createUsuario({Usuario: this.usuario, Password: this.password, IdEmpresa: this.idEmpresa, Permiso: this.permiso, Nombre_Empresa: this.nombre_Empresa, Terminos_Condiciones:0, Deshabilitado:habilitado   })
               }
            }else{
                if(this.isValid()){
                   if(this.deshabilitado == true){
                       habilitado = 1
                   }
                   if(this.idEmpresa == 96){
                    this.idEmpresa = 0
                   }
                   if(this.empresa==process.env.VUE_APP_Nombre){
                    this.idEmpresa=0
                    this.nombre_Empresa=process.env.VUE_APP_Nombre+' S.A.'
                   }else{
                    this.idEmpresa=this.empresa.Id
                    this.nombre_Empresa=this.empresa.Nombre
                   }
                   this.editUsuario(this.idUsuario,{Id: this.idUsuario, Usuario: this.usuario, Password: this.password, IdEmpresa: this.idEmpresa, Permiso: this.permiso, Nombre_Empresa: this.nombre_Empresa, Terminos_Condiciones:0, Deshabilitado:habilitado   })
               }
            }
            this.resetValue()
        },

        createUsuario(payload){
            let exist = false
            this.listaUsuariosCompleta.forEach(usuario => {
                if(usuario.Usuario === payload.Usuario){
                    exist = true
                }
            })

            if(!exist){
                usuarios.saveUsuario(payload)
                    .then(respuesta => {
                            this.usuarioDialog = false                         
                    }).catch(puteada => {
                        this.getAllUsuarios()
                    })      
            } else {
                this.mostrarError("El usuario ya existe")
                this.mostrarMensaje('Operación  Incorrecta', 'El usuario ya existe')
            }
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
            
            if(this.usuario == null){
                this.mostrarMensaje('Operación  Incorrecta', 'Debe completar el usuario')
                return false
            }else if(this.password == null){
                this.mostrarMensaje('Operación  Incorrecta', 'Debe completar la Contraseña')
                return false
            }else if (this.empresa == null){
                this.mostrarMensaje('Operación  Incorrecta', 'Debe completar la empresa')
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
        this.getAllEmpresas()
         
      
       },
}

</script>