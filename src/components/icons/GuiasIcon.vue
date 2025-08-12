<template>
  <img 
    :src="require('@/assets/icons/iconoguias.svg')" 
    alt="Guías"
    class="guias-icon"
  />
</template>

<script>
export default {
  name: 'GuiasIcon'
}
</script>

<style scoped>
.guias-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  vertical-align: middle;
}
</style>
