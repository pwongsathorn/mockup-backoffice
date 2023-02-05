<template lang="pug">
  v-app.site-wrapper
    layout-alert(ref="noti" id="noti" :typeAlert="alertType" :description="alertDescription")
    nuxt
</template>

<script>
export default {
  name: 'BlankLayout'
}
</script>

<style lang="scss" scoped>
.site-wrapper {
  min-height: 100vh;
  width: 100%;
}
</style>
