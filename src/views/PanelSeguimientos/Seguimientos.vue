<template>
    <v-container fluid class="pa-4">
      <v-row>
        <v-col>
          <v-sheet elevation="0" class="mb-6">
            <v-row align="center" justify="space-between">
              <v-col cols="12" md="6">
                <span class="text-h4 font-weight-semibold">
                  Seguimiento
                </span>
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
      </v-row>
  
      <v-row>
        <v-col cols="12">
          <v-card elevation="2" class="mb-6">
            <v-card-text>
              <v-row dense align="center" no-gutters>
                <v-col cols="12" md="4" class="pr-4">
                  <v-row>
                    <v-col cols="12">
                      <span class="subtitle-2 font-weight-medium mb-1">
                        Seleccionar empresa
                      </span>
                    </v-col>
                    <v-col cols="12">
                      <SelectorEmpresa
                        @eligioEmpresa="eligioEmpresa"
                        :idEmpresaInicialmenteSeleccionada="idEmpresa"
                        :listaEmpresas="listaEmpresas"
                        outlined
                        dense
                        hide-details
                      />
                    </v-col>
                  </v-row>
                </v-col>
  
                <v-col cols="12" md="4" class="pr-4">
                  <v-row>
                    <v-col cols="12">
                      <span class="subtitle-2 font-weight-medium mb-1">
                        Fecha Desde
                      </span>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="fechaDesde"
                        type="date"
                        outlined
                        dense
                        hide-details
                      />
                    </v-col>
                  </v-row>
                </v-col>
  
                <v-col cols="12" md="4">
                  <v-row>
                    <v-col cols="12">
                      <span class="subtitle-2 font-weight-medium mb-1">
                        Fecha Hasta
                      </span>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="fechaHasta"
                        type="date"
                        outlined
                        dense
                        hide-details
                      />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
  
      <v-row>
        <v-col cols="12">
          <v-card elevation="2">
            <v-tabs v-model="tab" :style="{ 'background-color': 'var(--surface)' }" show-arrows class="seguimiento-tabs">
              <v-tab href="#tab-ordenes">
                Órdenes
              </v-tab>
              <v-tab href="#tab-guias">
                Guías
              </v-tab>
              <v-tab href="#tab-guias-empresa">
                Conforme de entrega
              </v-tab>
            </v-tabs>
  
            <v-tabs-items v-model="tab">
              <v-tab-item value="tab-ordenes">
                <OrdenesTab
                  :cabecerasOrdenes="cabecerasOrdenes"
                  :ordenesFiltradasParaTabla="ordenesFiltradasParaTabla"
                  :pageOrdenes.sync="pageOrdenes"
                  :pageCountOrdenes="pageCountOrdenes"
                  :paginationInfoOrdenes="paginationInfoOrdenes"
                  :itemsPerPage.sync="itemsPerPage"
                  :itemsPerPageOptions="itemsPerPageOptions"
                  :textoBusqueda.sync="textoBusqueda"
                  :idEmpresa="idEmpresa"
                  :loading="loading"
                  :errorAlCargar="errorAlCargar"
                  :getStatusChipClassTextual="getStatusChipClassTextual"
                  @open-modal="openModal"
                  @ver-guia-asociada="verGuiaAsociada"
                  @descargar-ordenes-excel="descargarOrdenesExcel"
                />
              </v-tab-item>
  
              <v-tab-item value="tab-guias">
                <GuiasTab
                  :cabecerasGuias="cabecerasGuias"
                  :guiasFiltradasParaTabla="guiasFiltradasParaTabla"
                  :pageGuias.sync="pageGuias"
                  :pageCountGuias="pageCountGuias"
                  :paginationInfoGuias="paginationInfoGuias"
                  :itemsPerPageGuias.sync="itemsPerPageGuias"
                  :itemsPerPageOptions="itemsPerPageOptions"
                  :textoBusquedaGuias.sync="textoBusquedaGuias"
                  :idEmpresa="idEmpresa"
                  :loading="loading"
                  :errorAlCargar="errorAlCargar"
                  :getStatusChipClassTextual="getStatusChipClassTextual"
                  @open-modal="openModal"
                />
              </v-tab-item>

              <v-tab-item value="tab-guias-empresa">
                <GuiasEmpresaTab
                  :cabecerasGuiasEmpresa="cabecerasGuiasEmpresa"
                  :guiasEmpresaFiltradasParaTabla="guiasEmpresaFiltradasParaTabla"
                  :pageGuiasEmpresa.sync="pageGuiasEmpresa"
                  :pageCountGuiasEmpresa="pageCountGuiasEmpresa"
                  :paginationInfoGuiasEmpresa="paginationInfoGuiasEmpresa"
                  :itemsPerPageGuiasEmpresa.sync="itemsPerPageGuiasEmpresa"
                  :itemsPerPageOptions="itemsPerPageOptions"
                  :textoBusquedaGuiasEmpresa.sync="textoBusquedaGuiasEmpresa"
                  :idEmpresa="idEmpresa"
                  :loading="loading"
                  :errorAlCargar="errorAlCargar"
                  :getStatusChipClassTextual="getStatusChipClassTextual"
                  @open-modal="openGuiaEmpresaModal"
                />
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-col>
      </v-row>
  
      <SeguimientoModal
        :show="showModal"
        :modalData="modalData"
        :modalType="modalType"
        :timelineStepsComputed="timelineStepsComputed"
        :loading="loading"
        :errorAlCargar="errorAlCargar"
        :getStatusChipClassTextual="getStatusChipClassTextual"
        @close="closeModal"
        @descargar-orden-excel-individual="descargarOrdenExcelIndividual"
        @descargar-guia-excel-individual="descargarGuiaExcelIndividual"
      />

      <GuiaEmpresaModal
        :show="showGuiaEmpresaModal"
        :guia="guiaEmpresaModalData"
        :getStatusChipClassTextual="getStatusChipClassTextual"
        @close="closeGuiaEmpresaModal"
        @descargar="descargarGuiaEmpresaPDF"
      />
    </v-container>
  </template>
  
  <script>
  /*
    SeguimientosOrdenesGuias.vue
    --------------------------------------------------------------------------
    Componente principal para el seguimiento de órdenes y guías en una interfaz
    unificada. Permite filtrar por empresa y rango de fechas, mostrando los
    resultados en dos pestañas separadas (Órdenes y Guías). Al seleccionar un
    elemento, muestra un modal con detalles y una línea de tiempo de su progreso.
  
    Utiliza Vuex para la gestión de estados (store) y Vuetify para los componentes
    de interfaz de usuario y el layout.
  
    ==========================================================================
    Características y Funcionalidades:
  
    1.  **Filtros de Empresa y Fechas:**
        * Selector de empresa (`SelectorEmpresa`): Componente reutilizable para elegir la empresa.
        * Campos de fecha (`fechaDesde`, `fechaHasta`): Permiten definir un rango de fechas.
        * Las fechas se inicializan por defecto a la "última semana" (7 días atrás hasta hoy).
        * Los filtros se aplican a la carga de datos tanto para órdenes como para guías.
  
    2.  **Pestañas (`v-tabs`):**
        * Organiza la información en dos secciones: "Órdenes" y "Guías".
        * Permite al usuario alternar entre la visualización de órdenes y guías.
  
    3.  **Tablas de Datos (`v-data-table`):**
        * Cada pestaña contiene su propia tabla para mostrar la lista de elementos (órdenes o guías).
        * **Columnas:** `N° Orden/Guía`, `Empresa`, `Cliente/Destino`, `Fecha Creación`, `Estado Actual`, `Acciones`.
        * **Buscador:** Permite buscar dentro de la tabla actual.
        * **Paginación:** Controlada manualmente para ambas tablas.
        * **Chips de Estado:** Los estados se muestran con un `v-chip` con colores dinámicos (definidos en `getStatusChipClassTextual`).
        * **Botón de Acción (`mdi-eye-outline`):** Abre un modal de detalle para el elemento seleccionado.
        * **NUEVA FUNCIONALIDAD:** Para órdenes en estado "A distribución" y con guía asociada, se muestra un chip "Seguimiento aquí" que redirige a la pestaña de guías y abre el modal de la guía directamente.
  
    4.  **Modal de Detalle Unificado (`v-dialog`):**
        * Muestra información detallada de una orden o una guía cuando se hace clic en el botón "ojo".
        * **Datos Generales:** Número, Empresa, Cliente/Destino, Fechas relevantes, Estado actual.
        * **Línea de Tiempo de Progreso:** Visualiza los diferentes estados por los que ha pasado el elemento (orden o guía) con iconos y colores (`_construirTimelineOrden` y `_construirTimelineGuia`). Se muestran todos los estados posibles, y se pintan/destacan los completados y el estado actual.
        * **Detalle de Productos:** Para órdenes, muestra la lista de productos asociados.
  
    5.  **Manejo de Estados (Loading, Error):**
        * `loading`: Indica si alguna operación de carga está en curso (muestra un spinner).
        * `errorAlCargar`: Muestra mensajes de error si la carga de datos falla.
  
    ==========================================================================
    Ajustes y Correcciones Realizadas:
  
    * **Uso del nuevo endpoint `getOrdenesByEmpresaPeriodoConDestinos`:** El método `popularListaDeOrdenes` ahora utiliza este nuevo endpoint para obtener los datos de las órdenes.
    * **Procesamiento de la respuesta para órdenes:** La respuesta del nuevo endpoint se agrupa para consolidar la información de una orden con sus múltiples productos y campos de destino.
    * **Actualización de las cabeceras de la tabla de órdenes:** Se han ajustado para reflejar los nuevos campos disponibles como `NombreDestino` y `Fecha`.
    * **Visualización del modal de órdenes:** Se han añadido y ajustado los campos en el modal de detalle de órdenes para mostrar `DomicilioDestino`, `LocalidadDestino`, `CodigoPostalDestino`, `ObservacionesDestino`, `Valor` y las `Observaciones` de la orden.
    * **Manejo de productos en el modal de órdenes:** Se ha adaptado la sección de productos del modal para mostrar los datos devueltos por el nuevo endpoint (Barcode, CodeEmpresa, Precio, Alto, Ancho, Largo, Peso).
    * **Consistencia en nombres de campos:** Se ha verificado que los nombres de los campos utilizados en la plantilla (`item.Numero`, `item.NombreDestino`, `item.Fecha`, `item.Estado`) coincidan con los nombres de las propiedades en el objeto `item` después del procesamiento de `popularListaDeOrdenes`.
    * Se eliminó la llamada a `_obtenerDetalleProductos` para las órdenes, ya que la nueva API ya devuelve todos los productos anidados.
  
    ==========================================================================
    Dependencias de Vuex (asumidas):
    * `store`: Instancia global del store Vuex.
    * `store/empresas`: Módulo Vuex para cargar `listaEmpresas` y obtener configuración de `empresasV3`.
    * `store/ordenesV3`: Módulo Vuex para obtener y procesar datos de órdenes.
    * `store/guias`: Módulo Vuex para obtener y procesar datos de guías.
    * `store/roles`: Módulo Vuex para obtener roles de usuario (usado para `rolPermitido`).
  
    Componentes Externos:
    * `SelectorEmpresa`: Componente para la selección de empresas (se asume su existencia y funcionalidad).
  */
  
import SelectorEmpresa from '@/components/SelectorEmpresa.vue'
import OrdenesTab from './components/OrdenesTab.vue'
import GuiasTab from './components/GuiasTab.vue'
import GuiasEmpresaTab from './components/GuiasEmpresaTab.vue'
import GuiaEmpresaModal from './components/GuiaEmpresaModal.vue'
import SeguimientoModal from './components/SeguimientoModal.vue'
import store from '@/store'
import excel from 'exceljs'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
  
import apiMixin from '@/mixins/seguimientosApiMixin'
import { construirTimelineOrden, construirTimelineGuia } from '@/helpers/timeline'
  export default {
    name: 'SeguimientosOrdenesGuias', // Nuevo nombre para el componente
  mixins: [apiMixin],
    components: { SelectorEmpresa, OrdenesTab, GuiasTab, GuiasEmpresaTab, SeguimientoModal, GuiaEmpresaModal },
    data() {
      return {
        tab: null, // Controla la pestaña activa ('tab-ordenes' o 'tab-guias'). Por defecto, null para que no se seleccione ninguna al inicio o la primera se activa si Vuetify lo hace.
        listaEmpresas: [], // Almacena la lista de empresas disponibles para el filtro.
        idEmpresa: -1, // ID de la empresa seleccionada en el filtro.
        empresaPorLote: false, // Propiedad de configuración de la empresa.
        empresaPosicionado: false, // Propiedad de configuración de la empresa.
        estaEmpresa: {}, // Objeto completo de la empresa seleccionada.
  
        fechaDesde: '', // Fecha de inicio para el filtro de rango.
        fechaHasta: '', // Fecha de fin para el filtro de rango.
  
        todasLasOrdenes: [], // Array que contiene todas las órdenes cargadas para la empresa y fechas.
        todasLasGuias: [], // Array que contiene todas las guías cargadas para la empresa y fechas.
  
        // ---------------------------------------
        // Definición de cabeceras de la tabla de Órdenes
        // Se utiliza para configurar las columnas de la v-data-table de órdenes.
        // ---------------------------------------
        cabecerasOrdenes: [
          { text: 'N° Orden', value: 'Numero', sortable: true }, // Cambiado a 'Numero'
          { text: 'Empresa', value: 'NombreEmpresa', sortable: true }, // Podrías necesitar mapear esto si no viene directamente
          { text: 'Cliente', value: 'NombreDestino', sortable: true }, // Nuevo campo
          { text: 'Fecha Creación', value: 'Fecha', sortable: true }, // Cambiado a 'Fecha' de la orden
          { text: 'Estado Actual', value: 'Estado', sortable: true },
          {
            text: 'Acciones',
            value: 'acciones',
            sortable: false,
            align: 'center',
            width: '180px', // Ancho ajustado para el nuevo chip de seguimiento
          },
        ],
        // ---------------------------------------
        // Definición de cabeceras de la tabla de Guías
        // Se utiliza para configurar las columnas de la v-data-table de guías.
        // ---------------------------------------
        cabecerasGuias: [
          { text: 'N° Guía', value: 'Comprobante', sortable: true },
          { text: 'Empresa', value: 'NombreCliente', sortable: true },
          { text: 'Destino', value: 'NombreDestino', sortable: true },
          { text: 'Remito', value: 'Remitos', sortable: true },
          { text: 'Fecha Creación', value: 'FechaOriginal', sortable: true },
          { text: 'Estado Actual', value: 'Estado', sortable: true },
          {
            text: 'Acciones',
            value: 'acciones',
            sortable: false,
            align: 'center',
            width: '80px',
          },
        ],

        cabecerasGuiasEmpresa: [
          { text: 'Comprobante', value: 'Comprobante', sortable: true },
          { text: 'Destino', value: 'NombreDestino', sortable: true },
          { text: 'Bultos', value: 'Bultos', sortable: true },
          { text: 'Remitos', value: 'Remitos', sortable: true },
          { text: 'Fecha Entrega', value: 'FechaEntrega', sortable: true },
          { text: 'Fecha Creación', value: 'FechaOriginal', sortable: true },
          { text: 'Estado', value: 'Estado', sortable: true },
          { text: 'Acciones', value: 'acciones', sortable: false, align: 'center', width: '80px' },
        ],
  
        textoBusqueda: '', // Texto para el campo de búsqueda de órdenes.
        textoBusquedaGuias: '', // Texto para el campo de búsqueda de guías.
        loading: false, // Indica si alguna operación de carga está en curso.
        errorAlCargar: null, // Almacena mensajes de error durante la carga de datos.
  
        showModal: false, // Controla la visibilidad del modal de detalle.
        modalType: '', // 'orden' o 'guia', indica qué tipo de elemento se está mostrando en el modal.
        modalData: null, // Objeto con los datos del elemento (orden o guía) que se muestra en el modal.

        showGuiaEmpresaModal: false,
        guiaEmpresaModalData: null,
  
        rolPermitido: false, // Controla permisos basados en el rol del usuario.
        unidadesTotalesEnBase: 0, // Dato específico para clientes textiles (no relacionado con seguimiento general).
  
        // ---------------------------------------
        // Paginación de la tabla de Órdenes
        // ---------------------------------------
        pageOrdenes: 1, // Página actual de la tabla de órdenes.
        itemsPerPage: 30, // Número de ítems por página para órdenes.
        itemsPerPageOptions: [10, 30, 100, { text: 'Todos', value: -1 }], // Opciones para ítems por página.
  
        // ---------------------------------------
        // Paginación de la tabla de Guías
        // ---------------------------------------
        pageGuias: 1, // Página actual de la tabla de guías.
        itemsPerPageGuias: 30, // Número de ítems por página para guías.

        // ---------------------------------------
        // Paginación de la tabla de Guías por Empresa
        // ---------------------------------------
        pageGuiasEmpresa: 1,
        itemsPerPageGuiasEmpresa: 30,

        textoBusquedaGuiasEmpresa: '',
        todasLasGuiasEmpresa: [],
      }
    },
    computed: {
      /**
       * `ordenesFiltradasParaTabla`:
       * Propiedad computada que filtra la lista completa de órdenes (`todasLasOrdenes`)
       * según el campo de búsqueda de texto. Luego aplica la paginación manual.
       * @returns {Array} Array de órdenes filtradas y paginadas.
       */
      ordenesFiltradasParaTabla() {
        // Si no hay empresa seleccionada, no hay órdenes que mostrar.
        if (this.idEmpresa <= 0) return [];
  
        let filteredItems = this.todasLasOrdenes;
  
        // Filtrar por texto de búsqueda
        if (this.textoBusqueda) {
          const searchText = this.textoBusqueda.toLowerCase();
          filteredItems = filteredItems.filter(item => {
            // Busca en Numero, NombreDestino, Observaciones, NombreEstado, productos.NombreProducto
            return (
              item.Numero?.toLowerCase().includes(searchText) ||
              item.NombreDestino?.toLowerCase().includes(searchText) ||
              item.Observaciones?.toLowerCase().includes(searchText) ||
              item.NombreEstado?.toLowerCase().includes(searchText) ||
              item.productos?.some(p => p.NombreProducto?.toLowerCase().includes(searchText))
            );
          });
        }
  
        // Aplicar paginación manual a los resultados filtrados.
        if (this.itemsPerPage > 0) {
          const start = (this.pageOrdenes - 1) * this.itemsPerPage;
          return filteredItems.slice(start, start + this.itemsPerPage);
        } else {
          // Si la opción es "Todos" (value: -1), se devuelve toda la lista filtrada.
          return filteredItems;
        }
      },
  
      /**
       * `pageCountOrdenes`:
       * Calcula el número total de páginas para la paginación de órdenes,
       * basándose en la cantidad total de órdenes filtradas por búsqueda y los ítems por página.
       * @returns {number} Número total de páginas.
       */
      pageCountOrdenes() {
        if (this.itemsPerPage > 0) {
          const totalFilteredBySearch = this.ordenesFiltradasParaTabla.length; // Usar el largo de la lista ya filtrada por búsqueda
          return Math.ceil(totalFilteredBySearch / this.itemsPerPage);
        }
        return 1;
      },
  
      /**
       * `paginationInfoOrdenes`:
       * Genera la cadena de texto para mostrar la información de paginación
       * en el pie de la tabla de órdenes (ej. "Mostrando 1-30 de 100").
       * @returns {string} Información de paginación.
       */
      paginationInfoOrdenes() {
        const total = this.todasLasOrdenes.length; // Total de órdenes cargadas (sin filtros de búsqueda)
        if (this.itemsPerPage > 0) {
          const start = (this.pageOrdenes - 1) * this.itemsPerPage + 1;
          const end = Math.min(start + this.itemsPerPage - 1, total);
          return `${start}-${end} de ${total}`;
        } else {
          // Si se muestran todos los ítems, el rango es de 1 al total.
          return `1-${total} de ${total}`;
        }
      },
  
      /**
       * `guiasFiltradasParaTabla`:
       * Propiedad computada que filtra la lista completa de guías (`todasLasGuias`)
       * según la empresa seleccionada y el rango de fechas. Luego aplica la paginación manual.
       * Esta función solo prepara los datos para la tabla de guías.
       * @returns {Array} Array de guías filtradas y paginadas.
       */
      guiasFiltradasParaTabla() {
        // Si no hay empresa seleccionada, no hay guías que mostrar.
        if (this.idEmpresa <= 0) return []
  
        // 1) Filtrar por empresa seleccionada
        let filtrado = this.todasLasGuias.filter(
          (g) => g.IdEmpresa === this.idEmpresa
        )
  
        // Convertir strings de fecha a objetos Date para comparación.
        const fechaDesdeNormalized = this.normalizeDateToStartOfDay(this.fechaDesde);
        const fechaHastaNormalized = this.normalizeDateToStartOfDay(this.fechaHasta);
  
        // 2) Filtrar por rango de fechas (basado en `FechaOriginalDate` de la guía)
        if (fechaDesdeNormalized) {
          filtrado = filtrado.filter((g) => {
            const guiaDateNormalized = this.normalizeDateToStartOfDay(g.FechaOriginalDate);
            return guiaDateNormalized && guiaDateNormalized.getTime() >= fechaDesdeNormalized.getTime();
          });
        }
        if (fechaHastaNormalized) {
          filtrado = filtrado.filter((g) => {
            const guiaDateNormalized = this.normalizeDateToStartOfDay(g.FechaOriginalDate);
            return guiaDateNormalized && guiaDateNormalized.getTime() <= fechaHastaNormalized.getTime();
          });
        }
        
        // 3) Filtrar por texto de búsqueda para guías
        if (this.textoBusquedaGuias) {
          const searchText = this.textoBusquedaGuias.toLowerCase();
          filtrado = filtrado.filter(item => {
            return (
              item.Comprobante?.toLowerCase().includes(searchText) ||
              item.NombreCliente?.toLowerCase().includes(searchText) ||
              item.NombreDestino?.toLowerCase().includes(searchText) ||
              item.Remitos?.toLowerCase().includes(searchText) ||
              item.Estado?.toLowerCase().includes(searchText)
            );
          });
        }
  
        // 4) Aplicar paginación manual a los resultados filtrados.
        if (this.itemsPerPageGuias > 0) {
          const start = (this.pageGuias - 1) * this.itemsPerPageGuias
          return filtrado.slice(start, start + this.itemsPerPageGuias)
        } else {
          // Si la opción es "Todos" (value: -1), se devuelve toda la lista filtrada.
          return filtrado
        }
      },
  
      /**
       * `pageCountGuias`:
       * Calcula el número total de páginas para la paginación de guías,
       * basándose en la cantidad total de guías filtradas y los ítems por página.
       * @returns {number} Número total de páginas.
       */
      pageCountGuias() {
        if (this.itemsPerPageGuias > 0) {
          // Usa el largo de la lista ya filtrada por búsqueda para calcular las páginas
          const total = this.guiasFiltradasParaTabla.length; 
          return Math.ceil(total / this.itemsPerPageGuias)
        }
        return 1 // Si no hay ítems por página definidos, se asume 1 página.
      },
  
      /**
       * `paginationInfoGuias`:
       * Genera la cadena de texto para mostrar la información de paginación
       * en el pie de la tabla de guías (ej. "Mostrando 1-30 de 100").
       * @returns {string} Información de paginación.
       */
      paginationInfoGuias() {
        // Calcula el total de guías filtradas por empresa y fecha (sin filtro de búsqueda)
        const total = this.todasLasGuias.filter(
          (g) => g.IdEmpresa === this.idEmpresa
        ).length
        if (this.itemsPerPageGuias > 0) {
          const start = (this.pageGuias - 1) * this.itemsPerPageGuias + 1
          const end = Math.min(start + this.itemsPerPageGuias - 1, total)
          return `${start}-${end} de ${total}`
        } else {
          // Si se muestran todos los ítems, el rango es de 1 al total.
          return `1-${total} de ${total}`
        }
      },

      guiasEmpresaFiltradasParaTabla() {
        if (this.idEmpresa <= 0) return []

        let filtrado = this.todasLasGuiasEmpresa

        // Mostrar solo las guías entregadas
        filtrado = filtrado.filter(
          g => String(g.Estado).toUpperCase() === 'ENTREGADO'
        )

        const fechaDesdeNormalized = this.normalizeDateToStartOfDay(this.fechaDesde)
        const fechaHastaNormalized = this.normalizeDateToStartOfDay(this.fechaHasta)

        if (fechaDesdeNormalized) {
          filtrado = filtrado.filter(g => {
            const f = this.normalizeDateToStartOfDay(g.FechaOriginalDate)
            return f && f.getTime() >= fechaDesdeNormalized.getTime()
          })
        }
        if (fechaHastaNormalized) {
          filtrado = filtrado.filter(g => {
            const f = this.normalizeDateToStartOfDay(g.FechaOriginalDate)
            return f && f.getTime() <= fechaHastaNormalized.getTime()
          })
        }

        if (this.textoBusquedaGuiasEmpresa) {
          const searchText = this.textoBusquedaGuiasEmpresa.toLowerCase()
          filtrado = filtrado.filter(item => {
            return (
              item.Comprobante?.toLowerCase().includes(searchText) ||
              item.NombreDestino?.toLowerCase().includes(searchText) ||
              item.Remitos?.toLowerCase().includes(searchText) ||
              item.Estado?.toLowerCase().includes(searchText)
            )
          })
        }

        if (this.itemsPerPageGuiasEmpresa > 0) {
          const start = (this.pageGuiasEmpresa - 1) * this.itemsPerPageGuiasEmpresa
          return filtrado.slice(start, start + this.itemsPerPageGuiasEmpresa)
        }
        return filtrado
      },

      pageCountGuiasEmpresa() {
        if (this.itemsPerPageGuiasEmpresa > 0) {
          const total = this.guiasEmpresaFiltradasParaTabla.length
          return Math.ceil(total / this.itemsPerPageGuiasEmpresa)
        }
        return 1
      },

      paginationInfoGuiasEmpresa() {
        const total = this.todasLasGuiasEmpresa.length
        if (this.itemsPerPageGuiasEmpresa > 0) {
          const start = (this.pageGuiasEmpresa - 1) * this.itemsPerPageGuiasEmpresa + 1
          const end = Math.min(start + this.itemsPerPageGuiasEmpresa - 1, total)
          return `${start}-${end} de ${total}`
        }
        return `1-${total} de ${total}`
      },
  
      /**
       * `timelineStepsComputed`:
       * Propiedad computada que determina qué línea de tiempo se debe construir
       * y mostrar en el modal (si es una orden o una guía), basándose en `modalType`.
       * @returns {Array} Array de pasos de la línea de tiempo.
       */
      timelineStepsComputed() {
        // Si no hay datos en el modal, no hay línea de tiempo que mostrar.
        if (!this.modalData) return [];
        // Si el modal es de tipo 'orden', usa la función de timeline de órdenes.
        if (this.modalType === 'orden') {
          return construirTimelineOrden(this.modalData);
        }
        // Si el modal es de tipo 'guia', usa la función de timeline de guías.
        else if (this.modalType === 'guia') {
          return construirTimelineGuia(this.modalData);
        }
        return []; // Si no es ni orden ni guía, devuelve un array vacío.
      }
    },
    watch: {
      fechaDesde() {
        this.onFechaChange()
      },
      fechaHasta() {
        this.onFechaChange()
      },
    },
    methods: {
      /**
       * `normalizeDateToStartOfDay`:
       * Método auxiliar para tomar una cadena de fecha o un objeto Date y devolver
       * un nuevo objeto Date normalizado al inicio del día (00:00:00.000).
       * Esto es crucial para realizar comparaciones de fechas precisas sin problemas de zona horaria
       * o la mutación inesperada del objeto original.
       * @param {string|Date} dateInput - La fecha a normalizar.
       * @returns {Date|null} Un nuevo objeto Date normalizado o null si la entrada es inválida.
       */
      normalizeDateToStartOfDay(dateInput) {
        if (!dateInput) return null;
        const date = new Date(dateInput);
        // setHours modifica el objeto Date y devuelve el timestamp.
        // Para evitar el TypeError, simplemente modificamos el objeto y luego lo usamos.
        date.setHours(0, 0, 0, 0);
        return date; // Retorna el objeto Date modificado
      },

      onFechaChange() {
        if (!this.fechaDesde || !this.fechaHasta) return

        if (this.fechaHasta < this.fechaDesde) {
          this.mostrarError(
            'La fecha hasta debe ser mayor o igual a la fecha desde'
          )
          return
        }

        this.pageOrdenes = 1
        this.pageGuias = 1
        this.popularAmbasListas()
      },
  
  
      /**
       * `closeModal`:
       * Cierra el diálogo (modal) de detalle y reinicia sus datos.
       */
      closeModal() {
        console.log("closeModal: Cerrando modal.");
        this.showModal = false; // Oculta el modal.
        this.modalData = null; // Limpia los datos del modal.
        this.modalType = ''; // Restablece el tipo de modal.
        this.errorAlCargar = null; // Limpia cualquier mensaje de error en el modal.
      },
  
      openGuiaEmpresaModal(item) {
        this.guiaEmpresaModalData = item
        this.showGuiaEmpresaModal = true
      },

      closeGuiaEmpresaModal() {
        this.guiaEmpresaModalData = null
        this.showGuiaEmpresaModal = false
      },
      
      /**
       * `getStatusChipClassTextual`:
       * Devuelve las clases CSS de Vuetify para aplicar un color específico
       * a los `v-chip` de estado, tanto para órdenes como para guías.
       * @param {string} estado - El estado textual del elemento (orden o guía).
       * @returns {string} Clases CSS de Vuetify.
       */
      getStatusChipClassTextual(estado) {
        // Clases para estados de Órdenes.
        if (['Pendiente', 'Preparado', 'A distribución', 'Anulado', 'Retira Cliente'].includes(estado)) {
          switch (estado) {
            case 'Pendiente':
              return 'chip-pendiente'
            case 'Preparado':
              return 'chip-preparada'
            case 'A distribución':
            case 'Retira Cliente':
              return 'chip-despachada'
            case 'Anulado':
              return 'error lighten-2 white--text'
            default:
              return 'secondary lighten-2 white--text'
          }
        }
        // Clases para estados de Guías (basadas en `VistaDeTracking.vue`).
        else if (
          [
            'Pedido en preparación',
            'Pedido preparado',
            'En CD',
            'En Planchada',
            'Ruteado',
            'DESPACHADO',
            'En distribución',
            'Entregado',
            'No entregado',
            'Entrega parcial',
            'Pedido retirado',
            'ANULADO',
          ].includes(estado)
        ) {
          switch (estado) {
            case 'Entregado':
              return 'chip-entregado';
            case 'Pedido preparado':
            case 'Pedido en preparación':
            case 'En CD':
            case 'En Planchada':
            case 'Ruteado':
            case 'DESPACHADO':
            case 'En distribución':
            case 'Pedido retirado':
              return 'success lighten-2 white--text'; // Progreso positivo.
            case 'No entregado':
            case 'ANULADO':
              return 'error lighten-2 white--text'; // Error o anulado.
            case 'Entrega parcial':
              return 'warning lighten-2 white--text'; // Parcial.
            default:
              return 'secondary lighten-2 white--text'; // Por defecto.
          }
        }
        return 'secondary lighten-2 white--text'; // Por defecto si no coincide.
      },

      async descargarOrdenesExcel() {
        const workbook = new excel.Workbook()

        const statusColors = {
          Pendiente: 'FFC81E2B',
          Preparada: 'FFF8B421',
          Despachada: 'FF2D8BBA',
        }

        this.ordenesFiltradasParaTabla.forEach((orden) => {
          const numero = orden.Numero || orden.numero || orden.IdOrden
          const sheetName = String(numero).substring(0, 31)
          const sheet = workbook.addWorksheet(sheetName)

          sheet.getRow(1).values = ['N° Orden', numero]
          sheet.getRow(2).values = ['Empresa', orden.NombreEmpresa || '']
          sheet.getRow(3).values = [
            'Cliente',
            orden.NombreDestino || '',
          ]
          sheet.getRow(4).values = [
            'Fecha',
            orden.FechaRaw
              ? new Date(orden.FechaRaw).toLocaleString('es-AR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                }) : ''
          ]
          sheet.getRow(5).values = [
            'Estado',
            orden.NombreEstado || orden.Estado || '',
          ]

          const estadoCelda = sheet.getCell('B5')
          const color = statusColors[orden.NombreEstado || orden.Estado]
          if (color) {
            estadoCelda.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: color },
            }
          }

          sheet.getRow(7).values = [
            'Cantidad',
            'Producto',
            'Barcode',
            'Código Empresa',
            'Precio',
          ]

          if (Array.isArray(orden.productos)) {
            orden.productos.forEach((prod) => {
              sheet.addRow([
                prod.Unidades,
                prod.NombreProducto || '',
                prod.Barcode || '',
                prod.CodeEmpresa || '',
                prod.Precio != null
                  ? Number(prod.Precio).toFixed(2)
                  : '',
              ])
            })
          }

          sheet.eachRow((row, idx) => {
            row.eachCell((cell) => {
              cell.font = idx <= 7 ? { size: 14, bold: idx <= 5 } : { size: 14 }
            })
          })
          sheet.columns = [
            { width: 15 },
            { width: 30 },
            { width: 30 },
            { width: 25 },
            { width: 15 },
          ]
        })

        const buffer = await workbook.xlsx.writeBuffer()
        saveAs(
          new Blob([buffer]),
          `ordenes_${this.fechaDesde}_${this.fechaHasta}.xlsx`
        )
      },

      async descargarOrdenExcelIndividual(orden) {
        if (!orden) return

        const workbook = new excel.Workbook()

        const statusColors = {
          Pendiente: 'FFC81E2B',
          Preparada: 'FFF8B421',
          Despachada: 'FF2D8BBA',
        }

        const numero = orden.Numero || orden.numero || orden.IdOrden
        const sheetName = String(numero).substring(0, 31)
        const sheet = workbook.addWorksheet(sheetName)

        sheet.getRow(1).values = ['N° Orden', numero]
        sheet.getRow(2).values = ['Empresa', orden.NombreEmpresa || '']
        sheet.getRow(3).values = ['Cliente', orden.NombreDestino || '']
        sheet.getRow(4).values = [
          'Fecha',
          orden.FechaRaw ? new Date(orden.FechaRaw).toLocaleString('es-AR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }) : ''
        ]
        sheet.getRow(5).values = ['Estado', orden.NombreEstado || orden.Estado || '']

        const estadoCelda = sheet.getCell('B5')
        const color = statusColors[orden.NombreEstado || orden.Estado]
        if (color) {
          estadoCelda.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: color },
          }
        }

        sheet.getRow(7).values = [
          'Cantidad',
          'Producto',
          'Barcode',
          'Código Empresa',
          'Precio',
        ]

        if (Array.isArray(orden.productos)) {
          orden.productos.forEach((prod) => {
            sheet.addRow([
              prod.Unidades,
              prod.NombreProducto || '',
              prod.Barcode || '',
              prod.CodeEmpresa || '',
              prod.Precio != null ? Number(prod.Precio).toFixed(2) : '',
            ])
          })
        }

        sheet.eachRow((row, idx) => {
          row.eachCell((cell) => {
            cell.font = idx <= 7 ? { size: 14, bold: idx <= 5 } : { size: 14 }
          })
        })
        sheet.columns = [
          { width: 15 },
          { width: 30 },
          { width: 30 },
          { width: 25 },
          { width: 15 },
        ]

        const buffer = await workbook.xlsx.writeBuffer()
        saveAs(new Blob([buffer]), `orden_${numero}.xlsx`)
      },

      async descargarGuiaExcelIndividual(guia) {
        if (!guia) return

        const workbook = new excel.Workbook()

        const statusColors = {
          'Pedido en preparación': 'FFC81E2B',
          'Pedido preparado': 'FFF8B421',
          DESPACHADO: 'FF2D8BBA',
          'En distribución': 'FF2D8BBA',
          ENTREGADO: 'FF4CAF50',
          'ANULADO': 'FFF44336'
        }

        const numero = guia.Comprobante || guia.Id || guia.Numero || ''
        const sheetName = String(numero).substring(0, 31)
        const sheet = workbook.addWorksheet(sheetName)

        sheet.getRow(1).values = ['N° Guía', numero]
        sheet.getRow(2).values = ['Empresa', guia.NombreCliente || guia.Empresa?.RazonSocial || '']
        sheet.getRow(3).values = ['Destino', guia.NombreDestino || '']
        sheet.getRow(4).values = ['Remito', guia.Remitos || '']
        sheet.getRow(5).values = [
          'Fecha',
          guia.FechaOriginal ? new Date(guia.FechaOriginal).toLocaleString('es-AR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }) : ''
        ]
        sheet.getRow(6).values = ['Estado', guia.Estado || '']

        const estadoCelda = sheet.getCell('B6')
        const color = statusColors[guia.Estado]
        if (color) {
          estadoCelda.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: color }
          }
        }

        sheet.getRow(8).values = [
          'Cantidad',
          'Producto',
          'Barcode',
          'Código Empresa',
          'Precio'
        ]

        if (Array.isArray(guia.productos)) {
          guia.productos.forEach((prod) => {
            sheet.addRow([
              prod.Unidades,
              prod.NombreProducto || '',
              prod.Barcode || '',
              prod.CodeEmpresa || '',
              prod.Precio != null ? Number(prod.Precio).toFixed(2) : ''
            ])
          })
        }

        const historial =
          guia.historialEstados || guia.historial || guia.Historial || guia.Estados

        if (Array.isArray(historial) && historial.length) {
          const sheetHist = workbook.addWorksheet('Historial')
          sheetHist.columns = [{ width: 25 }, { width: 20 }]
          sheetHist.getRow(1).values = ['Estado', 'Fecha']
          historial.forEach((h) => {
            sheetHist.addRow([
              h.estado || h.Estado || h.nombre || h.Nombre || '',
              h.fecha
                ? new Date(h.fecha).toLocaleString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  })
                : h.Fecha
                ? new Date(h.Fecha).toLocaleString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  })
                : ''
            ])
          })
          sheetHist.eachRow((row, idx) => {
            row.eachCell((cell) => {
              cell.font = idx === 1 ? { size: 14, bold: true } : { size: 14 }
            })
          })
        }

        sheet.eachRow((row, idx) => {
          row.eachCell((cell) => {
            cell.font = idx <= 8 ? { size: 14, bold: idx <= 6 } : { size: 14 }
          })
        })
        sheet.columns = [
          { width: 15 },
          { width: 30 },
          { width: 30 },
          { width: 25 },
          { width: 15 }
        ]

        const buffer = await workbook.xlsx.writeBuffer()
        saveAs(new Blob([buffer]), `guia_${numero}.xlsx`)
      },

      async descargarGuiaEmpresaPDF(payload) {
        if (!payload || !payload.guia) return
        const { guia, foto } = payload
        const pdf = new jsPDF('p', 'mm', 'A4')
        pdf.setFont('DM Sans')
        let y = 20
        pdf.text(`Conforme de entrega: ${guia.Comprobante}`, 20, y)
        y += 10
        pdf.text(`Destino: ${guia.NombreDestino || ''}`, 20, y)
        y += 10
        pdf.text(`Bultos: ${guia.Bultos}`, 20, y)
        y += 10
        pdf.text(`Remitos: ${guia.Remitos || ''}`, 20, y)
        y += 10
        pdf.text(`Fecha Entrega: ${guia.FechaEntrega || ''}`, 20, y)
        y += 10
        pdf.text(`Fecha Creación: ${guia.FechaOriginal || ''}`, 20, y)
        y += 10
        pdf.text(`Estado: ${guia.Estado || ''}`, 20, y)

        if (foto) {
          try {
            const imgData = await this.getImageBase64(foto)
            pdf.addImage(imgData, 'JPEG', 20, y + 10, 170, 90)
          } catch (e) {
            console.error('Error agregando imagen', e)
          }
        }

        pdf.save(`conforme_${guia.Comprobante}.pdf`)
      },

      async getImageBase64(url) {
        const res = await fetch(url)
        const blob = await res.blob()
        return await new Promise(resolve => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.readAsDataURL(blob)
        })
      },
  
      /**
       * `getHoy`:
       * Método auxiliar que retorna la fecha actual formateada como 'YYYY-MM-DD'.
       * Es útil para APIs que esperan este formato de fecha.
       * @returns {string} Fecha actual formateada.
       */
      getHoy() {
        const hoy = new Date();
        const y = hoy.getFullYear();
        const m = String(hoy.getMonth() + 1).padStart(2, '0'); // Mes con dos dígitos.
        const d = String(hoy.getDate()).padStart(2, '0'); // Día con dos dígitos.
        return `${y}-${m}-${d}`;
      },

      mostrarError(mensaje) {
        store.dispatch('snackbar/mostrar', mensaje)
      },
    },
  
    /**
     * `created()`:
     * Gancho del ciclo de vida de Vue que se ejecuta una vez que la instancia
     * del componente ha sido creada. Se utiliza para la inicialización inicial.
     */
    async created() {
      console.log("created: Componente SeguimientosOrdenesGuias inicializado.");
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7); // Retrocede 7 días para obtener la fecha de inicio de la última semana.
  
      // Inicializa `fechaDesde` a la fecha de hace 7 días (última semana).
      this.fechaDesde = sevenDaysAgo.toISOString().split('T')[0];
      // Inicializa `fechaHasta` a la fecha de hoy.
      this.fechaHasta = today.toISOString().split('T')[0];
      console.log(`created: Fechas por defecto configuradas: Desde ${this.fechaDesde} hasta ${this.fechaHasta}`);
  
      // Carga la lista de empresas disponibles.
      await this.fetchEmpresas();
  
      // Si el usuario actual tiene una empresa asignada en el store Vuex,
      // se selecciona automáticamente esa empresa y se cargan los datos.
      const empresaUsuario = store.state.usuarios.usuarioActual.IdEmpresa;
      if (empresaUsuario && empresaUsuario > 0) {
        this.idEmpresa = empresaUsuario;
        console.log("created: Usuario con empresa asignada, cargando datos para ID:", this.idEmpresa);
        // Llama a `eligioEmpresa` para iniciar la carga de datos con la empresa preseleccionada.
        await this.eligioEmpresa(empresaUsuario);
      } else {
        console.log("created: No hay empresa asignada al usuario o el ID es inválido.");
      }
    },
  }
  </script>
  
  <style scoped>
  /* Estilos para la línea de tiempo */
  .timeline-step {
    position: relative;
    display: flex;
    align-items: flex-start;
    margin-bottom: 16px;
    min-height: 40px;
  }
  
  .timeline-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 16px;
    flex-shrink: 0;
    background-color: var(--estado-neutral-bg); /* Color por defecto para estados pendientes */
    color: var(--estado-neutral-tx);
  }
  
  .timeline-icon {
    font-size: 18px;
  }
  
  .timeline-content {
    flex-grow: 1;
    padding-bottom: 16px;
  }
  
  .timeline-line {
    position: absolute;
    left: 16px;
    top: 32px;
    bottom: 0;
    width: 2px;
    background-color: var(--estado-neutral-bg);
  }
  
  /* Estados */
  .completed .timeline-icon-container {
    background-color: var(--estado-entregado); /* Verde para completado */
    color: white;
  }
  
  .current .timeline-icon-container {
    background-color: #2196f3; /* Azul para estado actual */
    color: white;
    animation: pulse 2s infinite;
  }
  
  .current-bad .timeline-icon-container {
    background-color: #f44336; /* Rojo para estado actual de error */
    color: white;
    animation: pulse 2s infinite;
  }
  
  .completed + .timeline-step:not(.completed) .timeline-line {
    background: linear-gradient(to bottom, var(--estado-entregado), var(--estado-neutral-bg));
  }
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.4);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(33, 150, 243, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(33, 150, 243, 0);
    }
  }
  
  /* Estilos para la tabla de productos */
  .product-table {
    border: 1px solid var(--estado-neutral-bg);
    border-radius: 4px;
    overflow: hidden;
  }
  
  .product-table th {
    background-color: var(--login-bg);
    font-weight: 600;
    font-size: 0.875rem;
  }
  
  .product-table tr:not(:last-child) {
    border-bottom: 1px solid var(--estado-neutral-bg);
  }
  
  .product-table tr:hover {
    background-color: var(--surface);
  }
  
  /* ============================ */
  /* Estilos generales          */
  /* ============================ */
  
  /*
    `.blue-header`:
    Estilo aplicado a la fila de encabezados de la `v-data-table`
    para darle un fondo azul suave y texto azul oscuro.
  */
  .blue-header th {
    background-color: var(--v-primary-base);
    color: #fff;
    font-weight: 600;
  }
  
  /* ============================ */
  /* Estilos para el Timeline   */
  /* Estos estilos recrean la apariencia de una línea de tiempo vertical
     con iconos circulares y una línea que conecta los pasos. */
  /* ============================ */
  
  /* Contenedor de cada paso individual en la línea de tiempo */
  .timeline-step {
    display: flex; /* Utiliza flexbox para alinear el icono y el contenido */
    align-items: flex-start; /* Alinea los ítems al inicio del contenedor flex */
    position: relative; /* Necesario para posicionar la línea vertical */
    padding-bottom: 1.5rem; /* Espacio entre los pasos */
  }
  /* Elimina el padding inferior del último paso para evitar espacio extra */
  .timeline-step:last-child {
    padding-bottom: 0;
  }
  
  /* Contenedor del ícono circular para cada paso */
  .timeline-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px; /* Ancho del círculo */
    height: 36px; /* Alto del círculo */
    border-radius: 50%; /* Hace el contenedor circular */
    flex-shrink: 0; /* Evita que el contenedor del icono se encoja */
    margin-right: 1rem; /* Espacio a la derecha del icono antes del contenido */
    z-index: 1; /* Asegura que el icono esté por encima de la línea */
  }
  
  /* Estilo del ícono dentro del contenedor circular */
  .timeline-icon {
    font-size: 1.25rem; /* Tamaño del icono */
  }
  
  /* Línea vertical que conecta los pasos de la línea de tiempo */
  .timeline-step:not(:last-child)::before {
    content: ''; /* Contenido vacío para el pseudo-elemento */
    position: absolute; /* Posiciona la línea de forma absoluta */
    left: 17px; /* Ajusta la posición horizontal para que esté centrada con el icono */
    top: 36px; /* Inicia la línea debajo del icono */
    bottom: 0; /* Extiende la línea hasta la parte inferior del paso */
    width: 2px; /* Grosor de la línea */
    background-color: rgba(0, 0, 0, 0.12); /* Color gris claro de la línea */
  }
  
  /* Contenido textual de cada paso (nombre, fecha, descripción) */
  .timeline-content {
    flex: 1; /* Permite que el contenido ocupe el espacio restante */
    padding-top: 0.5rem; /* Alinea el contenido con el centro vertical del icono */
  }
  
  /* Estados del paso: colores de fondo del círculo del icono y de la línea */
  /* Estado `completed`: indica un paso que ya fue finalizado exitosamente. */
  .timeline-step.completed .timeline-icon-container {
    background-color: #e8f5e9; /* Vuetify green lighten-5 */
    color: #388e3c;            /* Vuetify green darken-2 */
  }
  .timeline-step.completed::before {
    background-color: #388e3c; /* La línea también se vuelve verde */
  }
  
  /* Estado `current`: indica el paso actual en el progreso. */
  .timeline-step.current .timeline-icon-container {
    background-color: #e3f2fd; /* Vuetify blue lighten-5 */
    color: #1976d2;            /* Vuetify blue darken-2 */
  }
  
  /* Estado `current-bad`: indica el paso actual que es un estado negativo (ej. anulado, no entregado). */
  .timeline-step.current-bad .timeline-icon-container {
    background-color: #ffebee; /* Vuetify red lighten-5 */
    color: #d32f2f;            /* Vuetify red darken-2 */
  }
  
  /* Estado `pending`: indica un paso que aún no ha sido alcanzado. */
  .timeline-step.pending .timeline-icon-container {
    background-color: var(--login-bg); /* Vuetify grey lighten-4 */
    color: #757575;            /* Vuetify grey darken-1 */
  }

  /* Colores por tipo de estado */
  .timeline-step.pendiente .timeline-icon-container,
  .timeline-line.pendiente {
    background-color: var(--estado-pendiente);
    color: #fff;
  }
  .timeline-step.pendiente::before {
    background-color: var(--estado-pendiente);
  }

  .timeline-step.preparada .timeline-icon-container,
  .timeline-line.preparada {
    background-color: var(--estado-preparada);
    color: #fff;
  }
  .timeline-step.preparada::before {
    background-color: var(--estado-preparada);
  }

  .timeline-step.despachada .timeline-icon-container,
  .timeline-line.despachada {
    background-color: var(--estado-despachada);
    color: #fff;
  }
  .timeline-step.despachada::before {
    background-color: var(--estado-despachada);
  }

  .timeline-step.entregado .timeline-icon-container,
  .timeline-line.entregado {
    background-color: var(--estado-entregado);
    color: #fff;
  }
  .timeline-step.entregado::before {
    background-color: var(--estado-entregado);
  }

  /* === Chip color classes (comparten valores con el timeline) === */
  .chip-pendiente {
    background-color: var(--estado-pendiente);
    color: #fff;
  }

  .chip-preparada {
    background-color: var(--estado-preparada);
    color: #fff;
  }

  .chip-despachada {
    background-color: var(--estado-despachada);
    color: #fff;
  }

  .chip-entregado {
    background-color: var(--estado-entregado);
    color: #fff;
  }
  </style>
