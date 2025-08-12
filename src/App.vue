<template>
  <v-app>
    <v-main>
      <!-- Snackbar global -->
      <LSIMensajes />

      <!-- Diálogo de confirmación / alertDialog -->
      <LSIDialog
        v-model="alertDialog.visible"
        :titulo="alertDialog.titulo"
        :mensaje="alertDialog.mensaje"
        :boton-primario="alertDialog.botonPrimario"
        :boton-secundario="alertDialog.botonSecundario"
        @primario="onDialogConfirm"
        @secundario="onDialogCancel"
      />

      <MenuPrincipal :tituloPrincipal="TituloMenuPrincipal" class="py-0" />
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import MenuPrincipal from './components/MenuPrincipal'
import LSIMensajes  from 'vue-lsi-util'
import { LSIDialog } from 'vue-lsi-util'
import { mapState }  from 'vuex'
import store        from './store'
import router       from './router'
import axios        from 'axios'

export default {
  name: 'App',
  components: {
    MenuPrincipal,
    LSIMensajes,
    LSIDialog
  },
  computed: {
    ...mapState({
      // título principal que se muestra en el menú
      TituloPrincipal: state => state.TituloPrincipal,
      // snackbar
      textoAMostrar:   state => state.snackbar.textoAMostrar,
      // overlay de carga
      cartelAMostrar:  state => state.loading.cartelAMostrar,
      // TODO el objeto de diálogo, no solo el texto
      alertDialog:     state => state.alertDialog
    }),
    TituloMenuPrincipal() {
      return this.TituloPrincipal
    }
  },
  methods: {
    // Estos métodos se llaman automáticamente cuando
    // el usuario pulsa cualquiera de los dos botones
    onDialogConfirm() {
      this.$store.dispatch('alertDialog/ocultar', this.alertDialog.botonPrimario)
    },
    onDialogCancel() {
      this.$store.dispatch('alertDialog/ocultar', this.alertDialog.botonSecundario)
    }
  },
  created() {
    // Inicializa tu API y usuario loggeado igual que antes
    const DatosAPI = JSON.parse(process.env.VUE_APP_API)
    store.dispatch('usuarios/actualizarDatosAPI', DatosAPI)

    axios.defaults.baseURL = process.env.VUE_APP_API_URL
    if (typeof sessionStorage.usuarioLoggeado !== 'undefined') {
      store.dispatch('usuarios/actualizar', {
        Loggeado:  true,
        Nombre:    sessionStorage.usuarioNombre,
        Id:        sessionStorage.usuarioId,
        IdEmpresa: sessionStorage.idEmpresa
      })
      router.replace('/home')
    }
  },
  watch: {
    '$route'(to) {
      document.title = to.meta.tituloPagina || process.env.VUE_APP_Nombre
    }
  }
}
</script>

<style scoped>
/* aquí tus estilos scoped para App.vue */
</style>
