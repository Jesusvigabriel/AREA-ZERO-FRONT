<template>
  <!-- Estructura principal de la aplicación -->
  <v-app>
    <!-- Contenedor principal con fondo gris claro u oscuro según tema -->
    <v-main :class="['login-bg', { 'modo-dark': $vuetify.theme.dark }]">
      <v-container fill-height>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="6" lg="4">
            <v-card :class="['elevation-6', 'login-card', { 'modo-dark': $vuetify.theme.dark }]">
              <!-- Barra superior con título e icono -->
              <v-toolbar flat class="header-menubar">
                <v-toolbar-title class="text-h5">Bienvenido</v-toolbar-title>
                <v-spacer />
                <v-icon large>mdi-forklift</v-icon>
              </v-toolbar>

              <!-- Cuerpo de la tarjeta con el formulario -->
              <v-card-text class="pa-6">
                <v-form
                  v-model="datosValidos"
                  ref="form"
                  @submit.prevent="iniciarSesion"
                >
                  <!-- Campo de usuario -->
                  <v-text-field
                    outlined
                    class="mb-4 input-field"
                    :class="{ 'input-dark': $vuetify.theme.dark }"
                    label="Usuario"
                    prepend-inner-icon="mdi-account-hard-hat"
                    v-model="username"
                    :rules="[rules.required, rules.min]"
                    hide-details="auto"
                    single-line
                    rounded
                  />

                  <!-- Campo de contraseña con toggle para mostrar/ocultar -->
                  <v-text-field
                    outlined
                    class="mb-6 input-field"
                    :class="{ 'input-dark': $vuetify.theme.dark }"
                    label="Contraseña"
                    prepend-inner-icon="mdi-lock"
                    v-model="password"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show1 ? 'text' : 'password'"
                    :rules="[rules.required, rules.min]"
                    @click:append="show1 = !show1"
                    hide-details="auto"
                    single-line
                    rounded
                  />

                  <!-- Botón de Ingresar -->
                  <v-btn
                    block
                    x-large
                    color="primary"
                    @click="iniciarSesion"
                    class="login-btn mt-2"
                    :disabled="!datosValidos"
                    :depressed="!$vuetify.theme.dark"
                    :outlined="$vuetify.theme.dark"
                    :loading="loading"
                  >
                    <span class="btn-text">INGRESAR</span>
                  </v-btn>

                  <!-- Divisor visual -->
                  <v-divider class="my-6" />

                  <!-- Opciones alternativas -->
                  <div class="text-center">
                    <!-- Notar que el texto cambia de color según tema -->
                    <p class="text-caption mb-3"
                      :class="{ 'secondary--text': !$vuetify.theme.dark, 'text-dark-mode': $vuetify.theme.dark }">
                      O ingresa con
                    </p>
                    <!-- Componente de login con Google -->
                    <LoginGoogle />
                    <!-- Enlace para recuperación de contraseña (¡ahora SIEMPRE se ve en ambos temas!) -->
                    <v-btn
                      text
                      small
                      color="primary"
                      class="mt-4 forgot-password"
                      @click="olvidePassword"
                    >
                      ¿Olvidaste tu contraseña?
                    </v-btn>
                  </div>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
// Importaciones necesarias para login
import store from '@/store'
import LoginGoogle from '@/components/LoginGoogle.vue'
import { auth, sendPasswordResetEmail } from '@/firebase-config'

export default {
  name: 'Login',
  components: { LoginGoogle },
  data() {
    return {
      username: '',       // Usuario ingresado
      password: '',       // Contraseña ingresada
      show1: false,       // Toggle para mostrar/ocultar contraseña
      loading: false,     // Estado de carga del botón
      datosValidos: false,// Estado de validación del formulario
      rules: {            // Reglas de validación para los campos
        required: v => !!v || 'Obligatorio',
        min:      v => v.length >= 3 || 'Mínimo 3 caracteres'
      }
    }
  },
  methods: {
    // Lógica de login, validación, errores y loading
    async iniciarSesion() {
      this.$refs.form.validate()
      if (!this.datosValidos) {
        store.dispatch('snackbar/mostrar', 'Datos incompletos')
        return
      }
      this.loading = true
      try {
        await store.dispatch('usuarios/intentarLoggearse', {
          Username: encodeURIComponent(this.username),
          Password: encodeURIComponent(this.password)
        })
      } catch (err) {
        console.error('Error al iniciar sesión:', err)
        this.$store.dispatch('alertDialog/mostrar', {
          titulo:          'Error al iniciar sesión',
          mensaje:         err.message || 'No fue posible iniciar sesión.',
          botonPrimario:   'Reintentar',
          botonSecundario: 'Cancelar',
          callback: respuesta => {
            if (respuesta === 'Reintentar') {
              this.iniciarSesion()
            }
          }
        })
      } finally {
        this.loading = false
      }
    },
    // Flujo de "Olvidaste tu contraseña", envío de mail con Firebase
    async olvidePassword() {
      const email = prompt(
        'Por favor, ingresa tu correo registrado y luego revisa tu bandeja de mail'
      )
      if (!email) return
      const actionCodeSettings = {
        url: window.location.origin + '/reset-password',
        handleCodeInApp: true
      }
      try {
        await sendPasswordResetEmail(auth, email, actionCodeSettings)
        this.$store.dispatch('alertDialog/mostrar', {
          titulo:          'Revisa tu bandeja de entrada',
          mensaje:         `Hemos enviado un correo a <b>${email}</b>.<br>¿Quieres abrir tu Gmail ahora?`,
          botonPrimario:   'Abrir Gmail',
          botonSecundario: 'Volver al login',
          callback: respuesta => {
            if (respuesta === 'Abrir Gmail') {
              window.open('https://mail.google.com', '_blank')
            }
            this.$router.push('/login')
          }
        })
      } catch (err) {
        console.error('Error al enviar mail de restablecimiento:', err)
        this.$store.dispatch('alertDialog/mostrar', {
          titulo:          'Error al enviar correo',
          mensaje:         err.code === 'auth/user-not-found'
            ? 'Email no registrado'
            : 'Error al enviar el mail de restablecimiento',
          botonPrimario:   'Reintentar',
          botonSecundario: 'Cancelar',
          callback: respuesta => {
            if (respuesta === 'Reintentar') {
              this.olvidePassword()
            }
          }
        })
      }
    }
  },
  created() {
    // Al cargar el componente, seteo el título principal del login
    store.dispatch('actualizarTituloPrincipal', 'Inicio de sesión')
  }
}
</script>

<style scoped>
/* Estilos para el botón de ingreso */
.login-btn .btn-text {
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

/* Asegurar que el botón de ingreso sea visible en modo oscuro */
.theme--dark .login-btn.v-btn--outlined {
  border: 1px solid rgba(255, 255, 255, 0.7) !important;
  color: #f4fafe !important;
}

.theme--dark .login-btn.v-btn--outlined:hover {
  background-color: rgba(255, 255, 255, 0.08) !important;
}

/* ======== ESTILOS PARA MODO CLARO ======== */
.login-bg {
  background-color: var(--login-bg);
}
.login-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1) !important;
  background-color: var(--login-card-bg);
}
.input-field {
  border-radius: 8px !important;
}
.input-field >>> .v-input__slot {
  min-height: 48px !important;
}
.login-btn {
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  height: 48px !important;
}
.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0,0,0,0.15);
}
.login-btn:active {
  transform: translateY(0);
}
.forgot-password {
  letter-spacing: 0.3px;
  /* En modo claro usa color primario (azul, por defecto) */
}

/* ======== ESTILOS PARA MODO OSCURO ======== */
.modo-dark {
  background-color: var(--login-bg) !important;
  color: #fafafa !important;
}
.modo-dark .v-card,
.modo-dark .login-card {
  background-color: var(--login-card-bg) !important;
  color: #fafafa !important;
}
.input-dark input,
.input-dark .v-input__slot,
.input-dark .v-label {
  background-color: #232323 !important;
  color: #fafafa !important;
}
.input-dark .v-input__slot {
  border-color: #444 !important;
}
.text-dark-mode {
  color: #fafafa !important;
}
/* ======= HAGO QUE EL BOTÓN "¿Olvidaste tu contraseña?" SIEMPRE SE VEA EN DARK ======= */
.modo-dark .forgot-password,
.modo-dark .v-btn--text.forgot-password {
  color: #fafafa !important;
  opacity: 0.95 !important;
  text-decoration: underline !important;
  font-weight: 600 !important;
  letter-spacing: 0.1em;
}
.modo-dark .forgot-password:hover {
  color: var(--forgot-link-hover) !important;
  text-shadow: 0 0 6px var(--forgot-link-shadow);
}
</style>

<!-- Fuentes -->
<!-- DM Sans se carga globalmente desde public/index.html -->
