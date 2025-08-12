export function construirTimelineOrden(orden) {
  const historial = Array.isArray(orden.historialEstados) ? orden.historialEstados : []
  if (!historial.length) return []

  const labelMap = { 1: 'Pendiente', 2: 'Preparado', 3: 'A distribución', 4: 'Anulado', 5: 'Retira Cliente' }
  const iconMap = {
    1: 'mdi-file-document-edit-outline',
    2: 'mdi-package-variant-closed-check',
    3: 'mdi-truck-fast-outline',
    4: 'mdi-cancel',
    5: 'mdi-account-check-outline'
  }
  const colorMap = { 1: 'pendiente', 2: 'preparada', 3: 'despachada', 4: 'despachada', 5: 'despachada' }

  return historial.map((h, idx) => {
    const fecha = h.Fecha ? new Date(h.Fecha).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }) : 'N/A'
    const nombre = labelMap[h.Estado] || `Estado ${h.Estado}`
    const descripcion = h.Usuario ? `Por ${h.Usuario}` : ''
    const statusClass = idx === historial.length - 1 ? (h.Estado === 4 ? 'current-bad' : 'current') : 'completed'
    return {
      id: `estado_${idx}`,
      nombre,
      icon: iconMap[h.Estado] || 'mdi-alert-circle-outline',
      fecha,
      descripcion,
      statusClass,
      colorClass: colorMap[h.Estado] || ''
    }
  })
}

export function construirTimelineGuia(guia) {
  const timelineSteps = []
  const currentStatusText = guia.Estado
  const isRetiraClienteSucursal = guia.Domicilio && guia.Domicilio.toLowerCase().includes('lagos garcia 4470')
  const fechaOriginal = guia.FechaOriginal || 'N/A'
  const fechaNoEntregado = guia.FechaNoEntregado || 'N/A'

  const baseSteps = [
    {
      id: 'preparacion',
      nombre: 'Pedido en preparación',
      icon: 'mdi-clipboard-list-outline',
      fecha: fechaOriginal,
      descripcion: 'Actualmente estamos trabajando en procesar tu pedido para que llegue a tus manos lo mas pronto posible.',
      baseOrder: 1,
    },
    {
      id: 'preparado',
      nombre: 'Pedido preparado',
      icon: 'mdi-cube-outline',
      fecha: fechaOriginal,
      descripcion: 'Tu pedido ha sido preparado y está listo para el proceso de distribución.',
      baseOrder: 2,
    },
    {
      id: 'en_cd',
      nombre: 'En CD',
      icon: 'mdi-warehouse',
      fecha: fechaOriginal,
      descripcion: 'Tu pedido se encuentra en proceso de Cross Docking en nuestras instalaciones, ¡Pronto esta en camino hacia su destino final!',
      baseOrder: 3,
    },
    {
      id: 'en_distribucion',
      nombre: 'En distribución',
      icon: 'mdi-truck-fast-outline',
      fecha: guia.Estado === 'DESPACHADO' ? fechaOriginal : 'N/A',
      descripcion: '¡Tu pedido ya está en camino!',
      baseOrder: 4,
    },
  ]

  if (currentStatusText === 'ANULADO') {
    return [{
      id: 'anulado',
      nombre: 'Guía Anulada',
      icon: 'mdi-cancel',
      fecha: fechaOriginal,
      descripcion: 'La guía ha sido cancelada.',
      statusClass: 'current-bad'
    }]
  }

  if (isRetiraClienteSucursal) {
    baseSteps.forEach(step => {
      if (step.baseOrder <= 2) {
        step.statusClass = 'completed'
      } else {
        step.statusClass = 'pending'
      }
      timelineSteps.push(step)
    })
    timelineSteps.push({
      id: 'retirado',
      nombre: 'Pedido retirado',
      icon: 'mdi-kabaddi',
      fecha: currentStatusText === 'ENTREGADO' ? fechaOriginal : 'N/A',
      descripcion: 'El pedido fue retirado de nuestro centro de distribución.',
      statusClass: currentStatusText === 'ENTREGADO' ? 'current' : 'pending'
    })
  } else {
    let currentStepId = ''
    switch (currentStatusText) {
      case 'Pedido en preparación': currentStepId = 'preparacion'; break
      case 'Pedido preparado': currentStepId = 'preparado'; break
      case 'En Planchada':
      case 'En CD': currentStepId = 'en_cd'; break
      case 'Ruteado':
      case 'DESPACHADO':
      case 'En distribución': currentStepId = 'en_distribucion'; break
      case 'ENTREGADO': currentStepId = 'entregado'; break
      case 'PARCIAL': currentStepId = 'parcial'; break
      case 'NO ENTREGADO': currentStepId = 'no_entregado'; break
      default: currentStepId = ''
    }
    baseSteps.forEach(step => {
      let stepStatus = 'pending'
      const currentStepIndex = baseSteps.findIndex(s => s.id === currentStepId)
      const stepIndex = baseSteps.findIndex(s => s.id === step.id)
      if (step.id === currentStepId) {
        stepStatus = (currentStatusText === 'PARCIAL' || currentStatusText === 'NO ENTREGADO') ? 'current-bad' : 'current'
      } else if (currentStepIndex !== -1 && stepIndex < currentStepIndex) {
        stepStatus = 'completed'
      }
      step.statusClass = stepStatus
      timelineSteps.push(step)
    })
    if (currentStatusText === 'ENTREGADO') {
      timelineSteps.push({
        id: 'entregado',
        nombre: 'Entregado',
        icon: 'mdi-truck-check-outline',
        fecha: fechaOriginal,
        descripcion: 'Tu pedido fue entrega con exito.',
        statusClass: 'current'
      })
    } else if (currentStatusText === 'PARCIAL') {
      timelineSteps.push({
        id: 'parcial',
        nombre: 'Entrega parcial',
        icon: 'mdi-truck',
        fecha: fechaOriginal,
        descripcion: 'Por algún motivo no se pudo entregar tu pedido de forma completa.',
        statusClass: 'current-bad'
      })
    } else if (currentStatusText === 'NO ENTREGADO') {
      timelineSteps.push({
        id: 'no_entregado',
        nombre: 'No entregado',
        icon: 'mdi-truck',
        fecha: fechaNoEntregado,
        descripcion: 'Al no haberse podido entregar tu pedido se recordinara.',
        statusClass: 'current-bad'
      })
    }
  }

  let foundCurrent = false
  for (let i = timelineSteps.length - 1; i >= 0; i--) {
    const step = timelineSteps[i]
    if (step.statusClass === 'current' || step.statusClass === 'current-bad') {
      foundCurrent = true
    } else if (foundCurrent && step.statusClass === 'pending') {
      step.statusClass = 'completed'
    }
  }

  const colorMap = {
    preparacion: 'pendiente',
    preparado: 'preparada',
    en_cd: 'despachada',
    en_distribucion: 'despachada',
    retirado: 'despachada',
    entregado: 'entregado',
    parcial: 'despachada',
    no_entregado: 'despachada'
  }
  timelineSteps.forEach(step => {
    step.colorClass = colorMap[step.id] || ''
  })
  return timelineSteps
}

