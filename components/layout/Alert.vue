
<template lang="pug">
  v-snackbar.alert.text.dense.elevation-2(
    :color="typeAlert"
    border="left"
    :bottom="bottom"
    :right="right"
    :value="isShowAlert"
    elevation="4"
  )
    span.white--text.mr-2.newLine {{description}}
    template(v-slot:action="{ attrs }")
      v-icon(color="white" small v-bind="attrs" @click="close()") fa fa-times
</template>
<script>
export default {
  name: 'AlertComponent',
  components: {},
  props: {
    typeAlert: {
      default: 'info',
      type: String
    },
    description: {
      default: 'การแจ้ง',
      type: String
    },
    top: {
      default: false,
      type: Boolean
    },
    bottom: {
      default: true,
      type: Boolean
    },
    right: {
      default: true,
      type: Boolean
    },
    left: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {}
  },
  computed: {},
  beforeMount () {},
  mounted () {},
  beforeDestroy () {},
  methods: {
    close () {
      // toggle()
      this.$store.commit('main/closeAlert')
    }
  }
}
</script>

<style lang='scss' scoped>
.newLine{
  white-space: pre-line;
}
</style>
