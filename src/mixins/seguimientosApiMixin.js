import store from '@/store'
import ordenes from '@/store/ordenesV3'
import empresasV3 from '@/store/empresasV3'
import guias from '@/store/guias'
import roles from '@/store/roles'

export default {
  methods: {
    async fetchEmpresas() {
      try {
        await store.dispatch('empresas/cargarListaEmpresas', 'SoloActivas')
        this.listaEmpresas = store.state.empresas.listaEmpresas || []
      } catch (error) {
        console.error('fetchEmpresas error:', error)
        this.listaEmpresas = []
      }
    },

    async eligioEmpresa(idEmpresa) {
      const id = Number(idEmpresa)
      if (isNaN(id) || id <= 0) {
        this.mostrarError('Seleccione una empresa válida')
        return
      }
      this.modalData = null
      this.showModal = false
      this.errorAlCargar = null
      try {
        const resp = await empresasV3.getOneById(id)
        this.estaEmpresa = resp
        this.empresaPosicionado = resp.StockPosicionado
        this.empresaPorLote = resp.LOTE
        if (resp.ClienteTextil === true) {
          this.unidadesTotalesEnBase = await ordenes.contadorBultosDia(idEmpresa, this.getHoy())
        } else {
          this.unidadesTotalesEnBase = 0
        }
      } catch (error) {
        console.error('eligioEmpresa error:', error)
        this.estaEmpresa = {}
        this.empresaPosicionado = false
        this.empresaPorLote = false
        this.unidadesTotalesEnBase = 0
        this.errorAlCargar = 'No se pudo cargar la configuración de la empresa.'
      }
      this.idEmpresa = id
      this.pageOrdenes = 1
      this.pageGuias = 1
      await this.popularAmbasListas()
    },

    async popularAmbasListas() {
      if (this.idEmpresa > 0 && this.fechaDesde && this.fechaHasta) {
        this.loading = true
        this.errorAlCargar = null
        try {
          await Promise.all([
            this.popularListaDeOrdenes(),
            this.popularListaDeGuias(),
            this.popularListaGuiasEmpresa()
          ])
        } catch (error) {
          console.error('popularAmbasListas error:', error)
          this.errorAlCargar = error.message || 'Ocurrió un error al cargar los datos.'
          this.todasLasOrdenes = []
          this.todasLasGuias = []
        } finally {
          this.loading = false
        }
      } else {
        this.todasLasOrdenes = []
        this.todasLasGuias = []
        this.errorAlCargar = null
        this.loading = false
      }
    },

    async popularListaDeOrdenes() {
      this.todasLasOrdenes = []
      try {
        const userId = store.state.usuarios.usuarioActual?.Id
        if (!userId) throw new Error('No se pudo identificar al usuario actual')
        const rolesUser = await roles.getUserRolesById(userId)
        this.rolPermitido = !store.state.usuarios.usuarioActual?.IdEmpresa && rolesUser?.[0]?.IdRole === 1
      } catch (error) {
        console.error('popularListaDeOrdenes roles error:', error)
        this.rolPermitido = false
      }

      try {
        const response = await ordenes.getOrdenesByEmpresaPeriodoConDestinos(this.idEmpresa, this.fechaDesde, this.fechaHasta)
        let data = []
        if (response && response.status === 'OK' && Array.isArray(response.data)) {
          data = response.data
        } else if (Array.isArray(response)) {
          data = response
        } else if (response && response.data === undefined) {
          data = []
        } else {
          throw new Error('Formato de respuesta inesperado del servidor.')
        }
        const ordenesAgrupadas = {}
        data.forEach(item => {
          if (!ordenesAgrupadas[item.IdOrden]) {
            ordenesAgrupadas[item.IdOrden] = {
              IdOrden: item.IdOrden,
              Numero: item.Numero,
              Fecha: item.Fecha,
              Estado: item.Estado,
              Tipo: item.Tipo,
              preOrden: item.preOrden,
              retira_cliente: item.retira_cliente,
              Valor: item.Valor,
              Observaciones: item.Observaciones,
              id_integracion: item.id_integracion,
              IdDestino: item.IdDestino,
              NombreDestino: item.NombreDestino,
              DomicilioDestino: item.DomicilioDestino,
              LocalidadDestino: item.LocalidadDestino,
              CodigoPostalDestino: item.CodigoPostalDestino,
              ObservacionesDestino: item.ObservacionesDestino,
              IdEmpresaDestino: item.IdEmpresaDestino,
              NombreEmpresa: this.estaEmpresa.RazonSocial || 'N/A',
              IdGuia: item.IdGuia || -1,
              productos: []
            }
          }
          ordenesAgrupadas[item.IdOrden].productos.push({
            IdDetalle: item.IdDetalle,
            Unidades: item.Unidades,
            Precio: item.Precio,
            loteCompleto: item.loteCompleto,
            IdProducto: item.IdProducto,
            Barcode: item.Barcode,
            NombreProducto: item.NombreProducto,
            CodeEmpresa: item.CodeEmpresa,
            Alto: item.Alto,
            Ancho: item.Ancho,
            Largo: item.Largo,
            Peso: item.Peso
          })
        })
        const todasOrdenes = Object.values(ordenesAgrupadas)
        
        // Obtener todos los IDs de órdenes únicos
        const ordenesIds = todasOrdenes.map(o => o.IdOrden)
        
        try {
          // Obtener todos los históricos en una sola llamada
          const historicosResponse = await ordenes.getHistoricoEstadosMultiple(ordenesIds)
          
          // Crear un mapa para acceso rápido por ordenId
          const historicosPorOrden = new Map()
          if (Array.isArray(historicosResponse)) {
            historicosResponse.forEach(item => {
              if (item && item.ordenId && Array.isArray(item.historicos)) {
                historicosPorOrden.set(
                  item.ordenId, 
                  item.historicos.sort((a, b) => new Date(a.Fecha) - new Date(b.Fecha))
                )
              }
            })
          }
          
          // Asignar los históricos a cada orden
          for (const o of todasOrdenes) {
            const historialOrden = historicosPorOrden.get(o.IdOrden) || []
            o.historialEstados = historialOrden
            const ultimo = historialOrden[historialOrden.length - 1]
            if (ultimo) o.Estado = ultimo.Estado
          }
        } catch (histErr) {
          console.error('Error al obtener historiales de órdenes:', histErr)
          // Si falla, inicializar con array vacío
          todasOrdenes.forEach(o => { o.historialEstados = [] })
        }

        // Procesar cada orden para formatear fechas y estados
        for (const o of todasOrdenes) {
          o.FechaRaw = o.Fecha
          o.FechaFormateada = o.Fecha ? new Date(o.Fecha).toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }) : 'N/A'
          o.Fecha = o.FechaFormateada
          switch (o.Estado) {
            case 1: o.NombreEstado = 'Pendiente'; break
            case 2: o.NombreEstado = 'Preparado'; break
            case 3: o.NombreEstado = 'A distribución'; break
            case 4: o.NombreEstado = 'Anulado'; break
            case 5: o.NombreEstado = 'Retira Cliente'; break
            default: o.NombreEstado = `Desconocido (${o.Estado})`
          }
          o.Estado = o.NombreEstado
          o.tipo = o.preOrden === true || o.preOrden === 1 ? 'Pre-Orden' : 'Orden'
          o.preOrdenDisplay = o.tipo
          o.IdGuia = o.IdGuia || -1
        }
        todasOrdenes.sort((a, b) => {
          const dateA = new Date(a.FechaRaw)
          const dateB = new Date(b.FechaRaw)
          return dateB.getTime() - dateA.getTime()
        })
        this.todasLasOrdenes = todasOrdenes
      } catch (error) {
        console.error('popularListaDeOrdenes error:', error)
        throw new Error('No se pudieron cargar las órdenes. Intente nuevamente.')
      }
    },

    async popularListaDeGuias() {
      this.todasLasGuias = []
      try {
        const response = await guias.getByPeriodoIdEmpresa(this.fechaDesde, this.fechaHasta, this.idEmpresa)
        let todas = []
        if (response && response.status === 'OK' && Array.isArray(response.data)) {
          todas = response.data
        } else if (Array.isArray(response)) {
          todas = response
        } else {
          throw new Error('Formato de guías inesperado. Contacte a soporte.')
        }
        todas.forEach(g => {
          g.FechaOriginalDate = new Date(g.FechaOriginal)
          g.FechaOriginal = g.FechaOriginal ? new Date(g.FechaOriginal).toLocaleDateString('es-AR') : 'N/A'
          g.NombreCliente = g.NombreCliente || 'N/A'
          g.NombreDestino = g.NombreDestino || 'N/A'
          g.Remitos = g.Remitos || 'N/A'
          g.Estado = g.Estado || 'Desconocido'
        })
        todas.sort((a, b) => b.FechaOriginalDate.getTime() - a.FechaOriginalDate.getTime())
        this.todasLasGuias = todas
      } catch (error) {
        console.error('popularListaDeGuias error:', error)
        throw new Error('No se pudieron cargar las guías. Intente nuevamente.')
      }
    },

    async popularListaGuiasEmpresa() {
      this.todasLasGuiasEmpresa = []
      try {
        const response = await guias.getByPeriodoIdEmpresa(this.fechaDesde, this.fechaHasta, this.idEmpresa)
        let todas = []
        if (response && response.status === 'OK' && Array.isArray(response.data)) {
          todas = response.data
        } else if (Array.isArray(response)) {
          todas = response
        } else {
          throw new Error('Formato de guías inesperado')
        }
        todas.forEach(g => {
          g.FechaOriginalDate = new Date(g.FechaOriginal)
          g.FechaOriginal = g.FechaOriginal ? new Date(g.FechaOriginal).toLocaleDateString('es-AR') : 'N/A'
          g.FechaEntrega = g.FechaEntrega ? new Date(g.FechaEntrega).toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }) : 'N/A'
          g.Bultos = g.Bultos || 0
          g.Remitos = g.Remitos || 'N/A'
          g.Estado = g.Estado || 'Desconocido'
        })
        todas.sort((a, b) => b.FechaOriginalDate.getTime() - a.FechaOriginalDate.getTime())
        this.todasLasGuiasEmpresa = todas
      } catch (error) {
        console.error('popularListaGuiasEmpresa error:', error)
        throw new Error('No se pudieron cargar las guías por empresa')
      }
    },

    async verGuiaAsociada(ordenItem) {
      if (ordenItem.IdGuia > 0) {
        const guiaAsociada = this.todasLasGuias.find(g => g.Id === ordenItem.IdGuia)
        if (guiaAsociada) {
          this.tab = 'tab-guias'
          await this.openModal('guia', guiaAsociada)
        } else {
          try {
            const response = await guias.getById(ordenItem.IdGuia)
            const retrievedGuia = (response && response.data) ? response.data : (response && response.Id ? response : null)
            if (retrievedGuia) {
              retrievedGuia.FechaOriginal = retrievedGuia.FechaOriginal ? new Date(retrievedGuia.FechaOriginal).toLocaleDateString('es-AR') : 'N/A'
              retrievedGuia.Estado = retrievedGuia.Estado || 'Desconocido'
              this.todasLasGuias.push(retrievedGuia)
              this.tab = 'tab-guias'
              await this.openModal('guia', retrievedGuia)
            } else {
              this.errorAlCargar = 'No se pudo encontrar la guía asociada.'
            }
          } catch (error) {
            this.errorAlCargar = `Error al cargar la guía asociada: ${error.message || error}`
          }
        }
      } else {
        this.errorAlCargar = 'Esta orden no tiene una guía asociada para seguimiento.'
      }
    },

    async openModal(type, item) {
      this.modalData = null
      this.loading = true
      this.errorAlCargar = null
      this.modalType = type
      try {
        let dataToModal
        if (type === 'orden') {
          const found = this.todasLasOrdenes.find(o => o.IdOrden === item)
          dataToModal = found ? JSON.parse(JSON.stringify(found)) : null
          if (dataToModal) {
            const historico = await ordenes.getHistoricoEstados(item)
            const historialOrden = Array.isArray(historico) ? historico : []
            historialOrden.sort((a, b) => new Date(a.Fecha) - new Date(b.Fecha))
            dataToModal.historialEstados = historialOrden
            const ultimo = historialOrden[historialOrden.length - 1]
            if (ultimo) {
              dataToModal.Estado = ultimo.Estado
              switch (ultimo.Estado) {
                case 1: dataToModal.NombreEstado = 'Pendiente'; break
                case 2: dataToModal.NombreEstado = 'Preparado'; break
                case 3: dataToModal.NombreEstado = 'A distribución'; break
                case 4: dataToModal.NombreEstado = 'Anulado'; break
                case 5: dataToModal.NombreEstado = 'Retira Cliente'; break
                default: dataToModal.NombreEstado = `Desconocido (${ultimo.Estado})`
              }
            } else {
              switch (dataToModal.Estado) {
                case 1: dataToModal.NombreEstado = 'Pendiente'; break
                case 2: dataToModal.NombreEstado = 'Preparado'; break
                case 3: dataToModal.NombreEstado = 'A distribución'; break
                case 4: dataToModal.NombreEstado = 'Anulado'; break
                case 5: dataToModal.NombreEstado = 'Retira Cliente'; break
                default: dataToModal.NombreEstado = `Desconocido (${dataToModal.Estado})`
              }
            }
            if (!dataToModal.FechaFormateada && dataToModal.FechaRaw) {
              dataToModal.FechaFormateada = new Date(dataToModal.FechaRaw).toLocaleString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              })
            }
            dataToModal.NombreEmpresa = dataToModal.NombreEmpresa || this.estaEmpresa.RazonSocial || 'N/A'
          } else {
            throw new Error('No se encontraron detalles válidos para esta orden.')
          }
        } else if (type === 'guia') {
          const response = await guias.getById(item.Id)
          const guiaCompleta = (response && response.data) ? response.data : (response && response.Id ? response : null)
          if (!guiaCompleta) throw new Error('No se encontraron detalles válidos para esta guía.')
          dataToModal = { ...item, ...guiaCompleta }
          dataToModal.productos = Array.isArray(guiaCompleta.productos) ? guiaCompleta.productos : []
          dataToModal.FechaOriginal = dataToModal.FechaOriginal ? new Date(dataToModal.FechaOriginal).toLocaleDateString('es-AR') : 'N/A'
          if (dataToModal.Estado === 'NO ENTREGADO' && dataToModal.Fecha) {
            dataToModal.FechaNoEntregado = new Date(dataToModal.Fecha).toLocaleString('es-AR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })
          } else {
            dataToModal.FechaNoEntregado = 'N/A'
          }
        }
        if (dataToModal && (dataToModal.IdOrden || dataToModal.Id)) {
          this.modalData = dataToModal
          this.showModal = true
        } else {
          throw new Error('No se encontraron detalles o la respuesta fue inválida.')
        }
      } catch (error) {
        console.error('openModal error:', error)
        this.errorAlCargar = error.message || 'Error al cargar los detalles.'
      } finally {
        this.loading = false
      }
    }
  }
}

