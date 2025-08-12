import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

// Importa la vista de restablecimiento de contraseña
import ResetPassword from '../views/ResetPassword.vue'
import Seguimientos from '../views/PanelSeguimientos/Seguimientos.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/Home.vue'), meta: { tituloPagina: process.env.VUE_APP_Nombre } },
  { path: '/StockIngreso', name: 'StockIngreso', component: () => import('../views/StockIngreso.vue'), meta: { tituloPagina: 'Ingreso de stock' }, props: route => ({ coso: route.query.coso }) },
  { path: '/PosicionamientoStock', name: 'PosicionamientoStock', component: () => import('../views/PosicionamientoStock.vue'), meta: { tituloPagina: 'Posicionamiento de stock' } },
  { path: '/Reposicionamiento', name: 'Reposicionamiento', component: () => import('../views/Reposicionamiento.vue'), meta: { tituloPagina: 'Reposicionamiento' } },
  { path: '/VaciarPosicion', name: 'VaciarPosicion', component: () => import('../views/VaciarPosicion.vue'), meta: { tituloPagina: 'Vaciar posición' } },
  { path: '/HistoricoPosiciones', name: 'HistoricoPosiciones', component: () => import('../views/HistoricoPosiciones.vue'), meta: { tituloPagina: 'Historico de Posiciones' } },
  { path: '/Posiciones/VerPosiciones', name: 'VerPosiciones', component: () => import('../views/Posiciones/VerPosiciones.vue'), meta: { tituloPagina: 'Ver posiciones' } },
  { path: '/Inventario', name: 'Inventario', component: () => import('../views/Inventario.vue'), meta: { tituloPagina: 'Inventario' } },
  { path: '/Stock/Conciliacion', name: 'ConciliacionStock', component: () => import('../views/Stock/Conciliacion.vue'), meta: { tituloPagina: 'Stock - Conciliacion' } },
  { path: '/ImprimirOrdenes', name: 'ImprimirOrdenes', component: () => import('../views/Ordenes/ImprimirOrdenes.vue'), meta: { tituloPagina: 'Impresión de órdenes' } },
  { path: '/ImprimirUnaOrden/:idOrden', name: 'ImprimirUnaOrdenId', component: () => import('../views/Ordenes/ImprimirUnaOrden.vue'), meta: { tituloPagina: 'Impresión de órdenes' } },
  { path: '/ImprimirStickersGuia/:idsGuias', name: 'ImprimirStickersGuia', component: () => import('../views/ImprimirStickersGuia.vue'), meta: { tituloPagina: 'Impresión de stickers de guías' } },
  { path: '/ImprimirUnaOrden/:idOrden/:formato', name: 'ImprimirUnaOrdenIdFormato', component: () => import('../views/Ordenes/ImprimirUnaOrden.vue'), meta: { tituloPagina: 'Impresión de órdenes' } },
  { path: '/guias/VistaDeTracking/:comprobante/:tockenAccesoTracking', name: 'VistaDeTracking', component: () => import('../views/Guias/VistaDeTracking.vue'), meta: { tituloPagina: 'Vista de seguimiento' } },
  { path: '/Rendiciones/ImprimirUnaRendicion/:idRendicion', name: 'ImprimirUnaRendicion', component: () => import('../views/Rendiciones/ImprimirUnaRendicion.vue'), meta: { tituloPagina: 'Impresión de rendiciones' } },
  { path: '/Guias/VerFotosDocumentacionEntrega/:idGuia', name: 'Guias_VerFotosDocumentacionEntrega', component: () => import('../views/Guias/VerFotosDocumentacionEntega.vue'), meta: { tituloPagina: 'Fotos de documentación de entrega' } },
  { path: '/Guias/GenerarDesdeOrdenes', name: 'Guias_GenerarDesdeOrdenes', component: () => import('../views/Guias/GenerarDesdeOrdenes.vue'), meta: { tituloPagina: 'Generar guías desde órdenes' } },
  { path: '/Guias/GenerarDesdeExcel', name: 'Guias_GenerarDesdeExcel', component: () => import('../views/Guias/GenerarDesdeExcel.vue'), meta: { tituloPagina: 'Generar guías desde Excel' } },
  { path: '/Guias/GenerarRendiciones', name: 'Guias_GenerarRendiciones', component: () => import('../views/Guias/GenerarRendiciones.vue'), meta: { tituloPagina: 'Generar rendiciones' } },
  { path: '/Guias/ActualizarFechas', name: 'Guias_ActualizarFechas', component: () => import('../views/Guias/ActualizarFechas.vue'), meta: { tituloPagina: 'Actualizar fechas' } },
  { path: '/Empresas/Configuracion', name: 'EmpresasConfiguracion', component: () => import('../views/Empresas/Configuracion.vue'), meta: { tituloPagina: 'Empresas - Configuración' } },
  { path: '/Empresas/ConfiguracionMasiva', name: 'EmpresasConfiguracionMasiva', component: () => import('../views/Empresas/ConfiguracionMasiva.vue'), meta: { tituloPagina: 'Empresas - Activación' } },
  { path: '/Informes/OrdenesPorPeriodo', name: 'Informes_OrdenesPorPeriodo', component: () => import('../views/Informes/OrdenesPorPeriodo.vue'), meta: { tituloPagina: 'Informes - Órdenes por período' } },
  { path: '/Informes/GuiasPorPeriodo', name: 'Informes_GuiasPorPeriodo', component: () => import('../views/Informes/GuiasPorPeriodo.vue'), meta: { tituloPagina: 'Informes - Guías por período' } },
  { path: '/Informes/Tracking', name: 'Informes_Tracking', component: () => import('../views/Informes/Tracking.vue'), meta: { tituloPagina: 'Informes - Tracking' } },
  { path: '/Informes/AlmacenajePorPeriodo', name: 'Informes_AlmacenajePorPeriodo', component: () => import('../views/Informes/AlmacenajePorPeriodo.vue'), meta: { tituloPagina: 'Informes - Almacenaje por período' } },
  { path: '/Informes/Facturacion', name: 'Informes_Facturacion', component: () => import('../views/Informes/Facturacion.vue'), meta: { tituloPagina: 'Informes - Facturacion' } },
  { path: '/Informes/Ingresos', name: 'Informes_Ingresos', component: () => import('../views/Informes/Ingresos.vue'), meta: { tituloPagina: 'Informes - Ingresos' } },
  { path: '/ImportacionOrdenes', name: 'ImportacionOrdenes', component: () => import('../views/Ordenes/ImportacionOrdenes.vue'), meta: { tituloPagina: 'Importación de órdenes' } },
  { path: '/OrdenesSalida', name: 'OrdenesSalida', component: () => import('../views/Ordenes/OrdenesSalida.vue'), meta: { tituloPagina: 'Salida de órdenes' } },
  { path: '/Ordenes/PrepararOrden/:idOrden', name: 'PrepararOrden', component: () => import('../views/Ordenes/PrepararOrden.vue'), meta: { tituloPagina: 'Preparar Orden' } },
  { path: '/Ordenes/CreacionManual', name: 'OrdenesCreacionManual', component: () => import('../views/Ordenes/CreacionManual.vue'), meta: { tituloPagina: 'Creación manual de órdenes' } },
  { path: '/Productos/ABM', name: 'ProductosABM', component: () => import('../views/Productos/ABM.vue'), meta: { tituloPagina: 'Creación de productos' } },
  { path: '/Estadisticas', name: 'Estadisticas', component: () => import('../views/Estadisticas.vue'), meta: { tituloPagina: 'Estadísticas' } },
  { path: '/Stock', name: 'Stock', component: () => import('../views/Stock/Stock.vue'), meta: { tituloPagina: 'Stock' } },
  { path: '/Stock/Ajustes', name: 'Ajustes', component: () => import('../views/Stock/Ajustes.vue'), meta: { tituloPagina: 'Stock - Ajustes' } },
  { path: '/Guias/CargarNovedadesGuias', name: 'CargarNovedadesGuias', component: () => import('../views/Guias/CargarNovedadesGuias.vue'), meta: { tituloPagina: 'Novedades' } },
  { path: '/Usuarios', name: 'Usuarios', component: () => import('../views/Seguridad/Usuarios.vue'), meta: { tituloPagina: 'Usuarios' } },
  { path: '/Empresas/HistoricoDeAumentos', name: 'HistoricoDeAumentos', component: () => import('../views/Empresas/HistoricoDeAumentos.vue'), meta: { tituloPagina: 'Historico De Aumentos' } },
  { path: '/ItinerarRuta/:numeroChofer/:fecha/:ventana', name: 'ItinerarRuta', component: () => import('../views/ItinerarRuta.vue'), meta: { tituloPagina: 'Itinerar' } },
  { path: '/Roles', name: 'Roles', component: () => import('../views/Seguridad/Roles.vue'), meta: { tituloPagina: 'Roles' } },
  { path: '/AsignarRoles', name: 'AsignacionDeRoles', component: () => import('../views/Seguridad/AsignarRoles.vue'), meta: { tituloPagina: 'Asignación de Roles' } },
  { path: '/Seguridad/EmailConfig', name: 'EmailConfig', component: () => import('../views/Seguridad/EmailConfig.vue'), meta: { tituloPagina: 'Configurar Correos' } },
  { path: '/Empresas/ABMEmpresas', name: 'ABMEmpresas', component: () => import('../views/Empresas/ABMEmpresas.vue'), meta: { tituloPagina: 'Empresas - ABM Empresas' } },
  { path: '/Ordenes/OrdenesPendientes', name: 'OrdenesPendientes', component: () => import('../views/Ordenes/OrdenesPendientes.vue'), meta: { tituloPagina: 'Ordenes - Ordenes Pendientes' } },
  { path: '/Ordenes/Ordenes', name: 'Ordenes', component: () => import('../views/Ordenes/Ordenes.vue'), meta: { tituloPagina: 'Ordenes - Ordenes' } },
  { path: '/Transportes/Choferes', name: 'Choferes', component: () => import('../views/Transportes/Choferes.vue'), meta: { tituloPagina: 'Transportes - Choferes' } },
  { path: '/Transportes/RutaChoferes', name: 'Ruta_Choferes', component: () => import('../views/Transportes/RutaChoferes.vue'), meta: { tituloPagina: 'Ruta Choferes' } },
  { path: '/Login', name: 'Login', component: () => import('../views/Login.vue'), meta: { tituloPagina: 'Inicio de sesión' } },
  { path: '/Logout', name: 'Logout', component: () => import('../views/Logout.vue'), meta: { tituloPagina: 'Cierre de sesión' } },
  {path: '/seguimientos',  name: 'Seguimientos', component: Seguimientos, meta: { tituloPagina: 'Panel de Seguimientos' } },
  // Ruta para restablecer contraseña
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
    props: route => ({
      oobCode: route.query.oobCode,
      email: route.query.email
    })
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (
    to.path === '/Login' ||
    to.path === '/Logout' ||
    to.path === '/reset-password' ||
    to.path.toLowerCase().includes('/itinerarruta') ||
    to.path.toLowerCase().includes('/imprimirunaorden') ||
    to.path.toLowerCase().includes('/imprimirstickersguia') ||
    to.path.toLowerCase().includes('/guias/verfotosdocumentacionentrega') ||
    to.path.toLowerCase().includes('/guias/vistadetracking') ||
    to.path === '/' ||
    store.state.usuarios.usuarioActual.Loggeado ||
    process.env.NODE_ENV === 'development'
  ) {
    next()
  } else {
    next('/Login')
  }
})

export default router
