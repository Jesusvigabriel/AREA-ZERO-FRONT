<template>
    <v-container>
    <v-row justify="end" v-show="listaEmpresas.length>0">
      <v-col cols="3"><v-btn color="success" block @click="exportarAExcel()">Exporta a Excel <v-icon>mdi-microsoft-excel</v-icon></v-btn></v-col>
    </v-row>
    <v-row justify="end" v-show="listaEmpresas.length>0">
      <v-col cols="3">
        <v-file-input 
          label="Importar desde Excel" 
          @change="fileOnChange" 
          accept=".xlsx"
          v-model="excelAProcesar"
          filled
          prepend-icon="mdi-microsoft-excel"
        ></v-file-input>
      </v-col>
    </v-row>
    <v-row justify="center" v-show="empresasSeleccionadas.length>0">
      <v-col class="py-2" cols="6">
          <v-btn @click="iniciarActualizacionMasiva()" color="success" block>Actualización masiva de precios<v-icon>mdi-currency-usd</v-icon></v-btn>
      </v-col>
    </v-row>
      <v-row justify="center" v-if="listaEmpresas.length>0">
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
      <v-row  justify="center">
        <v-col cols="12" v-if="listaEmpresas.length>0">
          <v-data-table 
              :headers="cabecerasEmpresas" 
              :items="listaEmpresas"
              :footer-props="{itemsPerPageOptions:[30,60,-1]}"   
              :items-per-page="130" 
              :search="textoBusqueda"
              item-key="Id"
              v-model="empresasSeleccionadas"
              :singleSelect=false
              class="elevation-3" 
              show-select
          >
          <template v-slot:item.Estado="{item}">
            <v-icon :class="getClassIconoEstado(item)" :color="getColorIconoEstado(item)">{{getIconoEstado(item)}}</v-icon>
          </template>
          <template v-slot:item.Activa="{item}">
            <v-switch @change="clickEnActivar(item)" v-model="item.Activa" ></v-switch>            
          </template>
          </v-data-table>
        </v-col>
      </v-row>

      <v-dialog
        v-model="mostrarVentanaEdicion"
        persistent
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">Actualización masiva de precios</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-select 
                      v-model="conceptosAActualizar" 
                      dense 
                      multiple
                      prepend-inner-icon="mdi-factory"
                      chips
                      :items="conceptosActualizables" 
                      item-value="id" 
                      item-text="nombre" 
                      label="Seleccione conceptos a actualizar"
                      class="my-0 py-0"
                  >
                    <template v-slot:prepend-item>
                      <v-list-item
                        ripple
                        @mousedown.prevent
                        @click="seleccionarTodo"
                      >
                        <v-list-item-action>
                          <v-icon :color="conceptosAActualizar.length > 0 ? 'indigo darken-4' : ''">
                            {{ icono }}
                          </v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                          <v-list-item-title>
                            Seleccionar todo
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider class="mt-2"></v-divider>
                    </template>
                  </v-select>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-col cols="6">
                  <v-text-field prefix="%" label="Porcentaje de actualización" required v-model="porcentajeActualizacion"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cancelarActualizacionMasiva()">Cancelar</v-btn>
            <v-btn color="blue darken-1" text @click="confirmarActualizacionMasiva()">Grabar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-container>
</template>

<script>

import store from '@/store'
import empresas from '@/store/empresasV3'
import excel from "exceljs"
import {saveAs} from "file-saver"
import {xlsx, read, utils} from 'xlsx'


export default {
    name: "EmpresasActivar",

    data() {
      return {
        listaEmpresas: [],
        empresasSeleccionadas: [],
        textoBusqueda: '',
        cabecerasEmpresas: [],
        textoBusqueda: '',
        conceptosActualizables: [],
        mostrarVentanaEdicion: false,
        conceptosAActualizar: [],
        porcentajeActualizacion: 0,
        excelAProcesar: null,
        tipoCliente: [{id:0,nombre:'Administrador'},{id:1,nombre:'Integral'},{id:3,nombre:'Cross Docking'}],
        flag:0,
      }
    },

    computed: {
      todoSeleccionado () {
        return this.conceptosAActualizar.length === this.conceptosActualizables.length
      },
      algoSeleccionado () {
        return this.conceptosAActualizar.length > 0 && !this.todoSeleccionado
      },
      icono () {
        if (this.todoSeleccionado) return 'mdi-close-box'
        if (this.algoSeleccionado) return 'mdi-minus-box'
        return 'mdi-checkbox-blank-outline'
      },
    },

    methods: {
      async procesarPlanillaImportada(planilla) {
        const columnasExcluidas=['Empresa', 'Activa', 'AutogestionHabilitada', 'AutogestionOpciones', 'MostrarTyC']
        for (const unaFila of planilla) {
          //Me fijo si la empresa existe
          const posicionEmpresa=this.listaEmpresas.findIndex(f => f.Nombre===unaFila.Empresa)
          if (posicionEmpresa>=0) {
            this.flag=0
            const unaEmpresa=this.listaEmpresas[posicionEmpresa]
            for (const unaColumna of Object.entries(unaFila)) {

              if (!columnasExcluidas.includes(unaColumna[0])) {
                
                for (const unConcepto of this.conceptosActualizables) {


                  const nombreConceptoPuro=unConcepto.id.split("-")[0].trim()
                  const nombreConceptoSufijo=unConcepto.id.split("-")[1].trim()

                  if (unaColumna[0]===nombreConceptoPuro+nombreConceptoSufijo) {
                    
                    const conceptoAActualizar=unaEmpresa.Configuracion[nombreConceptoPuro]
                    const componentes=conceptoAActualizar.split("|")
                    let actualizar, nuevoConceptoAActualizar
                    if (nombreConceptoSufijo==="Valor") {
                      if (componentes[1]===String(unaColumna[1])) {
                        actualizar=false
                      } else {
                        componentes[1]=String(unaColumna[1])
                        actualizar=true
                      }
                    } else if (nombreConceptoSufijo==="Minimo") {
                      if (componentes[2]===String(unaColumna[1])) {
                        actualizar=false
                      } else {
                        componentes[2]=String(unaColumna[1])
                        actualizar=true
                      }
                    } else {
                      actualizar=false
                    }

                    const objetoAActualizar={}
                    objetoAActualizar[nombreConceptoPuro]=componentes.join("|")
                    //Actualizamos el aumento Historico primero creamos un registro y luego lo actualizamos
                    if(this.flag==0){
                        this.flag=1
                        unaEmpresa.Estado="G"
                          await empresas.saveConfiguracionHistorico(unaEmpresa.Id, objetoAActualizar)
                          unaEmpresa.Estado=""
                      }else{
                        unaEmpresa.Estado="G"
                          await empresas.updateConfiguracionHistorico(unaEmpresa.Id, objetoAActualizar)
                          unaEmpresa.Estado=""
                      }



                    if (actualizar) {
                      
                      unaEmpresa.Estado="G"
                      //console.log(unaEmpresa.Id, objetoAActualizar)
                      await empresas.updateConfiguracion(unaEmpresa.Id, objetoAActualizar)
                      
                      
                      unaEmpresa.Configuracion[nombreConceptoPuro]=objetoAActualizar[nombreConceptoPuro]
                      unaEmpresa.Estado=""

                      if (nombreConceptoPuro==='EntregaRegularB2BGuia') {                  
                        
                        // console.log("unaEmpresa.Configuracion[nombreConceptoPuro]", unaEmpresa.Configuracion[nombreConceptoPuro])
                        // console.log("typeof unaEmpresa.Configuracion[nombreConceptoPuro]", typeof unaEmpresa.Configuracion[nombreConceptoPuro])

                        // console.log("objetoAActualizar[nombreConceptoPuro]", objetoAActualizar[nombreConceptoPuro])
                        // console.log("typeof objetoAActualizar[nombreConceptoPuro]", typeof objetoAActualizar[nombreConceptoPuro])

                      }





                    }
                  }
                }
              }
            }

          }
        }
        this.popularListaEmpresas()
      },
      verificarColumnasExcel(planilla) {
        let columnasObligatorias=['Empresa', 'Activa']

        const columnasExcluidas=['Tipo', 'Id', 'Nombre','ClienteTextil', 'Iva','Cuit','IngresosBrutos','DireccionOficina','DireccionDeposito','ContactoOficina','ContactoDeposito','CodigoPostal', 'RazonSocial', 'StockUnitario', 'StockPosicionado', 'RequiereFotoDocumentacionEntrega', 'GeneracionAutomaticaEtiquetas', 'Activa', 'Estado', 'Configuracion']
        const columnas=[{width: 40}, {width: 15}]
        const cabeceras=['Empresa', 'Activa']
        for (const unDato of Object.entries(this.listaEmpresas[0])) {
          const nombreDato=unDato[0]
          if (!columnasExcluidas.includes(nombreDato)) {
            columnasObligatorias.push(nombreDato)
          }
        }

        let columnasFaltantes=[]
        let filaActual=1
        let tituloMostrado=false
        let mensaje=''
        planilla.forEach(unaFila => {
            filaActual++
            columnasObligatorias.forEach(unaColumnaObligatoria => {
                if (!Object.keys(unaFila).map(e=>e).includes(unaColumnaObligatoria)) {
                    if (!columnasFaltantes.includes(unaColumnaObligatoria)) {
                        if (!tituloMostrado) {
                          mensaje += "Faltan las siguientes columnas:;"
                          tituloMostrado=true
                        }
                        mensaje += "Fila: "+filaActual+" - Columna: "+unaColumnaObligatoria+";"
                    }
                }
            })
        })
        if (mensaje!=='') {
          this.mostrarMensaje(mensaje, "Error en procesamiento")
          // this.mostrarError("Columnas faltantes - Revise el archivo")
        } else {
          this.procesarPlanillaImportada(planilla)
        }
      },
      fileOnChange(archivoLeido) {
        if (archivoLeido!=null) {
          const lector=new FileReader()
          lector.onload = ev => {
              const datosCrudos = ev.target.result;
              const planillaCruda = read(datosCrudos, {type: "binary", cellDates: true, cellNF: true, cellText:true})
              const nombreHoja1=planillaCruda.SheetNames[0]
              const datosPlanilla=utils.sheet_to_json(planillaCruda.Sheets[nombreHoja1])
              this.verificarColumnasExcel(datosPlanilla)
          }
          lector.readAsBinaryString(archivoLeido)            
        } else {
        }
      },
      async exportarAExcel() {
        const workbook=new excel.Workbook()
        const worksheet=workbook.addWorksheet("tarifas")

        // worksheet.getRow(1).values=[`Configuración de tarifas`]
        

        const columnasExcluidas=['Tipo Cliente','TokenApi', 'TipoMoneda', 'Id', 'Nombre','ClienteTextil', 'Iva','Cuit','IngresosBrutos','DireccionOficina','DireccionDeposito','ContactoOficina','ContactoDeposito','CodigoPostal','RazonSocial', 'StockUnitario', 'StockPosicionado', 'RequiereFotoDocumentacionEntrega', 'GeneracionAutomaticaEtiquetas', 'Activa', 'Estado', 'Configuracion', 'Tipo']
        const columnas=[{width: 40}, {width: 15}]
        // const cabeceras=['Empresa', 'Activa', 'Tipo Cliente']
        const cabeceras=['Empresa', 'Activa', 'Moneda']
        for (const unDato of Object.entries(this.listaEmpresas[0])) {
          const nombreDato=unDato[0]
          if (!columnasExcluidas.includes(nombreDato)) {
            cabeceras.push(nombreDato)
            columnas.push({width: 30})
          }
        }

        worksheet.columns=columnas
        worksheet.getRow(1).values=cabeceras

        worksheet.views = [{state: 'frozen', ySplit: 3}]
        // worksheet.autoFilter = 'A5:F5'

        let renglon=1


        this.listaEmpresas.forEach(e => {
            renglon++
            const datosFila=[e.Nombre, e.Activa ? "Si" : "No", e.TipoMoneda]
            if(e.Configuracion){
                if(!columnasExcluidas.includes('Tipo Cliente')){
                  let idTipoCliente = e.Configuracion.TipoCliente

                  this.tipoCliente.forEach(nombre => {
                    if (nombre.id == idTipoCliente){
                      datosFila.push(nombre.nombre)
                    }                   
                  })
                }
              }
              
            for (const unDato of Object.entries(this.listaEmpresas[0])) {
              const nombreDato=unDato[0]
              const valorDato=unDato[1]
              //console.log(nombreDato, valorDato, e[nombreDato])
              if (!columnasExcluidas.includes(nombreDato)) {
                datosFila.push(e[nombreDato] || 0)
              }
            }

            // console.log(datosFila)

            worksheet.getRow(renglon).values=datosFila
        })


        worksheet.eachRow ( (row, rowNumber) => {
            row.eachCell ( (cell, colNumber) => {
                if (rowNumber===1) {
                    cell.font={size: 16, bold: true}
                // } else if (rowNumber===3 ) {
                //     cell.font={size: 14, bold: true}
                } else {
                    cell.font={size: 14}
                }
            })
        } )

        const buf=await workbook.xlsx.writeBuffer()
        saveAs(new Blob([buf]), `tarifas.xlsx`)

      },
      iniciarActualizacionMasiva() {
        this.mostrarVentanaEdicion=true
      },
      confirmarActualizacionMasiva() {
        this.mostrarVentanaEdicion=false
        const porcentajeActualizacion=Number(this.porcentajeActualizacion)
        if (isNaN(porcentajeActualizacion)) {
          this.mostrarError("Debe ingresar un número válido")
          return
        }
        if (porcentajeActualizacion===0) {
          this.mostrarError("Vamos a actualizar un 0%?  Really? 🤪")
          return
        }

        if (this.conceptosAActualizar.length===0) {
          this.mostrarError("Debe seleccionar al menos un concepto a actualizar")
          return
        }

        const textoPrimario="Si, actualizar"
        const textoSecundario="No, cancelar"

        let mensaje="Confirma que desea "
        if (porcentajeActualizacion>0) {
          mensaje += "incrementar"
        } else {
          mensaje += "decrementar"          
        }
        mensaje += ` un <b>${porcentajeActualizacion}%</b> `
        if (this.conceptosAActualizar.length===1) {
          mensaje += "el único concepto seleccionado en "
        } else {
          mensaje += `los <b>${this.conceptosAActualizar.length}</b> conceptos selecccionados en `
        }
        if (this.empresasSeleccionadas.length===1) {
          mensaje += "la única empresa seleccionada "
        } else {
          mensaje += `las <b>${this.empresasSeleccionadas.length}</b> empresas seleccionadas? `
        }
        mensaje += ';;Este proceso es <b>irreversible</b>;;Está <u>completamente seguro?</u>'

        const ad={
          titulo: 'Actualización masiva de precios',
          mensaje,
          botonPrimario: textoPrimario,
          botonSecundario: textoSecundario,
          callback: ((respuesta) => {
            if (respuesta==textoPrimario) {
              this.confirmarActualizacionMasivaProcesar()
            }
          })
        }
        store.dispatch("alertDialog/mostrar", ad)

      },
    async  confirmarActualizacionMasivaProcesar() {
        for (const unaEmpresa of this.empresasSeleccionadas) {
          // console.log(unaEmpresa)
          this.flag=0
          if (unaEmpresa.Activa) {
            for (const unConcepto of this.conceptosAActualizar) {

              const nombreConceptoPuro=unConcepto.split("-")[0].trim()
              const nombreConceptoSufijo=unConcepto.split("-")[1].trim()
              const conceptoAActualizar=unaEmpresa.Configuracion[nombreConceptoPuro]
              const componentes=conceptoAActualizar.split("|")

              let valor, minimo, correspondeActualizar

             if (componentes[0]==="%VD") { 
                minimo=Number(componentes[2])
                if (minimo!==0 && nombreConceptoSufijo==="Minimo") {
                  minimo=minimo*(1+(this.porcentajeActualizacion/100))                
                  minimo=Number(minimo.toFixed(2))
                  valor=Number(componentes[1])
                  unaEmpresa[nombreConceptoPuro+nombreConceptoSufijo]=minimo
                  correspondeActualizar=true
                } else {
                  correspondeActualizar=false
                }
              } else {
              if (nombreConceptoSufijo==="Valor") {
                valor=Number(componentes[1])
                if (valor!==0) {
                  valor=valor*(1+this.porcentajeActualizacion/100)
                  valor=Number(valor.toFixed(2))
                  correspondeActualizar=true
                  unaEmpresa[nombreConceptoPuro+nombreConceptoSufijo]=valor
                  minimo=Number(componentes[2])
                } else {
                  correspondeActualizar=false
                }
              } else {
                minimo=Number(componentes[2])
                if (minimo!==0) {
                  minimo=minimo*(1+this.porcentajeActualizacion/100)
                  minimo=Number(minimo.toFixed(2))
                  valor=Number(componentes[1])
                  unaEmpresa[nombreConceptoPuro+nombreConceptoSufijo]=minimo
                  correspondeActualizar=true
                } else {
                  correspondeActualizar=false
                }
              }
            }
                            

              if (correspondeActualizar) {

                const componentesActualizados=componentes[0]+"|"+valor+"|"+minimo+"|"+componentes[3]+"|"+componentes[4]
                const objetoAActualizar={}
                unaEmpresa.Configuracion[nombreConceptoPuro]=componentesActualizados

                objetoAActualizar[nombreConceptoPuro]=componentesActualizados

                //Actualizamos el aumento Historico primero creamos un registro y luego lo actualizamos
                  if(this.flag==0){
                        this.flag=1
                        unaEmpresa.Estado="G"
                          await empresas.saveConfiguracionHistorico(unaEmpresa.Id, objetoAActualizar)
                          unaEmpresa.Estado=""
                      }else{
                        unaEmpresa.Estado="G"
                          await empresas.updateConfiguracionHistorico(unaEmpresa.Id, objetoAActualizar)
                          unaEmpresa.Estado=""
                      }
                unaEmpresa.Estado="G"
                // console.log("Voy a actualizar", objetoAActualizar)
                empresas.updateConfiguracion(unaEmpresa.Id, objetoAActualizar)
                  .finally( () => {
                    unaEmpresa.Estado=""
                  })
              }
            }

          }
        }
        //Avisa que la configuracion masiva ya termino de ejecutarse
        store.dispatch("alertDialog/mostrar", {titulo: "Actulizacion terminada", mensaje: "Se han actualizado todas las empresas seleccionadas"})
      },
      cancelarActualizacionMasiva() {
        this.mostrarVentanaEdicion=false
      },
      getColorIconoEstado(item) {
        if (item.Estado==="") {
          if (item.Activa) {
            return "green"
          } else {
            return "blue"
          }
        } else {
          return "red"
        }
      },
      getClassIconoEstado(item) {
        if (item.Estado==="") {
          return ""
        } else {
          return "mdi-spin"
        }
      },
      getIconoEstado(item) {
        if (item.Estado==="") {
          if (item.Activa) {
            return "mdi-checkbox-marked-circle-outline"
          } else {
            return "mdi-checkbox-blank-circle-outline"
          }
        } else {
          return "mdi-refresh"
        }
      },
      clickEnActivar(item) {
        item.Estado="G"
        empresas.saveActiva(item.Id, item.Activa)
          .then( () => {
            item.Estado=""
          })
      },
      async popularListaEmpresas() {
        let response
        if (process.env.NODE_ENV=="development") {
          response=await empresas.getAll(false, true)
        } else {
          response=await empresas.getAll(false, true)          
        }

        let primeraEmpresa=true
        this.cabecerasEmpresas=[
          {text: 'Nombre', value: 'Nombre', sortable: true},
          {text: '', value: 'Activa', sortable: false},
          {text: '', value: 'Estado', sortable: false},
        ]

        //Recorro cada una de las empresas
        for (const element of response) {
          element.Estado=""
          const configuracion=await empresas.getConfiguracion(element.Id, `Leyendo ${element.Nombre}`)

          //Si estoy en la primera empresa armo las cabeceras de las columnas
          if (primeraEmpresa) {
            primeraEmpresa=false
            for (const unConcepto of Object.entries(configuracion)) {
                   
              if (unConcepto[0]!=="Id" && unConcepto[0]!=="IdEmpresa" && unConcepto[0]!=="UnificarGuias" && unConcepto[0]!=="TipoCliente" && unConcepto[0]!="Direccion" && unConcepto[0]!="ContactoOficina" && unConcepto[0]!="ContactoDeposito") {
                
                this.cabecerasEmpresas.push(
                  {text: unConcepto[0]+" - Valor", value: unConcepto[0]+"Valor", sortable: true, align: "right"},
                  {text: unConcepto[0]+" - Mínimo", value: unConcepto[0]+"Minimo", sortable: true, align: "right"},
                )
                this.conceptosActualizables.push({id: unConcepto[0]+" - Valor", nombre: unConcepto[0]+" - Valor"})
                this.conceptosActualizables.push({id: unConcepto[0]+" - Minimo", nombre: unConcepto[0]+" - Minimo"})
              }
            }
          }
          element.Configuracion=configuracion

          //Para cada concepto de la configuración obtengo el valor y el mínimo
          //Para cada concepto de la configuración obtengo el valor y el mínimo
          for (const unConcepto of Object.entries(configuracion)) {
            
            if (typeof unConcepto[1]==="string") {
              const conceptos=unConcepto[1].split("|")


              if(typeof conceptos[0] === "string"){
                if(conceptos[0] == "---"){
                  conceptos[0] = "N/A"
                }              
              }


               if (conceptos.length===5) {
                 element[unConcepto[0]+"Variable"]=conceptos[0]
                 element[unConcepto[0]+"Valor"]=Number(conceptos[1])

                 if (isNaN(element[unConcepto[0]+"Valor"])) {
                   element[unConcepto[0]+"Valor"]=0
                  }
                  element[unConcepto[0]+"Variable"]=conceptos[0]
                  element[unConcepto[0]+"Minimo"]=Number(conceptos[2])
                  if (isNaN(element[unConcepto[0]+"Minimo"])) {
                    element[unConcepto[0]+"Minimo"]=0
                  }
                }
              }
            }
          }

        this.listaEmpresas=response
      },
      mostrarMensaje(mensaje, titulo) {
        store.dispatch("alertDialog/mostrar", {titulo, mensaje, botonPrimario: "Entendido"})
      },
      mostrarError(mensaje) {
          store.dispatch("snackbar/mostrar", mensaje)
      },
      mostrarLoading(mensaje) {
        store.dispatch("loading/mostrar", mensaje)
      },
      ocultarLoading(mensaje) {
        store.dispatch("loading/ocultar")
      },
      seleccionarTodo () {
        this.$nextTick(() => {
          if (this.todoSeleccionado) {
            this.conceptosAActualizar = []
          } else {
            this.conceptosAActualizar = this.conceptosActualizables.slice()
            this.conceptosAActualizar.forEach((element, index) => {
              this.conceptosAActualizar[index] = element.id
            });
          }
        })
      },
    },

    created() {
        store.dispatch('actualizarTituloPrincipal', 'Empresas - Configuración masiva')
        this.popularListaEmpresas()

        if (process.env.NODE_ENV=="development") {
          // this.eligioEmpresa(149)
          this.porcentajeActualizacion=10
        }
    }

}
</script>