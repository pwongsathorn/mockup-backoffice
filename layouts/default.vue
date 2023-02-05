<template lang="pug">
  v-app.overflow-hidden
    layout-alert(ref="noti" id="noti" :typeAlert="alertType" :description="alertDescription")
    client-only
      layout-app-bar(:clipped="clipped" :miniVariant="miniVariant" :title="title" @toggle="toggleSidebar")
      layout-sidebar-menu(:clipped="clipped" v-model="drawer" :items="menuList")
    v-main#content-container.grey.lighten-4.pt-0.pr-1.overflow-auto
      v-container.pa-2.pa-sm-6
        nuxt
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'DefaultLayout',
  data () {
    return {
      drawer: false,
      clipped: false,
      title: 'Vuetify.js'
    }
  },
  computed: {
    ...mapState({
      miniVariant: state => state.menu.miniVariant,
      menuList: state => state.menu.menuList
    })
  },
  mounted () {
    if (this.$vuetify.breakpoint.mdAndUp) {
      this.drawer = true
    }
  },
  methods: {
    toggleSidebar () {
      this.drawer = !this.drawer
    }
  }
}
</script>

<style lang="scss" scoped>
#content-container {
  overflow-x: hidden;
  margin-top: $navbarHeight;
  height: calc(100vh - #{$navbarHeight});
}
</style>
