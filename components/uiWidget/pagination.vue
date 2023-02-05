<template lang="pug">
  v-row(v-if="pageCount !== 0")
    //- v-col(cols="6")
    //-   span.px-4.py-2.subtitle-2.blue--text.text--darken-3.-pagination__count {{currentCount}} จาก {{dataCount}}
    v-col.d-flex.justify-center(cols="12")
      v-pagination#pagination(
        :class="{'no-shadow': noShadow}"
        v-model="currentPage"
        color="primary"
        :total-visible="9"
        :disabled="isDisabled"
        :length="pageCount"
        @input="onReturnValue"
      )
</template>
<script>
export default {
  name: 'PaginationComponent',
  components: {},
  props: {
    noShadow: {
      default: true,
      type: Boolean
    },
    isDisabled: {
      default: false,
      type: Boolean
    },
    pageCount: {
      default: 0,
      type: Number
    },
    dataCount: {
      default: 0,
      type: Number
    },
    currentCount: {
      default: 0,
      type: Number
    }
  },
  data () {
    return {
      currentPage: 1
    }
  },
  computed: {},
  beforeMount () {},
  mounted () {
    this.setPage()
  },
  beforeDestroy () {},
  methods: {
    onReturnValue () {
      this.$emit('onChangePage', this.currentPage)
    },
    setPage () {
      if (!this.$route.query.currentPage) {
        this.currentPage = 1
      } else {
        this.currentPage = Number(this.$route.query.currentPage)
      }
    }
  }
}
</script>

<style lang="scss">
// === !!!!!!!!!!!! UNSCOPED STYLE !!!!! ===
//--- Custom with caution and be specified
#pagination {
  &.no-shadow {
    ul.v-pagination li{
      button {
        box-shadow: none;
      }
    }
  }
}
</style>
