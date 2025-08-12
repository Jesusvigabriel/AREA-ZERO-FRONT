<template>
  <v-dialog v-model="show" scrollable max-width="650px">
    <v-card class="rounded-card">
      <v-card-title class="justify-space-between">
        <span class="text-h6">Detalle Conforme de entrega: {{ guia?.Comprobante }}</span>
        <v-btn icon @click="$emit('close')" aria-label="Cerrar detalle">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-list dense>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="subtitle-2 font-weight-medium">
                N° Guía:
              </v-list-item-title>
              <v-list-item-subtitle>{{ guia?.Comprobante }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="subtitle-2 font-weight-medium">
                Destino:
              </v-list-item-title>
              <v-list-item-subtitle>{{ guia?.NombreDestino }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="subtitle-2 font-weight-medium">
                Bultos:
              </v-list-item-title>
              <v-list-item-subtitle>{{ guia?.Bultos }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="subtitle-2 font-weight-medium">
                Remitos:
              </v-list-item-title>
              <v-list-item-subtitle>{{ guia?.Remitos }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="subtitle-2 font-weight-medium">
                Fecha Entrega:
              </v-list-item-title>
              <v-list-item-subtitle>{{ guia?.FechaEntrega }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="subtitle-2 font-weight-medium">
                Fecha Creación:
              </v-list-item-title>
              <v-list-item-subtitle>{{ guia?.FechaOriginal }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="subtitle-2 font-weight-medium">
                Estado:
              </v-list-item-title>
              <v-list-item-subtitle>
                <v-chip :class="getStatusChipClassTextual(guia?.Estado)" small>
                  {{ guia?.Estado }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-img v-if="fotoUrl" :src="fotoUrl" max-width="100%" class="mt-4" />
        <v-alert v-else type="info" dense text>
          Aún no se cargó la foto de entrega
        </v-alert>
      </v-card-text>
      <v-divider />
      <v-card-actions class="justify-end">
        <v-btn color="primary" text @click="$emit('descargar', { guia, foto: fotoUrl })">Descargar PDF</v-btn>
        <v-btn text color="primary" @click="$emit('close')">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import guias from '@/store/guias'

export default {
  name: 'GuiaEmpresaModal',
  props: {
    show: Boolean,
    guia: Object,
    getStatusChipClassTextual: Function
  },
  data() {
    return { fotoUrl: null }
  },
  watch: {
    show(val) {
      if (val) this.fetchFoto()
    },
    guia() {
      if (this.show) this.fetchFoto()
    }
  },
  methods: {
    async fetchFoto() {
      this.fotoUrl = null
      if (!this.guia) return
      try {
        const res = await guias.getFotosDocumentacionEntrega(this.guia.Id)
        if (Array.isArray(res) && res.length > 0) {
          const hash = res[0].Hash
          this.fotoUrl = `https://a54-choferes-fotos-documentacion-entrega.s3.amazonaws.com/a54_cfde_${this.guia.Id}_${hash}`
        }
      } catch (e) {
        console.error('Error cargando foto', e)
      }
    }
  }
}
</script>

<style scoped>
</style>
