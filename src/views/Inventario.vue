<template>
  <v-container fluid class="pa-4 grey lighten-4">
    <!-- ========================================= -->
    <!-- 1. Resumen gráfico de posiciones procesadas -->
    <!-- ========================================= -->
    <v-row class="mb-6" align="stretch" justify="space-between">
      <!-- Card: Total de posiciones procesadas -->
      <v-col cols="12" sm="4">
        <v-card class="pa-4 elevation-4 rounded-lg" outlined tile>
          <v-row no-gutters align="center">
            <v-col cols="3" class="text-center">
              <v-icon x-large color="primary">mdi-format-list-bulleted-type</v-icon>
            </v-col>
            <v-col cols="9">
              <h4 class="mb-1 font-weight-medium">Total de posiciones</h4>
              <h2 class="display-1 blue--text text--darken-2">{{ totalPosiciones }}</h2>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- Card: Gráfico de torta OK vs Errores -->
      <v-col cols="12" sm="4">
        <v-card class="pa-4 elevation-4 rounded-lg" outlined tile>
          <v-row no-gutters>
            <v-col cols="12" class="text-center">
              <h4 class="font-weight-medium mb-2">Posiciones OK vs Errores</h4>
            </v-col>
            <v-col cols="12" class="chart-wrapper">
              <doughnut-chart :chart-data="doughnutData" :chart-options="chartOptions" />
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- Card: Gráfico de barras Distribución de estados -->
      <v-col cols="12" sm="4">
        <v-card class="pa-4 elevation-4 rounded-lg" outlined tile>
          <v-row no-gutters>
            <v-col cols="12" class="text-center">
              <h4 class="font-weight-medium mb-2">Distribución de estados</h4>
            </v-col>
            <v-col cols="12" class="chart-wrapper">
              <bar-chart :chart-data="barData" :chart-options="chartOptions" />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- ========================================= -->
    <!-- 2. Selector de empresa y carga de Excel  -->
    <!-- ========================================= -->
    <v-row class="mb-4" align="center">
      <!-- Selector de empresa -->
      <v-col cols="12" sm="6">
        <SelectorEmpresa @eligioEmpresa="eligioEmpresa" />
      </v-col>
      <!-- Botón para importar Excel -->
      <v-col cols="12" sm="4" v-if="idEmpresa">
        <v-file-input
          label="Importar planilla Excel"
          accept=".xlsx"
          filled
          prepend-icon="mdi-file-excel"
          outlined
          dense
          @change="fileOnChange"
        />
      </v-col>
      <!-- Botón para descargar plantilla de ejemplo -->
      <v-col cols="12" sm="2" v-if="idEmpresa" class="d-flex align-center">
        <v-btn outlined color="primary" @click="downloadTemplate">
          <v-icon left>mdi-file-download</v-icon>
          Ejemplo
        </v-btn>
      </v-col>
    </v-row>

    <!-- ========================================= -->
    <!-- 3. Mensajes de estado y validaciones     -->
    <!-- ========================================= -->
    <v-row v-for="(msg, i) in mensajes" :key="i" class="mb-2">
      <v-col>
        <v-alert :type="msg.color ? msg.color : 'success'" dense outlined>
          {{ msg.texto }}
        </v-alert>
      </v-col>
    </v-row>

    <!-- ========================================= -->
    <!-- 4. Buscador y título de detalle          -->
    <!-- ========================================= -->
    <v-row v-if="posicionesRevisadas.length" class="mb-2" align="center">
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="textoBusqueda"
          label="Buscar posición"
          append-icon="mdi-magnify"
          dense
          outlined
        />
      </v-col>
      <v-col cols="12" sm="6" v-if="posicionDetallada.length">
        <h5 class="font-weight-medium">
          Detalle de: <span class="blue--text">{{ posicionSeleccionada }}</span>
        </h5>
      </v-col>
    </v-row>

    <!-- ========================================= -->
    <!-- 5. Tablas de posiciones y detalle        -->
    <!-- ========================================= -->
    <v-row>
      <!-- Tabla principal de posiciones -->
      <v-col cols="12" lg="6" v-if="posicionesRevisadas.length">
        <v-data-table
          :headers="cabecerasPosiciones"
          :items="posicionesRevisadas"
          :search="textoBusqueda"
          dense
          outlined
          class="elevation-1"
          :items-per-page="10"
        >
          <!-- Columna Estado con chip -->
          <template v-slot:item.Estado="{ item }">
            <v-chip
              :color="getColorEstado(item.Estado)"
              dark
              small
              class="ma-0"
            >
              <v-icon left small>{{ getIconoEstado(item.Estado) }}</v-icon>
              {{ item.Estado }}
            </v-chip>
          </template>
          <!-- Columna Acciones para ver detalle -->
          <template v-slot:item.Acciones="{ item }">
            <v-btn icon @click="verEstado(item)">
              <v-icon color="primary">mdi-arrow-right-bold</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>

      <!-- Tabla de detalle de la posición seleccionada -->
      <v-col cols="12" lg="6" v-if="posicionDetallada.length">
        <v-data-table
          :headers="cabecerasDetalle"
          :items="posicionDetallada"
          dense
          outlined
          class="elevation-1"
          :items-per-page="10"
        >
          <!-- Chip Estado en detalle con acción -->
          <template v-slot:item.Estado="{ item }">
            <v-chip
              :color="getColorEstadoDetalle(item)"
              dark
              small
              clickable
              @click="clickEnReparacion(item)"
            >
              <v-icon left small>{{ getIconoEstadoDetalle(item) }}</v-icon>
              {{ item.Inventariado === item.Unidades ? 'OK' : 'Corregir' }}
            </v-chip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// Importaciones de librerías y módulos
import * as XLSX from 'xlsx'             // Para generar la plantilla Excel de ejemplo
import { Doughnut, Bar } from 'vue-chartjs'  // Gráficos de torta y barra
import SelectorEmpresa from '../components/SelectorEmpresa.vue'
import store from '../store'
import posiciones from '../store/posiciones'
import fechas from 'vue-lsi-util/fechas'
import productos from '../store/productosV3'

export default {
  name: 'InventarioMejorado',
  components: {
    SelectorEmpresa,
    // Componente wrapper para Doughnut
    DoughnutChart: {
      extends: Doughnut,
      props: ['chartData', 'chartOptions'],
      mounted() { this.renderChart(this.chartData, this.chartOptions) }
    },
    // Componente wrapper para Bar
    BarChart: {
      extends: Bar,
      props: ['chartData', 'chartOptions'],
      mounted() { this.renderChart(this.chartData, this.chartOptions) }
    }
  },
  data() {
    return {
      idEmpresa: null,               // ID de la empresa seleccionada
      mensajes: [],                  // Mensajes de estado y validaciones
      posicionesARevisar: [],        // Posiciones extraídas de la planilla
      posicionesRevisadas: [],       // Posiciones con estado OK o Errores
      posicionDetallada: [],         // Detalle de productos para la posición seleccionada
      posicionSeleccionada: '',      // Nombre de la posición actualmente desplegada
      textoBusqueda: '',             // Término para filtrar tabla de posiciones

      // Definición de columnas para la tabla de posiciones
      cabecerasPosiciones: [
        { text: 'Posición', value: 'Nombre', align: 'start' },
        { text: 'Fec.Inv.', value: 'FechaInventario', align: 'start' },
        { text: 'Estado', value: 'Estado' },
        { text: 'Acciones', value: 'Acciones', sortable: false }
      ],
      // Definición de columnas para la tabla de detalle
      cabecerasDetalle: [
        { text: 'Id', value: 'IdProducto' },
        { text: 'Barcode', value: 'BarcodeProducto' },
        { text: 'Sistema', value: 'Unidades' },
        { text: 'Inventario', value: 'Inventariado' },
        { text: 'Estado', value: 'Estado' }
      ],
      // Datos para los gráficos
      doughnutData: null,
      barData: null,
      chartOptions: { responsive: true, maintainAspectRatio: false }
    }
  },
  computed: {
    // Computa el total de posiciones procesadas para mostrar en la card
    totalPosiciones() {
      return this.posicionesRevisadas.length
    }
  },
  watch: {
    // Cada vez que cambian las posiciones, actualizamos los gráficos
    posicionesRevisadas: 'actualizarGraficos'
  },
  methods: {
    /**
     * Genera y descarga dinámicamente un Excel de plantilla con
     * las cabeceras esperadas: Posicion, Barcode Producto y Cantidad.
     */
    downloadTemplate() {
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.aoa_to_sheet([
        ['Posicion', 'Barcode Producto', 'Cantidad']
      ])
      XLSX.utils.book_append_sheet(wb, ws, 'Inventario')
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([wbout], { type: 'application/octet-stream' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'inventario_template.xlsx'
      link.click()
      URL.revokeObjectURL(url)
    },

    /**
     * Reconstruye los datasets para los gráficos de torta y barras
     * con los conteos de posiciones OK y con Errores.
     */
    actualizarGraficos() {
      const ok = this.posicionesRevisadas.filter(p => p.Estado === 'OK').length
      const err = this.posicionesRevisadas.length - ok
      this.doughnutData = {
        labels: ['OK', 'Errores'],
        datasets: [{ data: [ok, err], backgroundColor: ['#4CAF50', '#F44336'] }]
      }
      this.barData = {
        labels: ['OK', 'Errores'],
        datasets: [{ label: 'Posiciones', data: [ok, err], backgroundColor: ['#4CAF50', '#F44336'] }]
      }
    },

    /**
     * Guarda el ID de la empresa seleccionada
     */
    eligioEmpresa(id) {
      this.idEmpresa = id
    },

    /**
     * Lee el Excel cuando el usuario lo selecciona,
     * lo parsea y pasa a validar sus columnas.
     */
    fileOnChange(file) {
      if (!file) {
        // Si el usuario cancela la selección, limpia todo
        this.mensajes = []
        this.posicionesARevisar = []
        this.posicionesRevisadas = []
        this.posicionDetallada = []
        return
      }
      this.mensajes.push({ texto: 'Leyendo archivo ...' })
      const reader = new FileReader()
      reader.onload = ev => {
        const data = ev.target.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])
        this.verificarColumnasExcel(rows)
      }
      reader.readAsBinaryString(file)
    },

    /**
     * Verifica que cada fila tenga las columnas: Posicion y Barcode Producto.
     * Si falta alguna, detiene el proceso y muestra errores.
     */
    verificarColumnasExcel(rows) {
      const colsReq = ['Posicion', 'Barcode Producto', 'Cantidad']
      this.mensajes = [{ texto: 'Verificando columnas ...' }]
      const faltan = []
      rows.forEach((r, i) => {
        colsReq.forEach(col => {
          if (!Object.prototype.hasOwnProperty.call(r, col)) {
            faltan.push(`Fila ${i + 2}: falta columna '${col}'`)
          }
        })
      })
      if (faltan.length) {
        this.mensajes = [{ texto: 'Columnas faltantes:', color: 'error' },
                         ...faltan.map(t => ({ texto: t, color: 'warning' }))]
      } else {
        this.mensajes = [{ texto: 'Columnas correctas', color: 'success' }]
        // Normaliza a mayúsculas y procesa planilla
        rows.forEach(r => { r['Barcode Producto'] = r['Barcode Producto'].toString().toUpperCase() })
        this.procesarPlanilla(rows)
      }
    },

    /**
     * Extrae posiciones únicas de la planilla y arranca el procesamiento completo.
     */
    procesarPlanilla(planilla) {
      this.mensajes.push({ texto: 'Procesando planilla ...' })
      this.posicionesARevisar = [...new Set(planilla.map(r => r.Posicion.trim()))]
        .map(nombre => ({ Nombre: nombre }))
      this.procesarTodasLasPosiciones(planilla)
    },

    /**
     * Consulta al backend las posiciones y su stock,
     * calcula discrepancias e inicializa posicionesRevisadas.
     */
    async procesarTodasLasPosiciones(planilla) {
      // 1. Obtiene contenido real de todas las posiciones
      const nombres = this.posicionesARevisar.map(p => p.Nombre).join(',')
      const datos = await posiciones.getContenidoVariasPosiciones(nombres)
      // 2. Anida contenido y cuenta inventariado
      this.posicionesARevisar.forEach(p => {
        const record = datos.find(d => d.Posicion.Nombre === p.Nombre)
        if (!record) return // posición inexistente en backend
        p.Id = record.Posicion.Id
        p.FechaInventario = record.Posicion.FechaInventario
        p.Contenido = record.Contenido.map(c => ({
          ...c,
          Inventariado: 0
        }))
        // Suma las cantidades inventariadas del Excel
        planilla.filter(r => r.Posicion.trim() === p.Nombre)
          .forEach(r => {
            const prod = p.Contenido.find(c => c.BarcodeProducto === r['Barcode Producto'])
            if (prod) prod.Inventariado += (r.Cantidad || 1)
            else p.Contenido.push({
              IdProducto: -1,
              BarcodeProducto: r['Barcode Producto'],
              Unidades: 0,
              Inventariado: r.Cantidad || 1
            })
          })
      })
      // 3. Construye posicionesRevisadas con estado OK o Errores
      this.posicionesRevisadas = this.posicionesARevisar
        .filter(p => p.Id > 0)
        .map(p => ({
          Id: p.Id,
          Nombre: p.Nombre,
          Estado: p.Contenido.every(c => c.Inventariado === c.Unidades) ? 'OK' : 'Errores',
          FechaInventario: p.FechaInventario,
          UsuarioInventario: p.UsuarioInventario
        }))
      this.mensajes = []
    },

    /**
     * Maneja clic en posición: si OK, registra fecha;
     * si Errores, muestra detalle de productos.
     */
    async verEstado(item) {
      if (item.Estado === 'OK') {
        // Confirma antes de actualizar fecha en backend
        const ok = confirm(`Registrar inventario para '${item.Nombre}'?`)
        if (!ok) return
        await this.registrarFechaInventarioEnPosicion(item)
      } else {
        // Despliega tabla de detalle
        const pos = this.posicionesARevisar.find(p => p.Id === item.Id)
        this.posicionDetallada = pos.Contenido
        this.posicionSeleccionada = pos.Nombre
      }
    },

    /**
     * Llama al store para actualizar la FechaInventario en backend.
     */
    async registrarFechaInventarioEnPosicion(item) {
      try {
        await posiciones.modificar(item.Id, {
          UsuarioInventario: store.state.usuarios.usuarioActual.Nombre,
          FechaInventario: fechas.getHoy()
        })
        item.FechaInventario = fechas.getHoy()
        alert('Fecha de inventario registrada exitosamente')
      } catch (e) {
        alert('Error al registrar fecha: ' + e)
      }
    },

    /**
     * Corrige discrepancias de un producto:
     * - Si Unidades > Inventariado → desposicionar
     * - Si Inventariado > Unidades → posicionar si hay stock sin ubicar
     */
    async clickEnReparacion(item) {
      if (item.Unidades === item.Inventariado) {
        alert('Sin discrepancias para corregir')
        return
      }
      // Desposicionar exceso
      if (item.Unidades > item.Inventariado) {
        const diff = item.Unidades - item.Inventariado
        if (!confirm(`Confirmar desposicionamiento de ${diff} unidades?`)) return
        this.registrarDesposicionamiento(item)
      } else {
        // Posicionar faltante si hay stock libre
        const diff = item.Inventariado - item.Unidades
        try {
          const prod = await productos.getByBarcodeAndEmpresa(item.BarcodeProducto, this.idEmpresa)
          if (prod.StockSinPosicionar < diff) {
            alert(`Stock insuficiente: solo ${prod.StockSinPosicionar} disponibles`) 
            return
          }
          if (confirm(`Confirmar posicionamiento de ${diff} unidades?`)) {
            this.registrarPosicionamiento(prod.Id, this.idPosicionSeleccionada, diff, item)
          }
        } catch (e) {
          alert('Error al obtener producto: ' + e)
        }
      }
    },

    /**
     * Llama al store para eliminar stock posicionado
     */
    async registrarDesposicionamiento(item) {
      try {
        await productos.registrarDesposicionamiento(
          item.IdProducto,
          this.idPosicionSeleccionada,
          item.Unidades - item.Inventariado
        )
        item.Unidades = item.Inventariado
        this.actualizarEstadoPosicionRevisada()
      } catch (e) {
        alert('Error al desposicionar: ' + e)
      }
    },

    /**
     * Llama al store para posicionar stock
     */
    async registrarPosicionamiento(idProd, idPos, qty, item) {
      try {
        await productos.registrarPosicionamiento(idProd, idPos, qty)
        item.Unidades = item.Inventariado
        this.actualizarEstadoPosicionRevisada()
      } catch (e) {
        alert('Error al posicionar: ' + e)
      }
    },

    /**
     * Si ya no quedan discrepancias en detalle, marca posición OK
     */
    actualizarEstadoPosicionRevisada() {
      const errores = this.posicionDetallada.some(c => c.Inventariado !== c.Unidades)
      if (!errores) {
        const idx = this.posicionesRevisadas.findIndex(p => p.Nombre === this.posicionSeleccionada)
        if (idx >= 0) this.posicionesRevisadas[idx].Estado = 'OK'
      }
    },

    // Iconos y colores según estado
    getIconoEstado(item) { return item === 'OK' ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline' },
    getColorEstado(item) { return item === 'OK' ? 'green' : 'red' },
    getIconoEstadoDetalle(item) { return item.Unidades === item.Inventariado ? 'mdi-check-circle-outline' : 'mdi-tools' },
    getColorEstadoDetalle(item) { return item.Unidades === item.Inventariado ? 'green' : 'red' }
  },
  created() {
    // Título de la pantalla y carga de empresas con stock posicionado
    store.dispatch('actualizarTituloPrincipal', 'Inventario')
    store.dispatch('empresas/cargarListaEmpresas', 'SoloStockPosicionado')
  }
}
</script>

<style scoped>
/* Ajustes de estilo adicionales */
.chart-wrapper { height: 220px; }
.v-card { background: #ffffff; }
</style>