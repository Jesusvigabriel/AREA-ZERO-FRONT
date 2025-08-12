<template>
  <img 
    :src="require('@/assets/icons/stock-total.svg')" 
    alt="Stock"
    class="stock-icon"
  />
</template>

<script>
export default {
  name: 'StockIcon'
}
</script>

<style scoped>
.stock-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  vertical-align: middle;
}
</style>
