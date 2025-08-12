<template>
  <img 
    :src="require('@/assets/icons/logouticono.svg')" 
    alt="Cerrar Sesión"
    class="logout-icon"
  />
</template>

<script>
export default {
  name: 'LogoutIcon'
}
</script>

<style scoped>
.logout-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  vertical-align: middle;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.logout-icon:hover {
  opacity: 1;
}
</style>
