<template>
  <v-card-text>
    <v-toolbar flat dense class="header-menubar">
      <v-toolbar-title class="subtitle-1 font-weight-medium">
        Seguimiento de Guías
      </v-toolbar-title>
    </v-toolbar>

    <div v-if="loading" class="text-center py-10">
      <v-progress-circular indeterminate size="40" color="primary" />
      <div class="mt-2">
        <span class="body-2 text--secondary">
          Cargando guías...
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
          Seleccione una empresa para ver sus guías.
        </span>
      </div>
    </div>

    <div v-else>
      <v-row align="center" justify="space-between" class="mb-4">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="localTextoBusqueda"
            append-icon="mdi-magnify"
            label="Buscar guías..."
            dense
            outlined
            clearable
            class="search-field"
          />
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
        :headers="cabecerasGuias"
        :items="guiasFiltradasParaTabla"
        :search="localTextoBusqueda"
        item-key="Id"
        :items-per-page="localItemsPerPage"
        class="elevation-1"
        dense
        hide-default-footer
        header-class="blue-header"
      >
        <template v-slot:item.Comprobante="{ item }">
          <span class="body-2 font-weight-bold">
            {{ item.Comprobante }}
          </span>
        </template>

        <template v-slot:item.NombreCliente="{ item }">
          <span class="body-2">{{ item.NombreCliente || 'N/A' }}</span>
        </template>

        <template v-slot:item.NombreDestino="{ item }">
          <span class="body-2">{{ item.NombreDestino || 'N/A' }}</span>
        </template>

        <template v-slot:item.Remitos="{ item }">
          <span class="body-2">{{ item.Remitos || 'N/A' }}</span>
        </template>

        <template v-slot:item.FechaOriginal="{ item }">
          <span class="body-2">{{ item.FechaOriginal }}</span>
        </template>

        <template v-slot:item.Estado="{ item }">
          <v-chip :class="getStatusChipClassTextual(item.Estado)" small>
            {{ item.Estado }}
          </v-chip>
        </template>

        <template v-slot:item.acciones="{ item }">
          <v-btn
            icon
            small
            @click="$emit('open-modal', 'guia', item)"
            :aria-label="`Ver detalles guía ${item.Comprobante}`"
          >
            <v-icon color="primary">mdi-eye-outline</v-icon>
          </v-btn>
        </template>

        <template v-slot:footer.prepend>
          <v-row align="center" justify="space-between" class="px-4">
            <v-col cols="12" md="6">
              <v-pagination
                v-model="localPageGuias"
                :length="pageCountGuias"
                prev-icon="mdi-chevron-left"
                next-icon="mdi-chevron-right"
                circle
                dense
              />
            </v-col>
            <v-col cols="12" md="6" class="text-right">
              <span class="caption text--secondary">
                Mostrando {{ paginationInfoGuias }}
              </span>
            </v-col>
          </v-row>
        </template>

        <template v-slot:no-data>
          <v-alert type="warning" dense text>
            No se encontraron guías para los filtros seleccionados.
          </v-alert>
        </template>
      </v-data-table>
    </div>
  </v-card-text>
</template>

<script>
export default {
  name: 'GuiasTab',
  props: {
    cabecerasGuias: Array,
    guiasFiltradasParaTabla: Array,
    pageGuias: Number,
    pageCountGuias: Number,
    paginationInfoGuias: String,
    itemsPerPageGuias: Number,
    itemsPerPageOptions: Array,
    textoBusquedaGuias: String,
    idEmpresa: Number,
    loading: Boolean,
    errorAlCargar: [String, Object],
    getStatusChipClassTextual: Function
  },
  data() {
    return {
      localPageGuias: this.pageGuias,
      localItemsPerPage: this.itemsPerPageGuias,
      localTextoBusqueda: this.textoBusquedaGuias
    }
  },
  watch: {
    localPageGuias(val) {
      this.$emit('update:pageGuias', val)
    },
    pageGuias(val) {
      this.localPageGuias = val
    },
    localItemsPerPage(val) {
      this.$emit('update:itemsPerPageGuias', val)
    },
    itemsPerPageGuias(val) {
      this.localItemsPerPage = val
    },
    localTextoBusqueda(val) {
      this.$emit('update:textoBusquedaGuias', val)
    },
    textoBusquedaGuias(val) {
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

