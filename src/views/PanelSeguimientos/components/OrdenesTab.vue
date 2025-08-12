<template>
  <v-card-text>
    <v-toolbar flat dense class="header-menubar">
      <v-toolbar-title class="subtitle-1 font-weight-medium">
        Seguimiento de Órdenes
      </v-toolbar-title>
    </v-toolbar>

    <div v-if="loading" class="text-center py-10">
      <v-progress-circular indeterminate size="40" color="primary" />
      <div class="mt-2">
        <span class="body-2 text--secondary">
          Cargando órdenes...
        </span>
      </div>
    </div>

    <div v-else-if="errorAlCargar" class="text-center py-10">
      <v-icon size="36" color="error">mdi-alert-circle-outline</v-icon>
      <div class="mt-2">
        <span class="body-2 text--error">
          {{ errorAlCargar }}
        </span>
      </div>
    </div>

    <div v-else-if="idEmpresa <= 0" class="text-center py-10">
      <v-icon size="36" color="grey">mdi-office-building</v-icon>
      <div class="mt-2">
        <span class="body-2 text--secondary">
          Seleccione una empresa para ver sus órdenes.
        </span>
      </div>
    </div>

    <div v-else>
      <v-row align="center" justify="space-between" class="mb-4">
        <v-col cols="12" md="6" class="d-flex align-center">
          <v-text-field
            v-model="localTextoBusqueda"
            append-icon="mdi-magnify"
            label="Buscar órdenes..."
            dense
            outlined
            clearable
            class="flex-grow-1 search-field"
          />
          <v-btn icon @click="$emit('descargar-ordenes-excel')">
            <v-icon>mdi-download</v-icon>
          </v-btn>
        </v-col>

        <v-col cols="12" md="3">
          <v-select
            v-model="localItemsPerPage"
            :items="itemsPerPageOptions"
            label="Filas por página"
            dense
            outlined
            hide-details
          />
        </v-col>
      </v-row>

      <v-data-table
        :headers="cabecerasOrdenes"
        :items="ordenesFiltradasParaTabla"
        :search="localTextoBusqueda"
        item-key="IdOrden"
        :items-per-page="localItemsPerPage"
        class="elevation-1"
        dense
        hide-default-footer
        header-class="blue-header"
      >
        <template v-slot:item.Numero="{ item }">
          <span class="body-2 font-weight-bold">
            {{ item.Numero }}
          </span>
        </template>

        <template v-slot:item.NombreDestino="{ item }">
          <span class="body-2">{{ item.NombreDestino || 'N/A' }}</span>
        </template>

        <template v-slot:item.Fecha="{ item }">
          <span class="body-2">{{ item.FechaFormateada || 'N/A' }}</span>
        </template>

        <template v-slot:item.Estado="{ item }">
          <v-chip :class="getStatusChipClassTextual(item.NombreEstado || item.Estado)" small>
            {{ item.NombreEstado || item.Estado }}
          </v-chip>
        </template>

        <template v-slot:item.acciones="{ item }">
          <v-btn
            icon
            small
            @click="$emit('open-modal', 'orden', item.IdOrden)"
            :aria-label="`Ver detalles orden ${item.Numero}`"
          >
            <v-icon color="primary">mdi-eye-outline</v-icon>
          </v-btn>

          <v-chip
            v-if="item.NombreEstado === 'A distribución' && item.IdGuia > 0"
            small
            class="ml-2"
            color="green lighten-4"
            text-color="green darken-4"
            @click="$emit('ver-guia-asociada', item)"
            title="Haz clic para ver el seguimiento de la guía asociada"
            label
          >
            Seguimiento aquí
            <v-icon right small>mdi-truck-check-outline</v-icon>
          </v-chip>
        </template>

        <template v-slot:footer.prepend>
          <v-row align="center" justify="space-between" class="px-4">
            <v-col cols="12" md="6">
              <v-pagination
                v-model="localPageOrdenes"
                :length="pageCountOrdenes"
                prev-icon="mdi-chevron-left"
                next-icon="mdi-chevron-right"
                circle
                dense
              />
            </v-col>
            <v-col cols="12" md="6" class="text-right">
              <span class="caption text--secondary">
                Mostrando {{ paginationInfoOrdenes }}
              </span>
            </v-col>
          </v-row>
        </template>

        <template v-slot:no-data>
          <v-alert type="warning" dense text>
            No se encontraron órdenes para los filtros seleccionados.
          </v-alert>
        </template>
      </v-data-table>
    </div>
  </v-card-text>
</template>

<script>
export default {
  name: 'OrdenesTab',
  props: {
    cabecerasOrdenes: Array,
    ordenesFiltradasParaTabla: Array,
    pageOrdenes: Number,
    pageCountOrdenes: Number,
    paginationInfoOrdenes: String,
    itemsPerPage: Number,
    itemsPerPageOptions: Array,
    textoBusqueda: String,
    idEmpresa: Number,
    loading: Boolean,
    errorAlCargar: [String, Object],
    getStatusChipClassTextual: Function
  },
  data() {
    return {
      localPageOrdenes: this.pageOrdenes,
      localItemsPerPage: this.itemsPerPage,
      localTextoBusqueda: this.textoBusqueda
    }
  },
  watch: {
    localPageOrdenes(val) {
      this.$emit('update:pageOrdenes', val)
    },
    pageOrdenes(val) {
      this.localPageOrdenes = val
    },
    localItemsPerPage(val) {
      this.$emit('update:itemsPerPage', val)
    },
    itemsPerPage(val) {
      this.localItemsPerPage = val
    },
    localTextoBusqueda(val) {
      this.$emit('update:textoBusqueda', val)
    },
    textoBusqueda(val) {
      this.localTextoBusqueda = val
    }
  }
}
</script>

<style scoped>
.blue-header th {
  background-color: var(--v-primary-base);
  color: #fff;
  font-weight: 600;
}
</style>

