<template>
  <img 
    :src="require('@/assets/icons/atrasicono.svg')" 
    alt="Volver atrás"
    class="atras-icon"
  />
</template>

<script>
export default {
  name: 'AtrasIcon'
}
</script>

<style scoped>
.atras-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  vertical-align: middle;
}
</style>
