<template>
  <img 
    :src="require('@/assets/icons/barcodeicono.svg')" 
    alt="Código de Barras"
    class="barcode-icon"
  />
</template>

<script>
export default {
  name: 'BarcodeIcon'
}
</script>

<style scoped>
.barcode-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  vertical-align: middle;
}
</style>
