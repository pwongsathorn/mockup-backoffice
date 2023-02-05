<template lang="pug">
  v-chip(
    :color="chipColor"
    :text-color="textColor"
  )
    v-avatar(left)
      template(v-if="!isShowIcon")
        v-icon {{iconDisplay}}
      template(v-else)
        v-img(v-if="urlImage" :src="urlImage")
        v-icon(v-else) {{iconDisplay}}
    span(v-if="textDisplay") {{textDisplay}}
</template>
<script>
export default {
  name: 'AvatarChipUiWidget',
  components: {},
  props: {
    textDisplay: {
      default: 'ตัวอย่าง การแสดงผล',
      type: String
    },
    chipColor: {
      default: 'blue lighten-5',
      type: String
    },
    textColor: {
      default: 'grey darken-3',
      type: String
    },
    isShowIcon: {
      default: false,
      type: Boolean
    },
    iconDisplay: {
      default: 'mdi-account-circle',
      type: String
    },
    urlImage: {
      default: null,
      type: String
    }
  },
  data () {
    return {}
  },
  computed: {},
  beforeMount () {},
  mounted () {},
  beforeDestroy () {},
  methods: {}
}
</script>
