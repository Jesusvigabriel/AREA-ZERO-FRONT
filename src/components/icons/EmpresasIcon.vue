<template>
  <img 
    :src="require('@/assets/icons/factory.svg')" 
    alt="Empresas"
    class="empresas-icon"
  />
</template>

<script>
export default {
  name: 'EmpresasIcon'
}
</script>

<style scoped>
.empresas-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  vertical-align: middle;
}
</style>
