<template lang="pug">
v-chip.pointer(text-color="grey darken-3" label outlined :x-large="isUploadMode" :large="!isUploadMode" :close="isUploadMode" @click="openImages" @click:close="deleteChip(index)")
    v-icon.mr-2(left color="primary") fa fa-file-image
    #detail-wrapper
      .text-body-2.text-truncate.flex-grow-1 {{ setImageName }}
      template(v-if="isUploadMode")
        v-progress-linear.mt-2(:value='progressCal' :color="progressCal > 0 ? 'primary' : 'grey'" height='5' rounded)
        .text-caption(class="grey--text") {{ Math.ceil(progressCal) }} % done
</template>
<script>
export default {
  name: 'ChipFileUiWidget',
  components: {},
  props: {
    isUploadMode: {
      default: false,
      type: Boolean
    },
    file: {
      default: () => {},
      type: Object
    },
    index: {
      default: null,
      type: Number
    },
    imageName: {
      default: null,
      type: String
    }
  },
  computed: {
    setImageName () {
      return this.imageName ? this.imageName : this.file && this.file.file && this.file.file.name
    },
    progressCal () {
      return this.file.isUploaded ? this.file.progress.count * 100 : 0
    }
  },
  methods: {
    openImages () {
      this.$emit('open')
    },
    deleteChip (index) {
      if (this.isUploadMode) {
        this.$emit('deleteChip', index)
      }
    }
  }
}
</script>
