<template lang="pug">
  Modal-Base(ref="previewModal" closeIcon :header="header" @close="close" :maxWidth="750")
    template( slot="body")
      v-carousel(hide-delimiters)
        v-carousel-item(v-for='(item,i) in images' :key='i')
          v-img(:src="item.src" lazy-src="/image/Loading.webp" height="100%")
            template(v-slot:placeholder)
              v-row.fill-height.ma-0(align='center' justify='center')
                v-progress-circular(indeterminate color='transparent')
</template>
<script>
export default {
  name: 'PreviewModal',
  components: {},
  props: {
    header: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isLoadingState: false,
      images: null
    }
  },
  computed: {},
  methods: {
    open (data) {
      this.images = data
      this.isLoadingState = false
      this.$refs.previewModal.show(true)
    },
    close () {
      this.images = null
      this.$refs.previewModal.hide()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
