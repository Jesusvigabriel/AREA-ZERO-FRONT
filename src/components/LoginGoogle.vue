<template>
  <v-btn 
    block 
    large 
    class="google-btn"
    @click="loginWithGoogle"
    depressed
    height="48"
    :disabled="loading"
    :loading="loading"
  >
    <div class="btn-content">
      <svg class="google-logo" viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 13.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V6.07H2.18C1.43 7.55 1 9.22 1 11s.43 3.45 1.18 4.93l3.66-2.83z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.93l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      <span class="btn-text">Cuenta de Google</span>
    </div>
    
    <template v-slot:loader>
      <v-progress-circular
        indeterminate
        size="24"
        color="primary"
      ></v-progress-circular>
    </template>
  </v-btn>
</template>

<script>
import { auth, provider } from '@/firebase-config'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'

export default {
  data: () => ({
    loading: false
  }),
  methods: {
    async loginWithGoogle() {
      this.loading = true
      try {
        const result = await signInWithPopup(auth, provider)
        const credential = GoogleAuthProvider.credentialFromResult(result)
        
        if (!credential) {
          throw new Error('No se pudo obtener credencial de Google')
        }

        const token = await result.user.getIdToken()
        
        if (!token) {
          throw new Error('Error al generar token de autenticación')
        }

        await this.$store.dispatch('usuarios/loginWithGoogle', token)
        
      } catch (error) {
        let errorMessage = 'Error al iniciar sesión con Google'
        
        // Manejo específico de errores de Firebase
        if (error.code) {
          switch (error.code) {
            case 'auth/popup-closed-by-user':
              errorMessage = 'El popup de autenticación se cerró antes de completar el login'
              break
            case 'auth/network-request-failed':
              errorMessage = 'Error de red. Verifica tu conexión a internet'
              break
            case 'auth/account-exists-with-different-credential':
              errorMessage = 'Este email ya está registrado con otro método de autenticación'
              break
          }
        }
        
        // Log para desarrollo
        console.error('Error Google Auth:', {
          code: error.code,
          message: error.message,
          email: error.customData?.email
        })

        this.$store.dispatch('snackbar/mostrar', {
          mensaje: errorMessage,
          color: 'error',
          timeout: 5000
        })
        
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.google-btn {
  background-color: #FFFFFF !important; /* Fondo blanco para el modo claro */
  border: 1px solid #dadce0 !important; /* Borde sutil */
  border-radius: 4px !important;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12) !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  color: #3c4043 !important; /* Texto oscuro para contraste */
}

/* Estilos específicos para modo oscuro */
.theme--dark .google-btn {
  background-color: transparent !important;
  border: 1px solid rgba(255, 255, 255, 0.7) !important;
  color: #f4fafe !important;
}

/* Efecto hover para modo claro */
.google-btn:hover:not(.theme--dark) {
  box-shadow: 0 2px 6px rgba(0,0,0,0.18) !important;
  opacity: 0.9;
}

/* Efecto hover para modo oscuro */
.theme--dark .google-btn:hover {
  background-color: rgba(255, 255, 255, 0.08) !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
}

.google-btn:active {
  transform: translateY(1px);
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 0 16px;
}

.google-logo {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  background-color: transparent !important;
  border-radius: 2px;
  filter: none !important;
}

.btn-text {
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.25px;
}

/* Texto en modo claro */
:not(.theme--dark) .btn-text {
  color: #3c4043 !important; /* Texto oscuro para mejor contraste con el fondo blanco */
}

/* Texto en modo oscuro */
.theme--dark .btn-text {
  color: #f4fafe !important;
}

/* Asegurar que el botón de Google herede los estilos del tema */
:deep(.v-btn) {
  text-transform: none !important;
  letter-spacing: 0.5px !important;
  font-weight: 500 !important;
}
</style>