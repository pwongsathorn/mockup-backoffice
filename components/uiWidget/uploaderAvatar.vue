<template lang="pug">
  #avatar-uploader
    v-form.d-block.mb-2(ref='uploadForm')
      v-card.card-upload.mx-auto.rounded-circle(
        elevation="0"
        :outlined="false"
        :width="size"
        :height="size"
        @click='selectFile()'
        @drop.prevent='onDrop'
        @dragover.prevent='dragover = true'
        @dragenter.prevent='dragover = true'
        @dragleave.prevent='dragover = false'
      )
        input(
          ref='inputFiles'
          type='file'
          accept='.jpg,.jpeg,.png,.webp'
          style="height: 0;"
          hidden
          @change='onSelect($event)'
        )
        v-card-text.pa-0.rounded-circle.grey.darken-3.overflow-hidden
          v-avatar.float-icon(size="48" color="white" outlined)
            v-icon(color="primary") mdi-camera
          //- Selected file
          .image-wrapper#files-wrapper(
            v-if="files.length > 0"
          )
            v-img(
              :src="preview(files[0])"
              :aspect-ratio="1"
            )
          .image-wrapper#exist-image(
            v-else-if="existingImage"
          )
            v-img(
              :src="existingImage"
              :aspect-ratio="1"
            )
          //- Placeholder
          .image-wrapper#image-placeholder(
            v-else
          )
            v-img(
              :src="placeholder"
              :aspect-ratio="1"
            )
</template>

<script>
export default {
  props: {
    existingImage: {
      default: null,
      type: String
    },
    size: {
      default: '216',
      type: String
    },
    placeholderType: {
      default: 'avatar',
      type: String
    }
  },
  data: () => ({
    dragover: false,
    files: [],
    progress: {},
    accept: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
  }),
  computed: {
    placeholder () {
      switch (this.placeholderType) {
        case 'avatar':
        default:
          return '/images/profile-placeholder.png'
      }
    }
  },
  methods: {
    clear () {
      this.files = []
    },
    preview (file) {
      const fileUrl = URL.createObjectURL(file)
      return fileUrl
    },
    onDrop (e) {
      this.dragover = false
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const getFiles = [...e.dataTransfer.files]
        getFiles.forEach((item) => {
          if (item.size <= 10000000) {
            this.keepData(item)
          }
        })
      }
    },
    onSelect (e) {
      if (e.target.files && e.target.files.length > 0) {
        const getFiles = [...e.target.files]
        getFiles.forEach((item) => {
          if (item.size <= 10000000) {
            this.keepData(item)
          }
        })
      }
    },
    keepData (keepFile) {
      if (this.accept.includes(keepFile.type)) {
        this.files = [keepFile]
      } else {
        this.$refs.uploadForm.validate()
      }
    },
    selectFile () {
      const fileInputElement = this.$refs.inputFiles
      fileInputElement.value = null
      fileInputElement.click()
    },
    validate () {
      // checking
      // Do we have new file to upload ?
      const checkUpload = new Promise((resolve, reject) => {
        if (this.files.length > 0) {
          // uploads required
          resolve(true)
        } else {
          // no file to upload
          resolve(false)
        }
      })

      return checkUpload
    },
    uploadImage () {
      // Create From Data
      const formData = new FormData()
      formData.append('file', this.files[0])
      // Do upload
      const promise = new Promise((resolve, reject) => {
        this.$uploadApi.upload(formData)
          .then((res) => {
            resolve(res.url)
          })
          .catch((error) => {
            reject(error)
          })
      })

      return promise
    }
  }
}
</script>

<style lang="scss" scoped>
.image-wrapper {
  transition: opacity 0.3s ease;
  &:hover,
  &.hovering {
    opacity: 0.5 !important;
  }
}
.card-upload {
  border: none !important;
}
.float-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 1;
  border: 1px inset $primary;
  &:hover {
    filter: saturate(80%);
  }
}
</style>
