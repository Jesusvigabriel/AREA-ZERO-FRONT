<template>
    <v-container>
      <v-row justify="center">
        <v-col class="py-3" cols="2" align="start">
            <v-checkbox @click="clickEnElegirEmpresa()" label="Una empresa" v-model="elegirEmpresa" class="py-0 my-0"></v-checkbox>
            <v-checkbox @click="clickEnPreOrdenes()" label="Pre-órdenes" v-model="PreOrdenes" class="py-0 my-0"></v-checkbox>
            <v-checkbox  v-if="!empresaPorLote" label="Impresion Horizontal" v-model="orientacionHojaPdf" class="py-0 my-0"></v-checkbox>
        </v-col>
        <v-col cols="4" v-show="elegirEmpresa">
          <SelectorEmpresa @eligioEmpresa="eligioEmpresa($event)" ></SelectorEmpresa>
        </v-col>
      </v-row>
      <v-row v-if="ordenes.length>0" class="pb-0 mb-0">
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
      <v-row v-else>
        <v-col>
          <v-alert color="orange" class="py-3 my-1" dark>No hay órdenes pendientes</v-alert>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="ordenesSeleccionadas.length>0">
          <v-btn class="action-button" block @click="imprimirMasivo">Imprimir ordenes seleccionadas en excel</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="py-0" v-if="ordenes.length>0 && this.columnaEmpresa">
          <v-data-table 
            v-model="ordenesSeleccionadas"
            :headers="cabecerasConEmpresa" 
            :singleSelect=false
            show-select
            item-key="Id"
            :search="textoBusqueda"
            :items="ordenes"  
            :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
            :items-per-page="30" 
            class="elevation-3" 
          >
          <template v-slot:item.Acciones="{ item }">
                         <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs"  v-on="on"  color="green"  @click="ver(item)">mdi-eye</v-icon>
                            </template>
                            <span>Ver</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                            <v-icon  v-bind="attrs" color="red"  v-on="on" @click="eliminarOrden(item)" v-show="rolPermitido">mdi-delete</v-icon>
                            </template>
                            <span>Anular orden</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon color="blue" v-bind="attrs" v-on="on" @click="quitarMarcaPreOrden(item)">mdi-file-edit-outline</v-icon>
                          </template>
                          <span>Quitar marca pre-orden</span>
                        </v-tooltip>  
                </template>
          </v-data-table>
        </v-col>
        <v-col class="py-0" v-if="ordenes.length>0 && !this.columnaEmpresa">
          <v-data-table 
            v-model="ordenesSeleccionadas"
            :headers="cabeceras" 
            :singleSelect=false
            item-key="Id"
            :search="textoBusqueda"
            :items="ordenes"  
            :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
            :items-per-page="30" 
            class="elevation-3" 
          >
          <template v-slot:item.Acciones="{ item }">
                         <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs"  v-on="on"  color="green"  @click="ver(item)">mdi-eye</v-icon>
                            </template>
                            <span>Ver</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon color="blue" v-bind="attrs" v-on="on" @click="quitarMarcaPreOrden(item)">mdi-file-edit-outline</v-icon>
                          </template>
                          <span>Quitar marca pre-orden</span>
                        </v-tooltip>  
                </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
    </template>



<script>


import store from "../../store"
import ordenes from "@/store/ordenesV3"
import ordenesV2 from "@/store/ordenes"
import empresasV3 from '@/store/empresasV3'
import posiciones from '@/store/posicionesV3'
import {xlsx, read, utils, writeFile} from 'xlsx'
import SelectorEmpresa from '@/components/SelectorEmpresa.vue'
import roles from '@/store/roles'
import fechas from 'vue-lsi-util/fechas'


export default {
  name: "OrdenesPendientes",

  components: {
      SelectorEmpresa
  },

  data() {
    return {
      ordenes: [],
      ordenesFiltradas: [],
      ordenesSeleccionadas: [],
      ordenesAProcesar: [],
      ordenDetalle: [],
      ordenesAProcesarSeleccionadas: [],
      textoBusqueda: '',
      elegirEmpresa: true,
      empresaPosicionado: false,
      idEmpresa: -1,
      empresaPorLote: false,
      fechasEntrega: ["48 hs", "Específica"],
      rolPermitido:false,
      fecha:[],
      estaEmpresa: [],
      unidadesTotalesEnBase: 0,
      cabeceras: [
        {text: 'Número', value: 'Numero',width: 1},
        {text: 'Cliente', value: 'Destino.Nombre',width: 1},
        {text: 'Observaciones', value: 'Observaciones',width: 200},
        {text: 'Ya se Imprimio', value: 'Impresion',width: 10},
        {text: 'Fecha', value: 'Fecha',width: 80},
        {text: 'Tipo', value: 'PreOrden', width: 30},
        {text: 'Usuario', value: 'Usuario', width: 30},
        {text: '', value: 'Acciones',width: 30},
        
      ],
      cabecerasConEmpresa: [
        {text: 'Empresa', value: 'Empresa.Nombre',width: 150},
        {text: 'Número', value: 'Numero',width: 1},
        {text: 'Cliente', value: 'Destino.Nombre',width: 1},
        {text: 'Observaciones', value: 'Observaciones',width: 200},
        {text: 'Ya se Imprimio', value: 'Impresion',width: 10},
        {text: 'Fecha', value: 'Fecha',width: 80},
        {text: 'Tipo', value: 'PreOrden', width: 30},
        {text: 'Usuario', value: 'Usuario', width: 30},
        {text: '', value: 'Acciones',width: 30},
        
      ],
      PreOrdenes: false,
      columnaEmpresa: false,
      orientacionHojaPdf: false
    }
  },

  methods: {

    clickEnElegirEmpresa() {
      if (!this.elegirEmpresa) {
        this.idEmpresa=-1
      }
      this.popularListaDeOrdenes()
      this.filtrarOrdenes()
    },
    clickEnHorizontal(){
    },
    clickEnPreOrdenes() {
      this.popularListaDeOrdenes()
      //this.traerPreOrdenes()
    },

    eligioEmpresa(idEmpresa) {
      this.ordenesSeleccionadas=[]
      empresasV3.getOneById(idEmpresa)
      .then(response =>{
        this.estaEmpresa = response
        this.empresaPosicionado = response.StockPosicionado
        this.empresaPorLote = response.LOTE
        if(response.ClienteTextil === true){
          ordenes.contadorBultosDia(idEmpresa,this.fecha)
          .then(response => {
              this.unidadesTotalesEnBase = response
          })
        }
      })
      this.idEmpresa=idEmpresa
      this.popularListaDeOrdenes()
      this.filtrarOrdenes()
    },

    popularListaDeOrdenes() {
       roles.getUserRolesById(store.state.usuarios.usuarioActual.Id)
       .then(response => {
         if (!store.state.usuarios.usuarioActual.IdEmpresa ) { 
           if(response[0].IdRole == 1){
             this.rolPermitido=true
           }else if(response[0].IdRole == 11){
             this.rolPermitido=true
           }else{
            this.rolPermitido=false
           }
         } else {
           this.rolPermitido = false
         }
       })
       .catch(error => {
         console.log(error)
       })

      ordenes.getPendientes()
        .then(response => {
          response.forEach(element => {
            element.Fecha=new Date(element.Fecha).toLocaleDateString()

            if ( element.PreOrden == true ) {
              element.PreOrden = "Pre-Orden"
            } else element.PreOrden = "Orden"

          });
          response.sort( (a, b) => a.Fecha>b.Fecha ?  -1 : 1)
          this.ordenes=response
          if( this.PreOrdenes ){
            this.traerPreOrdenes()
          } else this.filtrarOrdenes()
          //this.filtrarOrdenes()
        })
        .catch(error => {console.log("Error", error)})
    },

    traerPreOrdenes() {
      if ( store.state.usuarios.usuarioActual.IdEmpresa > 0 ) {
        this.ordenes=this.ordenes.filter( e => e.Empresa.Id === this.idEmpresa && e.PreOrden == "Pre-Orden" )
      } else {
        this.ordenes = this.ordenes.filter( e => e.Empresa.Id===(this.idEmpresa===-1 ? e.Empresa.Id : this.idEmpresa) && e.PreOrden == "Pre-Orden" ) 
      }
    },


     filtrarOrdenes() {
      if(store.state.usuarios.usuarioActual.IdEmpresa>0){
            this.ordenes=this.ordenes.filter(e=>e.Empresa.Id===this.idEmpresa && e.PreOrden == "Orden" )
        }else{
            this.ordenes=this.ordenes.filter(e=>e.Empresa.Id===(this.idEmpresa===-1 ? e.Empresa.Id : this.idEmpresa) && e.PreOrden == "Orden" )
        }
       
     },

 async  ver(item) {
    let lote=""
    let part=""
    let mensaje =""
    let producto=""
    await empresasV3.getOneById(item.IdEmpresa)
    .then(respuesta =>{
      lote = respuesta.LOTE
      part = respuesta.PART
    })
    if(part){
      await ordenes.getDetalleOrdenAndProductoPartidaById(item.Id)
      .then (response => {
          if (response.length>0) {
                mensaje='<table border="0" width="80%"><tr><td><b>Unidades&nbsp</b></td><td><b>Producto</b></td><td align="right"><b>Partida</b></td><td align="right"><b>Barcode</b></td></tr>'
                response.forEach(e=>{
                    mensaje += "<tr>"
                    mensaje += `<td>${e.Unidades}</td>`
                    mensaje += `<td>&nbsp${e.Productos}</td>`
                    mensaje += `<td align="right">${e.Partida}</td>`
                    mensaje += `<td align="right">${e.Barcode}</td>`
                
                })
              
                       mensaje += "</table>" 
                      
                        
                        
                        const textoPrimario="Aceptar"
                        const textoSecundario="Excel"
                        const textoTerciario="PDF"  
                        const ordenDetalle={
                           titulo: `Orden: ${item.Id} Numero ${item.Numero}`,
                           mensaje: `${mensaje}`,
                           botonSecundario: textoSecundario,
                           botonPrimario: textoPrimario,
                           botonTerciario: textoTerciario,
                           callback: ((respuesta) => {
                               if (respuesta===textoSecundario) {
                                this.getOrder(item,"Excel")
                               
                               }else if(respuesta===textoTerciario){
                                this.getOrder(item,'PDF')
                               }

                           })
                       }
                       
                       store.dispatch("alertDialog/mostrar",  ordenDetalle)      

                   } else {
                       store.dispatch("alertDialog/mostrar", {titulo: `Orden: ${item.Id} Numero ${item.Numero}`, mensaje: "La orden no contiene articulos"})
                   }
                    
                })
                .catch(error => {
                    console.log(error)
                })
    }else{
      await ordenes.getDetalleOrdenAndProductoById(item.Id)
      .then (response => {
          if (response.length>0) {
            if(lote == true){
            let numeroLote = ""
            mensaje='<table border="0" width="80%"><tr><td><b>Unidades&nbsp</b></td><td><b>Producto</b></td><td align="right"><b>Box Number</b></td><td align="right"><b>Serial Number</b></td></tr>'
              response.forEach(e=>{
                if(numeroLote != e.lote){
                  if(e.loteCompleto==1){
                    producto= "Lote Completo"
                  }else{
                    producto = e.Productos
                  }
                    mensaje += "<tr>"
                    mensaje += `<td>${e.Unidades}</td>`
                    mensaje += `<td>&nbsp${producto}</td>`
                    mensaje += `<td align="right">${e.lote}</td>`
                    mensaje += `<td align="right">${e.Barcode}</td>`
                    if(e.loteCompleto == 1)
                    {
                      numeroLote = e.lote
                    }
                  }
                })
          }else{
                mensaje='<table border="0" width="80%"><tr><td><b>Unidades&nbsp</b></td><td><b>Producto</b></td><td align="right"><b>Codigo</b></td><td align="right"><b>Cod. Empresa</b></td></tr>'
                response.forEach(e=>{
                    mensaje += "<tr>"
                    mensaje += `<td>${e.Unidades}</td>`
                    mensaje += `<td>&nbsp${e.Productos}</td>`
                    mensaje += `<td align="right">${e.Barcode}</td>`
                    mensaje += `<td align="right">${e.CodeEmpresa}</td>`
                
                })
              }  
                       mensaje += "</table>" 
                      
                        
                        
                        const textoPrimario="Aceptar"
                        const textoSecundario="Excel"
                        const textoTerciario="PDF"  
                        const ordenDetalle={
                           titulo: `Orden: ${item.Id} Numero ${item.Numero}`,
                           mensaje: `${mensaje}`,
                           botonSecundario: textoSecundario,
                           botonPrimario: textoPrimario,
                           botonTerciario: textoTerciario,
                           callback: ((respuesta) => {
                               if (respuesta===textoSecundario) {
                                this.getOrder(item,"Excel")
                               
                               }else if(respuesta===textoTerciario){
                                this.getOrder(item,'PDF')
                               }

                           })
                       }
                       
                       store.dispatch("alertDialog/mostrar",  ordenDetalle)      

                   } else {
                       store.dispatch("alertDialog/mostrar", {titulo: `Orden: ${item.Id} Numero ${item.Numero}`, mensaje: "La orden no contiene articulos"})
                   }
                    
                })
                .catch(error => {
                    console.log(error)
                })
              }     
        },

        getOrder(item, formato) {
            if (typeof formato=="undefined") {
                formato="PDF"
            }
            formato=formato.toUpperCase()
            ordenesV2.actions.getDatosOrden(item)
                .then(async orden => {
                  if (formato==="PDF") {
                    const nombrePdf = await this.reemplazarCaracteres(orden[0].Orden.Numero)
                        const pdf=await ordenesV2.generarOrdenEnPDF(orden,this.orientacionHojaPdf)
                        pdf.save("orden_"+nombrePdf+".pdf")

                        if (orden[2].Empresa.GeneracionAutomaticaEtiquetas) {
                            const pdfEtiqueta=await ordenesV2.generarOrdenEtiquetaEnPDF(orden)
                            pdfEtiqueta.save("etiqueta_"+nombrePdf+".pdf")
                            ordenes.informarEtiquetaImpresa(orden[0].Orden.Id)
                        }
                        if (store.state.usuarios.usuarioActual.IdEmpresa<=0){
                          if((orden[0].Orden.Impresion === "No")){
                            ordenes.editCantidadImpresion(orden[0].Orden.Id, "Si")
                            item.Impresion = "Si"
                          }
                        }
                      // } else if (formato==="StickerChico".toUpperCase()) {
                      //   const pdfEtiqueta=await ordenesV2.generarOrdenEtiquetaEnPDFChica(orden)
                      //   pdfEtiqueta.save("etiqueta_"+orden[0].Orden.Numero+".pdf")
                        
                    } else if (formato==="Excel".toUpperCase()) {
                        const workbook = utils.book_new()
                        //workbook.Props = {Title: "Area 54", Subject: "Excel de productos", Author: "Leo Lob", CreatedDate: new Date()}
                        const numeroOrden = await this.reemplazarCaracteres(orden[0].Orden.Numero)

                        const nombreHoja = numeroOrden.substring(0,30)
                        workbook.SheetNames.push(nombreHoja)
                        
                        // let cantidadUnidades=0
                        // orden.Detalle.forEach(element => {
                        //     cantidadUnidades += parseInt(element.Cantidad)
                        // });
                        let tipo=""
                        if (orden[0].Orden.Tipo==1) {
                                tipo = "Remito"
                        } else if (orden[0].Orden.Tipo==2) {
                            tipo = "Asignación"
                        } else tipo = "Otro"
                        const datosPlanilla = [
                            ["Empresa:", orden[2].Empresa.Nombre, "Destino:", orden[3].Destino.Nombre],
                            ["Comprob.:", orden[0].Orden.Numero, "Domicilio:", orden[3].Destino.Domicilio],
                            ["Fecha:", orden[0].Orden.FechaCreacion.substr(8, 2)+"-"+orden[0].Orden.FechaCreacion.substr(5, 2)+"-"+orden[0].Orden.FechaCreacion.substr(0, 4), "Localidad:", orden[3].Destino.Localidad],
                            ["Bultos:", orden[0].Orden.Bultos!=null ? orden[0].Orden.Bultos : "", "Cód. Post.:", orden[3].Destino.CodigoPostal],
                            ["Tipo:", tipo],
                            []
                        ]
                       

                        if(this.empresaPorLote){
                          let loteCompleto = "no"
                          datosPlanilla.push(["Cantidad", "Producto", "Lote", "Barcode", "Cod.Empresa", "Posicion", "Lote completo"])

                          for(const unItem of orden[1].Detalle){
                              if(unItem.loteCompleto == 1){
                                loteCompleto="si"
                              }else{
                                loteCompleto="no"
                              }
                              await posiciones.getDetallePosicionByIdAndEmpresa(unItem.IdOrdendetalle, this.idEmpresa)
                              .then(response=>{
                              response.forEach( detallePosicion =>{
                                if(detallePosicion.IdDetalle == unItem.IdOrdendetalle){
                                  const unRenglon=[unItem.Unidades, unItem.Productos, unItem.lote, unItem.Barcode, unItem.CodeEmpresa, detallePosicion.Posicion, loteCompleto]
                                  datosPlanilla.push(unRenglon)
                                }
                              })
                            })
                          }
                          var worksheet = utils.aoa_to_sheet(datosPlanilla);
                            workbook.Sheets[nombreHoja] = worksheet;
                            writeFile(workbook, "Orden_"+numeroOrden+".xlsx");
                        }else{
                          if(this.empresaPosicionado == true){
                            datosPlanilla.push(["Cantidad", "Producto", "Barcode", "Cod.Empresa", "Posicion"])

                            for(const unItem of orden[1].Detalle){
                              await posiciones.getDetallePosicionByIdAndEmpresa(unItem.IdOrdendetalle, this.idEmpresa)
                              .then(response=>{
                                response.forEach( detallePosicion =>{
                                  if(detallePosicion.IdDetalle == unItem.IdOrdendetalle){
                                    const unRenglon=[unItem.Unidades, unItem.Productos, unItem.Barcode, unItem.CodeEmpresa, detallePosicion.Posicion]
                                    datosPlanilla.push(unRenglon)
                                  }
                                })
                              })
                            
                            }
                            var worksheet = utils.aoa_to_sheet(datosPlanilla);
                            workbook.Sheets[nombreHoja] = worksheet;
                            writeFile(workbook, "Orden_"+numeroOrden+".xlsx");
                          }else{
                            datosPlanilla.push(["Cantidad", "Producto", "Barcode", "Cod.Empresa"])

                            for(const unItem of orden[1].Detalle){
                              const unRenglon=[unItem.Unidades, unItem.Productos, unItem.Barcode, unItem.CodeEmpresa]
                              datosPlanilla.push(unRenglon)
                            }
                            var worksheet = utils.aoa_to_sheet(datosPlanilla);
                            workbook.Sheets[nombreHoja] = worksheet;
                            writeFile(workbook, "Orden_"+numeroOrden+".xlsx");
                          }
                        }
                    }
                })
                .catch(puteada => {
                  console.log(puteada)
                    store.dispatch("alertDialog/mostrar", {titulo: "Error", mensaje: "Orden inexistente"})
                })        
        },
    imprimirMasivo(){
      for(const ordenes of this.ordenesSeleccionadas){
        this.getOrder(ordenes, 'EXCEL')
      }
    },
    reemplazarCaracteres(item){
      const itemFiltrado = item.replace(/[/!¿?,:*"<>|]/g, '-')
      return(itemFiltrado)
    },
    eliminarOrden(item){
      const textoPrimario="Aceptar"
      const textoSecundario="Cancelar"  
      const ordenDetalle={
        titulo: `Orden: ${item.Id} Numero ${item.Numero}`,
        mensaje: `Desea anular esta orden?`,
        botonSecundario: textoSecundario,
        botonPrimario: textoPrimario,
        callback: ((respuesta) => {
          if (respuesta===textoPrimario) {
            if(item.Estado!=4){
              let numeroOrden = item.Numero + "A"
              ordenes.anularOrdenById(item.Id, store.state.usuarios.usuarioActual.Nombre, numeroOrden, item.IdEmpresa)
              .then(response =>{
                this.popularListaDeOrdenes()
              })
              .catch(error =>{
                console.log(error)
              })
            }else{
              store.dispatch("alertDialog/mostrar", {titulo: "Error", mensaje: "La orden ya esta anulada"})
            }               
          }
        })
      }
      store.dispatch("alertDialog/mostrar",  ordenDetalle)
    },

    quitarMarcaPreOrden(unaOrden){
      let unidadesOrden = 0
      ordenes.getDetalleOrdenAndProductoById(unaOrden.Id)
      .then (response => {
        response.forEach(item => {
          unidadesOrden = unidadesOrden + parseInt(item.Unidades)
        })
      })
      const usuario = store.state.usuarios.usuarioActual.Nombre
      const fecha = fechas.getHoy()
      const textoPrimario="Aceptar"
      const textoSecundario="Cancelar"  
      const ordenDetalle={
        titulo: `Orden: ${unaOrden.Id} Numero ${unaOrden.Numero}`,
        mensaje: `Desea quitar marca pre-orden?`,
        botonSecundario: textoSecundario,
        botonPrimario: textoPrimario,
        callback: ((respuesta) => {
          if (respuesta===textoPrimario) {
            if(unaOrden.PreOrden == 'Pre-Orden'){
              if(this.estaEmpresa.ClienteTextil === true){
                const totalNuevo = parseInt(this.unidadesTotalesEnBase) + parseInt(unidadesOrden)
                if(totalNuevo < 401){
                  ordenes.setearPreOrden(unaOrden.Id, "F",fecha, usuario)
                  .then(response => {
                    store.dispatch("alertDialog/mostrar", {titulo: unaOrden.Id + ": Marca sacada", mensaje: "La orden ya no posee marca de pre-orden"})
                    this.popularListaDeOrdenes()
                    ordenes.contadorBultosDia(this.estaEmpresa.Id,this.fecha)
                    .then(response => {
                        this.unidadesTotalesEnBase = response
                    })
                  })
                  .catch(error => {
                  console.log(error)
                  })
                }else{
                  store.dispatch("alertDialog/mostrar", {titulo: unaOrden.Id + ": No se pudes sacar marca", mensaje: "Se a superado el limite de unidades diarias"})
                }
              }
              else{
                ordenes.setearPreOrden(unaOrden.Id, "F",fecha, usuario)
                  .then(response => {
                    store.dispatch("alertDialog/mostrar", {titulo: unaOrden.Id + ": Marca sacada", mensaje: "La orden ya no posee marca de pre-orden"})
                    this.popularListaDeOrdenes()
                  })
                  .catch(error => {
                  console.log(error)
                  })
              }   
            }else{
              store.dispatch("alertDialog/mostrar", {titulo: unaOrden.Id + ": No es una Pre-Orden", mensaje: "No se ha modificado ningun dato"})
            }
          }
        })
      }
      store.dispatch("alertDialog/mostrar",  ordenDetalle)
    },

    },

    created() {
    store.dispatch('empresas/cargarListaEmpresas', 'SoloActivas')
    if (store.state.usuarios.usuarioActual.IdEmpresa>0) {
          this.idEmpresa=store.state.usuarios.usuarioActual.IdEmpresa
          this.eligioEmpresa(store.state.usuarios.usuarioActual.IdEmpresa)
          this.fecha = fechas.getHoy()
    }else{
        this.columnaEmpresa = true
        this.fecha = fechas.getHoy()
    }
    
    roles.getUserRolesById(store.state.usuarios.usuarioActual.Id)
      .then(response => {
        if(response[0].IdRole == 1){
          this.rolPermitido = true
        }else if(response[0].IdRole == 11){
          this.rolPermitido = true
        }else{
          this.rolPermitido = false
        }
      })
    .catch(error => {
      console.log(error)
    })
    
    this.filtrarOrdenes()
  },

  
}

  </script>