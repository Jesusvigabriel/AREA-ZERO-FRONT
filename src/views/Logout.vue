<template>
    <h1>Logout</h1>
</template>

<script>

import store from '../store'
import router from '../router'

export default {
    name: 'Logout',
    created() {
        store.dispatch('actualizarTituloPrincipal', 'Cerrando sesión')
        store.dispatch('usuarios/desloggear')
    }

}
</script>