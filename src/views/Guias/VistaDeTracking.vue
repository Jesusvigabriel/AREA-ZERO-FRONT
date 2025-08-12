<template>
  <v-container>
    <v-row justify="center">
      <v-dialog v-model="seguimientoDialog" persistent max-width="1000px" >
        <v-card>
          <v-card-title>
            <v-row>
              <v-col align="center">
                <span class="text-h5" align="center" v-text="`Seguimiento de envio - ${this.Remitos}`"></span>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <template>
              <v-timeline> 
                <v-timeline-item
                  v-for="(year, i) in ordenTraking"
                  :key="i"
                  :color="year.color"
                  :icon="year.icon"
                  large
                >
                <div class="py-4">
                  <h2 :class="`headline font-weight-light mb-4 ${year.color}--text`" v-text="`${year.estado}`">     
                  </h2>
                  <div v-text="`${year.descripcion}`">
                  </div>
                </div>
                </v-timeline-item>
              </v-timeline>
            </template>
          </v-card-text>
          <v-card-title v-if="Reenvio!=''">
            <v-row>
              <v-col align="center">
                <v-btn small color="blue" class="ma-2 white--text"  align="center" v-text="`${this.intentos} - ${this.Reenvio}`"></v-btn>
                <v-btn
                  small
                  color="blue"
                  class="ma-2 white--text"
                  @click="verReenvio()"
                >
                  Ver reenvio
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>

import store from "../../store"
import guias from "@/store/guias"


export default {
    
    name: "VistaDeTracking",

    data() {
      
      return {
        idEmpresa: -1,
        TokenAccesoTracking:'',
        Remitos:'',
        Reenvio:'',
        intentos:'',
        Comprobante:null,
        remito: [],
        seguimientoDialog:false,
        ordenTraking: [
          {
            color: 'green',
            estado: 'Pedido en preparación',
            icon: 'mdi-clipboard-list-outline',
            descripcion: 'Actualmente estamos trabajando en procesar tu pedido para que llegue a tus manos lo mas pronto posible.',
          },
          {
            color: 'green',
            estado: 'Pedido preparado',
            icon: 'mdi-cube-outline',
            descripcion: 'Tu pedido ha sido preparado y está listo para el proceso de distribución.',
          },
          {
            color: 'green',
            estado: 'En CD',
            icon: 'mdi-warehouse',
            descripcion: 'Tu pedido se encuentra en proceso de Cross Docking en nuestras instalaciones, ¡Pronto esta en camino hacia su destino final!',
          },
          {
            color: 'green',
            estado: 'En distribución',
            icon: 'mdi-truck-fast-outline',
            descripcion: '¡Tu pedido ya está en camino!',
          },
          {
            color: 'green',
            estado: 'Entregado',
            icon: 'mdi-truck-check-outline',
            descripcion: 'Tu pedido fue entrega con exito.',
          },
          {
            color: 'red',
            estado: 'No entregado',
            icon: 'mdi-truck',
            descripcion: 'Al no haberse podido entregar tu pedido se recordinara.',
          },
          {
            color: 'yellow',
            estado: 'Entrega parcial',
            icon: 'mdi-truck',
            descripcion: 'Por algun motivo no se pudo entregar tu pedido de forma completa.',
          },

          {
            color: 'green',
            estado: 'Pedido en preparación',
            icon: 'mdi-clipboard-list-outline',
            descripcion: 'Actualmente estamos trabajando en procesar tu pedido para que llegue a tus manos lo mas pronto posible.',
          },
          {
            color: 'green',
            estado: 'Pedido preparado',
            icon: 'mdi-cube-outline',
            descripcion: 'Tu pedido ha sido preparado y está listo para el proceso de distribución.',
          },
          {
            color: 'green',
            estado: 'Pedido retirado',
            icon: 'mdi-kabaddi',
            descripcion: 'El pedido fue retirado de nuestro centro de distribución.',
          },
        ]
      }

    },

    methods: {

      getOrder(comprobante, tockenAccesoTracking){
        guias.getPlanchadaByComprobanteAndToken(comprobante, tockenAccesoTracking)
        .then(response => {
          this.aperturaDeSeguimiento(response[0])          
        })
        .catch(error => {
          console.log(error)
        })
      },

      async aperturaDeSeguimiento(item){
        this.Remitos= null
        this.Comprobante= null
        this.TokenAccesoTracking = null
        this.intentos = 'Reenvio'
        this.Comprobante= item.Comprobante
        this.TokenAccesoTracking = item.TokenAccesoTracking
        this.Remitos= item.Remitos
        if(item.Remitos.includes('9999')){
          this.remito = await store.dispatch('remitos/getById', encodeURIComponent(item.Remitos.slice(-5)))
          this.remito.forEach(r => {
            if(r.Remitos.includes('9991')){
              this.Reenvio = r.Remitos
              this.intentos = 'Segundo Reenvio'
            }
          })
        }else if(item.Remitos.includes('9991')){
          this.remito = await store.dispatch('remitos/getById', encodeURIComponent(item.Remitos))
          this.remito.forEach(r => {
            if(r.Remitos.includes('9992')){
              this.Reenvio = r.Remitos
              this.intentos = 'Tercer Reenvio'
            }
          })
        }else{
          this.remito = await store.dispatch('remitos/getById', encodeURIComponent(item.Remitos))
          this.remito.forEach(r => {
            if(r.Remitos.includes('9999')){
              this.Reenvio = r.Remitos
              this.intentos = 'Primer Reenvio'
            }
          })
        }
        this.generaVistaTraking(item)
        this.seguimientoDialog=true
      },

      generaVistaTraking(unaGuia){
        this.ordenTraking=[]     
        if(unaGuia.Domicilio.toLowerCase().includes("lagos garcia 4470")){
          switch (unaGuia.Estado) {
            
            case "ENTREGADO":
                this.ordenTraking= [
                  {
                    color: 'green',
                    estado: 'Pedido en preparación',
                    icon: 'mdi-clipboard-list-outline',
                    descripcion: 'Actualmente estamos trabajando en procesar tu pedido para que llegue a tus manos lo mas pronto posible.',
                  },
                  {
                    color: 'green',
                    estado: 'Pedido preparado',
                    icon: 'mdi-cube-outline',
                    descripcion: 'Tu pedido ha sido preparado y está listo para el proceso de distribución.',
                  },
                  {
                    color: 'green',
                    estado: 'Pedido retirado',
                    icon: 'mdi-kabaddi',
                    descripcion: 'El pedido fue retirado de nuestro centro de distribución.',
                  }
                ]
                break;
              
              case "RETIRA CLIENTE":
                this.ordenTraking= [
                  {
                    color: 'green',
                    estado: 'Pedido en preparación',
                    icon: 'mdi-clipboard-list-outline',
                    descripcion: 'Actualmente estamos trabajando en procesar tu pedido para que llegue a tus manos lo mas pronto posible.',
                  },
                  {
                    color: 'green',
                    estado: 'Pedido preparado',
                    icon: 'mdi-cube-outline',
                    descripcion: 'Tu pedido ha sido preparado y está listo para el proceso de distribución.',
                  },
                  {
                    color: 'grey',
                    estado: 'Pedido retirado',
                    icon: 'mdi-kabaddi',
                    descripcion: 'El pedido fue retirado de nuestro centro de distribución.',
                  }
                ]
                break;

              default:
              break;
            }
        } else {
          switch (unaGuia.Estado) {

            case "ENTREGADO":
                this.ordenTraking= [
                  {
                    color: 'green',
                    estado: 'Pedido en preparación',
                    icon: 'mdi-clipboard-list-outline',
                    descripcion: 'Actualmente estamos trabajando en procesar tu pedido para que llegue a tus manos lo mas pronto posible.',
                  },
                  {
                    color: 'green',
                    estado: 'Pedido preparado',
                    icon: 'mdi-cube-outline',
                    descripcion: 'Tu pedido ha sido preparado y está listo para el proceso de distribución.',
                  },
                  {
                    color: 'green',
                    estado: 'En CD',
                    icon: 'mdi-warehouse',
                    descripcion: 'Tu pedido se encuentra en proceso de Cross Docking en nuestras instalaciones, ¡Pronto esta en camino hacia su destino final!',
                  },
                  {
                    color: 'green',
                    estado: 'En distribución',
                    icon: 'mdi-truck-fast-outline',
                    descripcion: '¡Tu pedido ya está en camino!',
                  },
                  {
                    color: 'green',
                    estado: 'Entregado',
                    icon: 'mdi-truck-check-outline',
                    descripcion: 'Tu pedido fue entrega con exito.',
                  }
                ]
              break;

            case "PARCIAL":
              this.ordenTraking= [
                {
                  color: 'green',
                  estado: 'Pedido en preparación',
                  icon: 'mdi-clipboard-list-outline',
                  descripcion: 'Actualmente estamos trabajando en procesar tu pedido para que llegue a tus manos lo mas pronto posible.',
                },
                {
                  color: 'green',
                  estado: 'Pedido preparado',
                  icon: 'mdi-cube-outline',
                  descripcion: 'Tu pedido ha sido preparado y está listo para el proceso de distribución.',
                },
                {
                  color: 'green',
                  estado: 'En CD',
                  icon: 'mdi-warehouse',
                  descripcion: 'Tu pedido se encuentra en proceso de Cross Docking en nuestras instalaciones, ¡Pronto esta en camino hacia su destino final!',
                },
                {
                  color: 'green',
                  estado: 'En distribución',
                  icon: 'mdi-truck-fast-outline',
                  descripcion: '¡Tu pedido ya está en camino!',
                },
                {
                  color: 'yellow',
                  estado: 'Entrega parcial',
                  icon: 'mdi-truck',
                  descripcion: 'Por algun motivo no se pudo entregar tu pedido de forma completa.',
                }
              ]
              break;

            case "NO ENTREGADO":
              this.ordenTraking= [
                {
                  color: 'green',
                  estado: 'Pedido en preparación',
                  icon: 'mdi-clipboard-list-outline',
                  descripcion: 'Actualmente estamos trabajando en procesar tu pedido para que llegue a tus manos lo mas pronto posible.',
                },
                {
                  color: 'green',
                  estado: 'Pedido preparado',
                  icon: 'mdi-cube-outline',
                  descripcion: 'Tu pedido ha sido preparado y está listo para el proceso de distribución.',
                },
                {
                  color: 'green',
                  estado: 'En CD',
                  icon: 'mdi-warehouse',
                  descripcion: 'Tu pedido se encuentra en proceso de Cross Docking en nuestras instalaciones, ¡Pronto esta en camino hacia su destino final!',
                },
                {
                  color: 'green',
                  estado: 'En distribución',
                  icon: 'mdi-truck-fast-outline',
                  descripcion: '¡Tu pedido ya está en camino!',
                },
                {
                  color: 'red',
                  estado: 'No entregado',
                  icon: 'mdi-truck',
                  descripcion: `${unaGuia.Fecha} Al no haberse podido entregar tu pedido se recordinara.`,
                }
              ]
              break;

            case "DESPACHADO":
              this.ordenTraking= [
                {
                  color: 'green',
                  estado: 'Pedido en preparación',
                  icon: 'mdi-clipboard-list-outline',
                  descripcion: 'Actualmente estamos trabajando en procesar tu pedido para que llegue a tus manos lo mas pronto posible.',
                },
                {
                  color: 'green',
                  estado: 'Pedido preparado',
                  icon: 'mdi-cube-outline',
                  descripcion: 'Tu pedido ha sido preparado y está listo para el proceso de distribución.',
                },
                {
                  color: 'green',
                  estado: 'En CD',
                  icon: 'mdi-warehouse',
                  descripcion: 'Tu pedido se encuentra en proceso de Cross Docking en nuestras instalaciones, ¡Pronto esta en camino hacia su destino final!',
                },
                {
                  color: 'green',
                  estado: 'En distribución',
                  icon: 'mdi-truck-fast-outline',
                  descripcion: '¡Tu pedido ya está en camino!',
                },
                {
                  color: 'grey',
                  estado: 'Entregado',
                  icon: 'mdi-truck-check-outline',
                  descripcion: 'Tu pedido fue entrega con exito.',
                }
              ]
              break;

            case "Ruteado":
              this.ordenTraking= [
                {
                  color: 'green',
                  estado: 'Pedido en preparación',
                  icon: 'mdi-clipboard-list-outline',
                  descripcion: 'Actualmente estamos trabajando en procesar tu pedido para que llegue a tus manos lo mas pronto posible.',
                },
                {
                  color: 'green',
                  estado: 'Pedido preparado',
                  icon: 'mdi-cube-outline',
                  descripcion: 'Tu pedido ha sido preparado y está listo para el proceso de distribución.',
                },
                {
                  color: 'green',
                  estado: 'En CD',
                  icon: 'mdi-warehouse',
                  descripcion: 'Tu pedido se encuentra en proceso de Cross Docking en nuestras instalaciones, ¡Pronto esta en camino hacia su destino final!',
                },
                {
                  color: 'grey',
                  estado: 'En distribución',
                  icon: 'mdi-truck-fast-outline',
                  descripcion: '¡Tu pedido ya está en camino!',
                },
                {
                  color: 'grey',
                  estado: 'Entregado',
                  icon: 'mdi-truck-check-outline',
                  descripcion: 'Tu pedido fue entrega con exito.',
                }
              ]
              break;

            case "En Planchada":
              this.ordenTraking= [
                {
                  color: 'green',
                  estado: 'Pedido en preparación',
                  icon: 'mdi-clipboard-list-outline',
                  descripcion: 'Actualmente estamos trabajando en procesar tu pedido para que llegue a tus manos lo mas pronto posible.',
                },
                {
                  color: 'green',
                  estado: 'Pedido preparado',
                  icon: 'mdi-cube-outline',
                  descripcion: 'Tu pedido ha sido preparado y está listo para el proceso de distribución.',
                },
                {
                  color: 'green',
                  estado: 'En CD',
                  icon: 'mdi-warehouse',
                  descripcion: 'Tu pedido se encuentra en proceso de Cross Docking en nuestras instalaciones, ¡Pronto esta en camino hacia su destino final!',
                },
                {
                  color: 'grey',
                  estado: 'En distribución',
                  icon: 'mdi-truck-fast-outline',
                  descripcion: '¡Tu pedido ya está en camino!',
                },
                {
                  color: 'grey',
                  estado: 'Entregado',
                  icon: 'mdi-truck-check-outline',
                  descripcion: 'Tu pedido fue entrega con exito.',
                }
              ]
              break;

            case "ANULADO":
              this.ordenTraking= [
                {
                  color: 'grey',
                  estado: 'Pedido en preparación',
                  icon: 'mdi-clipboard-list-outline',
                  descripcion: 'Actualmente estamos trabajando en procesar tu pedido para que llegue a tus manos lo mas pronto posible.',
                },
                {
                  color: 'grey',
                  estado: 'Pedido preparado',
                  icon: 'mdi-cube-outline',
                  descripcion: 'Tu pedido ha sido preparado y está listo para el proceso de distribución.',
                },
                {
                  color: 'grey',
                  estado: 'En CD',
                  icon: 'mdi-warehouse',
                  descripcion: 'Tu pedido se encuentra en proceso de Cross Docking en nuestras instalaciones, ¡Pronto esta en camino hacia su destino final!',
                },
                {
                  color: 'grey',
                  estado: 'En distribución',
                  icon: 'mdi-truck-fast-outline',
                  descripcion: '¡Tu pedido ya está en camino!',
                },
                {
                  color: 'grey',
                  estado: 'Entregado',
                  icon: 'mdi-truck-check-outline',
                  descripcion: 'Tu pedido fue entrega con exito.',
                }            
              ]
              break;

            default:
              break;
          }
        }
      }
    
    },

    created() {
        this.getOrder(this.$route.params.comprobante, this.$route.params.tockenAccesoTracking)
    }

}

</script>