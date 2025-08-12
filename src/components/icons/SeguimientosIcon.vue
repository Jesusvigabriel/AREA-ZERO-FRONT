<template>
  <img 
    :src="require('@/assets/icons/seguimientosicono.svg')" 
    alt="Seguimientos"
    class="seguimientos-icon"
  />
</template>

<script>
export default {
  name: 'SeguimientosIcon'
}
</script>

<style scoped>
.seguimientos-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  vertical-align: middle;
}
</style>
