<template lang="pug">
  v-navigation-drawer#sidebar.customized-sidebar(
    :clipped="clipped"
    :fixed="$vuetify.breakpoint.mdAndup"
    app
    dark
    color="black"
    :value="value"
    :width="$vuetify.breakpoint.mdAndUp ? '256':'100vw'"
    @input="returnValue"
  )
    template(#prepend)
      .nav-prepend.text-right.pt-2.pr-2(v-if="!$vuetify.breakpoint.mdAndUp")
        v-btn(icon @click="returnValue(false)")
          v-icon#close-icon mdi-close
    .sidebar-content
      v-layout.pt-6.pb-2.px-6
        v-flex.text-center
          v-img.mx-auto(src="/images/main-logo.png" contain max-width="128")
          p.mt-2.mb-0.white--text BACK OFFICE
      .gradient-line
      v-list.py-2.px-6(v-if="menuList")
        template(
          v-for="(item, index) in menuList"
        )
          //- v-list-group.group-item(
          //-   v-if="item.group"
          //-   :key="`${item.group}-${index}`"
          //-   :value="$route.name && item.menu.map(ele => ele.route).includes($route.name.replaceAll(/-id|-form/gi,'').slice(0, -5))"
          //-   :prepend-icon="item.icon"
          //-   active-class="active-state"

          //- )
          //-   template(#activator)
          //-     v-list-item-content.menu-item
          //-       v-list-item-title(v-text="item.group")
          //-   template(#prependIcon)
          //-     v-icon {{ item.icon }}
          //-   template(
          //-     v-for="(subMenu, menuIndex) in item.menu"
          //-   )
          //-     v-list-item.sub-menu(
          //-       :key="`${item.group}-${menuIndex}`"
          //-       dense
          //-       replace
          //-       :to="subMenu.route"
          //-       color="white"
          //-       active-class="active-state"
          //-     )
          //-       v-list-item-title(
          //-         v-text="subMenu.text"
          //-       )
            //- v-else
          v-list-item.menu-item(
            exact
            dense
            replace
            color="white"
            active-class="active-state"
            @click="$router.push({ name: item.route })"
          )
            v-list-item-action
              v-icon {{ item.icon }}
            v-list-item-content
              v-list-item-title(v-text="item.text")
    p#version.text-center.mb-0.caption.white--text.black version {{ versionGB }}
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    clipped: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default: null
    }
  },
  data: () => ({
    toggler: true
  }),
  computed: {
    ...mapState({
      menuList: state => state.menu.menuList
    })
  },
  mounted () {
    if (!this.$vuetify.breakpoint.mdAndup) {
      this.toggler = false
    }
  },
  methods: {
    returnValue (value) {
      this.$emit('input', value)
    },
    toggleSidebar () {
      this.$emit('change', this.toggler)
    }
  }
}
</script>

<style lang="scss" scoped>
$versionSize: 24px;
.gradient-line {
  height: 2px;
  width: 100%;
  // background: red;
  background-image: linear-gradient(to right, transparent, $primary 21%, $primary 80%, transparent 100%);
  margin: 24px 0;
}
.customized-sidebar {
  .sidebar-content {
    height: calc(100% - #{$versionSize});
    overflow: auto;
  }
  #version {
    height: $versionSize;
  }
  .sub-menu {
    &.active-state {
      background-color: white !important;
      color: $primary !important;
      border-radius: 8px;
      &:before {
        opacity: 0;
      }
    }
  }
  .menu-item {
    &.active-state {
      background-color: white !important;
      color: $primary !important;
      border-radius: 8px;
      &:before {
        opacity: 0;
      }
    }
  }
}
</style>
