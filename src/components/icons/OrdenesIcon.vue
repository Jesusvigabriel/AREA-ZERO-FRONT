<template>
  <img 
    :src="require('@/assets/icons/ordenes_icon.svg')" 
    alt="Órdenes"
    class="ordenes-icon"
  />
</template>

<script>
export default {
  name: 'OrdenesIcon'
}
</script>

<style scoped>
.ordenes-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  vertical-align: middle;
}
</style>
