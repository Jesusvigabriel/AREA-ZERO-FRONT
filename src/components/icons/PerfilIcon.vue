<template>
  <img 
    :src="require('@/assets/icons/perfilicono.svg')" 
    alt="Perfil"
    class="perfil-icon"
  />
</template>

<script>
export default {
  name: 'PerfilIcon'
}
</script>

<style scoped>
.perfil-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  vertical-align: middle;
}
</style>
