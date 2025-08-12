<template>
  <v-dialog v-model="show" scrollable max-width="650px">
    <v-card class="rounded-card">
      <v-card-title class="justify-space-between">
        <span class="text-h6">
          Detalle de {{ modalType === 'orden' ? 'Orden' : 'Guía' }}: {{ modalData?.Numero || modalData?.Comprobante || '' }}
        </span>
        <v-btn icon @click="$emit('close')" aria-label="Cerrar detalle">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text>
        <div v-if="loading && !modalData" class="text-center py-6">
          <v-progress-circular indeterminate size="36" color="primary" />
          <div class="mt-2">
            <span class="body-2 text--secondary">
              Cargando detalles...
            </span>
          </div>
        </div>

        <div v-else-if="errorAlCargar && !modalData" class="text-center py-6">
          <v-icon size="36" color="error">mdi-alert-circle-outline</v-icon>
          <div class="mt-2">
            <span class="body-2 text--error">
              {{ errorAlCargar }}
            </span>
          </div>
        </div>

        <div v-else-if="modalData">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-list dense>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="subtitle-2 font-weight-medium">
                      N° {{ modalType === 'orden' ? 'Orden' : 'Guía' }}:
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ modalData.Numero || modalData.Comprobante }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="subtitle-2 font-weight-medium">
                      Empresa:
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ modalData.NombreEmpresa || modalData.Empresa?.RazonSocial || modalData.NombreCliente || 'N/A' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="subtitle-2 font-weight-medium">
                      Cliente/Destino:
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ modalData.NombreDestino || 'N/A' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="modalType === 'orden'">
                  <v-list-item-content>
                    <v-list-item-title class="subtitle-2 font-weight-medium">
                      Domicilio Destino:
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ modalData.DomicilioDestino || 'N/A' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="modalType === 'orden'">
                  <v-list-item-content>
                    <v-list-item-title class="subtitle-2 font-weight-medium">
                      Código Postal Destino:
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ modalData.CodigoPostalDestino || 'N/A' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="modalType === 'orden'">
                  <v-list-item-content>
                    <v-list-item-title class="subtitle-2 font-weight-medium">
                      Observaciones Destino:
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ modalData.ObservacionesDestino || 'N/A' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item v-else>
                  <v-list-item-content>
                    <v-list-item-title class="subtitle-2 font-weight-medium">
                      Remito:
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ modalData.Remitos || 'N/A' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="subtitle-2 font-weight-medium">
                      Fecha Creación:
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ modalType === 'orden' ? (modalData.FechaFormateada || 'N/A') : modalData.FechaOriginal || 'N/A' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="modalType === 'orden'">
                  <v-list-item-content>
                    <v-list-item-title class="subtitle-2 font-weight-medium">
                      Valor:
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      $ {{ parseFloat(modalData.Valor).toFixed(2) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="modalType === 'orden'">
                  <v-list-item-content>
                    <v-list-item-title class="subtitle-2 font-weight-medium">
                      Observaciones Orden:
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ modalData.Observaciones || 'N/A' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="subtitle-2 font-weight-medium">
                      Estado Actual:
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      <v-chip :class="getStatusChipClassTextual(modalData.NombreEstado || modalData.Estado)" small>
                        {{ modalData.NombreEstado || modalData.Estado }}
                      </v-chip>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>

            <v-col cols="12" md="6">
              <span class="subtitle-1 font-weight-medium mb-2">
                Progreso de la {{ modalType === 'orden' ? 'Orden' : 'Guía' }}:
              </span>
              <v-sheet elevation="0">
                <div
                  v-for="(paso, index) in timelineStepsComputed"
                  :key="paso.id + index"
                  :class="['timeline-step', paso.statusClass, paso.colorClass]"
                >
                  <div :class="['timeline-icon-container', paso.colorClass]">
                    <v-icon class="timeline-icon">{{ paso.icon }}</v-icon>
                  </div>
                  <div class="timeline-content">
                    <span class="subtitle-2 font-weight-medium">
                      {{ paso.nombre }}
                    </span>
                    <span
                      v-if="paso.fecha && paso.fecha !== 'N/A' && paso.fecha !== 'Invalid date'"
                      class="caption text--secondary"
                    >
                      – {{ paso.fecha }}
                    </span>
                    <span v-if="paso.descripcion" class="caption mt-1 text--secondary">
                      {{ paso.descripcion }}
                    </span>
                  </div>
                  <div v-if="index < timelineStepsComputed.length - 1" :class="['timeline-line', paso.colorClass]"></div>
                </div>
              </v-sheet>
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <v-row>
            <v-col cols="12">
              <v-card outlined>
                <v-card-title class="subtitle-1 font-weight-medium">
                  <v-icon left>mdi-format-list-bulleted</v-icon>
                  Detalle de Productos
                </v-card-title>
                <v-divider />
                <v-card-text class="pa-0">
                  <v-simple-table v-if="modalData.productos && modalData.productos.length > 0" dense>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">Cantidad</th>
                          <th class="text-left">Producto</th>
                          <th class="text-left">Códigos</th>
                          <th class="text-right">Precio</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(prod, index) in modalData.productos" :key="index">
                          <td class="text-left">{{ prod.Unidades }} u</td>
                          <td class="text-left">
                            <div class="font-weight-medium">{{ prod.NombreProducto }}</div>
                            <div v-if="prod.Alto || prod.Ancho || prod.Largo || prod.Peso" class="caption text--secondary">
                              Dim: {{ prod.Alto || '0' }}x{{ prod.Ancho || '0' }}x{{ prod.Largo || '0' }}m,
                              Peso: {{ prod.Peso || '0' }}kg
                            </div>
                          </td>
                          <td class="text-left">
                            <div v-if="prod.Barcode">
                              <v-icon x-small>mdi-barcode</v-icon> {{ prod.Barcode }}
                            </div>
                            <div v-if="prod.CodeEmpresa">
                              <v-icon x-small>mdi-tag</v-icon> {{ prod.CodeEmpresa }}
                            </div>
                          </td>
                          <td class="text-right">
                            <div v-if="prod.Precio">
                              ${{ parseFloat(prod.Precio).toFixed(2) }}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                  <v-alert v-else type="info" class="ma-4" dense outlined>
                    No hay productos registrados en esta {{ modalType === 'orden' ? 'orden' : 'guía' }}.
                  </v-alert>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="justify-end">
        <v-btn color="primary" text @click="download">
          {{ modalType === 'orden' ? 'Descargar Orden' : 'Descargar Guía' }}
        </v-btn>
        <v-btn text color="primary" @click="$emit('close')">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'SeguimientoModal',
  props: {
    show: Boolean,
    modalData: Object,
    modalType: String,
    timelineStepsComputed: Array,
    loading: Boolean,
    errorAlCargar: [String, Object],
    getStatusChipClassTextual: Function
  },
  methods: {
    download() {
      const event =
        this.modalType === 'orden'
          ? 'descargar-orden-excel-individual'
          : 'descargar-guia-excel-individual'

      this.$emit(event, this.modalData)
    }
  }
}
</script>

<style scoped>
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
  background-color: var(--estado-neutral-bg);
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

.completed .timeline-icon-container {
  background-color: var(--estado-entregado);
  color: white;
}

.current .timeline-icon-container {
  background-color: #2196f3;
  color: white;
  animation: pulse 2s infinite;
}

.current-bad .timeline-icon-container {
  background-color: #f44336;
  color: white;
  animation: pulse 2s infinite;
}

.completed + .timeline-step:not(.completed) .timeline-line {
  background: linear-gradient(to bottom, var(--estado-entregado), var(--estado-neutral-bg));
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(33,150,243,0.4); }
  70% { box-shadow: 0 0 0 10px rgba(33,150,243,0); }
  100% { box-shadow: 0 0 0 0 rgba(33,150,243,0); }
}

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

.timeline-step.pendiente .timeline-icon-container,
.timeline-line.pendiente { background-color: var(--estado-pendiente); color: #fff; }
.timeline-step.pendiente::before { background-color: var(--estado-pendiente); }
.timeline-step.preparada .timeline-icon-container,
.timeline-line.preparada { background-color: var(--estado-preparada); color: #fff; }
.timeline-step.preparada::before { background-color: var(--estado-preparada); }
.timeline-step.despachada .timeline-icon-container,
.timeline-line.despachada { background-color: var(--estado-despachada); color: #fff; }
.timeline-step.despachada::before { background-color: var(--estado-despachada); }
.timeline-step.entregado .timeline-icon-container,
.timeline-line.entregado { background-color: var(--estado-entregado); color: #fff; }
.timeline-step.entregado::before { background-color: var(--estado-entregado); }
.chip-pendiente { background-color: var(--estado-pendiente); color: #fff; }
.chip-preparada { background-color: var(--estado-preparada); color: #fff; }
.chip-despachada { background-color: var(--estado-despachada); color: #fff; }
.chip-entregado { background-color: var(--estado-entregado); color: #fff; }
</style>

