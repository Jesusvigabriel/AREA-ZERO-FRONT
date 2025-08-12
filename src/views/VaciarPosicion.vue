<template>
  <v-container fluid>
    <!-- SELECTOR DE EMPRESA: Aparece solo si no hay empresa elegida -->
    <v-row v-if="idEmpresa <= 0" justify="center" class="mb-8 mt-2">
      <v-col cols="12" md="6" lg="4">
<SelectorEmpresa
  @eligioEmpresa="eligioEmpresa"
  :idEmpresaInicialmenteSeleccionada="idEmpresa"
/>
      </v-col>
    </v-row>

    <!-- DASHBOARD, ACCIONES y TABLA SOLO SI YA HAY EMPRESA ELEGIDA -->
    <div v-if="idEmpresa > 0">
      <!-- DASHBOARD: Cards y gráfico de torta con resumen visual de las posiciones -->
      <v-row class="mb-6 mt-2 resumen-row" align="center" justify="center" no-gutters>
        <v-col cols="12" md="6" lg="5" class="d-flex justify-center align-center chart-col" style="min-height: 230px;">
          <div class="chart-wrap">
            <!-- Lienzo para el gráfico Pie de Chart.js -->
            <canvas ref="pieChart" width="230" height="230"></canvas>
          </div>
        </v-col>
        <v-col cols="12" md="6" lg="7" class="d-flex align-center justify-center resumen-tarjetas">
          <div class="resumen-cards-row">
            <!-- Tarjeta: Total de posiciones -->
            <v-card class="tarjeta-resumen azul">
              <div class="titulo">Totales</div>
              <div class="cantidad">{{ resumen.total }}</div>
            </v-card>
            <!-- Tarjeta: En uso -->
            <v-card class="tarjeta-resumen verde">
              <div class="titulo">En uso</div>
              <div class="cantidad">{{ resumen.enUso }}</div>
            </v-card>
            <!-- Tarjeta: Vacías -->
            <v-card class="tarjeta-resumen rojo">
              <div class="titulo">Vacías</div>
              <div class="cantidad">{{ resumen.vacias }}</div>
            </v-card>
          </div>
        </v-col>
      </v-row>

      <!-- FILTRO DE POSICIONES Y ACCIONES PRINCIPALES -->
      <v-row class="mb-2">
        <v-col cols="12" md="4">
          <v-text-field
            v-model="filtro"
            label="Buscar posición..."
            append-icon="mdi-magnify"
            dense
          />
        </v-col>
        <v-col cols="12" md="8" class="d-flex align-end justify-end flex-wrap">
          <!-- Seleccionar todas las posiciones visibles -->
          <v-btn class="boton-normalizado" @click="seleccionarTodas" small outlined :disabled="productosSeleccionadosGlobal.length > 0">
            Seleccionar todas
          </v-btn>
          <!-- Exportar a Excel -->
          <v-btn class="boton-normalizado mx-2" color="success" @click="exportarExcel" large>
            EXPORTAR A EXCEL <v-icon right>mdi-microsoft-excel</v-icon>
          </v-btn>
          <!-- Vaciar todas las posiciones seleccionadas -->
          <v-btn
            class="boton-normalizado ml-2"
            color="red"
            :disabled="seleccionadas.length === 0 || productosSeleccionadosGlobal.length > 0"
            @click="vaciarSeleccionadas"
          >
            Vaciar posiciones
          </v-btn>
        </v-col>
      </v-row>

      <!-- TABLA DE POSICIONES CON SELECCIÓN MULTIPLE -->
      <v-data-table
        :headers="headers"
        :items="posicionesFiltradas"
        :item-key="'Id'"
        show-select
        v-model="seleccionadas"
        dense
        class="elevation-2"
        style="border-radius:14px"
        :disabled="productosSeleccionadosGlobal.length > 0"
      >
        <!-- Estado visual (verde si en uso, rojo si vacía) -->
        <template v-slot:item.estado="{ item }">
          <v-chip small :color="item.EnUso ? 'green' : 'red'" dark>
            {{ item.EnUso ? 'En uso' : 'Vacía' }}
          </v-chip>
        </template>
        <!-- Nombre de posición, clickeable para abrir el detalle de productos -->
        <template v-slot:item.Nombre="{ item }">
          <span
            style="cursor:pointer; text-decoration:underline"
            @click="mostrarDetalle(item)"
          >
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">{{ item.Nombre }}</span>
              </template>
              <span>
                {{ item.EnUso
                  ? 'Click para ver productos de la posición'
                  : 'Posición vacía'
                }}
              </span>
            </v-tooltip>
          </span>
        </template>
        <!-- Cantidad de artículos distintos -->
        <template v-slot:item.CantArticulos="{ item }">
          {{ item.CantArticulos }}
        </template>
        <!-- Cantidad total de unidades -->
        <template v-slot:item.CantUnidades="{ item }">
          {{ item.CantUnidades }}
        </template>
      </v-data-table>

      <!-- PANEL DE PRODUCTOS A DESPOSICIONAR -->
      <v-row v-if="productosSeleccionadosGlobal.length > 0" class="mb-5">
        <v-col cols="12" md="10" class="mx-auto">
          <v-card outlined class="pa-6 my-6" style="font-size: 1.1rem;">
            <div class="font-weight-bold mb-4" style="font-size:1.3rem;">Productos seleccionados para desposicionar:</div>
            <v-list dense>
              <v-list-item
                v-for="(prod, idx) in productosSeleccionadosGlobal"
                :key="prod._seleccionKey"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    <span class="font-weight-bold">{{ buscarNombrePosicion(prod._posicionId) }}:</span>
                    <span style="font-size:1.1rem">
                      {{ prod.NombreProducto || prod.Producto?.Nombre || '-' }}
                      (Barcode: {{ prod.BarcodeProducto || prod.Producto?.Barcode || '-' }},
                      Unidades: {{ prod.Unidades || 0 }})
                    </span>
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <!-- Quitar de la selección individualmente -->
                  <v-btn icon @click="quitarSeleccionado(prod._seleccionKey)">
                    <v-icon color="red">mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <!-- Botón: Ejecutar desposicionamiento de todos los seleccionados -->
            <v-btn
              color="red"
              class="boton-normalizado mt-3"
              :disabled="productosSeleccionadosGlobal.length === 0"
              @click="vaciarProductosSeleccionados"
              block
            >
              Desposicionar seleccionados
            </v-btn>
            <!-- Cancelar selección de productos -->
            <v-btn
              class="boton-normalizado mt-3"
              @click="limpiarSeleccionProductos"
              color="grey"
              outlined
              block
            >
              Cancelar selección
            </v-btn>
          </v-card>
        </v-col>
      </v-row>

      <!-- MODAL DETALLE DE ARTÍCULOS DE LA POSICIÓN -->
      <v-dialog v-model="showModal" max-width="900px">
        <v-card class="rounded-card">
          <v-card-title class="text-h6">
            Productos en posición: <b>{{ posicionDetalle?.Nombre }}</b>
          </v-card-title>
          <v-card-text>
            <!-- Aviso de carga asíncrona -->
            <v-alert v-if="cargandoDetalle" color="info" dense>
              Cargando productos...
            </v-alert>
            <!-- Mensaje si está vacía la posición -->
            <v-alert v-else-if="!detalleArticulos.length" color="info" dense>
              No hay artículos en esta posición.
            </v-alert>
            <!-- Tabla de productos con checkboxes -->
            <v-data-table
              v-else
              :headers="detalleHeaders"
              :items="detalleArticulos"
              dense
              class="elevation-1"
              hide-default-footer
              show-select
              v-model="productosSeleccionadosModal"
              :item-key="'_seleccionKey'"
              :disabled="seleccionadas.length > 0"
            >
              <template v-slot:item.Producto="{ item }">
                {{ item.NombreProducto || (item.Producto && item.Producto.Nombre) || '-' }}
              </template>
              <template v-slot:item.Barcode="{ item }">
                {{ item.BarcodeProducto || (item.Producto && item.Producto.Barcode) || '-' }}
              </template>
              <template v-slot:item.Empresa="{ item }">
                {{ item.NombreEmpresa || (item.Empresa && item.Empresa.Nombre) || '-' }}
              </template>
              <template v-slot:item.Unidades="{ item }">
                {{ item.Unidades || 0 }}
              </template>
            </v-data-table>
          </v-card-text>
          <v-card-actions>
            <!-- Agregar a la selección global para desposicionar -->
            <v-btn
              class="boton-normalizado"
              color="blue"
              :disabled="productosSeleccionadosModal.length === 0"
              @click="agregarSeleccionadosGlobal"
            >
              Agregar a desposicionar
            </v-btn>
            <!-- Cerrar modal -->
            <v-btn class="boton-normalizado" text @click="cerrarModalDetalle">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<script>
// IMPORTANTE: Agregar el import del selector
import SelectorEmpresa from '@/components/SelectorEmpresa.vue'
import posiciones from "@/store/posiciones"
import productos from "@/store/productosV3"
import store from "@/store"
import excel from "exceljs"
import { saveAs } from "file-saver"
import Chart from "chart.js/auto"

export default {
  name: "VaciarPosicion",

  components: {
    SelectorEmpresa // Registra el componente
  },
  created() {
    store.dispatch('actualizarTituloPrincipal', 'Vaciar posiciones')
    store.dispatch('empresas/cargarListaEmpresas', "SoloActivas")

    if (store.state.usuarios.usuarioActual.IdEmpresa>0) {
        this.idEmpresa = store.state.usuarios.usuarioActual.IdEmpresa
        this.eligioEmpresa(store.state.usuarios.usuarioActual.IdEmpresa)
    }
},


  data() {
    return {
      idEmpresa: -1, // ID de empresa, se setea al elegir empresa
      listaPosiciones: [],
      seleccionadas: [],
      filtro: "",
      resumen: { total: 0, enUso: 0, vacias: 0 },
      showModal: false,
      posicionDetalle: null,
      detalleArticulos: [],
      cargandoDetalle: false,
      productosSeleccionadosModal: [],
      productosSeleccionadosGlobal: [],
      pieChart: null,
      headers: [
        { text: "Estado", value: "estado", sortable: false },
        { text: "Posición", value: "Nombre" },
        { text: "Unidades", value: "CantUnidades" },
        { text: "Artículos distintos", value: "CantArticulos" }
      ],
      detalleHeaders: [
        { text: "Unidades", value: "Unidades" },
        { text: "Descripción", value: "Producto" },
        { text: "Barcode", value: "Barcode" },
        { text: "Empresa", value: "Empresa" }
      ]
    }
  },

  computed: {
    // Filtra las posiciones según el texto de búsqueda
    posicionesFiltradas() {
      if (!this.filtro) return this.listaPosiciones
      const buscar = this.filtro.toLowerCase()
      return this.listaPosiciones.filter(pos =>
        (pos.Nombre || "").toLowerCase().includes(buscar) ||
        ("" + pos.CantUnidades).includes(buscar) ||
        ("" + pos.CantArticulos).includes(buscar)
      )
    }
  },

  methods: {
    // Elige empresa, setea id y carga posiciones
    eligioEmpresa(id) {
      this.idEmpresa = id
      this.cargarPosiciones()
    },

    // ==============================
    // Carga todas las posiciones y calcula resumen
    // ==============================
    async cargarPosiciones() {
      if (!this.idEmpresa || this.idEmpresa <= 0) return // Seguridad
      this.listaPosiciones = []
      let total = 0, enUso = 0, vacias = 0
      // Trae todo del endpoint por empresa
      const todas = await posiciones.getAllByEmpresaConProductos(this.idEmpresa)
      for (const pos of todas) {
        const articulos = pos.Detalle || []
        const cantUnidades = articulos.reduce((acc, art) => acc + (art.Unidades || 0), 0)
        const cantArticulos = articulos.length
        this.listaPosiciones.push({
          Id: pos.Id,
          Nombre: pos.Nombre,
          EnUso: cantArticulos > 0,
          CantUnidades: cantUnidades,
          CantArticulos: cantArticulos,
          Detalle: articulos
        })
        total++
        if (cantArticulos > 0) enUso++
        else vacias++
      }
      this.resumen = { total, enUso, vacias }
      this.$nextTick(this.renderPieChart)
    },

    renderPieChart() {
      if (!this.$refs.pieChart) return
      if (this.pieChart) this.pieChart.destroy()
      this.pieChart = new Chart(this.$refs.pieChart, {
        type: "pie",
        data: {
          labels: ["En uso", "Vacías"],
          datasets: [
            {
              data: [this.resumen.enUso, this.resumen.vacias],
              backgroundColor: ["var(--vaciar-verde)", "var(--vaciar-rojo)"],
              borderColor: ["#fff", "#fff"],
              borderWidth: 3,
              hoverOffset: 16
            }
          ]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } }
        }
      })
    },

    async mostrarDetalle(posicion) {
      this.posicionDetalle = posicion
      this.detalleArticulos = posicion.Detalle.map(element => ({
        ...element,
        NombreProducto: element.Descripcion || "-", // Corrige según tu backend
        BarcodeProducto: element.Barcode || "-",
        NombreEmpresa: element.EmpresaNombre || "-",
        Unidades: element.Unidades || 0,
        _seleccionKey: `${posicion.Id}-${element.IdProducto || Math.random()}`,
        _posicionId: posicion.Id
      }))
      this.productosSeleccionadosModal = []
      this.cargandoDetalle = false
      this.showModal = true
    },

    cerrarModalDetalle() {
      this.showModal = false
      this.productosSeleccionadosModal = []
    },

    agregarSeleccionadosGlobal() {
      if (!this.productosSeleccionadosModal.length) return
      for (const prod of this.productosSeleccionadosModal) {
        if (!this.productosSeleccionadosGlobal.some(p => p._seleccionKey === prod._seleccionKey)) {
          this.productosSeleccionadosGlobal.push({ ...prod })
        }
      }
      this.cerrarModalDetalle()
      this.mostrarMensaje("Productos agregados a la lista de desposicionamiento.", "Listo")
      this.seleccionadas = []
    },

    quitarSeleccionado(clave) {
      this.productosSeleccionadosGlobal = this.productosSeleccionadosGlobal.filter(p => p._seleccionKey !== clave)
    },

    limpiarSeleccionProductos() {
      this.productosSeleccionadosGlobal = []
      this.productosSeleccionadosModal = []
    },

    async vaciarProductosSeleccionados() {
      if (!this.productosSeleccionadosGlobal.length) return
      const detalleConfirm = `<b>Productos seleccionados:</b><ul>` +
        this.productosSeleccionadosGlobal
          .map(p => `<li>${p.NombreProducto || '-'} - ${p.Unidades || 0} und - <b>${this.buscarNombrePosicion(p._posicionId)}</b></li>`)
          .join("") +
        `</ul>`
      store.dispatch("alertDialog/mostrar", {
        titulo: "Confirmar desposicionamiento",
        texto: `¿Confirma desposicionar los siguientes productos?<br>${detalleConfirm}`,
        botonPrimario: "Desposicionar productos",
        botonSecundario: "Cancelar",
        callback: async (respuesta) => {
          if (respuesta === "Desposicionar productos") {
            for (const prod of this.productosSeleccionadosGlobal) {
              try {
                await productos.registrarDesposicionamiento(
                  prod.IdProducto || (prod.Producto && prod.Producto.Id),
                  prod._posicionId,
                  prod.Unidades
                )
              } catch (e) {
                console.error("Error al desposicionar producto:", e)
              }
            }
            this.mostrarMensaje("Productos desposicionados correctamente.", "Éxito")
            this.productosSeleccionadosGlobal = []
            this.cargarPosiciones()
          }
        }
      })
    },

    buscarNombrePosicion(id) {
      const pos = this.listaPosiciones.find(p => p.Id === id)
      return pos ? pos.Nombre : `ID:${id}`
    },

    seleccionarTodas() {
      if (this.productosSeleccionadosGlobal.length > 0) return
      this.seleccionadas = this.posicionesFiltradas.map(pos => pos)
    },

    vaciarSeleccionadas() {
      if (this.productosSeleccionadosGlobal.length > 0) return
      const idsDisponibles = this.listaPosiciones.map(p => p.Id)
      const posicionesValidas = this.seleccionadas
        .map(item => item.Id)
        .filter(id => typeof id === "number" && !isNaN(id) && idsDisponibles.includes(id))
      if (!posicionesValidas.length) {
        this.mostrarMensaje("No hay posiciones válidas para vaciar.", "Error")
        return
      }
      const tieneMuchaCarga = this.listaPosiciones
        .filter(pos => posicionesValidas.includes(pos.Id))
        .some(pos => pos.CantUnidades >= 100)
      let texto = `¿Confirma el vaciado de las ${posicionesValidas.length} posiciones seleccionadas?<br><br>`
      if (tieneMuchaCarga) {
        texto +=
          "<b style='color:red'>¡Atención! Una o más posiciones tienen mucho stock.<br>Esta acción no se puede deshacer.</b><br>"
      }
      store.dispatch("alertDialog/mostrar", {
        titulo: "Confirmar vaciado",
        texto,
        botonPrimario: "Vaciar posiciones",
        botonSecundario: "Cancelar",
        callback: async (respuesta) => {
          if (respuesta === "Vaciar posiciones") {
            for (const posId of posicionesValidas) {
              try {
                await posiciones.vaciar(posId)
              } catch (e) {
                console.error("Error al vaciar posición:", e)
              }
            }
            this.mostrarMensaje("Posiciones vaciadas correctamente.", "Éxito")
            this.seleccionadas = []
            this.cargarPosiciones()
          }
        }
      })
    },

    async exportarExcel() {
      const workbook = new excel.Workbook()
      const worksheet = workbook.addWorksheet("Posiciones")
      worksheet.columns = [
        { header: "Posición", width: 40 },
        { header: "Estado", width: 10 },
        { header: "Unidades", width: 15 },
        { header: "Artículos distintos", width: 20 }
      ]
      this.listaPosiciones.forEach(pos => {
        worksheet.addRow([
          pos.Nombre,
          pos.EnUso ? "En uso" : "Vacía",
          pos.CantUnidades,
          pos.CantArticulos
        ])
      })
      worksheet.getRow(1).font = { bold: true, size: 15 }
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) row.font = { size: 13 }
      })
      const buf = await workbook.xlsx.writeBuffer()
      saveAs(new Blob([buf]), `Posiciones_${(new Date()).toLocaleDateString('es-AR')}.xlsx`)
    },

    mostrarMensaje(mensaje, titulo) {
      store.dispatch("alertDialog/mostrar", { titulo, mensaje })
    }
  },

  // ¡Ya no carga posiciones automáticamente! Solo después de elegir empresa.
  mounted() {
    // No cargar posiciones automáticamente aquí
  }
}
</script>

<style scoped>
/* ====== Estilos principales y normalización de botones ====== */
.boton-normalizado {
  min-height: 40px !important;
  height: 40px !important;
  line-height: 40px !important;
  font-size: 15px !important;
  padding: 0 28px !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  letter-spacing: 1px !important;
  box-shadow: 0 1px 6px #0001 !important;
  margin-bottom: 0 !important;
  margin-top: 0 !important;
  text-transform: uppercase !important;
}
@media (max-width: 720px) {
  .boton-normalizado {
    min-height: 32px !important;
    height: 32px !important;
    font-size: 13px !important;
    padding: 0 12px !important;
    border-radius: 7px !important;
  }
}

/* Cards de resumen, dashboard y torta: igual que versión anterior */
.resumen-row {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 0;
}
.resumen-cards-row {
  display: flex;
  flex-direction: row;
  gap: 22px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 12px;
  margin-bottom: 12px;
}
.tarjeta-resumen {
  min-width: 104px;
  min-height: 84px;
  width: 132px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8px 28px rgba(65,100,250,0.13);
  padding: 18px 24px 10px 24px;
  transition: transform 0.15s;
}
.tarjeta-resumen:hover {
  transform: scale(1.04);
  box-shadow: 0 14px 32px rgba(20, 30, 85, 0.16);
}
.tarjeta-resumen.azul {
  background-color: var(--vaciar-azul);
  color: #fff;
}
.tarjeta-resumen.verde {
  background-color: var(--vaciar-verde);
  color: #fff;
}
.tarjeta-resumen.rojo {
  background-color: var(--vaciar-rojo);
  color: #fff;
}
.tarjeta-resumen .titulo {
  font-size: 1.02rem;
  font-weight: 500;
  margin-bottom: 2px;
  text-shadow: 0 2px 6px #0001;
  letter-spacing: 0.08em;
}
.tarjeta-resumen .cantidad {
  font-size: 2.2rem;
  font-weight: 700;
  margin-top: 4px;
  letter-spacing: 1.5px;
  text-shadow: 0 3px 12px #0002;
}
.chart-col {
  display: flex;
  align-items: center;
  justify-content: center;
}
.chart-wrap {
  background: rgba(31,66,160,0.07);
  border-radius: 60%;
  padding: 15px;
  box-shadow: 0 4px 22px 0 rgba(62,110,220,0.08);
  margin-bottom: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 230px;
  min-width: 230px;
}
@media (max-width: 720px) {
  .resumen-row {
    flex-direction: column;
    gap: 8px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .resumen-cards-row {
    flex-direction: column;
    gap: 12px;
    width: 100%;
    align-items: center;
    margin-top: 18px;
    margin-bottom: 6px;
  }
  .tarjeta-resumen {
    min-width: 80px;
    width: 100px;
    min-height: 62px;
    padding: 12px 8px 6px 8px;
    font-size: 1rem;
  }
  .chart-wrap {
    margin-bottom: 2px;
    padding: 5px;
    min-height: 120px;
    min-width: 120px;
    max-width: 150px;
  }
}
</style>
