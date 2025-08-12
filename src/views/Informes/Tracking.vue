<template>
  <v-container>
    <v-row justify="center">
      <v-col class="py-3" cols="2" align="start">
         <v-checkbox label="Una empresa" v-model="elegirEmpresa" class="py-0 my-0" v-show="empresaLoggeada()<=0"></v-checkbox>
    </v-col>      
      <v-col cols="4" v-show="elegirEmpresa && empresaLoggeada()<=0">
        <SelectorEmpresa @eligioEmpresa="eligioEmpresa($event)" :idEmpresaInicialmenteSeleccionada="idEmpresa" ></SelectorEmpresa>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="3">
        <v-text-field prepend-inner-icon="mdi-calendar" type="date" label="Desde" v-model="fechaDesde" dense></v-text-field>
      </v-col>
      <v-col  cols="3">
        <v-text-field prepend-inner-icon="mdi-calendar" type="date" label="Hasta" v-model="fechaHasta" dense></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col class="py-0" cols="3">
          <v-btn @click="obtenerInformacion()" color="success" block>Obtener información<v-icon>mdi-refresh</v-icon></v-btn>
      </v-col>
    </v-row>

   

    <v-row v-show="informacionAExportar.length>0" class="pb-0 mb-0">
        <v-col class="py-0 my-0"  >
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
      <v-col class="py-0" v-if="informacionAExportar.length>0">
        <v-data-table 
          :headers="cabeceras" 
          :search="textoBusqueda"
          item-key="Id"
          :singleSelect=false
          show-select
          v-model="guiasSeleccionadas"
          :items="informacionAExportar"  
          :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
          :items-per-page="30" 
          class="elevation-3" 
        >
        <template v-slot:item.Acciones="{item}">
          <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                      <v-icon v-if="item.Estado.trim()!='NO ENTREGADO'" v-bind="attrs"  v-on="on"  color="blue"  @click="verDocumentacionGuia(item)">mdi-clipboard-text</v-icon>
                      </template>
                      <span>Ver Documento Guia</span>
          </v-tooltip>
          <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                      <v-icon v-bind="attrs"  v-on="on"  color="green"  @click="aperturaDeSeguimiento(item)">mdi-order-bool-descending-variant</v-icon>
                      </template>
                      <span>Ver Seguimiento</span>
          </v-tooltip>
        </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row justify="center">
            <v-dialog v-model="seguimientoDialog" persistent max-width="1000px" >
                <v-card class="rounded-card">
                    <v-card-title>
                      <v-row>
                        <v-col align="center">
                        <span class="text-h5" align="center" v-text="`Seguimiento de envio - ${this.Remitos}`"></span>
                        <v-btn
                        small
                        color="blue-grey"
                        class="ma-2 white--text"
                        @click="verTurnoDeSeguimiento()"
                      >
                        Ver turno de envío
                      </v-btn>
                    </v-col>
                      </v-row>
                        
                    </v-card-title>
                    <v-card-text>
                      <template>
                        <v-timeline  > 
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
                    <v-card-actions>
                      <v-btn color="primary" block @click="cierreDeSeguimiento()">Cerrar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
      
        <!-- Dialog de Seguimiento -->
  </v-container>
</template>

<script>

import store from "../../store"
import SelectorEmpresa from '@/components/SelectorEmpresa.vue'
import ordenes from "@/store/ordenesV3"
import guias from "@/store/guias"
import fechas from 'vue-lsi-util/fechas'
import cadenas from 'vue-lsi-util/cadenas'




export default {
  name: "Informes_Tracking",

  data() {
    return {
      quitarAnuladas: [],
      mostrarVentanaEdicion: false,
      fechaDesde: '2021-11-01',
      fechaHasta: '2021-11-01',
      idEmpresa: -1,
      hashExcel: '',
      TokenAccesoTracking:'',
      Remitos:'',
      Reenvio:'',
      intentos:'',
      Comprobante:null,
      informacionAExportar: false,
      elegirEmpresa: false,
      guiasSeleccionadas: [],
      informacionAExportar: [],
      remito: [],
      textoBusqueda: '',
      cabeceras: [
        {text: 'Número', value: 'Comprobante'},
        {text: 'Destino', value: 'NombreDestino', width: '25%'},
        {text: 'Bultos', value: 'Bultos'},
        {text: 'Remitos', value: 'Remitos', width: '15%'},
        {text: 'Fecha', value: 'Fecha', width: '12%'},
        {text: 'F.Original', value: 'FechaOriginal', width: '12%'},
        {text: 'Estado', value: 'Estado', width: '12%'},
        {text: 'Turno de Entrega', value: 'OrdenEntrega', width: '5%'},
        {text: '', value: 'Acciones', sortable: true, width: '10%'},
      ],
      guiaEnEdicion: {},
      detalleCalculoGuia:{},
      nombreCliente: "",
      seguimientoDialog:false,
      orden:{},
      fechaCreacion:'',
      fechaPreparado:'',
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
        
      ],
    }
  },

  methods: {
    async verDocumentacionGuia(item) {

      try {
        const results=await guias.getFotosDocumentacionEntrega(item.Id)
        for (const unaFoto of results) {
          const url=`https://a54-choferes-fotos-documentacion-entrega.s3.amazonaws.com/a54_cfde_${item.Id}_${unaFoto.Hash}`
          window.open(url, "_blank")
        }
      } catch (error) {
        console.log("Error", error)
      }
    },
    empresaLoggeada() {
        if (!store.state.usuarios.usuarioActual.IdEmpresa) { 
            return -1
        } else {
            return store.state.usuarios.usuarioActual.IdEmpresa
        }
    },

    cierreDeSeguimiento(){
      this.Remitos= null
      this.TokenAccesoTracking= null
      this.Comprobante = null
      this.seguimientoDialog=false
      this.Reenvio = ''
      
    },

    verTurnoDeSeguimiento(){
      const URL = `https://seguimiento.area54sa.com.ar/tracking/${this.Comprobante}/${this.TokenAccesoTracking}`
      window.open(URL,'_blank')
    },


   verReenvio(){
      this.remito.forEach(r => {
          if(r.Remitos === this.Reenvio){
            this.aperturaDeSeguimiento(r)
          }
          
      })
   }  ,
  
  async  aperturaDeSeguimiento(item){
      this.Remitos= null
      this.Comprobante= null
      this.TokenAccesoTracking = null
      this.intentos = 'Reenvio'
      
      

      this.Comprobante= item.Comprobante
      this.TokenAccesoTracking = item.TokenAccesoTracking
      this.Remitos= item.Remitos

      if(isNaN(item.Remitos != true)){
        if(item.Remitos.includes('9999')){
          this.remito = await store.dispatch('remitos/getById', item.Remitos.slice(-5))
          
          this.remito.forEach(r => {
            if(r.Remitos.includes('9991')){
              this.Reenvio = r.Remitos
              this.intentos = 'Segundo Reenvio'
            }
          })
        }else if(item.Remitos.includes('9991')){
          this.remito = await store.dispatch('remitos/getById', item.Remitos)

          this.remito.forEach(r => {
            if(r.Remitos.includes('9992')){
              this.Reenvio = r.Remitos
              this.intentos = 'Tercer Reenvio'
            }
        })
        } else {
          this.remito = await store.dispatch('remitos/getById', item.Remitos)

          this.remito.forEach(r => {
            if(r.Remitos.includes('9999')){
              this.Reenvio = r.Remitos
              this.intentos = 'Primer Reenvio'
            }
        })
        }

    }

      
      
    if(item.IdOrden != null){
      this.orden = await ordenes.getById(item.IdOrden)
      
        if(this.orden.FechaCreacion != null){
          this.fechaCreacion = this.orden.FechaCreacion.substr(0, 10)
        }
        if(this.orden.FechaPreparado != null){
          this.fechaPreparado = this.orden.FechaPreparado.substr(0, 10)
        }
        
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
                    descripcion: `${this.fechaCreacion} Actualmente estamos trabajando en procesar tu pedido para que llegue a tus manos lo mas pronto posible.`,
                  },
                  {
                    color: 'green',
                    estado: 'Pedido preparado',
                    icon: 'mdi-cube-outline',
                    descripcion: `${this.fechaPreparado} Tu pedido ha sido preparado y está listo para el proceso de distribución.`,
                  },
                  {
                    color: 'green',
                    estado: 'Pedido retirado',
                    icon: 'mdi-kabaddi',
                    descripcion: 'El pedido fue retirado de nuestro centro de distribución.',
                  },            
                ]
              break;
              case "RETIRA CLIENTE":
                this.ordenTraking= [
                {
                    color: 'green',
                    estado: 'Pedido en preparación',
                    icon: 'mdi-clipboard-list-outline',
                    descripcion: `${this.fechaCreacion} Actualmente estamos trabajando en procesar tu pedido para que llegue a tus manos lo mas pronto posible.`,
                  },
                  {
                    color: 'green',
                    estado: 'Pedido preparado',
                    icon: 'mdi-cube-outline',
                    descripcion: `${this.fechaPreparado} Tu pedido ha sido preparado y está listo para el proceso de distribución.`,
                  },
                  {
                    color: 'grey',
                    estado: 'Pedido retirado',
                    icon: 'mdi-kabaddi',
                    descripcion: 'El pedido fue retirado de nuestro centro de distribución.',
                  },            
                ]
              break;

              default:
              break;
            }
        }else{
            switch (unaGuia.Estado) {
            case "ENTREGADO":
                this.ordenTraking= [
                  {
                    color: 'green',
                    estado: 'Pedido en preparación',
                    icon: 'mdi-clipboard-list-outline',
                    descripcion: `${this.fechaCreacion} Actualmente estamos trabajando en procesar tu pedido para que llegue a tus manos lo mas pronto posible.`,
                  },
                  {
                    color: 'green',
                    estado: 'Pedido preparado',
                    icon: 'mdi-cube-outline',
                    descripcion: `${this.fechaPreparado} Tu pedido ha sido preparado y está listo para el proceso de distribución.`,
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
                    descripcion: `${unaGuia.Fecha} Tu pedido fue entrega con exito.`,
                  },            
                ]
              break;
            case "PARCIAL":
            this.ordenTraking= [
                  {
                    color: 'green',
                    estado: 'Pedido en preparación',
                    icon: 'mdi-clipboard-list-outline',
                    descripcion: `${this.fechaCreacion} Actualmente estamos trabajando en procesar tu pedido para que llegue a tus manos lo mas pronto posible.`,
                  },
                  {
                    color: 'green',
                    estado: 'Pedido preparado',
                    icon: 'mdi-cube-outline',
                    descripcion: `${this.fechaPreparado} Tu pedido ha sido preparado y está listo para el proceso de distribución.`,
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
                    descripcion: `${unaGuia.Fecha} Por algun motivo no se pudo entregar tu pedido de forma completa.`,
                  },            
                ]
              break;
            case "NO ENTREGADO":
            this.ordenTraking= [
                  {
                    color: 'green',
                    estado: 'Pedido en preparación',
                    icon: 'mdi-clipboard-list-outline',
                    descripcion: `${this.fechaCreacion} Actualmente estamos trabajando en procesar tu pedido para que llegue a tus manos lo mas pronto posible.`,
                  },
                  {
                    color: 'green',
                    estado: 'Pedido preparado',
                    icon: 'mdi-cube-outline',
                    descripcion: `${this.fechaPreparado} Tu pedido ha sido preparado y está listo para el proceso de distribución.`,
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
                  },            
                ]
              break;
            case "DESPACHADO":
            this.ordenTraking= [
                  {
                    color: 'green',
                    estado: 'Pedido en preparación',
                    icon: 'mdi-clipboard-list-outline',
                    descripcion: `${this.fechaCreacion} Actualmente estamos trabajando en procesar tu pedido para que llegue a tus manos lo mas pronto posible.`,
                  },
                  {
                    color: 'green',
                    estado: 'Pedido preparado',
                    icon: 'mdi-cube-outline',
                    descripcion: `${this.fechaPreparado} Tu pedido ha sido preparado y está listo para el proceso de distribución.`,
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
                    descripcion: `Tu pedido fue entrega con exito.`,
                  },            
                ]
              break;
            case "Ruteado":
            this.ordenTraking= [
                  {
                    color: 'green',
                    estado: 'Pedido en preparación',
                    icon: 'mdi-clipboard-list-outline',
                    descripcion: `${this.fechaCreacion} Actualmente estamos trabajando en procesar tu pedido para que llegue a tus manos lo mas pronto posible.`,
                  },
                  {
                    color: 'green',
                    estado: 'Pedido preparado',
                    icon: 'mdi-cube-outline',
                    descripcion: `${this.fechaPreparado} Tu pedido ha sido preparado y está listo para el proceso de distribución.`,
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
                    descripcion: `Tu pedido fue entrega con exito.`,
                  },            
                ]
              break;
            case "En Planchada":
            this.ordenTraking= [
                  {
                    color: 'green',
                    estado: 'Pedido en preparación',
                    icon: 'mdi-clipboard-list-outline',
                    descripcion: `${this.fechaCreacion} Actualmente estamos trabajando en procesar tu pedido para que llegue a tus manos lo mas pronto posible.`,
                  },
                  {
                    color: 'green',
                    estado: 'Pedido preparado',
                    icon: 'mdi-cube-outline',
                    descripcion: `${this.fechaPreparado} Tu pedido ha sido preparado y está listo para el proceso de distribución.`,
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
                    descripcion: `Tu pedido fue entrega con exito.`,
                  },            
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
                    },            
                  ]
              break;

            default:
              break;
                }

        }
    },


    async obtenerInformacion() {
      if (this.elegirEmpresa) {
        if (this.idEmpresa==-1) {
          this.mostrarError("No se ha seleccionado Empresa")
          return
        }
      }

      let response
      if (!this.elegirEmpresa) {
        try {
          console.log(this.fechaDesde, this.fechaHasta)
          response = await guias.getByPeriodoEmpresa(this.fechaDesde, this.fechaHasta)
 
          response.forEach(e => {
            e.Fecha = e.Fecha.split('-').reverse().join('-')
            e.FechaOriginal = e.FechaOriginal.split('-').reverse().join('-')
          });
          this.informacionAExportar=response
          console.log(this.informacionAExportar)

        } catch (error) {
          console.log(error)          
        }
      } else {
        try {
          response =  await guias.getByPeriodoEmpresa(this.fechaDesde, this.fechaHasta, this.idEmpresa)
         
          response.forEach(e => {
            e.Fecha = e.Fecha.split('-').reverse().join('-')
            e.FechaOriginal = e.FechaOriginal.split('-').reverse().join('-')
          });
          this.informacionAExportar=response
           
        } catch (error) {
        
        console.log(error)          
        }
      }

      response.forEach (e=> {
        
        if (e.Id===952867) {

        }
        
        e.Conceptos={Guia: 0, Seguro: 0, Complemento: 0, CTR: 0, PickingCD: 0, Total: 0}
        if (e.DetalleCalculo) {

          e.DetalleCalculo=JSON.parse(e.DetalleCalculo)
          e.Canal= e.DetalleCalculo[0].Concepto
          // e.Canal= (JSON.parse(e.DetalleCalculo))[0].Concepto
          

          for (const unDetalle of e.DetalleCalculo) {
            if (unDetalle.Concepto.includes("EntregaRegular")) {
              e.Servicio="Entrega"    
            }
            if (unDetalle.Concepto.includes("RecoleccionRegular")) {
              e.Servicio="Recolección"
            }

            if (unDetalle.Concepto.includes("Guia")) {
              e.Conceptos.Guia=Number(unDetalle.Total)
              if (isNaN(e.Conceptos.Guia)) {
                e.Conceptos.Guia=0
              } else {
                e.Conceptos.Total += Number(unDetalle.Total)
              }
            }
            if (unDetalle.Concepto.includes("Seguro")) {
              e.Conceptos.Seguro=Number(unDetalle.Total)
              e.Conceptos.Total += Number(unDetalle.Total)
            }
            if (unDetalle.Concepto.includes("Complemento")) {
              e.Conceptos.Complemento=Number(unDetalle.Total)
              e.Conceptos.Total += Number(unDetalle.Total)
            }
            if (unDetalle.Concepto.includes("CTR")) {
              e.Conceptos.CTR=Number(unDetalle.Total)
              e.Conceptos.Total += Number(unDetalle.Total)
            }
            if (unDetalle.Concepto.includes("PickingCD")) {
              e.Conceptos.PickingCD=Number(unDetalle.Total)
              e.Conceptos.Total += Number(unDetalle.Total)
            }
          }

        } else {
          e.Canal="N/D"
        }

      })
      // this.generarInformeExcel(response)
    },
    
    obtenerImporteTotal(){
      this.importeTransporteExcel = 0
      this.importeComplemento = 0
      this.importeSeguroExcel = 0
      this.cantidadGuiasExcel = 0
      this.importePickingCD = 0
      this.importeTotalExcel = 0
      this.ContraReembolsoExcel = 0

      
        for (const concepto of this.informacionAExportar)
        {
        this.nombreCliente = concepto.NombreCliente
          this.cantidadGuiasExcel++

           if (typeof concepto.Conceptos.Seguro==="string"){
           
           if (!isNaN(Number(concepto.Conceptos.Seguro))){
            this.importeSeguroExcel += Number(concepto.Conceptos.Seguro)
          }

          } else {
           this.importeSeguroExcel += concepto.Conceptos.Seguro
          }

          

          if (typeof concepto.Conceptos.Guia==="string"){
           
           if (!isNaN(Number(concepto.Conceptos.Guia))){
            this.importeTransporteExcel += Number(concepto.Conceptos.Guia)
          }

          } else {
           this.importeTransporteExcel += concepto.Conceptos.Guia
          }



          if (typeof concepto.Conceptos.Complemento==="string"){
           
           if (!isNaN(Number(concepto.Conceptos.Complemento))){
            this.importeComplemento += Number(concepto.Conceptos.Complemento)
          }

          } else {
           this.importeComplemento += concepto.Conceptos.Complemento
          }

   


          if (typeof concepto.Conceptos.PickingCD==="string"){
           
           if (!isNaN(Number(concepto.Conceptos.PickingCD))){
            this.importePickingCD += Number(concepto.Conceptos.PickingCD)
          }

          } else {
           this.importePickingCD += concepto.Conceptos.PickingCD
          }


          if (typeof concepto.ContraReembolso==="string"){
           
           if (!isNaN(Number(concepto.ContraReembolso))){
            this.ContraReembolsoExcel += Number(concepto.Conceptos.CTR)
          }

          } else {
           this.ContraReembolsoExcel += concepto.Conceptos.CTR
          }



          if (typeof concepto.Conceptos.Total==="string"){
           
           if (!isNaN(Number(concepto.Conceptos.Total))){
            this.importeTotalExcel += Number(concepto.Conceptos.Total)
          }

          } else {
           this.importeTotalExcel += concepto.Conceptos.Total
          } 

       }
      this.importeSeguroExcel = Number(this.importeSeguroExcel.toFixed(2))
      this.importeTransporteExcel = Number(this.importeTransporteExcel.toFixed(2))
      this.importeComplemento = Number(this.importeComplemento.toFixed(2))
      this.importePickingCD = Number(this.importePickingCD.toFixed(2))
      this.importeTotalExcel = Number(this.importeTotalExcel.toFixed(2))
      this.ContraReembolsoExcel = Number(this.ContraReembolsoExcel.toFixed(2))
       

      
    },


    eligioEmpresa(idEmpresaElegida) {
      this.idEmpresa=idEmpresaElegida
      this.informacionAExportar=[]
      this.guiasSeleccionadas=[]

    },
    mostrarMensaje(mensaje, titulo) {
      store.dispatch("alertDialog/mostrar", {titulo, mensaje, botonPrimario: "Entendido"})
    },
    mostrarError(mensaje) {
      store.dispatch("snackbar/mostrar", mensaje)
    },
    mostrarLoading(texto) {
        store.dispatch("loading/mostrar", texto)
    },
    ocultarLoading() {
        store.dispatch("loading/ocultar")
    },

  },

  components: {
      SelectorEmpresa
  },

  mounted() {
    // console.log(store.state.usuarios.usuarioActual)

  },

  created() {




    store.dispatch('actualizarTituloPrincipal', 'Tracking')
    store.dispatch('empresas/cargarListaEmpresas', 'SoloActivas')
    if (process.env.NODE_ENV==="development") {
      this.fechaDesde=fechas.dateToString(fechas.getSumarDiasFecha(-10))
      this.fechaDesde='2024-01-02'
      this.fechaHasta='2024-01-02'

      this.elegirEmpresa=true
      this.idEmpresa=163
      
    } else {
      this.fechaDesde=fechas.dateToString(fechas.getSumarDiasFecha(-1))      
      this.fechaHasta=fechas.dateToString(fechas.getSumarDiasFecha(0))
    }

    if (store.state.usuarios.usuarioActual.IdEmpresa>0) {
        this.idEmpresa=store.state.usuarios.usuarioActual.IdEmpresa
        this.eligioEmpresa(store.state.usuarios.usuarioActual.IdEmpresa)
        this.elegirEmpresa=true
    }
},
}
</script>