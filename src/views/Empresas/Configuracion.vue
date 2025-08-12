<template>
    <v-container>
        <v-row class="py-2">
            <v-col>
                <SelectorEmpresa @eligioEmpresa="eligioEmpresa($event)" ></SelectorEmpresa>
            </v-col>            
        </v-row>
        <v-expansion-panels v-if="idEmpresa">
        
            <!-- Tipo De Cliente -->
         <v-expansion-panel>
           <v-expansion-panel-header>
              <h5>Tipo De Cliente</h5>
            </v-expansion-panel-header>
             <v-expansion-panel-content>
                   <v-radio-group v-model= "empresa.Tipo" v-for= "nombre in tipoCliente" :key="nombre.nombre">
                     <v-radio
                      :key="nombre.nombre"
                      :label="`${nombre.nombre}`"
                      :value="nombre.id"
                     ></v-radio>
                   </v-radio-group>
                <v-row>
                  <v-col>
                    <v-switch  v-model="empresa.StockUnitario" :label="`Stock Unitario: ${empresa.StockUnitario ? 'Si' : 'No'}`"></v-switch>
                  </v-col>
                  <v-col>
                    <v-switch  v-model="empresa.StockPosicionado" :label="`Stock Posicionado: ${empresa.StockPosicionado ? 'Si' : 'No'}`"></v-switch>
                  </v-col>
                  <v-col>
                    <v-switch  v-model="empresa.IngesarCantidadUnidadesEnSalidaOrdenes" :label="`Ingresa Cantidad de Stock en Salida de Ordenes: ${empresa.IngesarCantidadUnidadesEnSalidaOrdenes ? 'Si' : 'No'}`"></v-switch>
                  </v-col>
              </v-row>
              <v-row>
                  <v-col>
                    <v-switch  v-model="empresa.VistaDetalladaExcelGuias" :label="`Vista Detallada Excel de Guias: ${empresa.VistaDetalladaExcelGuias ? 'Si' : 'No'}`"></v-switch>
                  </v-col>
                  <v-col>
                    <v-switch  v-model="empresa.ClienteTextil" :label="`Cliente Textil: ${empresa.ClienteTextil ? 'Si' : 'No'}`"></v-switch>
                  </v-col>
                  <v-col>
                    <v-switch  v-model="empresa.LOTE" :label="`Maneja Contenedor: ${empresa.LOTE ? 'Si' : 'No'}`"></v-switch>
                  </v-col>
                  <v-col>
                    <v-switch  v-model="empresa.PART" :label="`Maneja Lote: ${empresa.PART ? 'Si' : 'No'}`"></v-switch>
                  </v-col>
              </v-row>
                <v-row>
                  <v-col cols="12" sm="6" >
                  <v-btn color ="#2196f3" elevation="3" @click="guardarDatosEmpresa">Guardar</v-btn>
                  </v-col>
                </v-row>
            </v-expansion-panel-content>
         </v-expansion-panel>
        
          <!-- Configuración de autogestión  -->
          <v-expansion-panel>
            <v-expansion-panel-header>
              <h5>Configuración de autogestión</h5>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col>
                  <v-switch @click="clickEnActivarAutogestion()" v-model="empresa.AutogestionHabilitada" :label="`Habilitación de autogestión: ${empresa.AutogestionHabilitada ? 'Si' : 'No'}`"></v-switch>
                </v-col>
                <v-col>
                  <v-switch @click="clickEnMostrarTyC()" v-model="empresa.MostrarTyC" :label="`Mostrar TyC: ${empresa.MostrarTyC ? 'Si' : 'No'}`"></v-switch>
                </v-col>
                <v-col>
                  <v-select
                      @change="changeEnOpcionesAutogestion"
                      v-model="listaOpcionesAutogestion"
                      dense
                      multiple
                      prepend-inner-icon="mdi-account-hard-hat"
                      chips
                      :items="autogestionOpciones"
                      label="Seleccione opciones de autogestión"
                      class="mx-5 mt-0 py-0">
                  </v-select>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <!-- Almacen - Ingreso  -->
          <v-expansion-panel>
            <v-expansion-panel-header>
              <h5>Almacen - Ingreso</h5>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="In" 
                    :valorInicial=configuracion.AlmacenIngresoIn
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    @huboIngresoDeDatos="configuracion.AlmacenIngresoIn=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Paletizado" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.AlmacenIngresoPaletizado
                    @huboIngresoDeDatos="configuracion.AlmacenIngresoPaletizado=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Desconsolidado" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.AlmacenIngresoDesconsolidado
                    @huboIngresoDeDatos="configuracion.AlmacenIngresoDesconsolidado=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Adicional desconsolidado" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.AlmacenIngresoAdicionalDesconsolidado
                    @huboIngresoDeDatos="configuracion.AlmacenIngresoAdicionalDesconsolidado=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <!-- Almacen - Almacenaje -->
          <v-expansion-panel>
            <v-expansion-panel-header>
              <h5>Almacen - Almacenaje</h5>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Prepago" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.AlmacenPrepago
                    @huboIngresoDeDatos="configuracion.AlmacenPrepago=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Postpago" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.AlmacenPostpago
                    @huboIngresoDeDatos="configuracion.AlmacenPostpago=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Seguro" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.AlmacenSeguro
                    @huboIngresoDeDatos="configuracion.AlmacenSeguro=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <!-- Almacen - Egreso -->
          <v-expansion-panel>
            <v-expansion-panel-header>
              <h5>Almacen - Egreso</h5>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Out" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.AlmacenEgresoOut
                    @huboIngresoDeDatos="configuracion.AlmacenEgresoOut=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Picking" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.AlmacenEgresoPicking
                    @huboIngresoDeDatos="configuracion.AlmacenEgresoPicking=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <!-- Unificación de guias -->
          <v-expansion-panel>
            <v-expansion-panel-header>
              <h5>Unificación de guías</h5>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col>
                  <v-switch v-model="configuracion.UnificarGuias" :label="`Unificación automática de guías: ${configuracion.UnificarGuias ? 'Si' : 'No'}`"></v-switch>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <!-- Entrega - Regular HD -->
          <v-expansion-panel>
            <v-expansion-panel-header>
              <h5>Entrega - Regular HD</h5>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Guía" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.EntregaRegularHDGuia
                    @huboIngresoDeDatos="configuracion.EntregaRegularHDGuia=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Seguro" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.EntregaRegularHDSeguro
                    @huboIngresoDeDatos="configuracion.EntregaRegularHDSeguro=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="PickingCD" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.EntregaRegularHDPickingCD
                    @huboIngresoDeDatos="configuracion.EntregaRegularHDPickingCD=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Complemento" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.EntregaRegularHDComplemento
                    @huboIngresoDeDatos="configuracion.EntregaRegularHDComplemento=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <!-- Entrega - Regular B2B -->
          <v-expansion-panel>
            <v-expansion-panel-header>
              <h5>Entrega - Regular B2B</h5>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Guía" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.EntregaRegularB2BGuia
                    @huboIngresoDeDatos="configuracion.EntregaRegularB2BGuia=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Seguro" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.EntregaRegularB2BSeguro
                    @huboIngresoDeDatos="configuracion.EntregaRegularB2BSeguro=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="CTR" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.EntregaRegularB2BCTR
                    @huboIngresoDeDatos="configuracion.EntregaRegularB2BCTR=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="PickingCD" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.EntregaRegularB2BPickingCD
                    @huboIngresoDeDatos="configuracion.EntregaRegularB2BPickingCD=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Complemento" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.EntregaRegularB2BComplemento
                    @huboIngresoDeDatos="configuracion.EntregaRegularB2BComplemento=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>


          <!-- Entrega - Regular Devoluciones -->
          <v-expansion-panel>
            <v-expansion-panel-header>
              <h5>Entrega - Regular Devoluciones</h5>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Guía" 
                    variablesDisponibles="M3|Kilos|Unidades|Pats|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.EntregaRegularDevolucionesGuia
                    @huboIngresoDeDatos="configuracion.EntregaRegularDevolucionesGuia=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Seguro" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.EntregaRegularDevolucionesSeguro
                    @huboIngresoDeDatos="configuracion.EntregaRegularDevolucionesSeguro=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="CTR" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.EntregaRegularDevolucionesCTR
                    @huboIngresoDeDatos="configuracion.EntregaRegularDevolucionesCTR=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="PickingCD" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.EntregaRegularDevolucionesPickingCD
                    @huboIngresoDeDatos="configuracion.EntregaRegularDevolucionesPickingCD=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Complemento" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.EntregaRegularDevolucionesComplemento
                    @huboIngresoDeDatos="configuracion.EntregaRegularDevolucionesComplemento=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>


          <!-- Entrega - Regular Supermercado -->
          <v-expansion-panel>
            <v-expansion-panel-header>
              <h5>Entrega - Regular Supermercado</h5>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Guía" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.EntregaRegularSupermercadoGuia
                    @huboIngresoDeDatos="configuracion.EntregaRegularSupermercadoGuia=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Seguro" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.EntregaRegularSupermercadoSeguro
                    @huboIngresoDeDatos="configuracion.EntregaRegularSupermercadoSeguro=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="PickingCD" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.EntregaRegularSupermercadoPickingCD
                    @huboIngresoDeDatos="configuracion.EntregaRegularSupermercadoPickingCD=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Complemento" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.EntregaRegularSupermercadoComplemento
                    @huboIngresoDeDatos="configuracion.EntregaRegularSupermercadoComplemento=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <!-- Entrega - Regular CND -->
          <v-expansion-panel>
            <v-expansion-panel-header>
              <h5>Entrega - Regular CND</h5>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Guía" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.EntregaRegularCNDGuia
                    @huboIngresoDeDatos="configuracion.EntregaRegularCNDGuia=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Seguro" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.EntregaRegularCNDSeguro
                    @huboIngresoDeDatos="configuracion.EntregaRegularCNDSeguro=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="PickingCD" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.EntregaRegularCNDPickingCD
                    @huboIngresoDeDatos="configuracion.EntregaRegularCNDPickingCD=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Complemento" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.EntregaRegularCNDComplemento
                    @huboIngresoDeDatos="configuracion.EntregaRegularCNDComplemento=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <!-- Entrega - Regular Rendiciones -->
          <v-expansion-panel>
            <v-expansion-panel-header>
              <h5>Entrega - Regular Rendiciones</h5>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Guía" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.EntregaRegularRendicionesGuia
                    @huboIngresoDeDatos="configuracion.EntregaRegularRendicionesGuia=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Seguro" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.EntregaRegularRendicionesSeguro
                    @huboIngresoDeDatos="configuracion.EntregaRegularRendicionesSeguro=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="PickingCD" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.EntregaRegularRendicionesPickingCD
                    @huboIngresoDeDatos="configuracion.EntregaRegularRendicionesPickingCD=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Complemento" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.EntregaRegularRendicionesComplemento
                    @huboIngresoDeDatos="configuracion.EntregaRegularRendicionesComplemento=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <!-- Entrega - Especial -->
          <v-expansion-panel>
            <v-expansion-panel-header>
              <h5>Entrega - Especial</h5>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Guía" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.EntregaEspecialGuia
                    @huboIngresoDeDatos="configuracion.EntregaEspecialGuia=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <!-- Recolección - Regular HD -->
          <v-expansion-panel>
            <v-expansion-panel-header>
              <h5>Recolección - Regular HD</h5>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Guía" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.RecoleccionRegularHDGuia
                    @huboIngresoDeDatos="configuracion.RecoleccionRegularHDGuia=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Seguro" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.RecoleccionRegularHDSeguro
                    @huboIngresoDeDatos="configuracion.RecoleccionRegularHDSeguro=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <!-- Recolección - Regular B2B -->
          <v-expansion-panel>
            <v-expansion-panel-header>
              <h5>Recolección - Regular B2B</h5>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Guía" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.RecoleccionRegularB2BGuia
                    @huboIngresoDeDatos="configuracion.RecoleccionRegularB2BGuia=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Seguro" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.RecoleccionRegularB2BSeguro
                    @huboIngresoDeDatos="configuracion.RecoleccionRegularB2BSeguro=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="CTR" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.RecoleccionRegularB2BCTR
                    @huboIngresoDeDatos="configuracion.RecoleccionRegularB2BCTR=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <!-- Recolección - Regular Supermercado -->
          <v-expansion-panel>
            <v-expansion-panel-header>
              <h5>Recolección - Regular Supermercado</h5>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Guía" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.RecoleccionRegularSupermercadoGuia
                    @huboIngresoDeDatos="configuracion.RecoleccionRegularSupermercadoGuia=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Seguro" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.RecoleccionRegularSupermercadoSeguro
                    @huboIngresoDeDatos="configuracion.RecoleccionRegularSupermercadoSeguro=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <!-- Recolección - Regular CND -->
          <v-expansion-panel>
            <v-expansion-panel-header>
              <h5>Recolección - Regular CND</h5>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Guía" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.RecoleccionRegularCDNGuia
                    @huboIngresoDeDatos="configuracion.RecoleccionRegularCDNGuia=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Seguro" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.RecoleccionRegularCDNSeguro
                    @huboIngresoDeDatos="configuracion.RecoleccionRegularCDNSeguro=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <!-- Recolección - Especial -->
          <v-expansion-panel>
            <v-expansion-panel-header>
              <h5>Recolección - Especial</h5>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col>
                  <IngresoValorConfiguracion 
                    :key="keyComponent"
                    titulo="Guía" 
                    variablesDisponibles="M3|Kilos|Unidades|%VD|Fijo|Bultos"
                    :valorInicial=configuracion.RecoleccionEspecialGuia
                    @huboIngresoDeDatos="configuracion.RecoleccionEspecialGuia=$event" 
                  ></IngresoValorConfiguracion>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <!-- Contacto -->
          <v-expansion-panel>
            <v-expansion-panel-header>
              <h5>Contacto</h5>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col cols="12" >
                  <v-text-field filled label="Domicilio" v-model="configuracion.Direccion" append-icon="mdi-map-marker"></v-text-field>
                </v-col>  
                <v-col cols="12" width="30">
                  <v-text-field label="Emails oficina" v-model="configuracion.ContactoOficina"></v-text-field>
                  <small>Puede colocar varios separados por comas</small>
                </v-col>
                <br>
                <v-col cols="12" width="30">
                  <v-text-field label="Emails depósito" v-model="configuracion.ContactoDeposito" ></v-text-field>
                  <small>Puede colocar varios separados por comas</small>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
         </v-expansion-panel>


        </v-expansion-panels>
    
        <v-col>
          <v-footer absolute><v-btn :block="true" color="blue" @click="registrarInformacion" dark  v-if="idEmpresa">Registrar información</v-btn></v-footer>
        </v-col>
       
    </v-container>
</template>

<script>

import SelectorEmpresa from '@/components/SelectorEmpresa.vue'
import IngresoValorConfiguracion from "@/components/IngresoValorConfiguracion.vue"
import store from '@/store'
import empresas from '@/store/empresasV3'
import guias from "../../store/guias"
import fechas from 'vue-lsi-util/fechas'

export default {
    name: "EmpresasConfiguracion",

    data() {
        return {
            RdgTipoCliente: null,
            tipoCliente: [{id:0,nombre:'Administrador'},{id:1,nombre:'Integral'},{id:3,nombre:'Cross Docking'}],
            keyComponent: 0,
            datosValidos: false,
            idEmpresa: null,
            guiasEmpresa: [],
            configuracion: {},
            empresa: {},
            autogestionOpciones: [
              'VerStock', 
              'ImportarOrdenesDesdeExcel', 
              'InformeDeGuias', 
              'InformeDeAlmacenaje', 
              'InformeDeOrdenes', 
              'InformeDeTracking', 
              'GestionManualDeCatalogo', 
              'CreacionManualDeOrdenes',
            ],
            listaOpcionesAutogestion: [],
            reglas: { 
              required: value => !!value || 'Obligatorio', 
              min: value => value.length>=3 || 'Demasiado corto', 
              configuracionValida: value => value>=0 || "No puede ser negativo"},
        }
    },

    methods: {
      async clickEnActivarAutogestion() {
        this.mostrarLoading("Registrando información...")
        await empresas.saveActivaAutogestion(this.idEmpresa, this.empresa.AutogestionHabilitada)
        this.ocultarLoading()
      },
      async clickEnMostrarTyC() {
        this.mostrarLoading("Registrando información...")
        await empresas.saveMostrarTyC(this.idEmpresa, this.empresa.MostrarTyC)
        this.ocultarLoading()
      },
      async changeEnOpcionesAutogestion() {
        this.mostrarLoading("Registrando información...")
        const opcionesAutogestion=this.listaOpcionesAutogestion.join(',')
        console.log(this.listaOpcionesAutogestion, opcionesAutogestion)
        await empresas.saveAutogestionOpciones(this.idEmpresa, opcionesAutogestion)
        this.ocultarLoading()
      },
      registrarInformacion() {
        let fechaActual = fechas.getHoy()
        let mesActual = fechaActual.substring(5,7)
        let añoActual = fechaActual.substring(0,4)
        let inicioMes = añoActual + "-" + mesActual + "-01"
        
        guias.getByPeriodoIdEmpresa(inicioMes, fechaActual, this.idEmpresa)
        .then(response=>{
            this.guiasEmpresa = response

          this.validar()

          if (this.datosValidos) {
            const payload={}
            Object.assign(payload, this.configuracion)
            for (const unAtributo of Object.entries(payload)) {
              if (unAtributo[0]!="Id" && unAtributo[0]!="IdEmpresa" && unAtributo[0]!="UnificarGuias" && unAtributo[0]!="TipoCliente" && unAtributo[0]!="Direccion" && unAtributo[0]!="ContactoOficina" && unAtributo[0]!="ContactoDeposito") {
                payload[unAtributo[0]]=unAtributo[1].Variable+"|"+String(unAtributo[1].Valor)+"|"+String(unAtributo[1].Minimo)+"|"+String(unAtributo[1].Activo)+"|"+String(unAtributo[1].Predeterminado)
              }
            }
            payload.UnificarGuias=this.configuracion.UnificarGuias
            // console.log(payload);
            empresas.saveConfiguracion(this.idEmpresa, payload)
              .then(response => {
                empresas.saveConfiguracionHistorico(this.idEmpresa, payload)
                //actualizo las guias con los valores nuevos
                this.guiasEmpresa.forEach(e=>{
                  let concepto = e.DetalleCalculo.split(":")[1].trim()
                  concepto = concepto.split(",")[0].trim()
                  concepto = concepto.substring(1,concepto.length-5)
                  
                  guias.calcularValorizacion(e.IdOrden,concepto)
                  .then(respuesta =>{
                    for(const unCalculo of respuesta.Calculo){
                      unCalculo.Concepto = concepto + unCalculo.Concepto
                    }
                    console.log(respuesta.Calculo)
                    guias.actualizarCalculoGuias(respuesta.Calculo,e.Id)
                  })
                  store.dispatch("alertDialog/mostrar", {titulo: "Registración exitosa", mensaje: "Los datos se han registrado exitosamente"})
                })
                //Aca llamo a mi funcion Historico
                // console.log("Respuesta de API", response);
              })
              .catch(error => {
                console.log("Error en API", error);
              })
          }  
        })
        
      },
      eligioEmpresa(idEmpresaElegida) {
          this.idEmpresa=idEmpresaElegida;
          // console.log("Voy a leer la configuraicon")

          empresas.getOne(idEmpresaElegida)
            .then ( response => {
              this.empresa=response
              const autogestionOpciones=this.empresa.AutogestionOpciones.split(',')
              // console.log("Opciones aut", autogestionOpciones)
              this.listaOpcionesAutogestion=[]
              autogestionOpciones.forEach(e => {
                this.listaOpcionesAutogestion.push(e)
              })
            })

          empresas.getConfiguracion(idEmpresaElegida)
            .then(response => {
              // console.log("Configuracion leida", response);
              this.configuracion=response
              for (const unAtributo of Object.entries(this.configuracion)) {
                if (unAtributo[0]!="Id" && unAtributo[0]!="IdEmpresa" && unAtributo[0]!="UnificarGuias" && unAtributo[0]!="TipoCliente" && unAtributo[0]!="Direccion" && unAtributo[0]!="ContactoOficina" && unAtributo[0]!="ContactoDeposito") {
                  const valores=unAtributo[1].split("|")
                  if (valores.length==5) {
                    this.configuracion[unAtributo[0]]={Variable: valores[0], Valor: parseFloat(valores[1]), Minimo: parseFloat(valores[2]), Activo: valores[3]=="true", Predeterminado: valores[4]=="true"}
                  } else {
                    this.configuracion[unAtributo[0]]={Variable: '', Valor: 0, Minimo: 0, Activo: false, Predeterminado: false}
                  }
                }
                this.keyComponent++
              }
            })
            .catch(error => {
              console.log("Error", error)
              this.mostrarError(error)
            })
            
      },



      guardarDatosEmpresa(){
        
        if(this.empresa.PART && this.empresa.LOTE){
          this.mostrarError("Los clientes no pueden tener contenedor y lote activos a la vez")
        }else{
          empresas.saveEmpresa(this.idEmpresa,{Id: this.idEmpresa, Tipo: this.empresa.Tipo, StockUnitario: this.empresa.StockUnitario, StockPosicionado: this.empresa.StockPosicionado, IngesarCantidadUnidadesEnSalidaOrdenes: this.empresa.IngesarCantidadUnidadesEnSalidaOrdenes,VistaDetalladaExcelGuias: this.empresa.VistaDetalladaExcelGuias, ClienteTextil: this.empresa.ClienteTextil, LOTE: this.empresa.LOTE, PART: this.empresa.PART})
          .then(response => {
            this.empresa=response
          })
          .catch(error => {
            console.log("Error", error)
            this.mostrarError(error)
          })
        }        
      },

      validar() {
        let errores=""
        for (const unAtributo of Object.entries(this.configuracion)) {
          if (unAtributo[0]!="Id" && unAtributo[0]!="IdEmpresa" && unAtributo[0]!="TipoCliente" && unAtributo[0]!="Direccion" && unAtributo[0]!="ContactoOficina" && unAtributo[0]!="ContactoDeposito"){
            if (unAtributo[1].Activo) {
              if (unAtributo[1].Variable==="" || unAtributo[1].Valor<0 || unAtributo[1].Minimo<0) {
                errores += unAtributo[0]+";"
              }
            } else {
              if (unAtributo[0]!="UnificarGuias" && unAtributo[0]!="TipoCliente" && unAtributo[0]!="Direccion" && unAtributo[0]!="ContactoOficina" && unAtributo[0]!="ContactoDeposito") {
                unAtributo[1].Variable="---"
              }
            }
          }
        }
        this.datosValidos=(errores.length==0)
        if (errores.length>0) {
          store.dispatch("alertDialog/mostrar", {titulo: "Datos incompletos", mensaje: "Los siguientes campos presentan datos incompletos o erróneos:;;"+errores})          
        }
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
    },

    components: {
        SelectorEmpresa, IngresoValorConfiguracion
    },

    created() {
        store.dispatch('actualizarTituloPrincipal', 'Empresas - Configuración')
        store.dispatch('empresas/cargarListaEmpresas', "SoloActivas")

        if (process.env.NODE_ENV=="development") {
          // this.eligioEmpresa(149)
        }
    }

}
</script>