<template>
  <v-card class="elevation-3 mt-8">
    <v-card-title class="d-flex align-center">
      <span>Reglas de Envío Automático</span>
      <v-spacer></v-spacer>
      <v-btn color="primary" :disabled="!idEmpresa" @click="abrirDialogoNuevaRegla">
        <v-icon left>mdi-plus</v-icon> Nueva Regla
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-data-table :headers="headers" :items="reglas" :loading="cargando" class="elevation-1">
        <template v-slot:item.proceso="{ item }">
          <span>{{ item.Proceso }}</span>
        </template>
        <template v-slot:item.emailServer="{ item }">
          <span>{{ item.NombreServidor || item.IdEmailServer }}</span>
        </template>
        <template v-slot:item.emailTemplate="{ item }">
          <span>{{ item.NombrePlantilla || item.IdEmailTemplate }}</span>
        </template>
        <template v-slot:item.destinatarios="{ item }">
          <span>{{ item.Destinatarios }}</span>
        </template>
        <template v-slot:item.activo="{ item }">
          <v-switch v-model="item.Activo" @change="toggleActivo(item)" color="success" dense></v-switch>
        </template>
        <template v-slot:item.acciones="{ item }">
          <v-btn icon small @click="editarRegla(item)"><v-icon>mdi-pencil</v-icon></v-btn>
          <v-btn icon small @click="eliminarRegla(item)"><v-icon color="error">mdi-delete</v-icon></v-btn>
          <v-btn icon small color="success" @click="abrirDialogoProbarEnvio(item)"><v-icon>mdi-email-fast</v-icon></v-btn>
          <v-btn icon small @click="abrirDialogoProbarEnvio(item)"><v-icon>mdi-email-send</v-icon></v-btn>
        </template>
      </v-data-table>
      <v-alert v-if="!cargando && !reglas.length" type="info" class="mt-4" outlined dense>
        No hay reglas configuradas para esta empresa.
      </v-alert>
      <!-- Diálogo para probar envío -->
      <v-dialog v-model="dialogoProbarEnvio" max-width="500px">
        <v-card>
          <v-card-title>Probar Envío de Correo</v-card-title>
          <v-card-text>
            <div v-if="reglaAProbar">
              <div class="mb-2">Puedes ingresar un destinatario alternativo para la prueba:</div>
              <v-text-field v-model="destinatarioTest" label="Correo destinatario de prueba" :placeholder="reglaAProbar.Destinatarios || ''" />
              <div class="mt-2 text-caption grey--text">Si dejas vacío, se usará el/los destinatarios de la regla.</div>
            </div>
            <v-alert v-if="mensajeProbarEnvio" :type="resultadoProbarEnvio ? 'success' : 'error'" dense class="mt-2">{{ mensajeProbarEnvio }}</v-alert>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="cerrarDialogoProbarEnvio">Cancelar</v-btn>
            <v-btn color="success" @click="probarEnvio" :loading="enviandoPrueba" :disabled="enviandoPrueba">Probar envío</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-text>
    <v-dialog v-model="dialogoRegla" max-width="600px">
      <v-card>
        <v-card-title>{{ reglaEditando.Id ? 'Editar' : 'Nueva' }} Regla de Envío Automático</v-card-title>
        <v-card-text>
          <v-form ref="formRegla">
            <v-select
              v-model="reglaEditando.Proceso"
              :items="procesos"
              label="Proceso"
              :disabled="!!reglaEditando.Id"
              required
            />
            <v-select
              v-model="reglaEditando.IdEmailServer"
              :items="servidores"
              label="Servidor SMTP"
              item-text="Nombre"
              item-value="Id"
              required
            />
            <v-select
              v-model="reglaEditando.IdEmailTemplate"
              :items="plantillas"
              label="Plantilla"
              item-text="Titulo"
              item-value="Id"
              required
            />
            <v-text-field
              v-model="reglaEditando.Destinatarios"
              label="Destinatarios"
              hint="Separar por coma o elegir rol"
              persistent-hint
              :rules="[validarDestinatarios]"
            />
            <div v-if="contactosPorDefecto.length" class="mb-2">
              <v-chip
                v-for="(c, i) in contactosPorDefecto"
                :key="i"
                color="primary"
                text-color="white"
                small
                class="mr-1"
              >
                {{ c }}
              </v-chip>
              <span class="caption grey--text">(Si no se especifican destinatarios, se usarán estos contactos de la empresa)</span>
            </div>
            <div class="caption grey--text mb-2">
              Si no se especifican destinatarios, se enviará el correo a los contactos por defecto de la empresa.
            </div>
            <v-switch v-model="reglaEditando.Activo" label="Activo" color="success" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="cerrarDialogoRegla">Cancelar</v-btn>
          <v-btn color="primary" @click="guardarRegla">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import API from 'vue-lsi-util/APIAccesoV2'

export default {
  name: 'EmailProcesoConfigSection',
  props: {
    idEmpresa: {
      type: [String, Number],
      required: true
    },
    servidores: {
      type: Array,
      required: true
    },
    plantillas: {
      type: Array,
      required: true
    },
    procesos: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      contactosPorDefecto: [],
      dialogoRegla: false,
      reglaEditando: {},
      dialogoProbarEnvio: false,
      reglaAProbar: null,
      destinatarioTest: '',
      enviandoPrueba: false,
      mensajeProbarEnvio: '',
      resultadoProbarEnvio: false,
      headers: [
        { text: 'Proceso', value: 'proceso' },
        { text: 'Servidor SMTP', value: 'emailServer' },
        { text: 'Plantilla', value: 'emailTemplate' },
        { text: 'Destinatarios', value: 'destinatarios' },
        { text: 'Activo', value: 'activo', align: 'center' },
        { text: '', value: 'acciones', sortable: false, align: 'center' }
      ]
    }
  },
  computed: {
    ...mapGetters('emailProcesoConfig', ['reglas', 'cargando'])
  },
  watch: {
    idEmpresa: {
      immediate: true,
      handler(val) {
        if (val) this.cargarReglas(val)
      }
    }
  },
  methods: {
    ...mapActions('emailProcesoConfig', ['cargarReglas', 'crearRegla', 'actualizarRegla', 'eliminarRegla']),
    async abrirDialogoNuevaRegla() {
      this.reglaEditando = { IdEmpresa: this.idEmpresa, Activo: true }
      this.dialogoRegla = true
      await this.obtenerContactosPorDefecto()
    },
    async editarRegla(regla) {
      this.reglaEditando = { ...regla }
      this.dialogoRegla = true
      await this.obtenerContactosPorDefecto()
    },
    cerrarDialogoRegla() {
      this.dialogoRegla = false
      this.reglaEditando = {}
      this.contactosPorDefecto = []
    },
    async obtenerContactosPorDefecto() {
      // Traer contactos de la empresa
      if (!this.idEmpresa) return
      try {
        const mod = await import('@/store/empresasV3')
        const empresa = await mod.default.getOne(this.idEmpresa)
        this.contactosPorDefecto = []
        if (empresa?.ContactoDeposito) this.contactosPorDefecto.push(empresa.ContactoDeposito)
        if (empresa?.ContactoOficina) this.contactosPorDefecto.push(empresa.ContactoOficina)
      } catch (e) {
        this.contactosPorDefecto = []
      }
    },
    validarDestinatarios(val) {
      if (!val || !val.trim()) return true // vacío es válido (usa por defecto)
      const emails = val.split(',').map(e => e.trim()).filter(e => e)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      for (const email of emails) {
        if (!emailRegex.test(email)) return 'Correo inválido: ' + email
      }
      return true
    },
    async guardarRegla() {
      if (!this.reglaEditando.Proceso || !this.reglaEditando.IdEmailServer || !this.reglaEditando.IdEmailTemplate) return
      if (this.reglaEditando.Id) {
        await this.actualizarRegla(this.reglaEditando)
      } else {
        await this.crearRegla(this.reglaEditando)
      }
      this.cerrarDialogoRegla()
    },
    async eliminarRegla(regla) {
      if (confirm('¿Eliminar esta regla?')) {
        await this.$store.dispatch('emailProcesoConfig/eliminarRegla', { id: regla.Id, idEmpresa: this.idEmpresa })
      }
    },
    async toggleActivo(regla) {
      await this.actualizarRegla({ ...regla, Activo: !!regla.Activo })
    },
    async abrirDialogoProbarEnvio(regla) {
      this.reglaAProbar = regla
      this.destinatarioTest = ''
      this.mensajeProbarEnvio = ''
      this.resultadoProbarEnvio = false
      this.dialogoProbarEnvio = true
    },
    cerrarDialogoProbarEnvio() {
      this.dialogoProbarEnvio = false
      this.reglaAProbar = null
      this.destinatarioTest = ''
      this.mensajeProbarEnvio = ''
      this.resultadoProbarEnvio = false
      this.enviandoPrueba = false
    },
    async probarEnvio() {
      if (!this.reglaAProbar) return
      this.enviandoPrueba = true
      this.mensajeProbarEnvio = ''
      this.resultadoProbarEnvio = false
      try {
        // Usar ruta relativa, sin /apiv3 al inicio
        const resultado = await API.acceder({
          Ruta: `/emailProcesoConfig/${this.reglaAProbar.Id}/probar`,
          Metodo: 'POST',
          Body: { destinatarioTest: this.destinatarioTest }
        })
        if (resultado.data && resultado.data.exito) {
          this.mensajeProbarEnvio = resultado.data.mensaje || '¡Correo de prueba enviado con éxito!'
          this.resultadoProbarEnvio = true
        } else {
          this.mensajeProbarEnvio = (resultado.data && resultado.data.mensaje) || 'Error desconocido al probar el envío.'
          this.resultadoProbarEnvio = false
        }
      } catch (error) {
        this.mensajeProbarEnvio = 'Error al conectar con el servidor'
        this.resultadoProbarEnvio = false
      } finally {
        this.enviandoPrueba = false
      }
    }
  }
}
</script>
