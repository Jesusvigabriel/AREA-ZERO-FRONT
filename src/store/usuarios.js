import store from '../store'
import axios from "axios"
import router from '../router'
import usuariosV3 from '../store/usuariosV3'

const usuarios = {
    namespaced: true,
    state: {
        usuarioActual: {Loggeado: false, Nombre: '', IdEmpresa: '', Id: ''},
        API: null,
    },
    mutations: {
        actualizarDatosAPI(state, payload) {
            state.API = payload
        },
        actualizar(state, payload) {
            state.usuarioActual = payload
        },
        desloggear(state) {
            state.usuarioActual = {Loggeado: false, Nombre: '', IdEmpresa: '', Id: ''}
        },
        loggear(state, payload) {
            state.usuarioActual = {
                Loggeado: true, 
                Nombre: payload.Usuario, 
                IdEmpresa: payload.IdEmpresa, 
                Empresa: payload.Empresa, 
                Id: payload.Id
            }
        },
    },
    actions: {
        actualizarDatosAPI(state, payload) {
            this.commit("usuarios/actualizarDatosAPI", payload)  
        },
        actualizar(state, payload) {
            this.commit('usuarios/actualizar', payload)
        },
        desloggear(state) {
            this.commit('usuarios/desloggear')
            sessionStorage.removeItem("usuarioLoggeado")
            sessionStorage.removeItem("usuarioNombre")
            sessionStorage.removeItem("usuarioId")
            sessionStorage.removeItem("idEmpresa")
            router.push("/")
        },
        async loginWithGoogle({ commit }, token) {
            store.dispatch('loading/mostrar', {titulo: 'Verificando con Google'})
            
            try {
                const usuario = await usuariosV3.loginWithGoogle(token)
                
                if (usuario.IdEmpresa <= 0 || usuario.Empresa.AutogestionHabilitada) {
                    commit('loggear', usuario)
                    sessionStorage.usuarioLoggeado = true
                    sessionStorage.usuarioNombre = usuario.Usuario
                    sessionStorage.usuarioId = usuario.Id
                    sessionStorage.idEmpresa = usuario.IdEmpresa
                    router.push("/")
                } else {
                    store.dispatch('snackbar/mostrar', "Empresa no habilitada para autogestión")
                }
            } catch (error) {
                store.dispatch('snackbar/mostrar', error.message || "Error en autenticación con Google")
            } finally {
                store.dispatch('loading/ocultar')
            }
        },
        async intentarLoggearse(state, payload) {
            store.dispatch('loading/mostrar', {titulo: 'Verificando credenciales'})

            usuariosV3.getByUsernameAndPassword(payload.Username, payload.Password)
                .then(datos => {
                    if (datos.IdEmpresa <= 0 || datos.Empresa.AutogestionHabilitada) {
                        this.commit('usuarios/loggear', datos)
                        sessionStorage.usuarioLoggeado = true
                        sessionStorage.usuarioNombre = datos.Usuario
                        sessionStorage.usuarioId = datos.Id
                        sessionStorage.idEmpresa = datos.IdEmpresa
                        router.push("/")
                    } else {
                        store.dispatch('snackbar/mostrar', "Empresa no habilitada para autogestión")     
                    }
                })
                .catch(error => {
                    store.dispatch('snackbar/mostrar', error)
                })
                .finally(() => {
                    store.dispatch('loading/ocultar')        
                })
        }
    }
}

export default usuarios