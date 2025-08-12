<template>
  <img 
    :src="require('@/assets/icons/excelicono.svg')" 
    alt="Exportar a Excel"
    class="excel-icon"
  />
</template>

<script>
export default {
  name: 'ExcelIcon'
}
</script>

<style scoped>
.excel-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  vertical-align: middle;
}
</style>
