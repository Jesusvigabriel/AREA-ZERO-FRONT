<template>
  <img 
    :src="require('@/assets/icons/transporteicono.svg')" 
    alt="Transporte"
    class="transporte-icon"
  />
</template>

<script>
export default {
  name: 'TransporteIcon'
}
</script>

<style scoped>
.transporte-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  vertical-align: middle;
}
</style>
