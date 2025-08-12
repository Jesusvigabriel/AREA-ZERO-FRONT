<template>
  <img 
    :src="require('@/assets/icons/security.svg')" 
    alt="Seguridad"
    class="security-icon"
  />
</template>

<script>
export default {
  name: 'SecurityIcon'
}
</script>

<style scoped>
.security-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  vertical-align: middle;
}
</style>
