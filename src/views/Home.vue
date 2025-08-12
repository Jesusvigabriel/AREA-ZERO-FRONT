<template>
  <v-container fluid>
    <!-- 1) Botón de login mientras no esté loggeado -->
    <v-row justify="center" v-if="!usuarioActual.Loggeado">
      <v-btn x-large color="success" @click="irALogin">
        Iniciar sesión
      </v-btn>
    </v-row>

    <!-- 2) Dashboard: todas las tarjetas -->
    <v-row v-else justify="start">
      <!-- Órdenes Pendientes -->
      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <!-- DEBUG: INICIO ÓRDENES PENDIENTES -->
<div class="ordenes-pendientes-wrapper">
  <v-card 
    outlined 
    class="card-card pending-card white-background" 
    :class="{'dark-widget': $vuetify.theme.dark}"
    @click="irAPendientes" 
    style="display:inline-block; width:auto; background-color:#ececec; border:2px solid var(--home-border-pend); border-radius:18px;">

          <v-card-title class="pending-title align-center pa-4" :class="{'dark-mode': $vuetify.theme.dark}">
            <v-icon left class="pending-icon" :color="$vuetify.theme.dark ? 'var(--menubar)' : 'amber darken-2'">mdi-alert-circle-outline</v-icon>
            <span class="subtitle-1 font-weight-bold" :class="{'dark-mode': $vuetify.theme.dark}">Órdenes Pendientes</span>
          </v-card-title>
          <v-card-text class="pending-text">
            <div class="display-1 font-weight-bold pending-count" :class="{'dark-mode': $vuetify.theme.dark}">{{ pendientesCount }}</div>
  <div class="body-2" :class="{'dark-mode': $vuetify.theme.dark}">Órdenes que aún no han sido liberadas para preparación.</div>
  <div class="caption grey--text mt-2 d-flex align-center" :class="{'dark-mode': $vuetify.theme.dark}">
    <v-icon x-small left>mdi-clock-outline</v-icon>
    Actualizado: {{ formatearFecha(lastUpdated) }}
  </div>
  <div v-if="primerasPendientes.length > 0" class="mt-3">
    <div class="subtitle-2 font-weight-bold mb-1" :class="{'dark-mode': $vuetify.theme.dark}">Próximas órdenes:</div>
    <div v-for="(orden, idx) in primerasPendientes" :key="orden.Id || idx" class="caption grey--text mb-1 orden-pendiente-linea">
      <v-icon small left class="pending-icon">mdi-file-document-outline</v-icon>
      <span v-if="orden.Numero">#{{ orden.Numero }}</span>
      <span v-if="orden.Fecha"> - {{ formatearFecha(orden.Fecha) }}</span>
    </div>
  </div>
</v-card-text>
          <v-card-actions class="pa-4 pt-0">
            <v-spacer />
            <v-btn text color="amber darken-2" @click.stop="irAPendientes">Ver detalle →</v-btn>
          </v-card-actions>
    </v-card>
</div>
<!-- DEBUG: FIN ÓRDENES PENDIENTES -->
      </v-col>

      <!-- Stock Crítico -->
      <!--
      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card
          outlined
          class="card-card critical-card"
          :class="{'critical-alert': stockCritico > 0}"
          @click="verStockCritico"
        >
          <v-card-title class="red--text align-center pa-4">
            <v-icon left color="red">mdi-alert-decagram</v-icon>
            <span class="subtitle-1 font-weight-bold">Stock Crítico</span>
          </v-card-title>
          <v-card-text class="pa-4">
            <div class="display-1 font-weight-bold red--text">{{ stockCritico }}</div>
            <div class="body-2">Ítems bajo punto de reorden.</div>
            <div class="caption grey--text mt-2">Actualizado: {{ lastUpdated }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      -->

      <!-- Rotación 7 días -->
      <!--
      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card outlined class="card-card rotation-card">
          <v-card-title class="blue--text align-center pa-4">
            <v-icon left color="blue">mdi-chart-line</v-icon>
            <span class="subtitle-1 font-weight-bold">Rotación 7d</span>
          </v-card-title>
          <v-card-text class="pa-4">
            <div class="display-1 font-weight-bold blue--text">{{ rotacion7d }}%</div>
            <div class="body-2">% inventario movido últimos 7 días.</div>
            <div class="caption grey--text mt-2">Actualizado: {{ lastUpdated }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      -->

      <!-- Días de Inventario -->
      <!--
      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card outlined class="card-card dio-card">
          <v-card-title class="purple--text align-center pa-4">
            <v-icon left color="purple">mdi-timer-sand</v-icon>
            <span class="subtitle-1 font-weight-bold">Días de Inventario</span>
          </v-card-title>
          <v-card-text class="pa-4">
            <div class="display-1 font-weight-bold purple--text">{{ dio }}</div>
            <div class="body-2">Días para agotar stock al ritmo actual.</div>
            <div class="caption grey--text mt-2">Actualizado: {{ lastUpdated }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      -->
    </v-row>
  </v-container>
</template>

<script>
import store from '../store'
import router from '../router'
import ordenesModule from '@/store/ordenesV3'
import productosV3 from '@/store/productosV3'
import posicionesV3 from '@/store/posicionesV3'
import fechas from 'vue-lsi-util/fechas'

export default {
  name: 'Home',
  data() {
    return {
      pendientesCount: 0,
      pendientes: [],
    
      stockCritico: 0,
      rotacion7d: 0,
      dio: 0,
      lastUpdated: new Date().toISOString()
    }
  },
  computed: {
    primerasPendientes() {
      // Devuelve las primeras 2 órdenes pendientes
      return this.pendientes.slice(0, 2);
    },
    usuarioActual() {
      return store.state.usuarios.usuarioActual
    }
  },
  methods: {
    formatearFecha(fechaISO) {
      if (!fechaISO) return 'N/A';
      try {
        const fecha = new Date(fechaISO);
        const fechaStr = fecha.toLocaleString('es-AR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
        return fechaStr + ' hs';
      } catch (error) {
        console.error('Error al formatear fecha:', error);
        return 'Fecha inválida';
      }
    },
    irALogin() {
      router.replace('/Login')
    },
    irAPendientes() {
      router.push({ name: 'OrdenesPendientes' })
    },
    async cargarPendientes() {
      try {
        const lista = await ordenesModule.getPendientes()
        this.pendientes = lista || [];
        this.pendientesCount = this.pendientes.length;
        // Actualizar la fecha de última actualización
        this.lastUpdated = new Date().toISOString();
      } catch (error) {
        console.error('Error al cargar pendientes:', error);
        this.lastUpdated = new Date().toISOString(); // Aún así actualizamos la fecha
      }
    },
    async cargarStockCritico() {
      const empresa = this.usuarioActual.IdEmpresa
      const productos = await productosV3.getAllProductosByEmpresa(empresa)
      const DEFAULT_PUNTO_REORDEN = 10
      this.stockCritico = productos.filter(p => {
        const punto = Number(p.minimo) || DEFAULT_PUNTO_REORDEN
        const totalStock = Number(p.stock_unitario || 0)
        return totalStock <= punto
      }).length
    },
    async verStockCritico() {
      const empresa = this.usuarioActual.IdEmpresa
      const productos = await productosV3.getAllProductosByEmpresa(empresa)
      const DEFAULT_PUNTO_REORDEN = 10
      const criticos = productos
        .filter(p => Number(p.stock_unitario || 0) <= (Number(p.minimo) || DEFAULT_PUNTO_REORDEN))
      let mensaje = '<table border="0" width="100%"><tr><th>ID</th><th>Producto</th><th>Stock</th><th>Mínimo</th></tr>'
      criticos.forEach(p => {
        mensaje += `<tr><td>${p.id}</td><td>${p.descripcion}</td><td align="right">${p.stock_unitario}</td><td align="right">${p.minimo}</td></tr>`
      })
      mensaje += '</table>'
      store.dispatch('alertDialog/mostrar', { titulo: 'Stock Crítico', mensaje })
    },
    async cargarRotacion7d() {
      const empresa = this.usuarioActual.IdEmpresa
      const hoy = fechas.getHoy()
      const desde = new Date()
      desde.setDate(desde.getDate() - 7)
      const fecha7d = desde.toISOString().substr(0, 10)
      const productos = await productosV3.getAllProductosByEmpresa(empresa)
      let totalMov = 0
      for (const p of productos) {
        const movs = await posicionesV3.getMovimientosByPeriodoAndEmpresaAndArticulo(
          empresa, fecha7d, hoy, p.Id
        )
        totalMov += movs.reduce((sum, m) => sum + Math.abs(m.unidades), 0)
      }
      const stockTotal = productos.reduce((sum, p) => sum + Number(p.stock_unitario || 0), 0)
      this.rotacion7d = ((totalMov / (stockTotal || 1)) * 100).toFixed(1)
    },
    async cargarDio() {
      const empresa = this.usuarioActual.IdEmpresa
      const hoy = fechas.getHoy()
      const desde = new Date()
      desde.setDate(desde.getDate() - 7)
      const fecha7d = desde.toISOString().substr(0, 10)
      const productos = await productosV3.getAllProductosByEmpresa(empresa)
      let totalEgresos = 0
      for (const p of productos) {
        const movs = await posicionesV3.getMovimientosByPeriodoAndEmpresaAndArticulo(
          empresa, fecha7d, hoy, p.Id
        )
        totalEgresos += movs
          .filter(m => m.signo === -1)
          .reduce((sum, m) => sum + m.unidades, 0)
      }
      const stockTotal = productos.reduce((sum, p) => sum + Number(p.stock_unitario || 0), 0)
      const avgEgreso = totalEgresos / 7 || 1
      this.dio = (stockTotal / avgEgreso).toFixed(1)
    }
  },
  async created() {
    store.dispatch('actualizarTituloPrincipal', process.env.VUE_APP_Nombre)
    if (!this.usuarioActual.Loggeado) {
      router.replace('/Login')
      return
    }
    this.lastUpdated = new Date().toISOString()
    await Promise.all([
      this.cargarPendientes()
      // , this.cargarStockCritico()
      // , this.cargarRotacion7d()
      // , this.cargarDio()
    ])
  }
}
</script>

<style scoped>
::v-deep .ordenes-pendientes-wrapper .v-card,
.ordenes-pendientes-wrapper .white-background,
.ordenes-pendientes-wrapper .pending-card {
  background-color: #ececec !important;
  background: #ececec !important;
  box-shadow: 0 2px 8px 0 rgba(60,60,60,0.04) !important;
  display: inline-block !important;
  width: auto !important;
  min-width: unset !important;
  max-width: unset !important;
  border: 2px solid var(--home-border-pend) !important;
  border-radius: 18px !important;
}

.ordenes-pendientes-wrapper .pending-card {
  margin-left: auto !important;
  margin-right: auto !important;
  transition: all 0.3s ease;
}

/* Estilos para el widget en modo oscuro */
.theme--dark .ordenes-pendientes-wrapper .dark-widget {
  background-color: rgba(255, 179, 0, 0.12) !important;
  border: 2px solid var(--home-border-pend) !important;
  box-shadow: 0 2px 8px 0 rgba(255, 179, 0, 0.1) !important;
}

/* Asegurar que TODO el texto sea blanco en modo oscuro */
.theme--dark .ordenes-pendientes-wrapper .dark-widget,
.theme--dark .ordenes-pendientes-wrapper .dark-widget * {
  color: #ffffff !important;
}

/* Asegurar que los íconos también sean blancos */
.theme--dark .ordenes-pendientes-wrapper .dark-widget .v-icon {
  color: #ffffff !important;
}

/* Asegurar que los enlaces y botones mantengan contraste */
.theme--dark .ordenes-pendientes-wrapper .dark-widget .v-btn {
  color: #ffffff !important;
  border-color: #ffffff !important;
}

/* Asegurar que el título tenga buen contraste */
.theme--dark .ordenes-pendientes-wrapper .dark-widget .v-card__title {
  color: #ffffff !important;
  opacity: 0.9;
}

/* Asegurar que el texto secundario sea ligeramente más claro */
.theme--dark .ordenes-pendientes-wrapper .dark-widget .body-2,
.theme--dark .ordenes-pendientes-wrapper .dark-widget .caption,
.theme--dark .ordenes-pendientes-wrapper .dark-widget .subtitle-2 {
  opacity: 0.9;
}

/* Título y contador usan color de la barra de menú */
.ordenes-pendientes-wrapper .pending-title,
.ordenes-pendientes-wrapper .pending-count,
.ordenes-pendientes-wrapper .pending-icon,
.ordenes-pendientes-wrapper .v-card-text,
.ordenes-pendientes-wrapper .caption,
.ordenes-pendientes-wrapper .grey--text,
.ordenes-pendientes-wrapper .subtitle-2,
.ordenes-pendientes-wrapper .body-2,
.ordenes-pendientes-wrapper .display-1,
.ordenes-pendientes-wrapper .mb-1,
.ordenes-pendientes-wrapper .mt-3,
.ordenes-pendientes-wrapper .orden-pendiente-linea,
.ordenes-pendientes-wrapper .v-icon,
.ordenes-pendientes-wrapper .subtitle-1,
.ordenes-pendientes-wrapper .font-weight-bold {
  color: var(--menubar) !important;
}
.ordenes-pendientes-wrapper .pending-title {
  font-weight: 700 !important;
  font-size: 0.95rem !important;
}
.ordenes-pendientes-wrapper .pending-count {
  font-size: 1.3rem !important;
  line-height: 1.5rem !important;
}
.ordenes-pendientes-wrapper .pending-icon,
.ordenes-pendientes-wrapper .v-icon {
  margin-right: 4px !important;
  font-size: 1.1rem !important;
  vertical-align: middle !important;
}
.ordenes-pendientes-wrapper .subtitle-2 {
  font-weight: 600 !important;
}



::v-deep .ordenes-pendientes-wrapper .v-card__title,
.ordenes-pendientes-wrapper .v-card-title {
  font-size: 0.89rem !important;
  padding: 4px 8px !important;
  min-height: unset !important;
}
::v-deep .ordenes-pendientes-wrapper .v-card__text,
.ordenes-pendientes-wrapper .v-card-text {
  font-size: 0.80rem !important;
  padding: 6px 8px 6px 8px !important;
}
.ordenes-pendientes-wrapper .display-1 {
  font-size: 1.3rem !important;
  line-height: 1.5rem !important;
}
.ordenes-pendientes-wrapper .body-2,
.ordenes-pendientes-wrapper .subtitle-2,
.ordenes-pendientes-wrapper .caption {
  font-size: 0.80rem !important;
  line-height: 1.05rem !important;
}
.ordenes-pendientes-wrapper .subtitle-2 {
  font-weight: 600 !important;
}
.ordenes-pendientes-wrapper .mb-1 {
  margin-bottom: 2px !important;
}
.ordenes-pendientes-wrapper .mt-3 {
  margin-top: 6px !important;
}
.ordenes-pendientes-wrapper .v-icon {
  font-size: 0.9rem !important;
  margin-right: 2px !important;
  vertical-align: middle !important;
}
.ordenes-pendientes-wrapper .orden-pendiente-linea {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  width: 100%;
  display: block;
}


.card-card {
  cursor: default;
  transition: box-shadow 0.2s ease;
}

/* Órdenes Pendientes: ámbar */
.pending-card {
  border: 2px solid var(--home-border-pend);
  background-color: rgba(255, 179, 0, 0.05);
  box-shadow: 0 2px 8px rgba(255, 179, 0, 0.1);
}
.pending-card:hover {
  box-shadow: 0 4px 16px rgba(255, 179, 0, 0.2);
}

/* Stock Crítico */
.critical-card {
  border: 2px solid var(--home-border-crit);
  background-color: rgba(229, 57, 53, 0.05);
  box-shadow: 0 2px 8px rgba(229, 57, 53, 0.1);
}
.critical-card:hover {
  box-shadow: 0 4px 16px rgba(229, 57, 53, 0.2);
}

/* Alerta pulsante */
.critical-alert {
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0% { box-shadow: 0 2px 8px rgba(229, 57, 53, 0.1); }
  50% { box-shadow: 0 2px 16px rgba(229, 57, 53, 0.3); }
  100% { box-shadow: 0 2px 8px rgba(229, 57, 53, 0.1); }
}

/* Rotación 7 días */
.rotation-card {
  border: 2px solid var(--home-border-rot);
  background-color: rgba(30, 136, 229, 0.05);
  box-shadow: 0 2px 8px rgba(30, 136, 229, 0.1);
}
.rotation-card:hover {
  box-shadow: 0 4px 16px rgba(30, 136, 229, 0.2);
}

/* Días de Inventario */
.dio-card {
  border: 2px solid var(--home-border-dio);
  background-color: rgba(142, 36, 170, 0.05);
  box-shadow: 0 2px 8px rgba(142, 36, 170, 0.1);
}
.dio-card:hover {
  box-shadow: 0 4px 16px rgba(142, 36, 170, 0.2);
}
</style>
