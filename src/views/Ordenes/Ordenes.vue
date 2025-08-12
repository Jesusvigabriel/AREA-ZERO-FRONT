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
        <v-col class="py-0" v-if="ordenes.length>0">
          <v-data-table 
            :headers="cabeceras" 
            :search="textoBusqueda"
            item-key="IdOrden"
            :singleSelect=false
            show-select
            v-model="ordenesSeleccionadas"
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
                            <!--<v-icon  v-bind="attrs" color="red"  v-on="on" @click="eliminarOrden(item)" v-show="rolPermitido">mdi-delete</v-icon>-->
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
import { forEach } from "jszip"


export default {
  name: "Ordenes",

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
      idEmpresa: -1,
      empresaPorLote: false,
      empresaPosicionado: false,
      fechasEntrega: ["48 hs", "Específica"],
      rolPermitido:false,
      fecha:[],
      estaEmpresa: [],
      unidadesTotalesEnBase: 0,
      cabeceras: [
        {text: 'Id', value: 'IdOrden',width: 100},
        {text: 'Empresa', value: 'nombre',width: 1},
        {text: 'Tipo', value: 'tipo',width: 1},
        {text: 'Número', value: 'numero',width: 1},
        {text: 'Dirección', value: 'direccion',width: 150},
        {text: 'Prioridad', value: 'prioridad',width: 1},
        {text: 'Valor', value: 'valor',width: 1},
        {text: 'Estado', value: 'Estado',width: 100},
        {text: 'Creada', value: 'Creada',width: 80},
        {text: 'Preparada', value: 'Preparado', width: 30},
        {text: 'Modificada', value: 'Modificada', width: 30},
        {text: 'Usuario', value: 'usuario', width: 30},
        {text: '', value: 'Acciones',width: 30},
        
      ],
      PreOrdenes: false,
      orientacionHojaPdf: false,
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
        if(this.estaEmpresa.ClienteTextil === true){
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

    async popularListaDeOrdenes() {
      roles.getUserRolesById(store.state.usuarios.usuarioActual.Id)
      .then(response => {
        if (!store.state.usuarios.usuarioActual.IdEmpresa ) {
          if(response[0].IdRole == 1){
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
      try {
        const response = await ordenes.getOrdenes()
        for (const orden of response) {

            // Acorto las fechas
            orden.Creada=new Date(orden.Creada).toLocaleDateString()
            orden.Modificada=new Date(orden.Modificada).toLocaleDateString()
            if(orden.Preparado!=null){
                orden.Preparado=new Date(orden.Preparado).toLocaleDateString()
            }

                //Coloco los estados
                switch (orden.Estado) {
                case 1:
                    orden.Estado = "Pendiente"
                break;

                case 2:
                    orden.Estado = "Preparado"
                break;
            
                case 3:
                orden.Estado = "A distribución"
                break;

                case 4:
                orden.Estado = "Anulado"
                break;

                case 5:
                orden.Estado = "Retira Cliente"
                break;

                default:
                break;
            }


            //Indico el Tipo
            if (orden.preOrden == true) {
              orden.tipo =
              orden.preOrden = "Pre-Orden"
            } else {
              orden.tipo = "Orden"
              orden.preOrden = "Orden"
            }

            // La API ya provee la dirección de destino
            orden.direccion = orden.direccion || ''
        }
        response.sort((a, b) => (a.Creada > b.Creada ? -1 : 1))
        this.ordenes = response
        if (this.PreOrdenes) {
          this.traerPreOrdenes()
        } else this.filtrarOrdenes()
      } catch (error) {
        console.log("Error", error)
      }
    },

    traerPreOrdenes() {
      if ( store.state.usuarios.usuarioActual.IdEmpresa > 0 ) {
        this.ordenes=this.ordenes.filter( e => e.IdEmpresa === this.idEmpresa && e.preOrden == "Pre-Orden" )
      } else {
        this.ordenes = this.ordenes.filter( e => e.IdEmpresa===(this.idEmpresa===-1 ? e.IdEmpresa : this.idEmpresa) && e.preOrden == "Pre-Orden" ) 
      }
    },


     filtrarOrdenes() {
      if(store.state.usuarios.usuarioActual.IdEmpresa>0){
            this.ordenes=this.ordenes.filter(e=>e.IdEmpresa===this.idEmpresa && e.preOrden == "Orden" )
        }else{
            this.ordenes=this.ordenes.filter(e=>e.IdEmpresa===(this.idEmpresa===-1 ? e.IdEmpresa : this.idEmpresa) && e.preOrden == "Orden" )
        }
       
     },

 async  ver(item) {
    let lote=""
    let mensaje =""
    let producto=""
    await empresasV3.getOneById(item.IdEmpresa)
    .then(respuesta =>{
      lote = respuesta.LOTE
    })
    await ordenes.getDetalleOrdenAndProductoById(item.IdOrden)
      .then(response =>{
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
        }
        else{
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
                           titulo: `Orden: ${item.IdOrden} Numero ${item.numero}`,
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
                       store.dispatch("alertDialog/mostrar", {titulo: `Orden: ${item.IdOrden} Numero ${item.numero}`, mensaje: "La orden no contiene articulos"})
                   }
                    
                })
                .catch(error => {
                    console.log(error)
                })
                
        },

        async getOrder(item, formato) {
            if (typeof formato=="undefined") {
                formato="PDF"
            }
            formato=formato.toUpperCase()
            const datosOrden =  await ordenes.getById(item.IdOrden)
            await ordenesV2.actions.getDatosOrden(datosOrden)
                .then(async orden => {
                  if (formato==="PDF") {
                        const nombrePdf = await this.reemplazarCaracteres(orden[0].Orden.Numero)
                        const pdf=await ordenesV2.generarOrdenEnPDF(orden,this.orientacionHojaPdf)
                        pdf.save("orden_"+nombrePdf+".pdf")

                        if (orden[2].Empresa.GeneracionAutomaticaEtiquetas) {
                            const pdfEtiqueta=await ordenesV2.generarOrdenEtiquetaEnPDF(orden)
                            pdfEtiqueta.save("etiqueta_"+nombrePdf+".pdf")
                            ordenesV3.informarEtiquetaImpresa(orden.Id)
                        }

                    } else if (formato==="StickerChico".toUpperCase()) {
                        const pdfEtiqueta=await ordenesV2.generarOrdenEtiquetaEnPDFChica(orden)
                        pdfEtiqueta.save("etiqueta_"+orden[0].Orden.Numero+".pdf")
                    } else if (formato==="Excel".toUpperCase()) {
                        const workbook = utils.book_new()
                        //workbook.Props = {Title: "Area 54", Subject: "Excel de productos", Author: "Leo Lob", CreatedDate: new Date()}
                        const numeroOrden = await this.reemplazarCaracteres(orden[0].Orden.Numero)
                        const nombreHoja=numeroOrden.substring(0,30)
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
                            ["Bultos:", orden[0].Orden.Bultos!=null ? orden[0].Orden.Bultos.toString() : "" , "Cód. Post.:", orden[3].Destino.CodigoPostal],
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
    
    eliminarOrden(item){
      const textoPrimario="Aceptar"
      const textoSecundario="Cancelar"  
      const ordenDetalle={
        titulo: `Orden: ${item.IdOrden} Numero ${item.numero}`,
        mensaje: `Desea anular esta orden?`,
        botonSecundario: textoSecundario,
        botonPrimario: textoPrimario,
        callback: ((respuesta) => {
          if (respuesta===textoPrimario) {
            if(item.Estado!="Anulado"){
              let numeroOrden = item.numero + "A"
              ordenes.anularOrdenById(item.IdOrden, store.state.usuarios.usuarioActual.Nombre, numeroOrden, item.IdEmpresa)
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
    imprimirMasivo(){
      for(const ordenes of this.ordenesSeleccionadas){
        this.getOrder(ordenes, 'EXCEL')
      }
    },
    reemplazarCaracteres(item){
      const itemFiltrado = item.replace(/[/!¿?,:*"<>|]/g, '-')
      return(itemFiltrado)
    },
    //
    quitarMarcaPreOrden(unaOrden){
      let unidadesOrden = 0
      ordenes.getDetalleOrdenAndProductoById(unaOrden.IdOrden)
      .then (response => {
        response.forEach(item => {
          unidadesOrden = unidadesOrden + parseInt(item.Unidades)
        })
      })
      const fecha = fechas.getHoy()
      const usuario = store.state.usuarios.usuarioActual.Nombre
      const textoPrimario="Aceptar"
      const textoSecundario="Cancelar"  
      const ordenDetalle={
        titulo: `Orden: ${unaOrden.IdOrden} Numero ${unaOrden.numero}`,
        mensaje: `Desea quitar marca pre-orden?`,
        botonSecundario: textoSecundario,
        botonPrimario: textoPrimario,
        callback: ((respuesta) => {
          if (respuesta===textoPrimario) {
            if(unaOrden.preOrden == 'Pre-Orden'){
              if(this.estaEmpresa.ClienteTextil === true){
                const totalNuevo = parseInt(this.unidadesTotalesEnBase) + parseInt(unidadesOrden)
                if(totalNuevo < 401){
                  ordenes.setearPreOrden(unaOrden.IdOrden, "F",fecha, usuario)
                  .then(response => {
                    store.dispatch("alertDialog/mostrar", {titulo: unaOrden.IdOrden + ": Marca sacada", mensaje: "La orden ya no es una pre-orden"})
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
              }else{
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
    }
    this.fecha = fechas.getHoy()
   
    this.filtrarOrdenes()
  },

  
}

  </script>