<template>
  <v-container>
       
      <v-row>
      <v-card-text>
   
    </v-card-text>
        <v-col>
                <form action="/subir" method="post" enctype="multipart/form-data">
                   <v-file-input  
                      v-model:value="urlImage"
                      prepend-icon="mdi-camera"
                      accept="image/png, image/jpeg, image/jpg" 
                      name="file" 
                      small-chips
                      multiple>
                      </v-file-input>

                      <v-row justify="center">
                      <v-col class="py-0" cols="3">
                          <v-btn @click="imgTransform" :disabled="habilitaControl"  color="success" block>Obtener Numeros de Guias<v-icon>mdi-refresh</v-icon></v-btn>
                      </v-col>
                      <v-col class="py-0" cols="3" v-if="this.imagenes.length>0" >
                          <v-btn @click="createNovedades"  color="success" block>Cargar Novedades<v-icon>mdi-camera</v-icon></v-btn>
                      </v-col>
                    </v-row>

                </form>
        </v-col>  
    </v-row>
    
    <v-row>
      <v-col class="py-0" v-if="this.imageFailed.length>0">
        <v-textarea
          label="Imagenes no Subidas"
          no-resize
          rows="1"
         v-model:value="imageFailed"
        ></v-textarea>
      </v-col>
    </v-row>
        <v-row>
      <v-col class="py-0" v-if="imagenes.length>0" >
        <v-data-table 
          :headers="cabeceras"
          :items="imagenes"  
          :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
          :items-per-page="30" 
          class="elevation-3"      
        >
          <template v-slot:item.nGuia="{item}">
          <v-edit-dialog
            :return-value.sync="item.nGuia"
            large
            persistent
            @save="save"
            @cancel="cancel"
            @open="open"
            @close="close"
          >
            <div>{{ item.nGuia }}</div>
            
            <template v-slot:input>
              <v-text-field
                v-model="item.nGuia"
                label="Edit"
                single-line
                counter
                autofocus
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </template>
        </v-data-table>
      </v-col>
      </v-row>
  </v-container>  

</template>


<script>

import guias from "../../store/guias"
import store from "../../store"
import choferes from '../../store/choferes'
import fechas from 'vue-lsi-util/fechas'
import {nanoid} from 'nanoid'
import SelectorEmpresa from '@/components/SelectorEmpresa.vue'




export default {
  name: "CargarNovedadesGuias",

  data() {
    return {
      urlImage:[],
      img:[],
      imagenes: [],
      cabeceras: [
        {text: 'Nombre Imagen', value: 'nImage', with:'50%'},
        {text: 'Numero Guia', value: 'nGuia'},
      ],
      idGuia:null,
      hashNano: '',
      nameFile:'',
      imageFailed:[],
    }
  },
  
  computed: {

          habilitaControl()
          {
            return this.urlImage.length<=0;
          },

  },
  methods: {
  
         save () {
            this.snack = true
            this.snackColor = 'success'
            this.snackText = 'Data saved'
          },
          cancel () {
            this.snack = true
            this.snackColor = 'error'
            this.snackText = 'Canceled'
          },
          open () {
            this.snack = true
            this.snackColor = 'info'
            this.snackText = 'Dialog opened'
          },
          close () {
            console.log('Dialog closed')
          },

      imgTransform() 
      {
        //Creamos una instancia de Form
        const formImage = new FormData()
        // Recorremos las imagenes y las agregamos a nuestro from para enviarlas a la API
        this.urlImage.forEach(file => 
          formImage.append('image', file)   
        )
       
       //Ejecutamos las funcion que nos va a devolver los numeros de guia
        guias.getNumeroGuia(formImage)
        .then(data => {  
          this.imagenes = data
        })

      },  
    



    ResetValue()
    {
      this.urlImage=null
      
    },


        createNovedades()
        {
          
            this.imagenes.forEach(guias => 
            {
              if(!isNaN(guias.nGuia))
              {
                
                 this.idGuia = guias.nGuia
                this.hashNano = nanoid()
                this.nameFile = `a54_cfde_${this.idGuia}_${this.hashNano}`
                this.img = this.urlImage.find(file => file.name == guias.nImage )
                console.log(this.urlImage)
                console.log(String(guias.nImage))
                console.log(this.img)
                this.gestorCargue()
              }else
              {
                  this.imageFailed.push(' '+ guias.nImage)
              }
               this.img=null
                
            } )
            

        },

    gestorCargue() {

          guias.registrarhashDocumentacionEntrega(this.idGuia, this.hashNano)
                .then(respuesta => {
                    
                    store.dispatch("alertDialog/mostrar", {titulo: "Registración exitosa", mensaje: "Se registro el Documento Correctamente"})
                })
                .catch(puteada => {
                    console.log(puteada)
                    
                })

         choferes.actions.uploadFileToAws(this.img, this.nameFile)
                .then(respuesta => {
                    
                    store.dispatch("alertDialog/mostrar", {titulo: "Registración exitosa", mensaje: "Se registro el Documento Correctamente"})
                })
                .catch(puteada => {
                    console.log(puteada)
                })
      
      },


    mostrarMensaje(mensaje, titulo) {
      store.dispatch("alertDialog/mostrar", {titulo, mensaje, botonPrimario: "Entendido"})
    },
    mostrarError(mensaje) {
      store.dispatch("snackbar/mostrar", mensaje)
    }

    
  },



}
</script>